<?php

namespace App\Http\Repositories;

use App\Models\Brand;
use App\Traits\Response;
use Illuminate\Http\Request;

class BrandRepository
{
    private $response;
    private $brand;

    public function __construct(
        Response $response,
        Brand $brand,
    ) {
        $this->response = $response;
        $this->brand = $brand;
    }

    public function index(Request $request)
    {
        $query = $this->brand->query();
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }
        if ($request->has('status') && in_array($request->input('status'), ['0', '1'])) {
            $query->where('status', $request->input('status'));
        }
        $data = $query->orderBy('created_at', 'desc')->get(); 
        return $data;
    }
}
