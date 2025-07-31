<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\BannerRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    private $bannerRepository;
    private $response;


    public function __construct(
        Response $response,
        BannerRepository $bannerRepository
    ) {
        $this->response = $response;
        $this->bannerRepository = $bannerRepository;
    }
    public function index(Request $request)
    {
        $data = $this->bannerRepository->index($request);
        return $this->response->index($data);
    }
}
