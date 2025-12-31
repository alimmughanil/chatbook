import WithModal from '@/Components/WithModal'
import { currency } from '@/utils/format'
import { useRef } from 'react'

const InquiryModal = (state) => {
  const { post, processing, data } = state 
  const disburse = data?.inquiry ?? null
     
  const MODAL_TYPE = `inquiry`
  const backButtonRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/withdraw`, {
      onSuccess: () => {
        backButtonRef.current?.click();
      },
    });
  };

  return (
    <WithModal type={MODAL_TYPE} modalBoxSize="w-full max-w-2xl">
      <p className='font-semibold mb-3 text-lg sm:text-xl'>Konfirmasi Penarikan Dana</p>
      <div className='mb-3 p-2 bg-orange-200 rounded-md flex'>
        <i className='fas fa-circle-exclamation mr-2 mt-1' />
        Perhatian, pastikan nomor rekening dan nama pemilik rekening sudah benar
      </div>
      <p className='text-lg font-bold text-primary'>{disburse?.bank_name}</p>
      <p className='text-lg'>Nomor Rekening: <span className='font-semibold text-lg'>{disburse?.account_number}</span></p>
      <p className='text-lg'>Nama Pemilik: <span className='font-semibold text-lg'>{disburse?.account_name}</span></p>

      <p className='text-lg mt-4'>Nominal Yang Diterima: <span className='text-lg font-semibold text-primary'>{currency(data?.net_amount)}</span></p>

      <div className='modal-action'>
        <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
          Kembali
        </label>
        <button onClick={handleSubmit} className={`btn btn-sm btn-primary `} disabled={processing || !disburse} >
          <span className={`${processing && 'loading'}`}>Konfirmasi</span>
        </button>
      </div>
    </WithModal>
  )
}

export default InquiryModal