import WithModal from '@/Components/WithModal'
import { usePage } from '@inertiajs/react'
import { useRef } from 'react'

const DetailModal = (state) => {
  const { data: bank, handleClick } = state
  const MODAL_TYPE = `detail_${bank?.id}`
  const backButtonRef = useRef()
  const { isAdmin } = usePage().props

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <div className='text-left'>
        <h3 className='font-bold'>{bank.bank_name}</h3>

        {isAdmin ? (
          <div className=''>
            <p className='font-semibold text-lg'>Pengguna</p>
            <p>{bank?.user?.name}</p>
            <p>{bank?.user?.email}</p>
            <p>{bank?.user?.phone}</p>
          </div>
        ) : null}

        <div className=''>
          <p className='font-semibold text-lg'>Nomor Rekening</p>
          <p>{bank?.bank_account ?? '-'}</p>
        </div>
        <div className=''>
          <p className='font-semibold text-lg'>Nama Pemilik</p>
          <p>{bank?.bank_alias ?? '-'}</p>
        </div>

        {bank.status_message ? (
          <div className=''>
            <p className='font-semibold text-lg'>Alasan Penolakan</p>
            <p>{bank?.status_message ?? '-'}</p>
          </div>
        ) : null}

        {bank?.attachment ? (
          <div className=''>
            <p className='font-semibold text-lg'>Foto Buku Rekening</p>
            <img src={bank?.attachment} className='w-full rounded-lg object-cover' />
          </div>
        ) : null}
      </div>

      <div className='modal-action'>
        <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
          Kembali
        </label>
      </div>
    </WithModal>
  )
}

export default DetailModal
