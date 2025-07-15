<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\AddressRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class AddressController extends Controller
{
    private $addressRepository;
    private $response;


    public function __construct(
        Response $response,
        AddressRepository $addressRepository
    ) {
        $this->response = $response;
        $this->addressRepository = $addressRepository;
    }

    public function index(Request $request)
    {
        $data = $this->addressRepository->index($request);
        return $this->response->index($data);
    }

    public function store(Request $request)
    {
        $data = $this->addressRepository->store($request);
        return $data;
    }

    public function destroy($id)
    {
        $data = $this->addressRepository->destroy($id);
        return $data;
    }
}
