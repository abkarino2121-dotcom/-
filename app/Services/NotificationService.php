<?php

namespace App\Services;

use App\Models\Customer;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Mock a WhatsApp notification
     *
     * @param Customer $customer
     * @param string $message
     * @return void
     */
    public function sendWhatsAppMessage(Customer $customer, string $message): void
    {
        // Mocking: Log the message instead of actually sending
        $logMessage = "Mock WhatsApp sent to {$customer->phone} ({$customer->name}): {$message}";
        Log::channel('single')->info($logMessage);
    }
}
