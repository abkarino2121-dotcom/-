<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Material;
use App\Services\DynamicPricingService;
use App\Services\WorkflowService;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    protected $pricingService;
    protected $workflowService;

    public function __construct(DynamicPricingService $pricingService, WorkflowService $workflowService)
    {
        $this->pricingService = $pricingService;
        $this->workflowService = $workflowService;
    }

    public function index()
    {
        return response()->json(Order::with(['customer', 'items.material'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'discount' => 'nullable|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.material_id' => 'required|exists:materials,id',
            'items.*.width' => 'required|numeric|min:0.01',
            'items.*.height' => 'required|numeric|min:0.01',
            'items.*.printing_type' => 'nullable|in:DTF,Laser,CNC',
            'items.*.processing_fee' => 'nullable|numeric|min:0',
            'items.*.profit_margin' => 'nullable|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $order = Order::create([
                'customer_id' => $validated['customer_id'],
                'discount' => $validated['discount'] ?? 0,
                'status' => 'Quotation'
            ]);

            $subtotal = 0;

            foreach ($validated['items'] as $itemData) {
                $material = Material::findOrFail($itemData['material_id']);

                $processingFee = $itemData['processing_fee'] ?? 0;
                $profitMargin = $itemData['profit_margin'] ?? 0;

                $itemTotal = $this->pricingService->calculatePrice(
                    $material,
                    $itemData['width'],
                    $itemData['height'],
                    $processingFee,
                    $profitMargin
                );

                $subtotal += $itemTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'material_id' => $material->id,
                    'width' => $itemData['width'],
                    'height' => $itemData['height'],
                    'printing_type' => $itemData['printing_type'] ?? null,
                    'processing_fee' => $processingFee,
                    'profit_margin' => $profitMargin,
                    'total' => $itemTotal
                ]);
            }

            // Apply discount
            $subtotal -= $order->discount;
            if ($subtotal < 0) $subtotal = 0;

            // Calculate VAT (assuming 15% for KSA)
            $vatRate = 0.15;
            $vat = $subtotal * $vatRate;
            $total = $subtotal + $vat;

            $order->update([
                'vat' => $vat,
                'total' => $total
            ]);

            DB::commit();

            return response()->json($order->load('items'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['customer', 'items.material']));
    }
}
