<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\PromoRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromoController extends Controller
{
    private $promo;
    public function __construct(PromoRepository $promo)
    {
        $this->middleware('permission:promo-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:promo-add', ['only' => ['store']]);
        $this->middleware('permission:promo-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:promo-delete', ['only' => ['destroy']]);
        $this->middleware('permission:notification-add', ['only' => ['notify']]);
        $this->promo = $promo;
    }
    public function index(Request $request)
    {
        $data['promos'] = $this->promo->index_pagination($request);
        $data['products'] = $this->promo->product_options();
        $data['variants'] = $this->promo->variant_options();
        $data['result'] = session('result');
        return Inertia::render('Promo/Index', compact('data'));
    }
    public function store(Request $request)
    {
        $data =  $this->promo->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }
    public function destroy($uuid)
    {
        $data = $this->promo->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
    public function notify($uuid)
    {
        $result = $this->promo->notify($uuid);
        return redirect()->back()->with('result', $result)->with('success', 'Berhasil Mengirim Notifikasi!');
    }
}
