<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Services\WorkflowService;
use App\Services\NotificationService;

class JobController extends Controller
{
    protected $workflowService;
    protected $notificationService;

    public function __construct(WorkflowService $workflowService, NotificationService $notificationService)
    {
        $this->workflowService = $workflowService;
        $this->notificationService = $notificationService;
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:Quotation,Pending Design,In Production,Ready,Completed'
        ]);

        $order = Order::findOrFail($id);

        // This will trigger inventory deduction if moving to 'In Production'
        $updatedOrder = $this->workflowService->updateOrderStatus($order, $validated['status']);

        // Mock WhatsApp Notification
        $customer = $order->customer;
        if ($customer && $customer->phone) {
            $message = "Your order #{$order->id} status has been updated to: {$validated['status']}.";
            $this->notificationService->sendWhatsAppMessage($customer, $message);
        }

        return response()->json($updatedOrder);
    }
}
