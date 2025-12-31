import WithModal from '@/Components/WithModal'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'

const ApprovedModal = (state) => {
  const { id, data = null, isLabel = true, content = null, handleClick } = state
  const MODAL_TYPE = `approved_${id}`
  const { page } = usePage().props

  const backButtonRef = useRef()
  const { put, processing } = useForm({
    approved: '1'
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
        {isLabel ? (
          <p>Apakah anda yakin ingin setujui {page.label} ini?</p>
        ) : null}
        <div className="">
          {!!data && !!content && typeof content === 'function' && content(data)}
        </div>
        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-success bg-green-600 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}></span>
            <span>Setujui {page.label}</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default ApprovedModal
