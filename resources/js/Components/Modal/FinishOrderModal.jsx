import TextArea from '@/Components/Form/TextArea'
import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'

const FinishOrderModal = (state) => {
  const { data: order, handleClick } = state
  const MODAL_TYPE = `finish_order_${order?.id}`
  const backButtonRef = useRef()

  const { data, setData, put, processing, errors } = useForm({
    message: '',
    type: 'response',
    status: 'finish',
    order_number: order?.order_number
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
    put(`/app/order/${order?.order_number}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  const inputProps = { handleChange, data, errors, setData }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-2">Konfirmasi Selesai Pekerjaan</h2>
        <p className="mb-4 text-sm text-gray-600">
          Apakah anda yakin untuk menyelesaikan pekerjaan ini? Pastikan tidak ada lagi proses yang tertunda karena pembayaran akan diteruskan kepada pekerja.
        </p>

        <TextArea
          name='message'
          placeHolder='Pesan atau informasi kepada pekerja (Opsional)'
          isLabel={false}
          {...inputProps}
        />

        <div className='modal-action'>
          <label
            ref={backButtonRef}
            htmlFor={`modal_${MODAL_TYPE}`}
            className='btn btn-sm btn-neutral btn-outline'
          >
            Batal
          </label>
          <button type="submit" className={`btn btn-sm btn-primary text-white`} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Selesaikan Pekerjaan</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default FinishOrderModal