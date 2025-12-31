<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Maintenance</title>
  @vite(['resources/js/app.jsx'])
</head>
<body>
  <div class=" flex flex-col md:flex-row items-center mx-auto w-full justify-center min-h-screen">
    <div class="flex flex-col w-full justify-center items-center gap-4">
      <h1 class="text-2xl lg:text-4xl font-bold text-indigo-700 w-full max-w-xs text-center">Website is Under Construction</h1>

      @if (auth()->check())
      <form action="/logout" method="post">
        @csrf
        <button type="submit" class="btn btn-primary btn-sm text-white mx-auto">Logout</button>
      </form>
      @endif
    </div>
    <img src="/image/maintenance.svg" class="w-full max-w-2xl">
  </div>
</body>
</html>