<?php

namespace App\Http\Repositories;

use App\Models\Term;
use App\Traits\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TermRepository
{
    private $response;
    private $term;

    public function __construct(Response $response, Term $term)
    {
        $this->response = $response;
        $this->term = $term;
    }

    private function validate(): array
    {
        return [
            'content' => 'required|string',
        ];
    }

    private function request(Request $request): array
    {
        return [
            'content' => $request->input('content'),
        ];
    }
    public function index(Request $request)
    {
        return $this->term->find(1);
    }
    public function index_pagination(Request $request)
    {
        return $this->term->paginate(10);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);
        $term = $this->term->updateOrCreate(['id' => 1], $data);

        return $term->wasRecentlyCreated
            ? $this->response->store($term)
            : $this->response->update($term);
    }

    public function destroy($id)
    {
        $term = $this->term->find($id);

        if (!$term) {
            return $this->response->notFound();
        }

        $term->delete();
        return $this->response->destroy($term);
    }
}
