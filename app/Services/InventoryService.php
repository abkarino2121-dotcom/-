<?php

namespace App\Services;

use App\Models\OrderItem;
use App\Models\Material;

class InventoryService
{
    /**
     * Automatically deduct stock when a production job is marked as "Started".
     *
     * @param OrderItem $orderItem
     * @return void
     */
    public function deductStockForOrderItem(OrderItem $orderItem): void
    {
        $material = $orderItem->material;

        $deductionAmount = 0;

        if ($material->type === 'Sheet') {
            // Deduct Area (m2)
            $deductionAmount = $orderItem->width * $orderItem->height;
        } elseif ($material->type === 'Roll') {
            // Linear meters (e.g. length/height) or area depending on setup.
            $deductionAmount = $orderItem->width * $orderItem->height;
        } elseif ($material->type === 'Unit') {
            // Units (using width * height as a quantity proxy if not explicitly quantity)
            $deductionAmount = $orderItem->width * $orderItem->height;
        }

        $material->current_stock -= $deductionAmount;
        $material->save();
    }
}
