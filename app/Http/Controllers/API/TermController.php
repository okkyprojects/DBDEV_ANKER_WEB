<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\TermRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class TermController extends Controller
{
    private $termRepository;
    private $response;

    public function __construct(Response $response, TermRepository $termRepository)
    {
        $this->response = $response;
        $this->termRepository = $termRepository;
    }
    public function index(Request $request)
    {
        $data = $this->termRepository->index($request);
        return $this->response->index($data);
    }
}
