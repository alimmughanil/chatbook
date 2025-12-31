<?php

return [
  'data' => [
    [
      "migration" => "2025_10_07_093544_create_patients_table",
      "label" => "Data Pasien",
      "icon" => "fas fa-hospital-user",
      // "prefix_url" => "admin",
      "labels" => [
        'name' => 'Nama',
        'address' => 'Alamat',
        'phone' => 'No. Hp',
        'birth_date' => 'Tanggal Lahir',
        'gender' => 'Jenis Kelamin',
        'medical_history' => 'Riwayat Penyakit',
        'medication_allergy' => 'Alergi Obat',
      ],
      "validation" => [
        'name' => 'required|string',
        'address' => 'required|string',
        'phone' => 'required|string',
        'birth_date' => 'required|date',
        'gender' => 'required|string',
        'medical_history' => 'nullable',
        'medication_allergy' => 'nullable',
      ],
    ],
    [
      "migration" => "2025_10_07_093739_create_doctors_table",
      "label" => "Data Dokter",
      "icon" => "fas fa-stethoscope",
      // "prefix_url" => "admin",
      "labels" => [
        'name' => 'Nama',
        'institute' => 'Institusi',
      ],
      "validation" => [
        'name' => 'required|string',
        'institute' => 'nullable|string',
      ],
    ],
    [
      "migration" => "2025_10_07_093814_create_medical_records_table",
      "label" => "Rekam Medis",
      "icon" => "fas fa-notes-medical",
      // "prefix_url" => "admin",
      "labels" => [
        'doctor_id' => 'Dokter',
        'date' => 'Tanggal',
        'complaint' => 'Keluhan',
        'note' => 'Keterangan',
        'treatment' => 'Tindakan',
      ],
      "validation" => [
        'doctor_id' => 'required|integer|exists:doctors,id',
        'date' => 'required|date',
        'complaint' => 'required|string',
        'note' => 'nullable|string',
        'treatment' => 'nullable|string',
      ],
    ],

  ]
];
