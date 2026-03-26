<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Invoice;

class WorkflowService
{
    private $inventoryService;

    private $zatcaService;

    public function __construct(InventoryService $inventoryService, ZatcaService $zatcaService)
    {
        $this->inventoryService = $inventoryService;
        $this->zatcaService = $zatcaService;
    }

    /**
     * Transition order status and trigger necessary side effects like stock deduction.
     *
     * @param Order $order
     * @param string $newStatus
     * @return Order
     */
    public function updateOrderStatus(Order $order, string $newStatus): Order
    {
        $oldStatus = $order->status;
        $order->status = $newStatus;

        // If transitioning into 'In Production', deduct stock
        if ($oldStatus !== 'In Production' && $newStatus === 'In Production') {
            foreach ($order->items as $item) {
                $this->inventoryService->deductStockForOrderItem($item);
            }
        }

        $order->save();

        // If completed, generate ZATCA invoice
        if ($oldStatus !== 'Completed' && $newStatus === 'Completed') {
            // Deduct stock if it skipped 'In Production' (e.g. POS direct sale)
            if ($oldStatus !== 'In Production' && $oldStatus !== 'Ready for Pickup/Installation' && $oldStatus !== 'Ready') {
                foreach ($order->items as $item) {
                    $this->inventoryService->deductStockForOrderItem($item);
                }
            }
            $this->generateZatcaInvoice($order);
        }

        return $order;
    }

    private function generateZatcaInvoice(Order $order): void
    {
        // Check if an invoice already exists for this order
        if (Invoice::where('order_id', $order->id)->exists()) {
            return;
        }

        $invoice = new Invoice();
        $invoice->order_id = $order->id;
        $invoice->total = $order->total;
        $invoice->vat_total = $order->vat;

        // Save first so it has an ID and timestamps
        // These are required for generating Zatca Data correctly
        $invoice->uuid = (string) \Illuminate\Support\Str::uuid(); // temp uuid to pass unique constraint
        $invoice->save();

        // Assume Seller name and VAT number are configured or fixed for now
        $sellerName = env('APP_NAME', 'EGY PRINT');
        $vatNumber = '300000000000003'; // Example 15 digit VAT number

        $this->zatcaService->generateZatcaData($invoice, $sellerName, $vatNumber);
    }
}
