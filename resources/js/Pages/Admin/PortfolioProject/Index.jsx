import { Link, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { useSearchParams } from "@/utils/format"
import RestoreModal from "@/Components/Modal/RestoreModal"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import PublishModal from "./Modal/PublishModal"
import ArchivedModal from "./Modal/ArchivedModal"

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
            {/* <li>
              <Link href={`/admin/portfolio/project/${data.id}`} className='whitespace-pre'>Lihat Detail</Link>
            </li> */}
            <li>
              <ModalButton id={`detail_${data?.id}`} onClick={() => handleShow(data)}>
                <span>Lihat Detail</span>
              </ModalButton>
            </li>
            {data.deleted_at ? (
              <li>
                <ModalButton id={`modal_restore_${data?.id}`} onClick={() => handleShow(data)}>
                  Pulihkan Data
                </ModalButton>
              </li>
            ) : (
              <li>
                <Link href={`${props?.page?.url}/${data.id}/edit`} className="">
                  Edit
                </Link>
              </li>
            )}
            <li>
              <ModalButton id={`modal_delete_${data?.id}`} onClick={() => handleShow(data)}>
                Hapus {data.deleted_at ? "Permanen" : ""}
              </ModalButton>
            </li>
            <li><ModalButton disabled={['publish'].includes(data.status)} id={`modal_publish_${data?.id}`} btnLabel={'Publikasi Portofolio'} onClick={() => handleShow(data)} /></li>
            <li><ModalButton disabled={['draft', 'archived'].includes(data.status)} id={`modal_archived_${data?.id}`} btnLabel={'Arsipkan Portofolio'} onClick={() => handleShow(data)} /></li>
          </>
        )}
        {...tableProps}
      />

      {show ? (
        <>
          <DeleteModal id={show?.id} label={show.name} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <RestoreModal id={show?.id} label={show.name} handleClick={() => handleShow(null)} />
          <DetailModal
            id={show?.id}
            tableHeader={tableHeader}
            data={show}
            handleClick={() => handleShow(null)}
            content={(data) => DetailModalContent(data, tableHeader)}
            size="max-w-2xl"
          />
          <PublishModal data={show} handleClick={() => handleShow(null)} />
          <ArchivedModal data={show} handleClick={() => handleShow(null)} />
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
      label: "#",
      value: "id",
      type: "numbering",
    },
    {
      label: "Nama Proyek",
      value: "name",
      isSearchable: true,
    },
    {
      label: "Kategori",
      value: "category.name",
      isSearchable: true,
    },
    {
      label: "Status Proyek",
      value: "project_status",
      type: 'status',
      prefix: 'portfolio',
    },
    {
      label: "Status",
      value: "status",
      type: 'status',
    },
    {
      label: "Terakhir Diperbarui",
      value: "updated_at",
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
      prefix: "post",
    },
    {
      name: "deleted_at",
      label: "Filter Data Terhapus",
    },
  ]

  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const PortfolioProjectIndex = Index
export default PortfolioProjectIndex
