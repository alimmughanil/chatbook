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

  const properties = [
    [
      {
        form: 'input',
        props: {
          name: 'name',
          label: 'Nama Produk',
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
        form: "select",
        props: {
          name: "category_id",
          isReactSelect: true,
          label: "Kategori",
          options: props.categories,
        },
      },
      {
        form: "select",
        props: {
          name: "assigned_user_id",
          isReactSelect: true,
          label: "Partner",
          options: props.partner,
        },
      },
    ],
    [
      {
        form: 'input',
        props: {
          name: 'price',
          label: 'Harga',
          type: 'number',
        }
      },
      {
        form: "select",
        props: {
          name: "status",
          isReactSelect: true,
          label: "Status",
          options: props.status,
        },
      },
    ],
    [
      {
        form: 'checkbox',
        props: {
          name: 'is_featured',
          label: 'Gunakan Sebagai Produk Unggulan',
        }
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          name: 'description',
          label: 'Deskripsi',
        }
      },
    ],
    [
      {
        form: 'input',
        props: {
          name: 'keywords',
          label: 'Keywords',
          type: 'text',
        }
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          name: 'meta_description',
          label: 'Meta Description',
        }
      },
    ],
    [
      {
        form: 'file',
        props: {
          name: 'thumbnail',
          label: 'Thumbnail',
        }
      },
    ],
    [
      {
        form: 'select',
        props: {
          name: 'tags',
          isReactSelect: true,
          label: 'Tags',
          options: props.tags,
          isMulti: true,
        }
      }
    ]
  ]

  return properties
}

export default MainForm
