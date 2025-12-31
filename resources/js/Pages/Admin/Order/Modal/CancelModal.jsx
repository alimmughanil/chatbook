import TextArea from '@/Components/Form/TextArea'
import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'

const CancelModal = (state) => {
  const { data: order, handleClick } = state
  const MODAL_TYPE = `cancel_${order?.id}`
  const backButtonRef = useRef()
  const { data, setData, post, errors, processing } = useForm({
    _method: 'put',
    cancel_message: ''
  })

  function handleChange(e) {
    const { name, value } = e.target

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    post(`/admin/order/${order?.id}?cancel=true`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <p className='font-semibold mb-3'>Konfirmasi Pembatalan</p>
      <div className='mb-3 p-2 bg-orange-200 rounded-md flex'>
        <i className='fas fa-circle-exclamation mr-2 mt-1' />
        Perhatian, biaya jasa akan dikembalikan penuh 100% kepada client
      </div>
      <form action=''>
        <TextArea required={true} type='text' placeHolder="Tulis alasan pembatalan kepada Client" name='cancel_message' noLabel handleChange={handleChange} data={data} errors={errors} />

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

export default CancelModal