import WithModal from '@/Components/WithModal'
import useFormBuilder from '@/utlis/useFormBuilder'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'
import { FormProperty } from '../FormBuilder'

const PaidModal = (state) => {
  const { id, data = {}, formType = '', isLabel = true, content = null, handleClick } = state
  const MODAL_TYPE = `paid_${id}`
  const { page } = usePage().props

  const backButtonRef = useRef()

  let getProperties = () => { }
  if (formType === 'payment') {
    getProperties = (props) => getPaymentProperties(props)
  }

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const { put } = form

    put(`${page.url}/${id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  const initialData = {
    ...data,
    paid: '1',
    _method: 'put',
  }

  const formConfig = { isEdit: true, getProperties, onSubmit: handleSubmit, initialData }
  const builderProps = useFormBuilder(formConfig)

  const { processing } = builderProps.form
  const { properties, inputProps } = builderProps

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        {isLabel ? (
          <p>Apakah anda yakin ingin selesaikan {page.label} ini?</p>
        ) : null}
        <div className="">
          {!!data && !!content && typeof content === 'function' && content(data)}
        </div>

        {properties?.length > 0 ? (
          <FormProperty properties={properties} inputProps={inputProps} />
        ) : null}

        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={builderProps.handleSubmit} className={`btn btn-sm btn-success bg-green-600 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}></span>
            <span>Selesaikan {page.label}</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

const getPaymentProperties = (state) => {
  const { setData, props } = state

  const properties = [
    [
      {
        form: 'input',
        props: {
          name: 'payment_date',
          label: 'Tanggal Pembayaran',
          type: 'date',
        }
      },
    ],
    [
      {
        form: 'textarea',
        props: {
          name: 'description',
          label: 'Keterangan',
        }
      },
    ]
  ]

  return properties
}

export default PaidModal
