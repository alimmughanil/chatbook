import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { useSearchParams } from "@/utlis/format"

function MainForm({ isEdit = false, formOptions = {}, BackButton = null, initialData = {}, isLabel = true, onSubmit = null }) {
  const formConfig = { isEdit, getProperties, formOptions, initialData, onSubmit }
  const builderProps = useFormBuilder(formConfig)  

  return <FormBuilder {...builderProps} BackButton={BackButton} isLabel={isLabel} wrapperClassName="flex flex-col items-center justify-center w-full gap-4" />
}

const getProperties = (state) => {
  const { props, data, setData } = state
  const { params } = useSearchParams(props.location)

  const properties = [
    [
      {
        form: "input",
        props: {
          name: "answer_text",
          label: "Teks Jawaban",
        },
      },
    ],
    [
      {
        form: "checkbox",
        props: {
          name: "is_correct",
          label: "Termasuk Jawaban Benar",
        },
      },
    ],
  ]

  return properties
}

export default MainForm
