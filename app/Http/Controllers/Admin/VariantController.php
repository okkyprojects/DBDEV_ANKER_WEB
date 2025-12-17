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
        $this->middleware('permission:product-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:product-add', ['only' => ['store']]);
        $this->middleware('permission:product-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:product-delete', ['only' => ['destroy']]);
        $this->variant = $variant;
    }

    public function destroy($uuid)
    {
        $result = $this->variant->destroy($uuid);

        if ($result['status'] === false) {
            return redirect()->back()
                ->withErrors([
                    'product' => $result['message']
                ]);
        }

        return redirect()->back()
            ->with('success', $result['message']);
    }

    public function export(Request $request)
    {
        return Excel::download(
            new VariantExport($request, $this->variant),
            'produk.xlsx'
        );
    }
}
