<?php

namespace App\Exports;

use App\Http\Repositories\TransactionRepository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;

class ShowPenjualanExport implements FromView
{
    use Exportable;

    protected $request;
    protected $penjualanRepo;
    protected $uuid;

    public function __construct(Request $request, TransactionRepository $penjualanRepo, $uuid)
    {
        $this->request = $request;
        $this->penjualanRepo = $penjualanRepo;
        $this->uuid = $uuid;
    }

    public function view(): View
    {
        $data = $this->penjualanRepo->export_penjualan_by_product($this->request, $this->uuid);

        return view('exports.penjualan_detail', [
            'data' => $data,
        ]);
    }
}
