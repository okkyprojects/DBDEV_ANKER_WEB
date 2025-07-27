<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BrandRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    private $response;
    private $repository;

    public function __construct(
        Response $response,
        BrandRepository $repository
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
        //
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
