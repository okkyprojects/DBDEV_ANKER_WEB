<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\ProductRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    private $response;
    private $repository;

    public function __construct(
        Response $response,
        ProductRepository $repository
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


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = $this->repository->single($id);

        if (!$data) {
            return $this->response->notFound();
        }

        return $this->response->index($data);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
