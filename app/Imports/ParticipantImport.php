<?php

namespace App\Imports;

use Carbon\Carbon;
use App\Utils\Helper;
use App\Models\Participant;
use App\Enums\ParticipantType;
use App\Enums\OriginStatusType;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;

class ParticipantImport implements ToCollection, WithBatchInserts, WithChunkReading, ShouldQueue, WithStartRow
{
  /**
   * @param array $row
   *
   * @return \Illuminate\Database\Eloquent\Model|null
   */
  use Importable;

  public $course;
  public function __construct($course)
  {
    $this->course = $course;
  }

  public function collection(Collection $rows)
  {
    foreach ($rows as $row) {
      if (isset($row[0]) || isset($row[1]) || isset($row[2]) || isset($row[3])) {
        $validate = [
          'course_id' => $this->course->id,
          'type' => $row[0] ?? ParticipantType::Participant,
          'name' => $row[1] ?? '-',
          'email' => $row[2] ?? '-',
          'phone' => $row[3] ?? '-',
          'institute' => $row[4] ?? null,
          'branch' => $row[5] ?? null,
          'status' => OriginStatusType::Active,
        ];
        if ($row[6]) {
          $createdAt = Carbon::parse($row[6]);
          if ($createdAt) {
            $validate['created_at'] = $createdAt;
          }
        }

        $exist = Participant::where('course_id', $this->course->id)->where('email', $validate['email'])->first();
        if ($exist) {
          continue;
        }

        $validate['participant_number'] = Participant::getParticipantNumber($this->course);
        Participant::create(attributes: $validate);
      }
    }
  }
  public function startRow(): int
  {
    return 2;
  }
  public function chunkSize(): int
  {
    return 1000;
  }
  public function batchSize(): int
  {
    return 1000;
  }
}
