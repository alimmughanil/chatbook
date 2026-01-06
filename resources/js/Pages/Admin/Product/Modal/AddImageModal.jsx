import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import WithModal from '@/Components/WithModal'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'

const AddImageModal = (state) => {
  const { data: product, btnLabel = null, btnClassName = null } = state
  const MODAL_TYPE = `add_image_${product?.id}`
  const backButtonRef = useRef()
  const { props } = usePage()
  const { data, setData, post, errors, processing, setError } = useForm({
    product_id: product?.id ?? '',
    type: 'file',
    link: '',
    file: ''
  })

  function handleChange(e) {
    const { name, value, files } = e.target
    const fileNames = ['file']
    let filteredValue = fileNames.includes(name) ? files[0] : value

    setData((state) => ({
      ...state,
      [name]: filteredValue
    }))

    if (name == 'link' && data.type == 'youtube' && !value.startsWith('https://www.youtube.com/watch?v=')) {
      setError('link', 'Kolom ini harus diawali dengan https://www.youtube.com/watch?v=')
    } else if (name == 'link' && data.type == 'link' && !value.startsWith('https://')) {
      setError('link', 'Kolom ini harus diawali dengan https://')
    } else {
      setError('link', null)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (errors?.link) return;
    const routerConfig = {
      preserveState: true,
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    }
    return post(`/admin/product/${product?.id}/image`, routerConfig)
  }

  const inputProps = { handleChange, data, errors }


  return (
    <WithModal btnLabel={btnLabel ?? <i className='text-lg text-blue-600 fas fa-plus'></i>} btnClassName={btnClassName ?? 'btn btn-xs btn-ghost text-white'} type={MODAL_TYPE}>
      <form action=''>
        <h1 className='text-lg font-bold'>Tambah Aset Demo</h1>
        <Select name='type' label='Tipe' defaultValue={data.type} {...inputProps}>
          {props.image_type.length == 0 ? null : props.image_type.map((image_type, index) => (
            <option key={index} value={image_type} className='capitalize'>
              {image_type}
            </option>
          ))}
        </Select>

        {data.type == 'youtube' ? null : (
          <Input type='file' name='file' label='Upload Gambar' {...inputProps} />
        )}

        {data.type == 'file' ? null : (
          <Input type='text' name='link' label='Tambahkan Link' placeHolder={data.type == 'youtube' ? 'Ex: https://www.youtube.com/watch?v=13ARO0HDZsQ' : ''} {...inputProps} />
        )}

        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-primary text-white `} disabled={processing} >
            <span className={`${processing && 'loading'}`}>Submit</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default AddImageModal
