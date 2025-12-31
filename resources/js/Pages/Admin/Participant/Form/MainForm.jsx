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
  const { props, data, setData, isEdit } = state
  const { params } = useSearchParams(props.location)

  const properties = [
    [
      {
        form: "select",
        props: {
          name: "course_id",
          label: "Kursus",
          options: props.courses,
          isReactSelect: true,
          isVirtualized: true,
          handleChange: (e) => setData("course_id", e?.value),
        },
      },
      {
        form: "select",
        props: {
          name: "type",
          label: "Jenis Kepesertaan",
          options: props.participant_type,
        },
      },
    ],
    [
      {
        form: "input",
        isHidden: !isEdit,
        props: {
          name: "participant_number",
          label: "Nomor Peserta",
        },
      },
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
          type: 'email'
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "phone",
          label: "Telepon/Whatsapp",
          type: 'tel'
        },
      },
      {
        form: "input",
        props: {
          name: "institute",
          label: "Institusi",
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
      {
        form: "select",
        props: {
          name: "status",
          label: "Status",
          prefix: "participant",
          options: props.status,
        },
      },
    ],
  ]

  return properties
}

export default MainForm
