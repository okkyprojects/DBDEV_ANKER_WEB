<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Repositories\NotificationRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    private $notification;
    public function __construct(NotificationRepository $notification)
    {
        $this->middleware('permission:notification-index', ['only' => ['index', 'show']]);
        $this->middleware('permission:notification-add', ['only' => ['store']]);
        $this->notification = $notification;
    }
    public function index(Request $request)
    {
        $data['summary'] = $this->notification->summary();
        $data['result'] = session('result');
        return Inertia::render('Notification/Index', compact('data'));
    }
    public function store(Request $request)
    {
        $result = $this->notification->store($request);
        return redirect()->back()->with('result', $result)->with('success', 'Berhasil Mengirim Notifikasi!');
    }
}
