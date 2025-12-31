<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    @include('components.meta')

    @if (isset($page['props']['schema']))
        {!! $page['props']['schema'] !!}
    @endif()

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
    <link fetchpriority="low" rel="stylesheet" href="/assets/fontawesome-6.7.2/css/all.min.css" />

    @include('components.gtm_head')

    <!-- Scripts -->
    {{-- @routes --}}
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia

    @include('components.gtm_body')
</body>

</html>
