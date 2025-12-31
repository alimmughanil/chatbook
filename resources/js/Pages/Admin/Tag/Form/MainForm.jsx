import React, { useEffect } from "react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { slugify } from "@/utils/format"

function MainForm({ isEdit = false }) {
  const formConfig = { isEdit, getProperties }
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

  return <FormBuilder {...builderProps} />
}

const getProperties = (state) => {
  const { props, data } = state

  const properties = [
    [
      {
        form: 'input',
        props: {
          name: 'title',
          label: 'Nama Tag',
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
          label: 'Gunakan Sebagai Tag Unggulan',
        }
      },
      {
        form: 'checkbox',
        props: {
          name: 'is_active',
          label: 'Aktifkan Tag',
        }
      },
    ],
  ]

  return properties
}

export default MainForm
