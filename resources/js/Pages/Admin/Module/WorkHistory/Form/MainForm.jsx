import useFormBuilder from "@/utils/useFormBuilder"
import FormBuilder from "@/Components/FormBuilder"
import { useSearchParams } from "@/utils/format"

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
  const { setData } = state

  const properties = [
    [
      {
        form: 'textarea',
        props: {
          name: 'message',
          label: 'Pesan kepada client',
        }
      }
    ],
    [
      {
        form: "FileUploader",
        props: {
          name: 'attachment',
          label: 'Upload Lampiran',
          accept: ["zip", "pdf", "word"],
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
