<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\VariantRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
}
