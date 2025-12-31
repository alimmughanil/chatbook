import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"

function MainForm({ isEdit = false, formOptions = {}, BackButton = null, initialData = {}, isLabel = true, onSubmit = null }) {
  const formConfig = { isEdit, getProperties, formOptions, initialData, onSubmit }
  const builderProps = useFormBuilder(formConfig)

  return <FormBuilder {...builderProps} BackButton={BackButton} isLabel={isLabel} wrapperClassName="flex flex-col items-center justify-center w-full gap-4" />
}

const getProperties = (state) => {
  const { props } = state

  const properties = [
    [
      {
        form: "select",
        props: {
          name: "status",
          label: "Penilaian Jawaban",
          options: props.status,
          prefix: "answer"
        },
      },
    ],
  ]

  return properties
}

export default MainForm
