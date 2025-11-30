<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\CategoryRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    private $category;
    public function __construct(CategoryRepository $category)
    {
        $this->middleware('permission:category-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:category-add', ['only' => ['store']]);
        $this->middleware('permission:category-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:category-delete', ['only' => ['destroy']]);
        $this->category = $category;
    }
    public function index(Request $request)
    {
        $data['categories'] = $this->category->index_pagination($request);
        return Inertia::render('Category/Index', compact('data'));
    }
    public function store(Request $request)
    {
        $data =  $this->category->store($request);
        return redirect()->back()->with('success', 'Berhasil Menambahkan Data!');
    }
    public function destroy($uuid)
    {
        $data = $this->category->destroy($uuid);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
    public function bulk_destroy(Request $request)
    {
        $this->category->bulk_destroy($request);
        return redirect()->back()->with('success', 'Berhasil Menghapus Data!');
    }
}
