<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    private $brand;
    public function __construct(BrandRepository $brand)
    {
        $this->brand = $brand;
    }
    public function index(Request $request)
    {
        $data['brands'] = $this->brand->index_pagination($request);
        return Inertia::render('Brand/Index', compact('data'));
    }
    public function store(Request $request)
    {
        $data =  $this->brand->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }
    public function destroy($uuid)
    {
        $data = $this->brand->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
    public function bulk_destroy(Request $request)
    {
        $this->brand->bulk_destroy($request);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}
