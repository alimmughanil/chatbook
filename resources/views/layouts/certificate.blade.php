<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>{{ "Sertifikat" }}</title>

    <style>
        @page {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
        }

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }

        .image-container {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: block;
            max-width: 100%;
        }

        .description p,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
            box-sizing: border-box;
            width: 85%;
            margin: 0;
        }

        /* .page-break {
            page-break-after: always;
        } */
    </style>
</head>

<body>
    <div class="image-container" style="position: relative; width:100%; height:100%; margin:auto;">
        <img src={{ public_path($certificate->template) }} alt="Template Sertifikat"
            style="width:100%; height:100%; z-index: 0; margin: 0; padding: 0; object-fit: fill;" />
        @if ($certificate->label->isEmpty())
            {{ null }}
        @else
            @foreach ($certificate->label as $label)
                <div
                    style="position: absolute; font-size:32px; width:{{ $label->box_width }}%; height:{{ $label->box_height }}%; top:{{ $label->y_coordinate }}%; left:{{ $label->x_coordinate }}%; text-align:center; z-index:50; line-height: 1rem; font-weight: 600;">
                    @if (isset($participant))
                        <p style="font-size: {{$label->font_size}}px">{{ $participant[$label->type_key] }}</p>
                    @else
                        <p style="font-size: {{$label->font_size}}px; text-transform: capitalize;">{{ $label->type }} {{ $certificate->type }}</p>
                    @endif
                </div>
            @endforeach
        @endif
    </div>
    @if (isset($certificate->description))
        <div class="description" style="box-sizing: border-box; width: 100%; padding: 80px; height: fit-content;">
            {!! $certificate->description !!}
        </div>
    @endif
</body>

</html>
