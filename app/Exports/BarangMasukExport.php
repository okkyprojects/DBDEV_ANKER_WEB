<?php

namespace App\Exports;

use App\Http\Repositories\TransactionRepository;
use App\Http\Repositories\VariantStockRepository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;

class BarangMasukExport implements FromView
{
    use Exportable;

    protected $request;
    protected $repository;

    public function __construct(Request $request, VariantStockRepository $repository)
    {
        $this->request = $request;
        $this->repository = $repository;
    }


    public function view(): View
    {
        $data = $this->repository->export($this->request);

        return view('exports.stok', [
            'data' => $data,
        ]);
    }
}
