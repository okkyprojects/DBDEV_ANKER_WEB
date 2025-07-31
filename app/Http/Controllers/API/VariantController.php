<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\VariantRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class VariantController extends Controller
{
    private $response;
    private $repository;

    public function __construct(
        Response $response,
        VariantRepository $repository
    ) {
        $this->response = $response;
        $this->repository = $repository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $this->repository->index($request);
        return $this->response->index($data);
    }

}
