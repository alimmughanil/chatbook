import WithModal from '@/Components/WithModal'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'
import TextArea from '@/Components/Form/TextArea'
import useFormChange from '@/utlis/useFormChange'

const CancelModal = (state) => {
  const { id, data = null, isLabel = true, content = null, handleClick } = state
  const MODAL_TYPE = `cancel_${id}`
  const { page } = usePage().props

  const backButtonRef = useRef()
  const { data: formData, setData, put, errors, processing } = useForm({
    cancel: '1',
    cancel_message: '',
  })

  function handleChange(e) {
    const { name, value } = useFormChange(e, formData)

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

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
        <h1 className='text-lg font-bold'>Konfirmasi Pembatalan</h1>
        {isLabel ? (
          <div className='mb-3 p-2 bg-orange-200 rounded-md flex'>
            <i className='fas fa-circle-exclamation mr-2 mt-1' />
            Saldo anggaran yang terpotong akan dikembalikan
          </div>
        ) : null}
        <div className="">
          {!!data && !!content && typeof content === 'function' && content(data)}
        </div>

        <div className="mt-2">
          <TextArea required={true} type='text' placeHolder="Tulis alasan pembatalan" name='cancel_message' isLabel={false} handleChange={handleChange} data={formData} errors={errors} />
        </div>

        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error bg-red-600 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}></span>
            <span>Batalkan {page.label}</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default CancelModal
