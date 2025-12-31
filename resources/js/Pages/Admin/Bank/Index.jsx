import { Link, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { useSearchParams, whatsappNumber } from "@/utils/format"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import AcceptModal from "./Modal/AcceptModal"
import RejectModal from "./Modal/RejectModal"
import useStatus, { useStatusLabel } from "@/utils/useStatus"
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
            <li>
              <Link href={`${props?.page?.url}/${data.id}/edit`}>Edit</Link>
            </li>
            {props.isAdmin ? (
              <>
                <li>
                  <ModalButton
                    disabled={data?.status !== "pending"}
                    id={`accept_${data?.id}`}
                    btnLabel={"Verifikasi Rekening Bank"}
                    className="disabled:opacity-50 text-green-700"
                    onClick={() => handleShow(data)}
                  />
                </li>
                <li>
                  <ModalButton
                    disabled={data?.status === "verified"}
                    id={`reject_${data?.id}`}
                    btnLabel={"Tolak Rekening Bank"}
                    className="disabled:opacity-50 text-red-600"
                    onClick={() => handleShow(data)}
                  />
                </li>
              </>
            ) : null}
            <li>
              <ModalButton id={`delete_${data?.id}`} onClick={() => handleShow(data)}>
                Hapus {data.deleted_at ? "Permanen" : ""}
              </ModalButton>
            </li>
            {!props.isAdmin && props.phoneNumber ? (
              <li>
                <a
                  href={`https://wa.me/${whatsappNumber(props.phoneNumber)}?text=Halo Admin ${props.appName}, saya telah mengajukan penambahan bank, mohon dapat diproses. Terima kasih`}
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
          <DeleteModal id={show?.id} label={show.bank_name} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <AcceptModal data={show} handleClick={() => handleShow(null)} />
          <RejectModal data={show} handleClick={() => handleShow(null)} />
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
      label: "Pengguna",
      value: "user.name",
      isSearchable: true,
      isDetail: true,
      isHidden: !isAdmin,
      isDefaultLabel: true,
      custom: ({ data }) => (
        <td>
          <p>{data.user.name}</p>
          <p className="opacity-90">{data.user.email}</p>
        </td>
      ),
    },
    {
      label: "Bank",
      value: "bank_name",
      isSearchable: true,
    },
    {
      label: "Nomor Rekening",
      value: "bank_account",
      isSearchable: true,
      isDetail: true,
    },
    {
      label: "Nama Pemilik",
      value: "bank_alias",
      isSearchable: true,
    },
    {
      label: "Status",
      value: "status",
      type: "status",
      prefix: "bank",
      isDefaultLabel: true,
      custom: ({ data }) => (
        <td className="text-start whitespace-pre md:whitespace-normal">
          <div className="flex flex-col gap-1">
            <div className={`capitalize badge badge-sm ${useStatus(`bank.${data.status}`)}`}>{useStatusLabel(`bank.${data.status}`)}</div>
            {data.is_primary == 1 ? <div className={`capitalize badge badge-sm ${useStatus(`bank.${data.status}`)}`}>Rekening Utama</div> : null}
          </div>
        </td>
      ),
    },
    {
      label: "Ditambahkan",
      value: "created_at",
      type: "date",
      isSearchable: true,
    },
    {
      label: "Terakhir Diperbarui",
      value: "updated_at",
      type: "date",
      isSearchable: true,
      isHidden: !isAdmin,
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
      isHidden: true,
      isDetail: true,
      label: "Lampiran",
      value: "attachment",
      type: "image",
    },
    {
      customHeader: (props) => hiddenField(props, "status", ["rejected"]),
      isDetail: true,
      label: "Alasan Penolakan",
      value: "status_message",
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
      prefix: "bank",
    },
  ]

  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const BankIndex = Index
export default BankIndex
