<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($notif_id)
    {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($notif_id)
    {
        //
        try {
            $notif = Notification::where('id', $notif_id)
                ->where('user_id', auth()->user()->id)
                ->with('order')
                ->first();
            $notif->read_at = now();
            $notif->save();
        } catch (\Throwable $th) {
            \Illuminate\Support\Facades\Log::error(request()->route()->uri() . "_" . $th->getMessage());
            return redirect()->back()->with('error', 'Kesalahan Server. Update notifikasi gagal');
        }
        if ($notif->type === 'PAYMENT_SUCCESS') return redirect("/admin/order");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Notification $notification)
    {
        //
    }


    public function updateAllRead()
    {
        try {
            Notification::where('user_id', auth()->user()->id)
                ->update(['read_at' => Carbon::now()]);

            return redirect()->back()->with('success', 'Berhasil mengupdate notifikasi');
        } catch (\Throwable $th) {
            \Illuminate\Support\Facades\Log::error(request()->route()->uri() . "_" . $th->getMessage());
            return redirect()->back()->with('error', 'Kesalahan Server. Update notifikasi gagal');
        }
    }
}
