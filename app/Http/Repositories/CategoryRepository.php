<?php

namespace App\Http\Repositories;

use App\Models\Category;
use App\Traits\Response;
use Illuminate\Http\Request;

class CategoryRepository
{
    private $response;
    private $category;

    public function __construct(
        Response $response,
        Category $category,
    ) {
        $this->response = $response;
        $this->category = $category;
    }

    public function index(Request $request)
    {
        $query = $this->category->query();
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
