import WithModal from '@/Components/WithModal'
import { currency } from '@/utils/format'
import useStatus, { useStatusLabel } from '@/utils/useStatus'
import { usePage } from '@inertiajs/react'
import { useRef } from 'react'

const DetailModal = (state) => {
  const { data: withdraw, handleClick } = state
  const MODAL_TYPE = `detail_${withdraw?.id}`
  const backButtonRef = useRef()
  const { isAdmin } = usePage().props

  let detail = null
  if (withdraw.detail) {
    try {
      detail = JSON.parse(withdraw.detail)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} boxClassName="modal-box max-w-2xl">
      <div className='text-left'>
        <h3 className='font-bold'>Nomor Transaksi #{withdraw.transaction_number}</h3>

        {isAdmin ? (
          <div className=''>
            <p className='font-semibold text-lg'>Pengguna</p>
            <p>{withdraw?.user?.name}</p>
            <p>{withdraw?.user?.email}</p>
            <p>{withdraw?.user?.phone}</p>
          </div>
        ) : null}

        <div className=''>
          <p className='font-semibold text-lg'>Penerima</p>
          <p>{withdraw.bank?.bank_name}</p>
          <p>{withdraw.bank?.bank_account} a.n. {withdraw.bank?.bank_alias}</p>
        </div>

        <div className=''>
          <p className='font-semibold text-lg'>Nominal Penarikan Dana</p>
          <p>{currency(withdraw?.gross_amount)}</p>
        </div>

        <div className=''>
          <p className='font-semibold text-lg'>Total Biaya Potongan</p>
          <p className='font-semibold text-purple-700'>{currency(withdraw?.fee)}</p>
          {detail ? (
            <ul className='list-disc ml-8'>
              <li>Biaya Transfer Bank: {currency(detail?.fee_transfer)}</li>
              <li>Biaya Platform: {currency(detail?.fee_platform)}</li>
            </ul>
          ) : null}
        </div>

        <div className=''>
          <p className='font-semibold text-lg'>Nominal Yang diterima</p>
          <p className='text-purple-700 font-semibold'>{currency(withdraw?.net_amount)}</p>
        </div>

        <div className=''>
          <p className='font-semibold text-lg'>Status Penarikan Dana</p>
          <div className={`capitalize badge ${useStatus(withdraw?.status)}`}>{useStatusLabel('withdraw.' + withdraw?.status)}</div>
        </div>

        {withdraw.status_message ? (
          <div className=''>
            <p className='font-semibold text-lg'>Alasan Pembatalan</p>
            <p>{withdraw?.status_message ?? '-'}</p>
          </div>
        ) : null}

        {withdraw.status == 'success' ? (
          <div className=''>
            <p className='font-semibold text-lg'>Bukti Pembayayaran</p>

            {withdraw?.attachment ? (
              <img src={withdraw?.attachment} className='w-full rounded-lg object-cover' />
            ) : <p>'-'</p>}
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