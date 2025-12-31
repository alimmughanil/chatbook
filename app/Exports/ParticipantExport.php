<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithStyles;
use Illuminate\Contracts\Queue\ShouldQueue;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ParticipantExport implements FromView, ShouldQueue, ShouldAutoSize, WithStyles
{
  public $data;
  public function __construct($data)
  {
    $this->data = $data;
  }

  public function view(): View
  {
    return view('exports.ParticipantExport', ["props" => (object) $this->data]);
  }

  public function styles(Worksheet $sheet)
  {
    $highestRow = $sheet->getHighestDataRow();
    $highestColumn = $sheet->getHighestDataColumn();
    $dataRange = 'A1:' . $highestColumn . $highestRow;

    return [
      $dataRange => [
        'alignment' => [
          'horizontal' => Alignment::HORIZONTAL_LEFT,
          'vertical' => Alignment::VERTICAL_CENTER,
        ],
        'borders' => [
          'allBorders' => [
            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
            'color' => ['argb' => 'FF000000'],
          ],
        ],
      ],
    ];
  }
}
