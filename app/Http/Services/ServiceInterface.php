<?php

namespace App\Http\Services;

interface ServiceInterface
{
   public function getAll();
   public function getAllLimitBy(int $number);
   public function getById($id);
   public function create(array $atributes);
   public function update($id, array $atributes);
   public function delete($id);
}