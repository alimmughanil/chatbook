import { useEffect } from "react"
import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { mimeType, slugify, useSearchParams } from "@/utlis/format"

function MainForm({ isEdit = false, formOptions = {}, BackButton = null }) {
  const formConfig = { isEdit, getProperties, formOptions }
  const builderProps = useFormBuilder(formConfig)
  const { data, setData } = builderProps.form

  useEffect(() => {
    let filteredSlug = ""
    if (data.title && !isEdit) {
      const slug = slugify(data.title)
      filteredSlug = slug
    }
    if (!isEdit) {
      setData("slug", filteredSlug)
    }
  }, [data.title])

  return <FormBuilder {...builderProps} BackButton={BackButton} />
}

const getProperties = (state) => {
  const { props, data, setData } = state
  const { params } = useSearchParams(props.location)

  const properties = [
    [
      {
        form: "select",
        props: {
          isReactSelect: true,
          isVirtualized: true,
          name: "category_id",
          label: "Kategori",
          options: props.categories,
          handleChange: (e) => setData("category_id", e?.value),
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "title",
          label: "Judul",
        },
      },
      {
        form: "input",
        props: {
          name: "slug",
          label: "Slug",
        },
      },
    ],
    [
      {
        form: "select",
        props: {
          name: "payment_type",
          label: "Tipe Pembayaran",
          prefix: "course",
          options: props.payment_type,
        },
      },
      {
        form: "input",
        isHidden: !["paid"].includes(data.payment_type),
        props: {
          name: "price",
          label: "Harga",
        },
      },
      {
        form: "select",
        props: {
          name: "time_limit",
          label: "Batas Waktu",
          prefix: "course",
          options: props.time_limit,
        },
      },
    ],
    [
      {
        form: "input",
        isHidden: !["limited"].includes(data.time_limit),
        props: {
          type: 'datetime-local',
          name: "start_at",
          label: "Mulai Kursus",
        },
      },
      {
        form: "input",
        isHidden: !["limited"].includes(data.time_limit),
        props: {
          type: 'datetime-local',
          name: "close_at",
          label: "Selesai Kursus",
        },
      },
      {
        form: "input",
        isHidden: !["limited"].includes(data.time_limit),
        props: {
          type: 'datetime-local',
          name: "registration_start_at",
          label: "Mulai Pendaftaran Kursus",
        },
      },
      {
        form: "input",
        isHidden: !["limited"].includes(data.time_limit),
        props: {
          type: 'datetime-local',
          name: "registration_close_at",
          label: "Tutup Pendaftaran Kursus",
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "participant_format_number",
          label: "Format Nomor Peserta",
        },
      },
      {
        form: "input",
        props: {
          name: "participant_start_number",
          label: "Nomor Mulai Peserta",
        },
      },
    ],
    [
      {
        form: "input",
        imagePreview: true,
        isSidePreview: false,
        previewClassName: "w-full aspect-[16/12] max-w-[20rem] object-cover rounded",
        props: {
          name: "thumbnail",
          type: "file",
          label: "Gambar",
          accept: mimeType("image"),
        },
      },
    ],
    [
      {
        form: 'checkbox',
        props: {
          name: 'is_featured',
          label: 'Jadikan Sebagai Kursus Pilihan',
        }
      },
      {
        form: "select",
        props: {
          name: "level",
          label: "Level",
          prefix: "course",
          options: props.level,
        },
      },
    ],
    [
      {
        form: "textarea",
        props: {
          name: "description",
          label: "Deskripsi",
          isTextEditor: true,
          setData: setData,
        },
      },
    ],
  ]

  return properties
}

export default MainForm
