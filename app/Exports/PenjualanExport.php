<?php

namespace App\Exports;

use App\Http\Repositories\TransactionRepository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;

class PenjualanExport implements FromView
{
    use Exportable;

    protected $request;
    protected $penjualanRepo;

    public function __construct(Request $request, TransactionRepository $penjualanRepo)
    {
        $this->request = $request;
        $this->penjualanRepo = $penjualanRepo;
    }


    public function view(): View
    {
        $data = $this->penjualanRepo->export_penjualan($this->request);

        return view('exports.penjualan', [
            'data' => $data,
        ]);
    }
}
