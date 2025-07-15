<?php

namespace App\Http\Repositories;

use App\Models\City;
use App\Models\District;
use App\Models\Province;
use App\Traits\Response;
use Illuminate\Http\Request;

class LocationRepository
{
    private $response;
    private $province;
    private $city;
    private $district;

    public function __construct(
        Response $response,
        Province $province,
        City $city,
        District $district,
    ) {
        $this->response = $response;
        $this->province = $province;
        $this->city = $city;
        $this->district = $district;
    }

    public function index_province(Request $request)
    {
        $query = $this->province->query();

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->input('search') . '%');
        }

        return $query->orderBy('nama')->get();
    }

    public function index_city(Request $request)
    {
        $query = $this->city->query();

        if ($request->filled('province_id')) {
            $query->where('province_id', $request->input('province_id'));
        }

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->input('search') . '%');
        }

        return $query->orderBy('nama')->get();
    }

    public function index_district(Request $request)
    {
        $query = $this->district->query();

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->input('city_id'));
        }

        if ($request->filled('search')) {
            $query->where('nama', 'like', '%' . $request->input('search') . '%');
        }

        return $query->orderBy('nama')->get();
    }
}
