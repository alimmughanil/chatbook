import WithModal from '@/Components/WithModal'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'
import TextArea from '@/Components/Form/TextArea'
import useFormChange from '@/utils/useFormChange'

const RejectedModal = (state) => {
  const { id, data = null, isLabel = true, content = null, handleClick } = state
  const MODAL_TYPE = `rejected_${id}`
  const { page } = usePage().props

  const backButtonRef = useRef()
  const { data: formData, setData, put, errors, processing } = useForm({
    rejected: '1',
    rejected_message: '',
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
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        {isLabel ? (
          <p>Apakah anda yakin ingin tolak {page.label} ini?</p>
        ) : null}
        <div className="">
          {!!data && !!content && typeof content === 'function' && content(data)}
        </div>

        <div className="mt-2">
          <TextArea required={true} type='text' placeHolder="Tulis alasan penolakan" name='rejected_message' isLabel={false} handleChange={handleChange} data={formData} errors={errors} />
        </div>

        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error bg-red-600 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}></span>
            <span>Tolak {page.label}</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default RejectedModal
