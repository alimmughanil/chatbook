import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { useSearchParams } from "@/utlis/format"
import useLang from "@/utlis/useLang"

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
          name: "title",
          label: "Judul",
        },
      },
    ],
    [
      {
        form: "textarea",
        props: {
          name: "description",
          label: "Deskripsi",
          setData: setData,
          alt: "Jika Ada"
        },
      },
    ],
    [
      {
        form: "select",
        props: {
          name: "grading_type",
          label: "Jenis Penilaian",
          options: props.quiz_grading_type,
          prefix: 'quiz',
          bottomLabel: useLang(`quiz.${data.grading_type}_info`),
        },
      },
      {
        form: "input",
        props: {
          name: "min_score",
          type: "tel",
          label: "Nilai Minimal",
          defaultValue: "0",
          bottomLabel: "Nilai minimal untuk lulus kuis ini"
        },
      },
      {
        form: "input",
        props: {
          name: "duration",
          type: "text",
          label: "Durasi Pengerjaan",
          alt: "Format: HH:MM:SS",
          placeHolder: "01:40:00 untuk 1 jam 40 menit"
        },
      },
    ],
  ]

  return properties
}

export default MainForm
