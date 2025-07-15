<?php

namespace App\Http\Controllers;

use App\Http\Repositories\AddressRepository;
use App\Http\Repositories\ProfilRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfilController extends Controller
{
    private $address;
    private $profil;
    public function __construct(AddressRepository $address, ProfilRepository $profil)
    {
        $this->address = $address;
        $this->profil = $profil;
    }
    public function informasiPribadi()
    {
        return Inertia::render('Profil/InformasiPribadi');
    }

    public function informasiToko()
    {
        return Inertia::render('Profil/InformasiToko');
    }

    public function ubahKataSandi()
    {
        return Inertia::render('Profil/UbahKataSandi');
    }

    public function alamat(Request $request)
    {
        $data['addresses'] = $this->address->index($request);
        return Inertia::render('Profil/Alamat', compact('data'));
    }

    public function store_alamat(Request $request)
    {
        $data = $this->address->store($request);
        return redirect()->route('profil.alamat.index')->with('success', 'Alamat berhasil disimpan');
    }
    public function store_informasi_pribadi(Request $request)
    {
        $data = $this->profil->store($request);
        return redirect()->back()->with('success', 'Alamat berhasil disimpan');
    }
}
