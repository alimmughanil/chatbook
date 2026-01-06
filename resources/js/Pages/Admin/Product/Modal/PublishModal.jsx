import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'

const PublishModal = (state) => {
  const { data: product, btnLabel = null, btnClassName = null, status, handleClick } = state
  const MODAL_TYPE = `publish_${product?.id}`
  const backButtonRef = useRef()
  const { put, processing } = useForm({ update_status: status })

  const handleSubmit = (e) => {
    e.preventDefault()
    put(`/admin/product/${product.id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        <p>Apakah anda yakin ingin mempublikasi produk ini?</p>
        <p className='text-xl font-semibold text-center'>{product?.name}</p>
        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-success`} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Publish</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default PublishModal
