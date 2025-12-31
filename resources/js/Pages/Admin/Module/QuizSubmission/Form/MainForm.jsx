import { useEffect } from "react"
import { usePage } from "@inertiajs/react"
import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { slugify, useSearchParams } from "@/utlis/format"

function MainForm({ isEdit = false, formOptions = {}, BackButton = null }) {
  const formConfig = { isEdit, getProperties, formOptions }
  const builderProps = useFormBuilder(formConfig)
  const { data, setData } = builderProps.form

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
          name: "quiz_id",
          label: "Id Kuis",
          options: props.quizzes,
        },
      },
      {
        form: "input",
        props: {
          name: "score",
          label: "Skor",
        },
      },
    ],
    [
      {
        form: "DatePicker",
        props: {
          name: "submitted_at",
          label: "Dikirim Pada",
        },
      },
    ],
  ]

  return properties
}

export default MainForm
