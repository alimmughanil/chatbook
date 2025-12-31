@php
  $gtmId = null;
  if(!empty($page['props']['config']['GTM_ID'])){
    $gtmId = $page['props']['config']['GTM_ID'];
  }
@endphp

@if (!empty($gtmId))
  <noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id={{ $gtmId }}"
            height="0" width="0" style="display:none;visibility:hidden">
    </iframe>
  </noscript>
@endif
