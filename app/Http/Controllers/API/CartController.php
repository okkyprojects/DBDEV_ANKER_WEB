<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\CartRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

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
        $data = $this->cartRepository->index($request);
        return $this->response->index($data);
    }

    public function store(Request $request)
    {
        $data = $this->cartRepository->store($request);
        return $data;
    }
}
