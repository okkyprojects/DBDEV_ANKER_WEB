<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\TermRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TermController extends Controller
{
    private $term;

    public function __construct(TermRepository $term)
    {
        $this->middleware('permission:term-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:term-add', ['only' => ['store']]);
        $this->middleware('permission:term-update', ['only' => ['edit', 'update']]);
        $this->middleware('permission:term-delete', ['only' => ['destroy']]);
        $this->term = $term;
    }

    public function index(Request $request)
    {
        $data['term'] = $this->term->index($request);
        return Inertia::render('Term/Index', compact('data'));
    }

    public function store(Request $request)
    {
        $this->term->store($request);

        return redirect()->back()->with('success', 'Berhasil menyimpan data!');
    }

    public function destroy($id)
    {
        $this->term->destroy($id);

        return redirect()->back()->with('success', 'Berhasil menghapus data!');
    }
}
