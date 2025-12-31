import WithModal from '@/Components/WithModal'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'

const AnswerDeleteModal = (state) => {
  const { id, data = null, content = null, label, isForceDelete = true, handleClick } = state
  const MODAL_TYPE = `answer_delete_${id}`
  const { page, question } = usePage().props

  const backButtonRef = useRef()
  const { delete: destroy, processing } = useForm()

  const handleSubmit = (e) => {
    e.preventDefault()
    destroy(`${page.url}/${question?.id}/answers/${id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        {isForceDelete ? (
          <div className='mb-3 p-2 bg-orange-200 rounded-md flex'>
            <p>Perhatian! Data akan dihapus permanen</p>
          </div>
        ) : null}
        <p>Apakah anda yakin ingin menghapus Pertanyaan Kuis ini?</p>
        <p className='text-xl font-semibold text-center'>{label}</p>

        <div className="">
          {!!data && !!content && typeof content === 'function' && content(data)}
        </div>
        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error bg-red-600 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}></span>
            <span>Hapus</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default AnswerDeleteModal
