<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BillRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillController extends Controller
{
    private $bill;
    public function __construct(BillRepository $bill)
    {
        $this->bill = $bill;
    }
    public function index(Request $request)
    {
        $data['bills'] = $this->bill->index_pagination($request);
        return Inertia::render('Bill/Index', compact('data'));
    }
    public function store(Request $request)
    {
        $data =  $this->bill->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }
    public function destroy($uuid)
    {
        $data = $this->bill->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}
