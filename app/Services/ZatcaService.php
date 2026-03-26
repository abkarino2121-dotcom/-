<?php

namespace App\Services;

use App\Models\Invoice;
use Illuminate\Support\Str;

class ZatcaService
{
    /**
     * Generate ZATCA required fields for an invoice
     * Generate UUID and Hash for each invoice.
     * Generate TLV-encoded QR Code (Seller, VAT No, Timestamp, Total, VAT Total).
     *
     * @param Invoice $invoice
     * @param string $sellerName
     * @param string $vatNumber
     * @return Invoice
     */
    public function generateZatcaData(Invoice $invoice, string $sellerName, string $vatNumber): Invoice
    {
        // 1. UUID
        $invoice->uuid = Str::uuid()->toString();

        // 2. Hash (Usually a hash of the XML invoice, but for phase 1 a basic hash can suffice as placeholder)
        $invoice->hash = hash('sha256', $invoice->uuid . $invoice->created_at . $invoice->total);

        // 3. TLV QR Code
        $invoice->qr_code = $this->generateTlvQrCode(
            $sellerName,
            $vatNumber,
            $invoice->created_at->toIso8601String(),
            $invoice->total,
            $invoice->vat_total
        );

        $invoice->save();

        return $invoice;
    }

    /**
     * TLV QR Code Generator
     * 1. Seller Name
     * 2. VAT Number
     * 3. Timestamp
     * 4. Invoice Total
     * 5. VAT Total
     */
    private function generateTlvQrCode(string $sellerName, string $vatNumber, string $timestamp, float $total, float $vatTotal): string
    {
        $tlv = $this->toTlv(1, $sellerName) .
               $this->toTlv(2, $vatNumber) .
               $this->toTlv(3, $timestamp) .
               $this->toTlv(4, (string)$total) .
               $this->toTlv(5, (string)$vatTotal);

        return base64_encode($tlv);
    }

    private function toTlv(int $tag, string $value): string
    {
        return chr($tag) . chr(strlen($value)) . $value;
    }
}
