<?php

namespace App\Http\Repositories;

use App\Models\Bill;
use App\Traits\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BillRepository
{
    private $response;
    private $bill;

    public function __construct(Response $response, Bill $bill)
    {
        $this->response = $response;
        $this->bill = $bill;
    }

    private function validate()
    {
        return [
            'account_number' => 'required|string|max:50',
            'bank_name' => 'required|string|max:100',
            'account_holder_name' => 'required|string|max:100',
            'is_main' => 'nullable|boolean',
        ];
    }

    private function request(Request $request): array
    {
        return [
            'user_id' => Auth::id(),
            'account_number' => $request->input('account_number'),
            'bank_name' => $request->input('bank_name'),
            'account_holder_name' => $request->input('account_holder_name'),
            'is_main' => $request->input('is_main', false),
        ];
    }

    public function index(Request $request)
    {
        $query = $this->bill->query();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('account_number', 'like', "%$search%")
                    ->orWhere('bank_name', 'like', "%$search%")
                    ->orWhere('account_holder_name', 'like', "%$search%");
            });
        }

        $data = $query->orderByDesc('is_main')->orderBy('created_at', 'desc')->get();
        return $data;
    }


    public function show($uuid)
    {
        $data = $this->bill->where('uuid', $uuid)->first();

        if (!$data) {
            return $this->response->notFound();
        }

        return $data;
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), $this->validate());
        if ($validator->fails()) {
            return $this->response->validationError($validator->errors());
        }

        $data = $this->request($request);

        if ($data['is_main']) {
            $this->bill->where('user_id', Auth::id())->update(['is_main' => false]);
        }

        if ($request->filled('uuid')) {
            $bill = $this->bill->where('uuid', $request->uuid)->where('user_id', Auth::id())->first();
            if (!$bill) {
                return $this->response->notFound();
            }

            $updated = $bill->update($data);

            if (!$this->bill->where('user_id', Auth::id())->where('is_main', true)->exists()) {
                $bill->update(['is_main' => true]);
            }

            return $updated
                ? $this->response->update($bill)
                : $this->response->updateError();
        } else {
            $data['uuid'] = Str::uuid();

            if (!$this->bill->where('user_id', Auth::id())->exists()) {
                $data['is_main'] = true;
            }

            $bill = $this->bill->create($data);

            return $bill
                ? $this->response->store($bill)
                : $this->response->storeError();
        }
    }

    public function destroy($uuid)
    {
        $bill = $this->bill->where('uuid', $uuid)->where('user_id', Auth::id())->first();

        if (!$bill) {
            return $this->response->notFound();
        }

        $wasMain = $bill->is_main;
        $bill->delete();

        if ($wasMain) {
            $another = $this->bill->where('user_id', Auth::id())->first();
            if ($another) {
                $another->update(['is_main' => true]);
            }
        }

        return $this->response->destroy($bill);
    }
}
