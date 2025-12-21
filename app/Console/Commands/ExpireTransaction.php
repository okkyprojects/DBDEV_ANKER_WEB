<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ExpireTransaction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'transactions:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::transaction(function () {
            $transactions = Transaction::with('items.variant')
                ->where('status', 0)
                ->where('expired_at', '<', Carbon::now())
                ->lockForUpdate()
                ->get();

            foreach ($transactions as $transaction) {
                foreach ($transaction->items as $item) {
                    if ($item->variant) {
                        $item->variant->increment('stock', $item->quantity);
                    }
                }
                $transaction->update([
                    'status' => 5,
                    'note_transaction' => 'Kadaluarsa',
                ]);
            }

            $this->info(
                'Total transaksi expired: ' . $transactions->count()
            );
        });
    }
}
