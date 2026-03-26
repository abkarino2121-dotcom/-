<?php

namespace App\Services;

use App\Models\Order;

class WorkflowService
{
    private $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
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
        return $order;
    }
}
