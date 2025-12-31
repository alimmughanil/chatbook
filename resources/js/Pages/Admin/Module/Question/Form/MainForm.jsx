import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { useSearchParams } from "@/utlis/format"

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
          name: "type",
          label: "Jenis Pertanyaan",
          options: props.question_type,
          prefix: "question",
          bottomLabel: data?.type ? props.question_description?.[data?.type] : null
        },
      },
    ],
    [
      {
        form: "textarea",
        props: {
          name: "question_text",
          label: "Teks Pertanyaan",
        },
      },
    ]
  ]

  return properties
}

export default MainForm
