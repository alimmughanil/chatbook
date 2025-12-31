import Input from '@/Components/Form/Input'
import Select from '@/Components/Form/Select'
import RowLabel from '@/Components/RowLabel'
import { disbursementMethodListOpt } from '@/utils/constants'
import { currency } from '@/utils/format'
import { Link, router, useForm, usePage } from '@inertiajs/react'
import { useEffect } from 'react'
import InquiryModal from '../Modal/InquiryModal'
import { ModalButton } from '@/Components/WithModal'

function WithdrawForm({ withdraw = null }) {
  const { props } = usePage()

  const { data, setData, post, errors, processing } = useForm({
    user_id: '',
    inquiry: '',
    bank_id: props.bank?.id ?? '',
    method: '',
    gross_amount: '',
    net_amount: '',
    fee: '',
    attachment: '',
    status: '',
    fee_transfer: 0,
    fee_platform: parseInt(props.feePlatform ?? 0),
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
    return post(`/admin/withdraw`, {
      preserveScroll: true,
      only: ['inquiry','flash','errors'],
      onSuccess:({props})=>{
        if (props.inquiry) {
          setData((state)=>({...state, inquiry: props.inquiry}))
          window?.document?.getElementById('modal_inquiry')?.click()
        }
      }
    })
  }

  useEffect(() => {
    const grossAmount = data.gross_amount ?? 0
    const feeTotal = parseInt(data.fee_transfer ?? 0) + parseInt(props.feePlatform ?? 0)
    const netAmount = parseInt(grossAmount) - parseInt(feeTotal)

    setData(state => ({
      ...state,
      fee: feeTotal,
      fee_transfer: data.fee_transfer,
      net_amount: netAmount > 0 ? netAmount : 0,
    }))

    return () => { }
  }, [data.gross_amount, data.bank_id, data.fee_transfer])


  let bankIndex = null;
  if (props.banks.length > 0) {
    bankIndex = data.bank_id ? props.banks.findIndex((option) => option.value == data.bank_id) : null
  }

  let companyIndex = null;
  if (props.company.length > 0) {
    companyIndex = data.user_id ? props.company.findIndex((option) => option.value == data.user_id) : null
  }

  const inputProps = { data, errors, handleChange, setData}
  const modalProps = { data, post, processing }
  const adminRole = ['admin']
  const rowProps = { wrapperClassName: 'flex justify-between', valueClassName: "whitespace-pre" }

  const credit_total = props?.balance?.credit_total ?? 0

  const handleChangeCompany = (e) => {
    setData((state) => ({
      ...state,
      user_id: e?.value,
      bank_id: ''
    }))

    router.visit(`?user_id=${e?.value}`, {
      method: 'get',
      preserveState: true,
      preserveScroll: true,
    })
  }

  return (
    <>
      <form className='flex flex-col items-center justify-center w-full gap-4 p-4 border rounded-lg shadow-lg'>
        <p className='text-lg font-semibold'>{props.title}</p>
        <p>Saldo Tersedia: {currency(credit_total)}</p>
        <div className='flex flex-col w-full gap-4 md:flex-row z-50'>
          {adminRole.includes(props?.auth?.user?.role) ? (
            <Select
              isReactSelect={true}
              name='user_id'
              label='Pilih Pengguna'
              handleChange={handleChangeCompany}
              data={data}
              errors={errors}
              defaultValue={props.company[companyIndex]}
              options={props.company}
            />
          ) : null}
          <Select
            isReactSelect={true}
            name='bank_id'
            label='Pilih Bank'
            alt={<AddButton path="/admin/bank/create" />}
            handleChange={(e) => setData('bank_id', e?.value)}
            data={data}
            errors={errors}
            defaultValue={props.banks[bankIndex]}
            options={props.banks}
          />
        </div>
        <div className='flex flex-col w-full gap-4 md:flex-row'>
          <Input type='text' name='gross_amount' label='Nominal (Rp)' alt={`Maksimal: ${currency(credit_total)}`} {...inputProps} />
        </div>
        <div className='flex flex-col w-full gap-4 md:flex-row'>
          <PaymentMethod {...inputProps} />
        </div>
        <div className=" mt-4 w-full">
          <p className="text-purple-400 font-semibold">Konfirmasi Penarikan Dana</p>
          <div className="w-full overflow-auto border p-2 rounded-lg">
            <RowLabel label={'Biaya Transfer'} value={currency(data.fee_transfer)} {...rowProps} />
            <RowLabel label={'Biaya Platform'} value={currency(data.fee_platform)} {...rowProps} />
            <RowLabel label={'Nominal Yang Diterima'} value={currency(data.net_amount)} {...rowProps} valueClassName="text-purple-700 font-medium whitespace-pre" />
            {parseInt(data.net_amount) < 10000 || errors.net_amount ? (
              <p className='text-red-500 text-sm'>* Nominal yang diterima tidak boleh kurang dari Rp 10.000</p>
            ) : null}
          </div>
        </div>
        <div className='flex flex-col items-center gap-2 mt-4'>
          <button onClick={handleSubmit} className={`btn btn-primary btn-sm px-8`} disabled={processing || parseInt(data.gross_amount) > parseInt(credit_total ?? 0) || parseInt(data.net_amount) < 10000} >
            <span className={`${processing && 'loading'}`}>Buat Penarikan Dana</span>
          </button>
          <Link href={'/admin/withdraw'} className='underline mt-2'>
            Kembali
          </Link>
        </div>
      </form>
      <ModalButton id={`modal_inquiry`} className='hidden' />
      <InquiryModal {...modalProps} />
    </>
  )
}

const AddButton = ({ path }) => {
  return (
    <Link href={path} className='text-lg btn btn-xs btn-neutral btn-circle'>
      <i className='text-white fas fa-plus'></i>
    </Link>
  )
}

const PaymentMethod = (state) => {
  const {method, auth, feeTransfer} = usePage().props
  const { data, setData, errors } = state

  const handleChange = (channel) => {
    setData((state) => {
      const stateClone = structuredClone(state)
      stateClone.fee_transfer = channel.transfer_fee
      stateClone.method = channel.value
      stateClone.inquiry = ''
      return { ...state, ...stateClone }
    })
  }

  return (
    <div className="rounded-lg w-full">
      <p>Metode Transfer</p>
      {method.map((method, index) => {
        let channel = disbursementMethodListOpt.find((item) => item.value == method)
        if (method == 'MANUAL') {
          channel.transfer_fee = feeTransfer
        }

        return (
          <button
            key={index}
            type='button'
            onClick={() => handleChange(channel)}
            disabled={data.gross_amount < channel.min_transfer}
            className={`disabled:bg-gray-200 disabled:opacity-50 relative text-start w-full flex items-center p-2.5 px-4 mt-3 h-auto rounded-lg ${data.method == channel.value ? 'bg-opacity-10 bg-primary border-primary border-opacity-50 border shadow-md' : 'border border-primary border-opacity-30'}`}
          >
            {data.method == channel.value && <i className='fas fa-circle-check text-green-600 absolute top-4 right-4 fa-2x'></i>}
            <div>
              <p className="mb-1 font-semibold">{channel.label}</p>
              <p className="text-xs">Waktu Proses: {channel.description}</p>
              <p className="text-xs">Biaya layanan: {currency(channel.transfer_fee)}</p>
              <p className="text-xs">Nominal Transfer: {currency(channel.min_transfer)} - {currency(channel.max_transfer)}</p>
            </div>
          </button>
        )
      })}
      {errors.method && <p className='text-red-500 text-sm mt-2'>* Silahkan pilih salah satu metode transfer</p>}

      {auth?.user?.role == 'admin' ? (
        <p className='text-red-500 text-sm mt-2'>* Admin hanya dapat menggunakan Metode Transfer Manual untuk Penarikan Dana</p>
      ) :null}
    </div>
  )
}


export default WithdrawForm
