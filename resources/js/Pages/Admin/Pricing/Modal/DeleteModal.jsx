import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'

const DeleteModal = (state) => {
  const { data: pricing, btnLabel = null, btnClassName = null } = state
  const MODAL_TYPE = `delete_${pricing?.id}`
  const backButtonRef = useRef()
  const { delete: destroy, processing } = useForm()

  const handleSubmit = (e) => {
    e.preventDefault()
    destroy(`/admin/pricing/${pricing.id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  return (
    <WithModal btnLabel={btnLabel ?? <i className='text-lg text-red-600 fas fa-trash'></i>} btnClassName={btnClassName ?? 'btn btn-xs btn-ghost text-white'} type={MODAL_TYPE}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        <p>Apakah anda yakin ingin menghapus komponen pricing ini?</p>
        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error bg-red-600 text-white `} disabled={processing} >
            <span className={`${processing && 'loading'}`}>Hapus</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default DeleteModal
