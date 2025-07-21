<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BannerRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    private $banner;
    public function __construct(BannerRepository $banner)
    {
        $this->banner = $banner;
    }
    public function index(Request $request)
    {
        $data['banners'] = $this->banner->index_pagination($request);
        return Inertia::render('Banner/Index', compact('data'));
    }
    public function store(Request $request)
    {
        $data =  $this->banner->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }
    public function destroy($uuid)
    {
        $data = $this->banner->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}
