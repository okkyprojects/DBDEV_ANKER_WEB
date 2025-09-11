<?php

namespace App\Http\Controllers\Admin;

use App\Exports\VariantExport;
use App\Http\Controllers\Controller;
use App\Http\Repositories\VariantRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class VariantController extends Controller
{
    private $variant;

    public function __construct(VariantRepository $variant)
    {
        $this->variant = $variant;
    }

    public function destroy($uuid)
    {
        $data =  $this->variant->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
    public function export(Request $request)
    {
        return Excel::download(
            new VariantExport($request, $this->variant),
            'produk.xlsx'
        );
    }
}
