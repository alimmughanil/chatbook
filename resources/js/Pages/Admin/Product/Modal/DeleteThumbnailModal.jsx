import WithModal from '@/Components/WithModal'
import { router, useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'

const DeleteThumbnailModal = (state) => {
  const { data: thumbnail, btnLabel = null, btnClassName = null } = state
  const MODAL_TYPE = `delete_thumbnail_${thumbnail?.id}`
  const backButtonRef = useRef()
  const { product } = usePage().props

  const { delete: destroy, processing } = useForm()

  const handleSubmit = (e) => {
    e.preventDefault()
    const routerConfig = {
      preserveState: false,
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    }

    if (thumbnail.type == 'image') {
      return destroy(`/admin/product/${product.id}/image/${thumbnail.id}`, routerConfig)
    }

    if (thumbnail.type == 'product') {
      return destroy(`/admin/product/${product.id}?type=thumbnail`, routerConfig)
    }

    return destroy(`/admin/product/${product.id}/detail/${thumbnail.id}?type=thumbnail`, routerConfig)
  }

  return (
    <WithModal btnLabel={btnLabel ?? <i className='text-lg text-red-600 fas fa-trash'></i>} btnClassName={btnClassName ?? 'btn btn-xs btn-ghost text-white'} type={MODAL_TYPE}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        <p>Apakah anda yakin ingin menghapus thumbnail ini?</p>
        <figure>
          <img src={thumbnail?.src} alt={thumbnail?.alt} className="rounded-lg w-80 max-h-[20rem] object-cover mx-auto" />
        </figure>
        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error bg-red-600 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Hapus</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default DeleteThumbnailModal
