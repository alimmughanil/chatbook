import React, { useEffect } from "react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { mimeType, slugify } from "@/utils/format"

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
  const { props, data, setData } = state

  const properties = [
    [
      {
        form: "input",
        props: {
          name: "name",
          label: "Nama Proyek",
          type: "text",
        },
      },
      {
        form: "input",
        props: {
          name: "slug",
          label: "Slug",
          type: "text",
        },
      },
    ],
    [
      {
        form: "select",
        props: {
          isReactSelect: true,
          name: "category_id",
          label: "Kategori",
          options: props.categories,
          handleChange: (e) => setData("category_id", e?.value),
        },
      },
      {
        form: "select",
        props: {
          isReactSelect: true,
          name: "client_id",
          label: "Klien",
          options: props.clients,
          handleChange: (e) => setData("client_id", e?.value),
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "price_min",
          label: "Harga Minimum",
          type: "number",
        },
      },
      {
        form: "input",
        props: {
          name: "price_max",
          label: "Harga Maksimum",
          type: "number",
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "duration",
          label: "Durasi",
          type: "tel",
        },
      },
      {
        form: "select",
        props: {
          name: "duration_unit",
          label: "Satuan Durasi",
          options: props.time_unit_type,
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "site_url",
          label: "URL Situs",
          type: "text",
        },
      },
      {
        form: "input",
        props: {
          name: "project_date",
          label: "Tanggal Proyek",
          type: "date",
        },
      },
    ],
    [
      {
        form: "textarea",
        props: {
          isTextEditor: true,
          name: "description",
          label: "Deskripsi",
          setData: setData,
        },
      },
    ],
    [
      {
        form: "input",
        imagePreview: true,
        isSidePreview: false,
        previewLabel: "Preview:",
        previewClassName: "w-[160px] h-[160px] object-cover border rounded-md",
        props: {
          name: "thumbnail",
          label: "Gambar",
          type: "file",
          accept: mimeType("image"),
        },
      },
      {
        form: "select",
        props: {
          name: "project_status",
          label: "Status Proyek",
          options: props.project_status,
          prefix: "portfolio",
        },
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
    [
      {
        form: "checkbox",
        props: {
          name: "is_show_client",
          label: "Tampilkan Klien",
        },
      },
    ],
    [
      {
        form: "FileUploader",
        props: {
          name: "images",
          label: "Upload Gambar Slider",
          accept: "image",
          setData: setData,
        },
      },
    ],
  ]

  return properties
}

export default MainForm
