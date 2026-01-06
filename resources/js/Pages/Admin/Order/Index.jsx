import { Link, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table from "@/Components/Table"
import { ModalButton } from "@/Components/WithModal"
import { currency, useSearchParams, whatsappNumber } from "@/utils/format"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import useStatus, { useStatusLabel } from "@/utils/useStatus"
import CopyToClipboard from "@/Components/CopyToClipboard"
import RowLabel from "@/Components/RowLabel"

function Index(props) {
  return (
    <AuthenticatedLayout title={props?.title}>
      <TableIndex />
    </AuthenticatedLayout>
  )
}

const TableIndex = (tableProps) => {
  let { tableHeader = null } = tableProps

  const { props } = usePage()
  if (!tableHeader) {
    tableHeader = useTableHeader()
  }

  const filterOptions = useFilterOptions()

  const [show, setShow] = useAtom(showModalAtom)
  const handleShow = (data) => {
    setShow(data)
  }

  return (
    <>
      <Table
        search
        filter
        filterOptions={filterOptions}
        tableHeader={tableHeader}
        tableBody={props?.[props?.page?.name]?.data ?? []}
        tablePage={props?.[props?.page?.name]?.links}
        tableAction={(data) => (
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button' className='m-1 btn btn-ghost btn-sm'>
              <i className='fas fa-ellipsis-vertical'></i>
            </div>
            <ul tabIndex={0} className='p-2 shadow menu dropdown-content z-[1] bg-base-100 w-[200px]'>
              <li>
                <ModalButton id={`detail_${data?.id}`} onClick={() => handleShow(data)}>
                  <span>Lihat Detail</span>
                </ModalButton>
              </li>
              <li><button disabled={!data?.user?.phone} onClick={() => window.open(`https://wa.me/${whatsappNumber(data?.user?.phone)}`, '_blank')} className="disabled:opacity-50">Hubungi Klien</button></li>
            </ul>
          </div>
        )}
        {...tableProps}
      />

      {show ? (
        <>
          <DetailModal
            id={show?.id}
            tableHeader={tableHeader}
            data={show}
            handleClick={() => handleShow(null)}
            content={(data) => DetailModalContent(data, tableHeader)}
            size="max-w-2xl"
          />
        </>
      ) : null}
    </>
  )
}

const useTableHeader = () => {
  const { page, isAdmin, location } = usePage().props
  const { params } = useSearchParams(location)

  const header = [
    {
      label: '#',
      value: 'id',
      type: 'numbering',
    },
    {
      label: 'Nomor Pesanan',
      value: 'order_number',
      isSearchable: true,
      isDefaultLabel: true,
      custom: ({ data }) => (
        <td>
          #{data?.order_number}<br />
          <p className='font-semibold'>{data?.product?.name}</p>
        </td>
      )
    },
    {
      label: 'Pemesan',
      value: 'user.name',
      isSearchable: true,
      isDefaultLabel: true,
      custom: ({ data }) => (
        <td>
          <p>{data?.user?.name}</p>
          <p className="opacity-80">{data?.user?.email}</p>
        </td>
      )
    },
    {
      label: 'Total Harga',
      value: 'price_total',
      type: 'currency',
    },
    {
      label: 'Status',
      value: 'status',
      isDetail: false,
      custom: ({ data }) => (
        <td>
          <div className='flex flex-col'>
            <div className={`capitalize mb-1 badge ${useStatus('payment.' + data?.payment?.status)}`}>{useStatusLabel('payment.' + data?.payment?.status)}</div>
            <div className={`capitalize badge ${useStatus('order.' + data?.status)}`}>{useStatusLabel(data?.status)}</div>
          </div>
        </td>
      )
    },

    {
      label: 'Status Pesanan',
      value: 'status',
      type: 'status',
      isDefaultLabel: true,
      isDetail: true,
      prefix: 'order',
    },
    {
      label: 'Status Pembayaran',
      value: 'payment.status',
      type: 'status',
      isDefaultLabel: true,
      isDetail: true,
      prefix: 'payment',
    },
    {
      label: 'Catatan',
      value: 'note',
      isDetail: true,
      isHidden: 'not null'
    },
    {
      label: 'Catatan Pembatalan',
      value: 'message_status',
      isDetail: true,
      isHidden: 'not null'
    },
    {
      label: 'Terakhir Diperbarui',
      value: 'updated_at',
      type: 'date',
    },
    {
      label: 'Halaman Pembayaran',
      isDetail: true,
      isDefaultLabel: true,
      custom: ({ data }) => {
        if (!data?.payment?.payment_link) return "-"
        const order = data
        let whatsappUrl = null

        if (order?.user?.phone) {
          let whatsappText = `Halo ${order.user.name}, terima kasih telah memesan ${order?.product?.name}. `
          if (order.status == 'success') {
            whatsappText += `Kami akan segera memproses pesanan anda.`
          } else {
            whatsappText += `Agar pesanan dapat diproses, harap lanjutkan pembayaran sebesar ${currency(order.price_total)} pada Link Pembayaran berikut: ${order.payment.payment_link}`
          }
          whatsappText = new URLSearchParams(whatsappText)
          whatsappUrl = `https://wa.me/${whatsappNumber(order?.user?.phone)}?text=${whatsappText}`
        }

        return (
          <div className=''>
            <div className="flex flex-wrap w-full gap-2">
              <CopyToClipboard data={data?.payment?.payment_link} label="Halaman Pembayaran" btnClassName="btn btn-neutral btn-sm" />
              <a href={data?.payment?.payment_link} target='_black' className='btn btn-sm btn-primary'>
                <i className='fas fa-arrow-up-right-from-square'></i>
                <span>Buka</span>
              </a>
              {whatsappUrl ? (
                <a href={whatsappUrl} target='_black' className='btn btn-sm btn-success text-white bg-green-800'>
                  <i className='fab fa-whatsapp'></i>
                  <span>Kirim</span>
                </a>
              ) : null}
              {/* <Link href={`/admin/order/${order?.order_number}/invoice?order_id=${order.id}`} className='btn btn-sm btn-neutral btn-outline'>
                <i className='fas fa-envelope'></i>
                <span>Kirim Invoice</span>
              </Link> */}
            </div>
          </div>
        )
      }
    },
    {
      label: "Aksi",
      value: "id",
      type: "action",
    },
  ]

  return header
}

const useFilterOptions = () => {
  const { props } = usePage()
  const filterOptions = [
    {
      name: "status",
      data: props?.status ?? [],
      label: "Filter Status",
      prefix: "order",
    },
  ]

  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const OrderIndex = Index
export default OrderIndex
