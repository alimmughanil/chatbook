<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Contact;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ContactController extends Controller
{
  public function index(Request $request)
  {
    $contacts = collect(Contact::groupBy('email')->paginate(20));

    $data = [
      'title' => 'Contact',
      'contacts' => $contacts
    ];
    return Inertia::render('Admin/Contact/Index', $data);
  }
  public function store(Request $request)
  {
    $validatedData = $request->validate([
      'name' => 'required',
      'email' => 'required|email',
      'message' => 'required',
      'is_reply' => 'required',
    ]);

    $store = Contact::create($validatedData);
    if (!$store) return redirect()->back()->with('error', 'Kesalahan Server. Tambah pesan gagal');

    return redirect("/contact/$request->email")->with('success', 'Tambah pesan berhasil');
  }

  public function show($email)
  {
    $contact = Contact::whereEmail($email)->orderBy('created_at')->get();
    if ($contact->isEmpty()) return redirect()->back()->with('error', 'Alamat email tidak ditemukan');

    $data = [
      'title' => 'Percakapan ' . $email,
      'contacts' => $contact
    ];
    return Inertia::render('Home/ContactShow', $data);
  }
}
