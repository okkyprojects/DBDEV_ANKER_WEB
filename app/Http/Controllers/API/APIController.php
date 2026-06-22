<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\AddressRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class APIController extends Controller
{
    private $response;


    public function __construct(
        Response $response
    ) {
        $this->response = $response;
    }

    public function index(Request $request)
    {
        $data = [
            "force_update" => true,
            "latest_version" => 1,
            "min_version" => 1,
            "play_store_url" => "https://play.google.com/store/apps/details?id=com.anker.app",
            "app_store_url" => "https://app.google.com/store/apps/details?id=com.anker.app"
        ];
        return $this->response->index($data);
    }
}
