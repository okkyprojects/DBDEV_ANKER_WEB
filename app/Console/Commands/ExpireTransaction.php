<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

class ExpireTransaction extends Command
{
    protected $signature = 'transactions:expire';

    protected $description = 'Expire transaction and restore stock';

    public function handle()
    {
        Log::info('ExpireTransaction START', [
            'time' => now()->toDateTimeString()
        ]);

        try {
            DB::transaction(function () {
                $transactions = Transaction::with('items.variant')
                    ->where('status', 0)
                    ->where('expired_at', '<', Carbon::now())
                    ->lockForUpdate()
                    ->get();

                Log::info('ExpireTransaction FOUND', [
                    'total' => $transactions->count()
                ]);

                foreach ($transactions as $transaction) {
                    foreach ($transaction->items as $item) {
                        if ($item->variant && is_numeric($item->quantity)) {
                            $item->variant->increment('stock', (int) $item->quantity);

                            Log::info('Stock increment SUCCESS', [
                                'transaction_id' => $transaction->id,
                                'item_id' => $item->id,
                                'variant_id' => $item->variant->id,
                                'qty' => (int) $item->quantity,
                            ]);
                        } else {
                            Log::warning('Stock increment SKIPPED', [
                                'transaction_id' => $transaction->id,
                                'item_id' => $item->id,
                                'variant_id' => $item->variant->id ?? null,
                                'quantity' => $item->quantity,
                            ]);
                        }
                    }

                    $transaction->update([
                        'status' => 5,
                        'note_transaction' => 'Kadaluarsa',
                    ]);

                    Log::info('Transaction EXPIRED', [
                        'transaction_id' => $transaction->id
                    ]);
                }
            });

            Log::info('ExpireTransaction SUCCESS');
        } catch (Throwable $e) {
            Log::error('ExpireTransaction FAILED', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
        }
    }
}
