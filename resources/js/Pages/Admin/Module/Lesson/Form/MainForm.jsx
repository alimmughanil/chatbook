import useFormBuilder from "@/utlis/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { useSearchParams } from "@/utlis/format"

function MainForm({ isEdit = false, formOptions = {}, BackButton = null, initialData = {}, isLabel = true, onSubmit = null }) {
  const formConfig = { isEdit, getProperties, formOptions, initialData, onSubmit }
  const builderProps = useFormBuilder(formConfig)  

  return (
    <FormBuilder
      {...builderProps}
      BackButton={BackButton}
      isLabel={isLabel}
      wrapperClassName="flex flex-col items-center justify-center w-full gap-4"
    />
  )
}

const getProperties = (state) => {
  const { props, data, setData } = state
  const { params } = useSearchParams(props.location)

  const properties = [
    [
      {
        form: "select",
        props: {
          name: "content_type",
          label: "Jenis Materi",
          options: props.lesson_content_type,
          prefix: "lesson",
        },
      },
      {
        form: "select",
        props: {
          name: "visibility",
          label: "Visibilitas",
          options: props.visibility_type,
          prefix: "visibility",
        },
      },
    ],
    [
      {
        form: "input",
        props: {
          name: "title",
          label: ["exam"].includes(data.content_type) ? "Nama Ujian Akhir" : "Judul Materi",
        },
      },
    ],
    [
      {
        form: "input",
        isHidden: !["video"].includes(data.content_type),
        props: {
          name: "video_url",
          label: "Link Youtube",
        },
      },
      {
        form: "input",
        props: {
          name: "duration",
          type: "text",
          label: `Estimasi Durasi ${["exam"].includes(data.content_type) ? "Pengerjaan" : "Belajar"}`,
          alt: "Format: HH:MM:SS",
          placeHolder: "01:40:00 untuk 1 jam 40 menit",
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
          alt: "Jika Ada",
        },
      },
    ],
    [
      {
        form: "FileUploader",
        props: {
          name: "attachment",
          label: "Upload Lampiran",
          accept: ["image", "pdf", "word"],
          setData: setData,
          maxSize: 5,
          alt: "Jika Ada",
          isAttachmentLink: true,
          attachmentLinkProps: {
            name: "attachment_link",
          }
        },
      },
    ],
  ]

  return properties
}

export default MainForm
