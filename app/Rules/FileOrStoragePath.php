<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class FileOrStoragePath implements ValidationRule
{
    protected array $allowedExtensions;
    protected int $maxSizeKb;
    protected string $valueField;

    public function __construct(array $allowedExtensions = ['pdf', 'jpg', 'png', 'csv', 'xlsx', 'zip'], int $maxSizeKb = 2048, string $valueField = 'value')
    {
        $this->allowedExtensions = $allowedExtensions;
        $this->maxSizeKb = $maxSizeKb;
        $this->valueField = $valueField;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value instanceof UploadedFile) {
            $ext = strtolower($value->getClientOriginalExtension());

            if (!in_array($ext, $this->allowedExtensions)) {
                $fail("File {$attribute} harus bertipe: " . implode(', ', $this->allowedExtensions));
            }

            if ($value->getSize() > $this->maxSizeKb * 1024) {
                $fail("File {$attribute} tidak boleh lebih dari {$this->maxSizeKb}KB");
            }
        }
        elseif (is_string($value)) {
            if (!str_starts_with($value, '/storage')) {
                $fail("Path {$attribute} harus diawali dengan /storage");
            }
        }
        elseif (is_array($value)) {
            if (!isset($value[$this->valueField])) {
                $fail("Field {$attribute}.{$this->valueField} harus ada");
            }
            
            $value = $value[$this->valueField];
            if (!str_starts_with($value, '/storage')) {
                $fail("Path {$attribute} harus diawali dengan /storage");
            }
        }
        else {
            $fail("Field {$attribute} harus berupa file upload atau path string");
        }
    }
}
