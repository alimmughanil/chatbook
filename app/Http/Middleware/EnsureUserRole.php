<?php

namespace App\Http\Middleware;

use App\Enums\UserType;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth()->check()) {
            return redirect('/login');
        }
        $roles = explode('|', $role);
        if (!in_array(auth()->user()->role, $roles) && auth()->user()->role != UserType::Admin) {
            return redirect('/admin/dashboard')->with('error','Anda tidak dapat mengakses halaman ini.');
        }

        return $next($request);
    }
}