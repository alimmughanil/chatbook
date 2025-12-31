import WithModal from '@/Components/WithModal'
import { currency, dateTime } from '@/utils/format'
import useLang from '@/utils/useLang'
import { Link, usePage } from '@inertiajs/react'
import { useRef } from 'react'

const WalletModal = (state) => {
  const { wallet } = usePage().props
  const MODAL_TYPE = `wallet`
  const backButtonRef = useRef()

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} modalBoxSize="max-w-2xl">
      <form action=''>
        <h1 className='text-lg font-bold'>Riwayat Transaksi</h1>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Tanggal</th>
              <th>Tipe</th>
              <th>Nominal</th>
              <th>Referensi</th>
            </tr>
          </thead>
          <tbody>
            {wallet.length > 0 ? wallet.map((wallet, index) => {
              const type = !!wallet.order_id ? 'credit' : 'debit'
              const amount = type === 'credit' ? wallet.credit : wallet.debit

              return (
                <tr key={index} className="">
                  <td>{index + 1}</td>
                  <td>{dateTime(wallet.created_at)}</td>
                  <td>{useLang(type)}</td>
                  <td>{currency(amount)}</td>
                  <td>
                    <Link href={`/admin/${type == 'credit' ? `order?q=${wallet.order?.order_number}&searchBy=order_number` : `withdraw?q=${wallet.withdraw?.transaction_number}&searchBy=transaction_number`}`} className='btn btn-xs btn-primary'>Lihat</Link>
                  </td>
                </tr>
              )
            }) : (
                <td colSpan={12}>Belum ada transaksi yang dapat ditampilkan</td>
            )}

          </tbody>
        </table>

        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
        </div>
      </form>
    </WithModal>
  )
}

export default WalletModal
