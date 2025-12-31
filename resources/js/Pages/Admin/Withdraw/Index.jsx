import { usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table from "@/Components/Table"
import { ModalButton } from "@/Components/WithModal"
import { currency, useSearchParams, whatsappNumber } from "@/utils/format"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import FinishModal from "./Modal/FinishModal"
import CancelModal from "./Modal/CancelModal"
import { hiddenField } from "@/utils/useFormBuilder"

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
          <>
            <li>
              <ModalButton id={`detail_${data?.id}`} onClick={() => handleShow(data)}>
                <span>Lihat Detail</span>
              </ModalButton>
            </li>
            {props.isAdmin && (
              <>
                <li>
                  <ModalButton
                    id={`finish_${data?.id}`}
                    onClick={() => handleShow(data)}
                    className="text-green-600"
                    disabled={!["pending", "processing"].includes(data.status)}
                  >
                    Selesaikan
                  </ModalButton>
                </li>
                <li>
                  <ModalButton
                    id={`cancel_${data?.id}`}
                    onClick={() => handleShow(data)}
                    className="text-red-600"
                    disabled={!["pending", "processing"].includes(data.status)}
                  >
                    Batalkan
                  </ModalButton>
                </li>
              </>
            )}
            {!props.isAdmin && data.status != "success" && props.phoneNumber ? (
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber(props.phoneNumber)}?text=Halo Admin ${props.appName}, saya mengajukan penarikan dana dengan nomor transaksi ${data?.transaction_number}, mohon dapat diproses. Terima kasih`}
                  target="_blank"
                  className="flex gap-2 items-center"
                >
                  <i className="fab fa-whatsapp text-green-700 text-lg"></i>
                  <span>Kontak Admin</span>
                </a>
              </li>
            ) : null}
          </>
        )}
        {...tableProps}
      />

      {show ? (
        <>
          <FinishModal data={show} handleClick={() => handleShow(null)} />
          <CancelModal data={show} handleClick={() => handleShow(null)} />
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
  const { page, isAdmin } = usePage().props
  const { params } = useSearchParams(location)

  const header = [
    {
      label: "#",
      value: "id",
      type: "numbering",
    },
    {
      label: "Nomor Transaksi",
      value: "transaction_number",
      isSearchable: true,
    },
    {
      label: "Pengguna",
      value: "user.name",
      isDetail: !isAdmin,
      isHidden: !isAdmin,
    },
    {
      label: "Bank Penerima",
      value: "bank.bank_alias",
      isSearchable: true,
      isDefaultLabel: true,
      custom: ({ data }) => (
        <td className="text-start whitespace-pre md:whitespace-normal">
          <p>{data.bank?.bank_name}</p>
          <p>
            {data.bank?.bank_account} a.n. {data.bank?.bank_alias}
          </p>
        </td>
      ),
    },
    {
      label: "Jumlah Penarikan",
      value: "gross_amount",
      type: "currency",
    },
    {
      label: "Jumlah Diterima",
      value: "net_amount",
      type: "currency",
    },
    {
      label: "Status",
      value: "status",
      type: "status",
      prefix: "withdraw",
    },
    {
      label: "Waktu Penarikan",
      value: "created_at",
      type: "date",
      isSearchable: true,
    },
    {
      label: "Dihapus",
      value: "deleted_at",
      type: "date",
      className: "text-[13px] w-[10%] md:w-[100px] !whitespace-pre",
      isHidden: params.get("deleted_at") != "show",
    },
    {
      label: "Aksi",
      value: "id",
      type: "action",
    },
    {
      isDetail: true,
      label: "Total Biaya Potongan",
      value: "fee",
      type: "currency",
      isDefaultLabel: true,
      custom: ({ data }) => {
        if (!data.detail) return <td>-</td>
        const detail = JSON.parse(data.detail)
        return (
          <div className="text-start whitespace-pre md:whitespace-normal">
            <div className="flex flex-col">
              <span>{currency(data.fee)}</span>
              <ul className="list-disc ml-8">
                <li>Biaya Transfer Bank: {detail?.fee_transfer}</li>
                <li>Biaya Platform: {detail?.fee_platform}</li>
              </ul>
            </div>
          </div>
        )
      },
    },
    {
      customHeader: (props) => hiddenField(props, "status", ["cancel"]),
      isDetail: true,
      label: "Alasan Pembatalan",
      value: "status_message",
    },
    {
      isDetail: true,
      label: "Bukti Pembayaran",
      value: "attachment",
      type: "image",
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
      prefix: "withdraw",
    },
  ]

  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const WithdrawIndex = Index
export default WithdrawIndex
