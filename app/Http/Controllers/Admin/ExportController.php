<?php

namespace App\Http\Controllers\Admin;

use App\Models\Attendance;
use App\Models\Participant;
use Illuminate\Http\Request;
use App\Exports\ParticipantExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
  public function index(Request $request)
  {
    $validatedData = $request->validate($this->validation($request)["validation"]);
    if ($validatedData['page_name'] == 'participants') return $this->exportParticipant($request, $validatedData);
  }

  public function exportParticipant($request, $baseValidation)
  {
    $additionalValidation = $request->validate([
      "course_id" => "required|exists:courses,id",
    ]);
    $validate = [...$baseValidation, ...$additionalValidation];

    $participant = Participant::with('course')->where("course_id", $validate['course_id'])->get();

    $title = "Peserta";
    if ($participant->first()?->course) {
      $title .= " - " . $participant->first()->course->title;
    }
    $title .= " - " . now()->format('d M Y');

    $data = [
      "participant" => $participant,
      "fileName" => "$title.xlsx",
    ];


    // return view('exports.ParticipantExport', ["props" => (object) $data]);

    return Excel::download(new ParticipantExport($data), $data['fileName']);
  }

  protected function validation($request, $id = null)
  {
    return [
      "validation" => [
        "page_name" => "required|string",
      ],
      "default" => []
    ];
  }
}
