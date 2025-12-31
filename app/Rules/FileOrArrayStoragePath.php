<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileOrArrayStoragePath implements ValidationRule
{
    protected array $allowedExtensions;
    protected int $maxSizeKb;

    public function __construct(array $allowedExtensions = ['pdf','jpg','png','csv','xlsx','zip'], int $maxSizeKb = 2048)
    {
        $this->allowedExtensions = $allowedExtensions;
        $this->maxSizeKb = $maxSizeKb;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {        
        if ($value instanceof UploadedFile) {
            $ext = strtolower($value->getClientOriginalExtension());

            if (!in_array($ext, $this->allowedExtensions)) {
                $fail("File {$attribute} harus bertipe: " . implode(', ', $this->allowedExtensions));
            }

            if ($value->getSize() > $this->maxSizeKb * 1024) {
                $fail("Ukuran file {$attribute} tidak boleh lebih dari {$this->maxSizeKb}KB");
            }

            return;
        }
        
        if (is_array($value) && isset($value['value'])) {
            $path = $value['value'];
            
            if (!str_starts_with($path, '/storage')) {
                $fail("{$attribute}.value harus diawali dengan /storage");
                return;
            }
            
            $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
            if (!in_array($ext, $this->allowedExtensions)) {
                $fail("{$attribute}.value harus berupa file dengan ekstensi: " . implode(', ', $this->allowedExtensions));
            }
            
            $size = null;

            if (isset($value['size'])) {
                $size = (int) $value['size'];
            } else {
                $relativePath = str_replace('/storage', 'public', $path);
                if (Storage::exists($relativePath)) {
                    $size = Storage::size($relativePath);
                }
            }

            if ($size !== null && $size > $this->maxSizeKb * 1024) {
                $fail("Ukuran file {$attribute} tidak boleh lebih dari {$this->maxSizeKb}KB");
            }

            return;
        }
        
        $fail("{$attribute} harus berupa file upload atau array dengan key 'value'");
    }
}
