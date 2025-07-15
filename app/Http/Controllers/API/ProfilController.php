<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Repositories\ProfilRepository;
use App\Traits\Response;
use Illuminate\Http\Request;

class ProfilController extends Controller
{
    private $profil;
    private $response;

    public function __construct(
        Response $response,
        ProfilRepository $profil
    ) {
        $this->response = $response;
        $this->profil = $profil;
    }
    
    public function store(Request $request)
    {
        $data = $this->profil->store($request);
        return $data;
    }
}
