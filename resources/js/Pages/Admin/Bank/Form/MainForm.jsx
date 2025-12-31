import Checkbox from '@/Components/Form/Checkbox'
import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import { currency } from '@/utils/format'
import { useStatusLabel } from '@/utils/useStatus'
import { useForm, usePage } from '@inertiajs/react'

function MainForm({ data:bank = null }) {
  const { props } = usePage()

  const { data, setData, post, errors, processing } = useForm({
    user_id: bank?.user_id ?? '',
    supported_bank_id: bank?.supported_bank_id ?? '',
    bank_name: bank?.bank_name ?? '',
    other_bank: bank?.other_bank ?? '',
    bank_account: bank?.bank_account ?? '',
    bank_alias: bank?.bank_alias ?? '',
    attachment: bank?.attachment ?? '',
    is_primary: bank?.is_primary ?? 0,
    status: bank?.status ?? '',
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
    if (bank) {
      data['_method'] = 'put'
      return post(`/admin/bank/${bank.id}`)
    }
    return post(`/admin/bank`)
  }

  let partnerIndex = null;
  if (props.partner.length > 0) {
    partnerIndex = data.user_id ? props.partner.findIndex((option) => option.value == data.user_id) : null
  }
  let supportedBankIndex = null;
  if (props.supportedBank.length > 0) {
    supportedBankIndex = data.supported_bank_id ? props.supportedBank.findIndex((option) => option.value == data.supported_bank_id) : null
  }

  const inputProps = { data, errors, handleChange }

  return (
    <form className='flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg'>
      <p className='text-lg font-semibold'>{props.title}</p>
      <div className='flex flex-col w-full gap-4 md:flex-row z-50'>
        {props.isAdmin ? (
          <Select
            isReactSelect={true}
            name='user_id'
            label='Pilih Pengguna'
            handleChange={(e) => setData('user_id', e?.value)}
            data={data}
            errors={errors}
            defaultValue={props.partner[partnerIndex]}
            options={props.partner}
          />
        ) : null}

          <Select
            isReactSelect={true}
            name='supported_bank_id'
            label='Pilih Bank'
            handleChange={(e) => setData('supported_bank_id', e?.value)}
            data={data}
            errors={errors}
            defaultValue={props.supportedBank[supportedBankIndex]}
            options={props.supportedBank}
          />
      </div>

      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Input type='text' name='bank_account' label='Nomor Rekening' {...inputProps} />
        <Input type='text' name='bank_alias' label='Nama Pemilik Rekening' {...inputProps} />
      </div>

      {/* <div className='flex flex-col w-full'>
        <Input type='file' name='attachment' label='Foto Buku Rekening' {...inputProps} />
        <p className='mt-2'>Pastikan Foto Buku Rekening tercantum data <span className='font-semibold'>nomor dan nama pemilik rekening</span></p>
      </div> */}

      {props.isAdmin ? (
        <div className='flex flex-col w-full gap-4 md:flex-row'>
          <Select name='status' label='Status' {...inputProps} defaultValue={data.status}>
            <option value=''>Pilih salah satu</option>
            {props.status.length == 0 ? null : props.status.map((status, index) => (
              <option key={index} value={status} className='capitalize'>
                {useStatusLabel(`bank.${status}`)}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
      <div className='flex flex-col w-full gap-4 md:flex-row'>
        <Checkbox name="is_primary" label="Jadikan Rekening Bank Utama" {...inputProps} />
      </div>

      <div className='flex justify-center gap-2 mt-4'>
        <button type='button' onClick={() => history.back()} className='btn btn-primary btn-outline btn-sm'>
          Batal
        </button>
        <button onClick={handleSubmit} className={`btn btn-primary btn-sm `} disabled={processing} >
          <span className={`${processing && 'loading'}`}>Kirim</span>
        </button>
      </div>
    </form>
  )
}


export default MainForm
