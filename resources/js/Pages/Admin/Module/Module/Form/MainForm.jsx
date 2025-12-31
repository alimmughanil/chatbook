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
      { custom: PageDescription }
    ],
    [
      {
        form: "input",
        props: {
          name: "title",
          label: "Nama Modul",
          placeHolder: "Contoh: Persiapan Belajar"
        },
      },
    ],
    [
      {
        form: "textarea",
        props: {
          name: "description",
          label: "Deskripsi",
          placeHolder: "Keterangan Singkat",
        },
      },
    ],
  ]

  return properties
}

const PageDescription = () => {
  const { course } = usePage().props
  return (
    <div className="w-full text-sm md:text-base text-gray-700">
      <p className="text-center">Modul ini akan menjadi materi untuk kursus <span className="font-semibold">{course?.title}</span></p>
    </div>
  )
}

export default MainForm
