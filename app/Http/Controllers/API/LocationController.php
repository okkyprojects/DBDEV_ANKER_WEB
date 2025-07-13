<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\LocationRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    private $response;
    private $repository;

    public function __construct(
        Response $response,
        LocationRepository $repository
    ) {
        $this->response = $response;
        $this->repository = $repository;
    }

    /**
     * List of Provinces
     */
    public function indexProvince(Request $request)
    {
        $data = $this->repository->index_province($request);
        return $this->response->index($data);
    }

    /**
     * List of Cities (optionally by province_id)
     */
    public function indexCity(Request $request)
    {
        $data = $this->repository->index_city($request);
        return $this->response->index($data);
    }

    /**
     * List of Districts (optionally by city_id)
     */
    public function indexDistrict(Request $request)
    {
        $data = $this->repository->index_district($request);
        return $this->response->index($data);
    }
}
