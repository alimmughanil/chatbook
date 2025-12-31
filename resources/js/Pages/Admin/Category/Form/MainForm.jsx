import { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { mimeType, slugify, useSearchParams } from "@/utils/format"

function MainForm({ isEdit = false, formOptions = {}, BackButton = null }) {
  const formConfig = { isEdit, getProperties, formOptions }
  const builderProps = useFormBuilder(formConfig)
  const { data, setData } = builderProps.form

  useEffect(() => {
    let filteredSlug = ""
    if (data.name && !isEdit) {
      const slug = slugify(data.name)
      filteredSlug = slug
    }
    if (!isEdit) {
      setData("slug", filteredSlug)
    }
  }, [data.name])

  return <FormBuilder {...builderProps} BackButton={BackButton} />
}

const getProperties = (state) => {
  const { props, data, setData } = state
  const { params } = useSearchParams(props.location)

  const booleanOptions = [
    { value: '1', label: "Ya" },
    { value: "0", label: "Tidak" },
  ]

  const properties = [
    [
      {
        form: "input",
        props: {
          name: "name",
          label: "Nama",
        },
      },
      {
        form: "input",
        props: {
          name: "slug",
          label: "Slug",
        },
      },
      {
        form: "select",
        props: {
          name: "type",
          label: "Jenis Kategori",
          prefix: "category",
          options: props.type,
        },
      },
      // {
      //   form: "input",
      //   imagePreview: true,
      //   isSidePreview: false,
      //   previewClassName: "w-full aspect-[16/12] max-w-[20rem] object-cover rounded",
      //   props: {
      //     name: "thumbnail",
      //     type: "file",
      //     label: "Gambar",
      //     accept: mimeType("image"),
      //     alt: "Opsional"
      //   },
      // },
    ],
    [
      {
        form: 'checkbox',
        props: {
          name: 'is_featured',
          label: 'Termasuk Kategori Unggulan',
        }
      },
      {
        form: 'checkbox',
        props: {
          name: 'is_active',
          label: 'Status Aktif',
        }
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
