import Input from '@/Components/Form/Input'
import TextArea from '@/Components/Form/TextArea'
import BaseForm from '@/Components/Form/BaseForm'
import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'
import { FileUploader } from "react-drag-drop-files";

const FinishModal = (state) => {
  const { data: order, handleClick } = state
  const MODAL_TYPE = `finish_${order?.id}`
  const backButtonRef = useRef()
  const { data, setData, post, errors, processing } = useForm({
    _method: 'put',
    work_id: order?.work_id ?? null,
    message: '',
    attachment_link: '',
    attachment_files: '',
  })

  function handleChange(e) {
    const { name, value } = e.target

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  function handleSetFiles(files) {
    setData((state) => ({
      ...state,
      ['attachment_files']: [...state.attachment_files, ...files]
    }))
  }

  function handleRemoveFile(file) {
    const files = data.attachment_files.filter((state) => state != file)
    setData((state) => ({
      ...state,
      ['attachment_files']: files
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post(`/admin/order/${order.id}?submit=true`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  const inputProps = { handleChange, data, errors }
  const fileTypes = ["PDF", "ZIP", "RAR"];

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <p className='font-semibold text-lg'>Selesaikan Pekerjaan</p>
        <TextArea name='message' label='pesan kepada client' {...inputProps} />
        <div className="grid gap-2">
          <p className='label-text mt-4'>Lampiran</p>
          <Input type='text' name='attachment_link' placeHolder="URL" isLabel={false} {...inputProps} />
          <BaseForm name="attachment_files" errors={errors} isLabel={false}>
            <FileUploader handleChange={handleSetFiles} name="attachment_files" types={fileTypes} multiple={true} maxSize={1} />
          </BaseForm>

          <div className="grid gap-2 w-full text-gray-700">
            {data.attachment_files?.length > 0 ? data.attachment_files.map((file) => (
              <div className="border px-2 rounded-lg flex gap-2 w-full py-1">
                <button onClick={() => handleRemoveFile(file)} type="button" className="btn btn-xs btn-neutral btn-circle">
                  <i className="fas fa-x"></i>
                </button>
                <p>{file.name}</p>
              </div>
            )) : null}
          </div>
        </div>

        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-neutral `} disabled={processing} >
            <span className={`${processing && 'loading'}`}>Submit</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default FinishModal