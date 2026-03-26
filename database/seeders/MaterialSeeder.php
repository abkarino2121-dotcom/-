<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Material;

class MaterialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $materials = [
            [
                'name' => 'MDF 3mm',
                'type' => 'Sheet',
                'width' => 1.22,
                'height' => 2.44,
                'thickness' => 3,
                'cost_per_unit' => 50.00,
                'current_stock' => 100
            ],
            [
                'name' => 'MDF 5mm',
                'type' => 'Sheet',
                'width' => 1.22,
                'height' => 2.44,
                'thickness' => 5,
                'cost_per_unit' => 75.00,
                'current_stock' => 80
            ],
            [
                'name' => 'Acrylic Gold 3mm',
                'type' => 'Sheet',
                'width' => 1.22,
                'height' => 2.44,
                'thickness' => 3,
                'cost_per_unit' => 250.00,
                'current_stock' => 20
            ],
            [
                'name' => 'Flex Banner',
                'type' => 'Roll',
                'width' => 3.2,
                'height' => 50,
                'thickness' => null,
                'cost_per_unit' => 15.00, // per linear meter or square meter depending on calculation
                'current_stock' => 5 // rolls
            ],
            [
                'name' => 'LED Module',
                'type' => 'Unit',
                'width' => null,
                'height' => null,
                'thickness' => null,
                'cost_per_unit' => 2.50,
                'current_stock' => 5000
            ]
        ];

        foreach ($materials as $material) {
            Material::create($material);
        }
    }
}
