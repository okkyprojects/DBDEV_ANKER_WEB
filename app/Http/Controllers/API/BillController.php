<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BillRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class BillController extends Controller
{
    private $billRepository;
    private $response;


    public function __construct(
        Response $response,
        BillRepository $billRepository
    ) {
        $this->response = $response;
        $this->billRepository = $billRepository;
    }

    public function index(Request $request)
    {
        $data = $this->billRepository->index($request);
        return $this->response->index($data);
    }

    public function store(Request $request)
    {
        $data = $this->billRepository->store($request);
        return $data;
    }

    public function destroy($id)
    {
        $data = $this->billRepository->destroy($id);
        return $data;
    }
}
