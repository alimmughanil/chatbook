import WithModal from '@/Components/WithModal'
import { currency, whatsappNumber } from '@/utils/format'
import useStatus, { useStatusLabel } from '@/utils/useStatus'
import { Link, usePage } from '@inertiajs/react'
import { useEffect, useRef } from 'react'

const DetailModal = (state) => {
  const { data: order } = state
  const MODAL_TYPE = `detail_${order?.id}`
  const backButtonRef = useRef()
  const { sendStatus } = usePage().props
  let whatsappUrl = null

  const params = new URLSearchParams(location.search)
  useEffect(() => {
    if (params.get('order_id') && params.get('order_id') == order?.id) {
      setTimeout(() => {
        backButtonRef?.current?.click()
      }, 50);
    }
    return () => { }
  }, [])

  if (order?.user?.phone) {
    let whatsappText = `Halo ${order.user.name}, terima kasih telah memesan ${order?.product?.name} ${order?.product_detail ? `dengan Paket ${order?.product_detail?.name}` : ''}. `
    if (order.status == 'success') {
      whatsappText += `Kami akan segera memproses pesanan anda.`
    } else {
      whatsappText += `Agar pesanan dapat diproses, harap lanjutkan pembayaran sebesar ${currency(order.price_total)} pada Link Pembayaran berikut: ${order.payment.payment_link}`
    }
    whatsappText = new URLSearchParams(whatsappText)
    whatsappUrl = `https://wa.me/${whatsappNumber(order?.user?.phone)}?text=${whatsappText}`
  }

  return (
    <WithModal btnLabel={'Lihat'} btnClassName='btn btn-xs btn-primary text-white' type={MODAL_TYPE}>
      <div className='text-left'>
        <h3 className='font-bold'>Order #{order.order_number}</h3>
        {sendStatus && sendStatus.includes(order.order_number) ? (
          <div className='badge text-green-800 badge-outline gap-2 bg-green-100 pl-0 border-none whitespace-normal justify-start h-max leading-4'>
            <i className='fas fa-check-circle text-lg'></i>
            <p>{sendStatus}</p>
          </div>
        ) : null}
        {!order.product ? null : (
          <div className=''>
            <p className='font-semibold text-lg'>Produk</p>
            <p>
              <span className='capitalize whitespace-normal'>
                {order.product?.name} {" "}
              </span>
              <span className='whitespace-normal'>
                ({order?.item_total}x)
              </span>
            </p>
          </div>
        )}

        <div className=''>
          <p className='font-semibold text-lg'>Catatan</p>
          <p>{order?.note ?? '-'}</p>
        </div>

        <div className=''>
          <p className='font-semibold text-lg'>Total Harga</p>
          <p>{currency(order.price_total)}</p>
        </div>

        {!order.status_message ? null : (
          <div className=''>
            <p className='font-semibold text-lg'>Catatan Pembatalan</p>
            <div>{order.status_message}</div>
          </div>
        )}
        {!order.payment ? null : (
          <div className=''>
            <p className='font-semibold text-lg'>Status Pembayaran</p>
            <div className={`capitalize badge ${useStatus(order.payment?.status)}`}>{useStatusLabel('payment.' + order.payment?.status)}</div>
          </div>
        )}
        {!order.payment.payment_link ? null : (
          <div className=''>
            <p className='font-semibold text-lg'>Halaman Pembayaran</p>
            <div className="flex flex-wrap w-full gap-2">
              <a href={order.payment.payment_link} target='_black' className='btn btn-sm btn-primary'>
                <i className='fas fa-arrow-up-right-from-square'></i>
                <span>Buka</span>
              </a>
              {whatsappUrl ? (
                <a href={whatsappUrl} target='_black' className='btn btn-sm btn-success text-white bg-green-800'>
                  <i className='fab fa-whatsapp'></i>
                  <span>Kirim</span>
                </a>
              ) : null}
              <Link href={`/admin/order/${order.order_number}/invoice?order_id=${order.id}`} className='btn btn-sm btn-neutral btn-outline'>
                <i className='fas fa-envelope'></i>
                <span>Kirim Invoice</span>
              </Link>
            </div>
          </div>
        )}
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