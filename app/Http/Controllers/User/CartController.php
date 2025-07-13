<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Repositories\CartRepository;
use App\Traits\Response;
use Inertia\Inertia;

class CartController extends Controller
{
    private $cartRepository;
    private $response;

    public function __construct(
        Response $response,
        CartRepository $cartRepository
    ) {
        $this->response = $response;
        $this->cartRepository = $cartRepository;
    }
    public function index(Request $request)
    {
        $data['carts'] = $this->cartRepository->index($request);
        return Inertia::render('Cart', compact('data'));
    }
    public function store(Request $request)
    {
        $this->cartRepository->store($request);

        return redirect()->back()->with('success', 'Produk berhasil ditambahkan ke keranjang!');
    }
}
