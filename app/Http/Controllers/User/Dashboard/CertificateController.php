<?php

namespace App\Http\Controllers\User\Dashboard;

use Inertia\Inertia;
use App\Models\Certificate;
use App\Models\Participant;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Http\Controllers\Controller;
use App\Models\ParticipantCertificate;
use App\Enums\ParticipantCertificateStatusType;

class CertificateController extends Controller
{
  public function index(Request $request)
  {
    $query = ParticipantCertificate::query()
      ->with([
        'course:id,title,thumbnail',
        'participant',
      ])
      ->where('user_id', auth()->id())
      ->orderBy('id', 'desc');

    $validStatus = ParticipantCertificateStatusType::getValues();

    if ($request->filled('status') && in_array($request->status, $validStatus)) {
      $query->where('status', $request->status);
    }

    $certificates = $query->paginate(20);

    $certificates->getCollection()->transform(function ($item) {
      return [
        'id' => $item->id,
        'status' => $item->status,
        'course_name' => $item->course->title,
        'certificate_title' => $item->participant->name ?? null,
        'thumbnail' => $item->course->thumbnail,
      ];
    });

    return Inertia::render('User/Dashboard/Certificate/Index', [
      'title' => 'Sertifikat Saya',
      'certificates' => $certificates,
      'status' => $validStatus,
    ]);
  }

  public function show($id, Request $request)
  {
    try {
      $participantCertificate = ParticipantCertificate::with('course')
        ->where('id', $id)
        ->where('user_id', auth()->id())
        ->first();

      if (!$participantCertificate) {
        return redirect()->back()->with('error', 'Sertifikat tidak ditemukan');
      }

      $certificate = Certificate::published()->whereId($participantCertificate->certificate_id)->with('label')->first();
      $course = $participantCertificate->course;

      if (!$certificate)
        return redirect()->back()->with("error", "Download Sertifikat Gagal. Sertifikat belum ditambahkan");
      if ($certificate->label->isEmpty())
        return redirect()->back()->with("error", "Download Sertifikat Gagal. Sertifikat belum ditambahkan");

      $widthInPoints = floatval($certificate->paper_width) * (72 / 2.54);
      $heightInPoints = floatval($certificate->paper_height) * (72 / 2.54);

      $certificate->label = collect($certificate->label)->map(function ($label) {
        $label->type_key = \App\Utils\Helper::getCertificateLabelType($label->type);
        return $label;
      });

      $participant = Participant::where('course_id', $participantCertificate->course_id)->where('user_id', auth()->id())->first();
      if (!$participant)
        return redirect()->back()->with("error", "Peserta belum terdaftar di kursus ini");

      if (\App\Utils\Helper::htmlToString($certificate->description) == '') {
        $certificate->description = null;
      }

      $pdf = Pdf::loadView('layouts.certificate', ['certificate' => $certificate, 'participant' => $participant])->setPaper([0, 0, $widthInPoints, $heightInPoints], 'potrait');

      $filePath = "{$participant->name}-{$course->slug}";
      $filePath = str_replace(' ', '-', $filePath);
      $filePath = preg_replace('/[^A-Za-z0-9-]/', '', $filePath);

      return $pdf->download("$filePath.pdf");
    } catch (\Throwable $th) {
      return redirect()->back()->with("error", "Download Sertifikat Gagal. Kesalahan sistem internal");
    }
  }
}
