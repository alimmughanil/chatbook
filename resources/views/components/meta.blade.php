@php
  $meta = [
    'title'=>'',
    'keywords'=>'',
    'description'=>'',
    'type'=>'website',
    'image'=>$page['props']['ziggy']['url']. "/image/logo.png",
  ];
  if(!empty($page['props']['meta']['title'])){
    $meta['title'] = $page['props']['meta']['title'];
  }
  if(!empty($page['props']['meta']['keywords'])){
    $meta['keywords'] = $page['props']['meta']['keywords'];
  }
  if(!empty($page['props']['meta']['description'])){
    $meta['description'] = $page['props']['meta']['description'];
  }
  if(!empty($page['props']['meta']['image'])){
    $meta['image'] = $page['props']['meta']['image'];
  }

  if(empty($meta['title']) && !empty($page['props']['default_meta']['companyName'])){
    $meta['title'] = $page['props']['default_meta']['companyName'];
  }
  if(empty($meta['description']) && !empty($page['props']['default_meta']['about'])){
    $meta['description'] = $page['props']['default_meta']['about'];
  }
  if(empty($meta['keywords']) && !empty($page['props']['default_meta']['seoKeywords'])){
    $meta['keywords'] = $page['props']['default_meta']['seoKeywords'];
  }
  if(empty($meta['description']) && !empty($page['props']['default_meta']['seoDescription'])){
    $meta['description'] = $page['props']['default_meta']['seoDescription'];
  }

  $title = $meta['title'];
  $keywords = $meta['keywords'];
  $description = $meta['description'];
  $type = $meta['type'];
  $image = $meta['image'];
  $ziggy = $page['props']['ziggy'];
  $appName = $page['props']['appName'];

  $currentUrl = url()->current();
  $googleVerification = $page['props']['config']['GOOGLE_VERIFICATION'] ?? null;
  // dd($googleVerification);
@endphp

<title inertia>{{$title}}</title>
<meta name="description" content="{{$description}}"/>
<meta name="twitter:description" content="{{$description}}"/>
<meta property="og:description" content="{{$description}}"/>

<meta name="keywords" content="{{$keywords}}"/>
<meta property="og:title" content="{{$title}}"/>
<meta property="og:url" content="{{$ziggy['location']}}"/>
<meta property="og:site_name" content="{{$appName}}"/>

<meta property="twitter:title" content="{{$title}}"/>
<meta property="twitter:url" content="{{$ziggy['location']}}"/>
<meta property="twitter:url" content="{{$ziggy['location']}}"/>
<meta property="twitter:domain" content="{{$appName}}"/>
<meta property="twitter:image" content="{{$image}}"/>
<meta name="twitter:card" content="summary_large_image"/>

<meta property="og:image" content="{{$image}}"/>
<meta property="og:image:url" content="{{$image}}"/>
<meta property="og:image:size" content="300"/>
<meta property="og:type" content="{{$type}}"/>

<link rel="icon" type="image/png" href="{{$ziggy['url'] ."/image/icon.png"}}">

@if (!empty($googleVerification))
    <meta name="google-site-verification" content="{{ $googleVerification }}" />
@endif