<?php

namespace App\Exports;

use App\Http\Repositories\VariantRepository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;

class VariantExport implements FromView
{
    use Exportable;

    protected $request;
    protected $variantRepository;

    public function __construct(Request $request, VariantRepository $variantRepository)
    {
        $this->request = $request;
        $this->variantRepository = $variantRepository;
    }


    public function view(): View
    {
        $data = $this->variantRepository->export($this->request);

        return view('exports.variant', [
            'data' => $data,
        ]);
    }
}
