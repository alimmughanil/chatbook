import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { useSearchParams } from "@/utlis/format"
import { usePage } from "@inertiajs/react"

function RegistrationForm({ isEdit = false, formOptions = {}, BackButton = null, SubmitButton = null }) {
  const { participant, auth } = usePage().props
  let initialData = participant ?? auth?.user

  const formConfig = { isEdit, getProperties, formOptions, initialData }
  const builderProps = useFormBuilder(formConfig)
  return <FormBuilder {...builderProps} BackButton={BackButton} SubmitButton={SubmitButton} isLabel={false} wrapperClassName="flex flex-col items-center justify-center w-full gap-4 border p-4" />
}

const getProperties = (state) => {
  const { props, data, setData, isEdit } = state
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
          name: "email",
          label: "Email",
          type: 'email',
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "phone",
          label: "Telepon/Whatsapp",
          type: 'tel',
        },
      },
      {
        form: "input",
        props: {
          name: "institute",
          label: "Institusi",
          alt: "Opsional"
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "branch",
          label: "Cabang",
          alt: "Opsional"
        },
      },
      {
        form: "input",
        props: {
          name: "job_title",
          label: "Jabatan",
          alt: "Opsional"
        },
      },
    ],
  ]  

  return properties
}
export default RegistrationForm
