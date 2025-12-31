import React, { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { mimeType, slugify, useSearchParams } from "@/utils/format"

function MainForm({ isEdit = false }) {
  const formConfig = { isEdit, getProperties }
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

  return <FormBuilder {...builderProps} />
}

const getProperties = (state) => {
  const { props, data } = state
  const { params } = useSearchParams(props.location)

  const properties = [
    [
      {
        form: 'input',
        props: {
          name: 'name',
          label: 'Nama Kategori',
          type: 'text',
        }
      },
      {
        form: 'input',
        props: {
          name: 'slug',
          label: 'Slug',
          type: 'text',
        }
      },
    ],
    [
      {
        form: 'checkbox',
        props: {
          name: 'is_featured',
          label: 'Gunakan Sebagai Artikel Unggulan',
        }
      },
      {
        form: "select",
        props: {
          name: "status",
          label: "Status",
          options: props.status,
        },
      },
    ],
  ]

  return properties
}

export default MainForm
