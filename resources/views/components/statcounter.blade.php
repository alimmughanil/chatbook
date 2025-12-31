<p id="sc_security" aria-hidden="true" style="display: none;" hidden>{{ config('app.sc_security') }}</p>
<!-- Default Statcounter code for {{ config('app.name') }} https://{{ config('app.name') }}/-->
<script fetchpriority="high" type="text/javascript">
    var sc_project = {{ config('app.sc_project') }}; //int
    var sc_invisible = {{ config('app.sc_invisible') }}; //int
    var sc_security = document.getElementById('sc_security')?.innerText; //string
</script>
<script fetchpriority="low" type="text/javascript" src="https://www.statcounter.com/counter/counter.js" async></script>
<noscript fetchpriority="low">
    <div class="statcounter"><a title="Web Analytics
Made Easy - Statcounter" href="https://statcounter.com/"
            target="_blank"><img class="statcounter"
                src="https://c.statcounter.com/{{ config('app.sc_project') }}/0/{{ config('app.sc_security') }}/{{ config('app.sc_invisible') }}/"
                alt="Web Analytics Made Easy - Statcounter" referrerPolicy="no-referrer-when-downgrade"></a></div>
</noscript>
<!-- End of Statcounter Code -->