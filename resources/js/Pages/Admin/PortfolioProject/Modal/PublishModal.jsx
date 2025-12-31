import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'

const PublishModal = (state) => {
  const { data: portfolio, handleClick } = state
  const MODAL_TYPE = `publish_${portfolio?.id}`
  const backButtonRef = useRef()
  const { put, processing } = useForm({
		update_status: true,
		status: 'publish'
	})

  const handleSubmit = (e) => {
    e.preventDefault()
    put(`/admin/portfolio/project/${portfolio.id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        <p>Apakah anda yakin ingin mempublikasikan portofolio ini?</p>
        <p className="text-center font-semibold text-xl">{portfolio?.name}</p>
        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm bg-green-700 hover:bg-green-800 text-white`} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Publish</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default PublishModal
