import { Link, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useState } from "react"
import Table from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { useSearchParams } from "@/utils/format"
import RestoreModal from "@/Components/Modal/RestoreModal"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"

function Index(props) {
  const tableHeader = useTableHeader()
  const filterOptions = useFilterOptions()

  const [show, setShow] = useState(null)
  const handleShow = (data) => {
    setShow(data)
  }

  return (
    <AuthenticatedLayout title={props?.title}>
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
          </>
        )}
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
        </>
      ) : null}
    </AuthenticatedLayout>
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
      label: "Nama Kategori",
      value: "name",
      isSearchable: true,
    },
    {
      label: "Slug",
      value: "slug",
      isDetail: true,
    },
    {
      label: `Artikel Unggulan`,
      value: "is_featured",
      className: 'w-[200px]',
      type: "boolean",
    },
    {
      label: "Status",
      value: "status",
      type: "status",
    },
    {
      label: "Dibuat",
      value: "created_at",
      type: "date",
      isSearchable: true,
    },
    {
      label: "Diperbarui",
      value: "updated_at",
      type: "date",
      isSearchable: true,
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
      data: props?.status,
      label: "Filter Status",
    },
    {
      name: "deleted_at",
      label: "Filter Data Terhapus",
    },
  ]

  return filterOptions
}

export default Index
