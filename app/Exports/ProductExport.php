<?php

namespace App\Exports;

use App\Http\Repositories\ProductRepository;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;

class ProductExport implements FromView
{
    use Exportable;

    protected $request;
    protected $productRepository;

    public function __construct(Request $request, ProductRepository $productRepository)
    {
        $this->request = $request;
        $this->productRepository = $productRepository;
    }


    public function view(): View
    {
        $data = $this->productRepository->export($this->request);

        return view('exports.product', [
            'data' => $data,
        ]);
    }
}
