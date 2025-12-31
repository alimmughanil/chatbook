import { Link, usePage } from "@inertiajs/react"
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

function Index(props) {
  return (
    <AuthenticatedLayout title={props?.title} Breadcrumb={Breadcrumb}>
      <TableIndex />
    </AuthenticatedLayout>
  )
}

const Breadcrumb = ({ currentLabel }) => {
  const { props } = usePage()
  
  let moduleUrl = props.location.split(`modules`)
  moduleUrl = `${moduleUrl[0]}modules`  

  return (
    <div className='text-sm text-gray-500 breadcrumbs overflow-auto scrollbar-none'>
      <ul>
        <li><Link href='/admin/courses' className="text-primary hover:underline">Kursus</Link></li>
        <li><Link href={moduleUrl} className="text-primary hover:underline">Modul</Link></li>
        <li><Link href={props.location} className="hover:underline">{currentLabel}</Link></li>
      </ul>
    </div>
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
        addButton={false}
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
              <Link href={`${props?.page?.url}/${data.id}/answers`} className="">
                Koreksi Jawaban
              </Link>
            </li>
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
      label: "Nomor Peserta",
      value: "participant.participant_number",
    },
    {
      label: "Nama",
      value: "participant.name",
      isSearchable: true,
    },
    {
      label: "Email",
      value: "participant.email",
      isSearchable: true,
    },
    {
      label: "Telepon",
      value: "participant.phone",
      isSearchable: true,
    },
    {
      label: "Institusi",
      value: "participant.institute",
      isSearchable: true,
    },
    {
      label: "Cabang",
      value: "participant.branch",
      isDetail: true,
    },
    {
      label: "Jabatan",
      value: "participant.job_title",
      isDetail: true,
    },
    {
      label: "Nilai Minimal",
      value: "quiz.min_score",
    },
    {
      label: "Nilai Akhir",
      value: "final_score",
      defaultValue: "0",
      valueLabel: ({data, value}) => {
        if (!['submitted'].includes(data.status)) return value
        return `${value} (Estimasi)`
      }
    },
    {
      label: "Status",
      value: "status",
      type: "status",
      prefix: 'submission'
    },
    {
      label: "Penliaian",
      value: "grade_status",
      type: "status",
      prefix: 'submission.grade'
    },
    {
      label: "Dikirim Pada",
      value: "submitted_at",
      type: "date",
    },
    {
      label: "Diperbarui",
      value: "updated_at",
      type: "date",
      isSearchable: true,
      className: "text-[13px] w-[10%] md:w-[100px] !whitespace-pre",
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
      prefix: "submission"
    },
    {
      name: "grade_status",
      data: props?.gradeStatus ?? [],
      label: "Filter Penilaian",
      prefix: "submission.grade"
    },
  ]

  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const QuizSubmissionIndex = Index
export default QuizSubmissionIndex
