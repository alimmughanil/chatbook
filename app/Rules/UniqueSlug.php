<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UniqueSlug implements Rule
{
    private string $lang;
    private string $tableName;
    private array $ignoreIds = [];

    /**
     * Membuat instance rule baru.
     *
     * @param string $tableName Nama tabel yang akan diperiksa.
     * @param array $idsToIgnore Array ID yang harus diabaikan dalam pengecekan.
     */
    public function __construct(string $tableName, string $lang = 'id', array $idsToIgnore = [])
    {
        $this->tableName = $tableName;
        $this->ignoreIds = $idsToIgnore;
        $this->lang = $lang;
    }

    /**
     * Menentukan apakah aturan validasi lolos.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
      return !DB::table($this->tableName)
                    ->where(['slug' => $value, 'lang' => $this->lang])
                    ->whereNotIn('id', $this->ignoreIds)->exists();
    }

    /**
     * Mendapatkan pesan error validasi.
     *
     * @return string
     */
    public function message()
    {
        return 'Slug ini telah digunakan oleh yang lain.';
    }
}
