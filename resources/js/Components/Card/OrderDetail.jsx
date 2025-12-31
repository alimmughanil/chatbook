import { currency, date, dateTime, whatsappNumber } from '@/utils/format'
import RowLabel from '../RowLabel'
import { usePage } from '@inertiajs/react'
import useStatus, { useStatusLabel } from '@/utils/useStatus';
import { CheckCircle, FileWarning } from 'lucide-react';
import FinishOrderModal from '@/Components/Modal/FinishOrderModal';
import RevisionOrderModal from '@/Components/Modal/RevisionOrderModal';
import { ModalButton } from '@/Components/WithModal';

const SectionHeader = ({ icon, title, action }) => (
  <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
    <div className="flex items-center gap-2 text-purple-700">
      <i className={`${icon} text-lg`}></i>
      <h3 className="font-bold text-gray-800">{title}</h3>
    </div>
    {action}
  </div>
);

export const UserData = ({ order, type = 'participant' }) => {
  const rowProps = { wrapperClassName: 'flex flex-wrap justify-between text-sm py-1 border-b border-gray-50 last:border-0', valueClassName: "font-medium text-gray-700 text-right" }
  const user = type == 'participant' ? order?.participant : order?.user
  if (!user) return <></>

  return (
    <div>
      <SectionHeader
        icon="fas fa-user-circle"
        title={type == 'participant' ? 'Data Peserta' : 'Data Pemesan'}
      />

      <div className="space-y-2">
        <RowLabel label={'Nama'} value={user?.name} {...rowProps} />
        {user?.participant_number && <RowLabel label={'No. Peserta'} value={user?.participant_number} {...rowProps} />}
        {user?.phone && <RowLabel label={'No. HP'} value={user?.phone} {...rowProps} />}
        {user?.email && <RowLabel label={'Email'} value={user?.email} {...rowProps} />}
        {user?.institute && <RowLabel label={'Instansi'} value={user?.institute} {...rowProps} />}
        {user?.branch && <RowLabel label={'Cabang'} value={user?.branch} {...rowProps} />}
      </div>

      {user?.qr_code && (
        <div className='mt-6 bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-300'>
          <p className="text-xs text-gray-500 mb-2">Tunjukan QR Code ini saat registrasi</p>
          <img src={user.qr_code} alt="QR Code" className='w-32 mx-auto mix-blend-multiply' />
        </div>
      )}

      {order.payment?.status == 'success' && type == 'participant' && (
        <a target="_blank" href={`/app/order/${order.order_number}?type=participant-card`} className="btn btn-sm btn-outline btn-primary w-full mt-4 gap-2">
          <i className="fas fa-download"></i>
          <span>Download Kartu Peserta</span>
        </a>
      )}
    </div>
  )
}

export const OrderData = ({ order }) => {
  const { detail } = order
  let product = order.product

  // Fallback jika data produk relasi tidak ada, ambil dari JSON detail snapshot
  if (!order.product_id) {
    try { product = JSON.parse(detail) } catch (error) { console.log(error); }
  }

  const packageName = order?.product_detail?.name || (product?.product_detail?.name ?? '-')

  // Style standar untuk baris (mirip UserData)
  const rowProps = {
    wrapperClassName: 'flex flex-wrap justify-between text-sm border-b border-gray-50 py-1 last:border-0',
    valueClassName: "font-medium text-gray-700 text-right"
  }

  return (
    <div>
      <SectionHeader
        icon="fas fa-file-invoice"
        title="Rincian Transaksi"
      />

      <div className="space-y-0">
        <RowLabel
          label="Nomor Transaksi"
          value={`#${order?.order_number}`}
          {...rowProps}
        />

        <RowLabel
          label="Tanggal"
          value={dateTime(order?.payment?.created_at || order?.created_at)}
          {...rowProps}
        />

        {/* Khusus Nama Produk menggunakan Link sebagai value */}
        <RowLabel
          label="Nama Produk"
          {...rowProps}
          value={
            <a href={`/service/${product?.slug}`} className="hover:text-purple-700 hover:underline">
              {product?.name || '-'}
            </a>
          }
        />

        <RowLabel
          label="Paket"
          value={packageName}
          {...rowProps}
        />

        {/* Khusus Harga, override warna text menjadi ungu */}
        <RowLabel
          label="Harga"
          value={currency(order?.price_total)}
          wrapperClassName={rowProps.wrapperClassName}
          valueClassName="font-bold text-purple-700 text-right"
        />

      </div>
      <div className="border-t border-dashed border-gray-300 mt-2 pt-2">
        <RowLabel
          label="Catatan"
          value={order?.note || '-'}
          valueClassName="text-gray-800"
          wrapperClassName={!!order.note ? "flex flex-col justify-between text-sm border-b border-gray-50 last:border-0" : rowProps.wrapperClassName}
        />
      </div>
    </div>
  )
}

export const ProcessData = ({ order, component = 'WorkHistoryData', isSeller = true, isCtaButton = true }) => {
  const { appName } = usePage().props
  const seller = order?.product?.assigned_user
  let message = `Hai ${seller?.name}, saya ingin bertanya terkait nomor pesanan ${order.order_number} di ${appName}`
  const phoneNumber = whatsappNumber(seller?.phone ?? null)
  const whatsAppUrl = phoneNumber ? `https://wa.me/${phoneNumber}?text=${new URLSearchParams(message)}`.slice(0, - 1) : null

  const componentMap = {
    'WorkHistoryData': WorkHistoryData,
    'LastWork': LastWork,
  }

  const headerMap = {
    'WorkHistoryData': {
      icon: "fas fa-history",
      title: "Riwayat Pekerjaan"
    },
    'LastWork': {
      icon: "fas fa-clipboard-check",
      title: "Status Pekerjaan"
    },
  }

  if (order?.last_work?.type == 'request') {
    headerMap['LastWork'] = {
      ...headerMap['LastWork'],
      title: "Konfirmasi Pekerjaan"
    }
  }

  const SelectedComponent = componentMap[component] || WorkHistoryData

  return (
    <div>
      <SectionHeader
        {...headerMap[component]}
        action={
          whatsAppUrl && isCtaButton && (
            <a target="_blank" href={whatsAppUrl} className="btn btn-xs btn-success text-white gap-1">
              <i className="fab fa-whatsapp"></i> Chat Freelancer
            </a>
          )
        }
      />

      <div className="bg-gray-50 p-4 rounded-xl">
        {!!seller && isSeller && (
          <div className="flex items-center gap-3 mb-6 border-b border-gray-200 pb-4">
            <div className="avatar placeholder">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                <img src={seller?.picture ?? '/image/user.png'} alt={seller?.name} className="object-cover" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500">Freelancer</p>
              <p className="font-bold text-gray-800">{seller?.name ?? "Admin"}</p>
            </div>
          </div>
        )}

        <SelectedComponent order={order} />
      </div>
    </div>
  )
}

export const WorkHistoryData = ({ order }) => {
  const histories = order?.work_history || []

  if (histories.length === 0) {
    return <p className="text-center text-gray-400 italic text-sm py-4">Belum ada update pekerjaan.</p>
  }

  return (
    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 my-2">
      {histories.map((history, idx) => (
        <div key={idx} className="relative pl-6">
          <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-4 border-purple-500`}></span>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${useStatus(`work.${history.type}.${history.status}`)} border`}>
                {useStatusLabel(`work.${history.type}.${history.status}`)}
              </span>
              <p className="text-xs text-gray-400 font-medium">
                {dateTime(history.created_at)}
              </p>
            </div>
          </div>

          {history?.message || history?.attachment?.length ? (
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              {history.message ? (
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {history.message}
                </div>
              ) : null}

              {history.attachment && history.attachment.length > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                    <i className="fas fa-paperclip"></i> Lampiran ({history.attachment.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {history.attachment.map((att, i) => (
                      <AttachmentItem key={i} attachment={att} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export const LastWork = ({ order }) => {
  const history = order?.last_work;
  const { user } = usePage().props.auth;

  if (order.status == 'success') {
    return <p className="text-center text-gray-400 italic text-sm py-4">Pekerjaan telah diselesaikan</p>;
  }

  if (!history || history?.user?.id == user?.id) {
    return <p className="text-center text-gray-400 italic text-sm py-4">Belum ada update pekerjaan terbaru.</p>;
  }

  const finishModalId = `finish_order_${order?.id}`;
  const revisionModalId = `revision_order_${order?.id}`;

  return (
    <>
      <FinishOrderModal data={order} handleClick={() => { }} />
      <RevisionOrderModal data={order} handleClick={() => { }} />

      <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 my-4">
        <div className="relative pl-6">
          <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-4 border-primary`}></span>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <div className="mb-1 sm:mb-0">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border mb-1 ${useStatus(`work.${history.type}.${history.status}`)}`}>
                {useStatusLabel(`work.${history.type}.${history.status}`)}
              </span>
              <p className="text-xs text-gray-400 font-medium">
                {history.created_at ? dateTime(history.created_at) : '-'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {history.message ? (
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {history.message}
              </div>
            ) : null}

            {history.attachment && history.attachment.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-1">
                  <i className="fas fa-paperclip"></i> Lampiran ({history.attachment.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {history.attachment.map((att, i) => (
                    <AttachmentItem key={i} attachment={att} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {history.type === 'request' && (
            <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
              <ModalButton
                id={revisionModalId}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 cursor-pointer"
              >
                <FileWarning size={16} className="mr-2 text-red-500" />
                Ajukan Revisi
              </ModalButton>

              <ModalButton
                id={finishModalId}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90 cursor-pointer"
              >
                <CheckCircle size={16} className="mr-2" />
                Setujui & Selesaikan
              </ModalButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const AttachmentItem = ({ attachment }) => {
  let icon = "fa-file-alt";
  let color = "text-gray-500";

  const type = attachment.type?.toLowerCase();
  const contentType = attachment.content_type?.toLowerCase();

  if (type === 'image' || contentType === 'image') {
    icon = "fa-image";
    color = "text-purple-600";
  } else if (type === 'video') {
    icon = "fa-video";
    color = "text-red-500";
  } else if (type === 'link' || contentType === 'link') {
    icon = "fa-link";
    color = "text-blue-500";
  }

  return (
    <a
      href={attachment.value}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 p-2 rounded border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
    >
      <div className={`w-8 h-8 rounded bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-white`}>
        <i className={`fas ${icon} ${color}`}></i>
      </div>
      <div className="overflow-hidden">
        <p className="text-xs font-medium text-gray-700 truncate group-hover:text-purple-700">
          {attachment.label || "File Lampiran"}
        </p>
        {attachment.description && (
          <p className="text-[10px] text-gray-400 truncate">
            {attachment.description}
          </p>
        )}
      </div>
    </a>
  )
}
export const PaymentData = ({ order }) => {
  const { detail } = order
  let product = order.product
  try { product = JSON.parse(detail) } catch (error) { console.log(error); }

  let paymentTotal = order?.payment?.net_amount
  if (paymentTotal <= 0) { paymentTotal = order?.payment?.gross_amount }

  const rowProps = { wrapperClassName: 'flex justify-between text-sm mb-2', valueClassName: "font-medium" }

  return (
    <div>
      <SectionHeader icon="fas fa-receipt" title="Rincian Pembayaran" />

      <div className="space-y-2">
        <RowLabel label={'Harga Item'} value={currency(order?.payment?.gross_amount ?? order.price_total)} {...rowProps} />
        {!!order.payment && (
          <RowLabel label={'Biaya Layanan'} value={currency(order?.payment?.fee ?? 0)} {...rowProps} />
        )}
      </div>

      <div className="border-t border-dashed border-gray-300 my-3 pt-2">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-800">Total Bayar</span>
          <span className="font-bold text-xl text-purple-700">
            {!!order.payment ? currency(paymentTotal) : currency(order.price_total)}
          </span>
        </div>
      </div>
    </div>
  )
}

export const RefundData = ({ order }) => {
  const { refund } = order
  const rowProps = { wrapperClassName: 'flex justify-between text-sm mb-1', valueClassName: "font-medium text-right" }

  return (
    <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-100">
      <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
        <i className="fas fa-undo-alt"></i> Info Refund
      </h4>
      <div className="space-y-1">
        <RowLabel label={'Bank'} value={refund.bank_name} {...rowProps} />
        <RowLabel label={'Rekening'} value={refund.bank_account} {...rowProps} />
        <RowLabel label={'A.N'} value={refund.bank_alias} {...rowProps} />
        <div className="border-t border-orange-200 my-2"></div>
        <RowLabel label={'Nominal'} value={currency(order.payment.gross_amount)} {...rowProps} valueClassName="font-bold text-orange-700" />
        <RowLabel label={'Diajukan'} value={date(refund.created_at)} {...rowProps} />
      </div>
      <p className='text-xs text-orange-600 mt-2 italic'>* Maksimal 7 hari kerja sejak pengajuan</p>
    </div>
  )
}