import WithModal from '@/Components/WithModal'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'

const RestoreModal = (state) => {
  const { id, label, handleClick } = state
  const MODAL_TYPE = `restore_${id}`
  const { page } = usePage().props

  const backButtonRef = useRef()
  const { put, processing } = useForm({
    restore_data: '1'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    put(`${page.url}/${id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        <p>Apakah anda yakin ingin memulihkan data {page.label} ini?</p>
        <p className='text-xl font-semibold text-center'>{label}</p>
        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-primary text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}></span>
            <span>Pulihkan</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default RestoreModal
