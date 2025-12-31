import { useEffect } from "react"
import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { slugify, useSearchParams } from "@/utils/format"

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
