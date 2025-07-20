<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BillRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class BillController extends Controller
{
    private $billrepository;
    private $response;


    public function __construct(
        Response $response,
        Billrepository $billrepository
    ) {
        $this->response = $response;
        $this->billrepository = $billrepository;
    }

    public function index(Request $request)
    {
        $data = $this->billrepository->index($request);
        return $this->response->index($data);
    }

    public function store(Request $request)
    {
        $data = $this->billrepository->store($request);
        return $data;
    }

    public function destroy($id)
    {
        $data = $this->billrepository->destroy($id);
        return $data;
    }
}
