import { Link, router, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { useSearchParams } from "@/utlis/format"
import RestoreModal from "@/Components/Modal/RestoreModal"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import Select from "@/Components/Form/Select"
import ExportModal from "@/Components/Modal/ExportModal"
import ImportModal from "@/Components/Modal/ImportModal"

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
        addLink={`${props?.page?.url}/create?course_id=${props?.course?.id}`}
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
                <Link href={`${props?.page?.url}/${data.id}/edit?ref=${props.location}`} className="">
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
        headerSection={() => {
          const { props } = usePage()
          const { params } = useSearchParams(props.location)

          let courseIndex = props.courses?.findIndex((e) => e.value == params.get("course_id"))          

          const handleSelected = (e) => {
            return router.get(`?course_id=${e?.value}`)
          }

          return (
            <div className="p-2 w-full">
              <Select
                isReactSelect={true}
                isLabel={false}
                defaultValue={props.courses[courseIndex]}
                label="Pilih Kursus"
                placeholder="Pilih Kursus"
                handleChange={handleSelected}
                options={props.courses}
                errors={{}}
                name={"course_id"}
              />
            </div>
          )
        }}
        headerLeftButton={() => (
          <div className="flex gap-2 items-center justify-center sm:justify-start sm:flex-1">
            {!!props?.course ? (
              <>
                <ModalButton id={`modal_import_${props.course?.id}`} btnLabel={'Import Data'} className={"btn btn-sm btn-primary"} />
                <ModalButton id={`export_${props.page?.name}`} className='btn btn-sm btn-neutral btn-outline !border-gray-400'>
                  <i className="fas fa-upload"></i>
                  <span>Ekspor Excel</span>
                </ModalButton>
              </>
            ) : null}
          </div>
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
        </>
      ) : null}

      {props.course ? (
        <ImportModal data={props.course} type="participant" />
      ) : null}

      <ExportModal id={props?.page?.name} handleClick={() => ({})} data={{ course_id: props.course?.id }} content={(data) => <p>Anda akan mengekspor data peserta kursus ini ke Excel</p>} />
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
      label: "Jenis",
      value: "type",
      isSearchable: true,
    },
    {
      label: "Nomor Peserta",
      value: "participant_number",
    },
    {
      label: "Nama",
      value: "name",
      isSearchable: true,
    },
    {
      label: "Email",
      value: "email",
      isSearchable: true,
    },
    {
      label: "Telepon",
      value: "phone",
      isSearchable: true,
    },
    {
      label: "Institusi",
      value: "institute",
    },
    {
      label: "Cabang",
      value: "branch",
      isDetail: true,
    },
    {
      label: "Jabatan",
      value: "job_title",
      isDetail: true,
    },
    {
      label: "Status",
      value: "status",
      type: "status",
      prefix: "participant",
    },
    {
      label: "Ditambahkan",
      value: "created_at",
      type: "date",
      isSearchable: true,
      className: "text-[13px] w-[10%] md:w-[100px] !whitespace-pre",
    },
    {
      label: "Diperbarui",
      value: "updated_at",
      type: "date",
      isSearchable: true,
      className: "text-[13px] w-[10%] md:w-[100px] !whitespace-pre",
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
      prefix: "participant"
    },
  ]

  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const ParticipantIndex = Index
export default ParticipantIndex
