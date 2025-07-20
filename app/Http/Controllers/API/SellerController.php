<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\SellerRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class SellerController extends Controller
{
    private $response;
    private $repository;

    public function __construct(
        Response $response,
        SellerRepository $repository
    ) {
        $this->response = $response;
        $this->repository = $repository;
    }
    public function show(string $id)
    {
        $data = $this->repository->show($id);
        return $this->response->index($data);
    }
}
