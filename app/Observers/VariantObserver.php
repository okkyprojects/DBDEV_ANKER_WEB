<?php

namespace App\Observers;

use App\Models\StockHistory;
use App\Models\Variant;
use App\Support\StockChangeContext;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class VariantObserver
{
    public function updating(Variant $variant): void
    {
        if (!$variant->isDirty('stock')) {
            return;
        }

        $before = (int) $variant->getOriginal('stock');
        $after = (int) $variant->stock;

        StockHistory::create([
            'uuid' => (string) Str::uuid(),
            'variant_uuid' => $variant->uuid,
            'user_id' => Auth::id(),
            'before_stock' => $before,
            'after_stock' => $after,
            'current_stock' => $after,
            'action' => StockChangeContext::get() ?? 'update_manual',
        ]);

        StockChangeContext::clear();
    }
}
