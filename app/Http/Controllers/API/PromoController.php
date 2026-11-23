<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\PromoRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class PromoController extends Controller
{
    private $promoRepository;
    private $response;

    public function __construct(
        Response $response,
        PromoRepository $promoRepository
    ) {
        $this->response = $response;
        $this->promoRepository = $promoRepository;
    }

    public function index(Request $request)
    {
        $data = $this->promoRepository->index_api($request);
        return $this->response->index($data);
    }

    public function check(Request $request)
    {
        return $this->promoRepository->check($request);
    }
}
