<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;

class ReportController extends Controller
{
    public function getVatReport(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', now()->endOfMonth()->toDateString());

        $invoices = Invoice::whereBetween('created_at', [$startDate, $endDate])->get();

        $totalSales = $invoices->sum('total');
        $totalVat = $invoices->sum('vat_total');

        return response()->json([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_sales' => $totalSales,
            'total_vat_collected' => $totalVat,
            'invoices' => $invoices
        ]);
    }
}
