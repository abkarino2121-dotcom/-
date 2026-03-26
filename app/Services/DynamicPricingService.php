<?php

namespace App\Services;

use App\Models\Material;

class DynamicPricingService
{
    /**
     * Calculate price for an order item based on dimensions and material type.
     * Formula: Total = (Area * MaterialCost) + ProcessingFee + ProfitMargin
     * For 'Unit' type materials, it uses width * height as quantity.
     *
     * @param Material $material
     * @param float $width
     * @param float $height
     * @param float $processingFee
     * @param float $profitMargin
     * @return float
     */
    public function calculatePrice(Material $material, float $width, float $height, float $processingFee, float $profitMargin): float
    {
        $cost = 0;

        if ($material->type === 'Sheet') {
            // Area in square meters (assuming width and height are in meters)
            $area = $width * $height;
            $cost = $area * $material->cost_per_unit;
        } elseif ($material->type === 'Roll') {
            // Usually calculated per linear meter, so we can use height (length)
            // Or square meters. We'll use Area for consistency
            $area = $width * $height;
            $cost = $area * $material->cost_per_unit;
        } elseif ($material->type === 'Unit') {
            // Assuming width * height represents quantity for units if needed,
            // or if strictly unit-based, maybe width=quantity. Let's assume width is qty here.
            $quantity = $width * $height; // Or however client expects. Let's default to $width * $height for now.
            $cost = $quantity * $material->cost_per_unit;
        }

        return ($cost + $processingFee + $profitMargin);
    }
}
