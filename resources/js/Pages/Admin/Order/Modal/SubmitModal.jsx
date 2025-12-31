import WithModal from '@/Components/WithModal'
import { useRef } from 'react'
import MainForm from '@/Pages/Admin/Module/WorkHistory/Form/MainForm'

const SubmitModal = (state) => {
  const { id = 'create', data = null, handleClick } = state
  const MODAL_TYPE = `submit_${data?.id}`

  const backButtonRef = useRef()
  let defaultData = {
    _method: 'put',
    work_id: data?.work_id ?? null,
    message: data?.message ?? '',
    attachment: data?.attachment ?? [],
    attachment_link: data?.attachment_link ?? [],
  }

  if (data) {
    defaultData = { ...defaultData, ...data }
  }

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const { post } = form
    let targetUrl = `/admin/order/${data?.id}?submit=true`

    post(targetUrl, {
      onSuccess: () => {
        backButtonRef.current?.click()

      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-6xl" boxClassName='modal-box scrollbar-thin overflow-auto'>
      <p className='font-semibold text-lg mb-4'>
        {data?.work_status == 'work.revision.request' ? 'Submit Revisi' : 'Submit Pekerjaan'}
      </p>

      <MainForm isEdit={id == "create"} initialData={defaultData} isLabel={false} onSubmit={handleSubmit} BackButton={() => (
        <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
          Batal
        </label>
      )} />
    </WithModal>
  )
}

export default SubmitModal
