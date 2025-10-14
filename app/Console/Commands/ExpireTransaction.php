<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;
use Carbon\Carbon;

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
        $count = Transaction::where('status', 0)
            ->where('expired_at', '<', Carbon::now())
            ->update([
                'status' => 4,
                'updated_at' => now()
            ]);

        $this->info("Total transaksi expired: {$count}");
    }
}
