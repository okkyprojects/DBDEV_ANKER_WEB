<?php

namespace App\Traits;

class Response {
	public function index($data){
        $response = [
            'status' => 'Success',
            'message' => 'Data has successfully retrieved',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function show($data){
        $response = [
            'status' => 'Success',
            'message' => 'Single data has successfully retrieved',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function store($data){
        $response = [
            'status' => 'Success',
            'message' => 'Data has successfully created',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function update($data){
        $response = [
            'status' => 'Success',
            'message' => 'Data has successfully edited',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function destroy($data){
        $response = [
            'status' => 'Success',
            'message' => 'Data has successfully deleted',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function empty($data = []){
        $response = [
            'status' => 'Success',
            'message' => 'Data has successfully retrieved but empty',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function notFound($data = []){
        $response = [
            'status' => 'Error',
            'message' => 'Data not found',
            'data' => $data
        ];
        return response()->json($response, 404);
    }

    public function storeError($data = []){
        $response = [
            'status' => 'Error',
            'message' => 'Error create data',
            'data' => $data
        ];
        return response()->json($response, 500);
    }

    public function updateError($data = []){
        $response = [
            'status' => 'Error',
            'message' => 'Error edit data',
            'data' => $data
        ];
        return response()->json($response, 500);
    }

    public function destroyError($data = []){
        $response = [
            'status' => 'Error',
            'message' => 'Error delete data',
            'data' => $data
        ];
        return response()->json($response, 500);
    }

    public function validationError($message, $data = []){
        $valArr = array();
        foreach ($message->toArray() as $key => $value) { 
            $errStr = $value[0];
            array_push($valArr, $errStr);
        }

        $errStrFinal = '';

        if(!empty($valArr)){
            $errStrFinal = implode(', ', $valArr);
        }

        $response = [
            'status' => 'Error',
            'message' => $errStrFinal,
            'data' => $data
        ];
        return response()->json($response, 400);
    }

    public function internalError($data){
        $response = [
            'status' => false,
            'message' => 'Internal Error',
            'data' => $data
        ];
        return response()->json($response, 500);
    }

    public function send($message, $data = [], $status = 400){
        $response = [
            'status' => false,
            'message' => $message,
            'data' => $data
        ];
        return response()->json($response, $status);
    }

    public function answer($data){
        $response = [
            'status' => 'Success',
            'message' => 'Question has successfully answered',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function mark_todo($data){
        $response = [
            'status' => 'Success',
            'message' => 'Question has successfully marked as todo',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function report($data){
        $response = [
            'status' => 'Success',
            'message' => 'Question has successfully reported',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function import($data){
        $response = [
            'status' => 'Success',
            'message' => 'Question has successfully imported',
            'data' => $data
        ];
        return response()->json($response, 200);
    }

    public function response($code, $status, $message, $data) {
        $response = [
            'status' => $status,
            'message' => $message,
            'data' => $data
        ];
        return response()->json($response, $code);
    }

    public function tokenMismatch($data = null){
        $response = [
            'status' => 'Error',
            'message' => 'Token Missmatch',
            'data' => $data
        ];
        return response()->json($response, 400);
    }
}