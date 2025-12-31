import { Link, usePage, router } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { useSearchParams } from "@/utils/format"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom } from "jotai"
import { showModalAtom } from "@/atoms"

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
        headerRightButton={() => (
          <button onClick={() => router.put("/admin/supported-bank/sync-duitku")} className="btn btn-primary btn-outline w-max btn-sm">
            Sync Duitku Bank
          </button>
        )}
        tableAction={(data) => (
          <>
            <li>
              <Link href={`${props?.page?.url}/${data.id}/edit`}>Edit</Link>
            </li>
            <li>
              <ModalButton id={`delete_${data?.id}`} onClick={() => handleShow(data)}>
                Hapus {data.deleted_at ? "Permanen" : ""}
              </ModalButton>
            </li>
          </>
        )}
        {...tableProps}
      />

      {show ? (
        <>
          <DeleteModal id={show?.id} label={show.bank_name} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
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
      label: "Kode Bank",
      value: "bank_code",
      isSearchable: true,
    },
    {
      label: "Nama Bank",
      value: "bank_name",
      isSearchable: true,
    },
    {
      label: "BI Fast",
      value: "bi_fast",
      custom: ({ data }) => (
        <td>
          <i className={`fas text-xl ${data.bi_fast ? "fa-circle-check text-green-700" : "fa-circle-xmark text-red-700"}`}></i>
        </td>
      ),
    },
    {
      label: "Limit Transfer",
      value: "limit_transfer_amount",
      type: "currency",
    },
    {
      label: "Status",
      value: "status",
      type: "status",
    },
    {
      label: "Dibuat",
      value: "created_at",
      isSearchable: true,
      type: "date",
    },
    {
      label: "Terakhir Diperbarui",
      value: "updated_at",
      isSearchable: true,
      type: "date",
    },
    {
      label: "Dihapus",
      value: "deleted_at",
      type: "date",
      isHidden: params.get("deleted_at") != "show",
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
    },
  ]

  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const SupportedBankIndex = Index
export default SupportedBankIndex
