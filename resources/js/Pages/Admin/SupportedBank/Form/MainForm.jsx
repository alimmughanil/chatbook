import Checkbox from '@/Components/Form/Checkbox'
import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import { useStatusLabel } from '@/utils/useStatus'
import { useForm, usePage } from '@inertiajs/react'

function MainForm({ data:supportedBank = null }) {
  const { props } = usePage()

  const { data, setData, post, errors, processing } = useForm({
    bank_code: supportedBank?.bank_code ?? '',
    bank_name: supportedBank?.bank_name ?? '',
    limit_transfer_amount: supportedBank?.limit_transfer_amount ?? '',
    bi_fast: supportedBank?.bi_fast ?? 0,
    status: supportedBank?.status ?? '',
  })
  

  function handleChange(e) {
    let { name, value, files, type, checked } = e.target

    if (type == 'file') {
      value = files[0]
    }
    if (type == 'checkbox') {
      value = checked ? 1 : 0
    }

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (supportedBank) {
      data['_method'] = 'put'
      return post(`/admin/supported-bank/${supportedBank.id}`)
    }
    return post(`/admin/supported-bank`)
  }

  const inputProps = { data, errors, handleChange }

  return (
    <form className='flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg'>
      <p className='text-lg font-semibold'>{props.title}</p>
      <div className='flex flex-col w-full gap-4 md:flex-row z-50'>
        <Input type='text' name='bank_code' label='Kode Bank' {...inputProps} />
        <Input type='text' name='bank_name' label='Nama Bank' {...inputProps} />
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Input type='text' name='limit_transfer_amount' label='Limit Jumlah Transfer' alt="Opsional" {...inputProps} />
        <Select name='status' label='Status' {...inputProps} defaultValue={data.status}>
          <option value=''>Pilih salah satu</option>
          {props.status.length == 0 ? null : props.status.map((status, index) => (
            <option key={index} value={status} className='capitalize'>
              {useStatusLabel(status)}
            </option>
          ))}
        </Select>
      </div>
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Checkbox name="bi_fast" label="Mendukung BI Fast" {...inputProps} />
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        <button type='button' onClick={() => history.back()} className='btn btn-primary btn-outline btn-sm'>
          Batal
        </button>
        <button onClick={handleSubmit} className={`btn btn-primary btn-sm `} disabled={processing} >
          <span className={`${processing && 'loading'}`}>Submit</span>
        </button>
      </div>
    </form>
  )
}


export default MainForm
