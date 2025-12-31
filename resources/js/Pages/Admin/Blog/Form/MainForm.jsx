import { useEffect } from "react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { mimeType, slugify, useSearchParams } from "@/utils/format"

function MainForm({ isEdit = false }) {
  const formConfig = { isEdit, getProperties }
  const builderProps = useFormBuilder(formConfig)
  const { data, setData } = builderProps.form

  useEffect(() => {
    let filteredSlug = ''
    if (data.title && !isEdit) {
      const slug = slugify(data.title)
      filteredSlug = `${slug}`
    }

    if (!isEdit) {
      setData('slug', filteredSlug)
    }

  }, [data.title])

  return <FormBuilder {...builderProps} />
}

const getProperties = (state) => {
  const { setData, props, data, errors } = state
  const { params } = useSearchParams(props.location)

  const properties = [
    [
      {
        form: 'select',
        props: {
          isReactSelect: true,
          isVirtualized: true,
          name: 'category_id',
          label: 'Kategori',
          options: props.categories,
          handleChange: (e) => setData('category_id', e?.value),
        }
      },
    ],
    [
      {
        form: 'input',
        props: {
          name: 'title',
          label: `Judul ${props.page?.label}`,
          type: 'text'
        }
      },
      {
        form: 'input',
        props: {
          name: 'slug',
          label: 'Slug',
          type: 'text'
        }
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          name: 'keyword',
          label: 'SEO Keyword',
          setData: setData,
          placeHolder: 'tips dan trik, panduan',
          bottomLabel: 'Pisahkan dengan koma'
        },
      },
      {
        form: 'textarea',
        props: {
          name: 'short_description',
          label: 'Keterangan Singkat',
          setData: setData,
          alt: "Opsional"
        },
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          isTextEditor: true,
          name: 'description',
          label: 'Konten',
          setData: setData
        }
      },
    ],
    [
      {
        form: 'input',
        imagePreview: true,
        isSidePreview: false,
        previewLabel: 'Preview:',
        previewClassName: "w-[160px] h-[160px] object-cover border rounded-md",
        props: {
          name: 'thumbnail',
          label: 'Gambar',
          type: 'file',
          accept: mimeType('image'),
        },
      },
      {
        form: 'select',
        props: {
          name: 'status',
          label: 'Status',
          options: props.status,
          defaultValue: data.status,
        }
      },
      {
        form: 'input',
        isHidden: data.status != 'publish',
        props: {
          name: 'published_at',
          label: 'Waktu Publikasi',
          type: 'datetime-local',
        }
      },
    ],
    [
      {
        form: 'checkbox',
        props: {
          name: 'is_slider',
          label: 'Gunakan Slider Banner',
        }
      },
    ],
    [
      {
        form: 'FileUploader',
        props: {
          name: 'images',
          label: 'Upload Gambar',
          accept: 'image',
          disabled: !data?.is_slider,
          setData: setData
        }
      },
    ]
  ]

  return properties
}

export default MainForm
