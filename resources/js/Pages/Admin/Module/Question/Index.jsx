import { Link, router, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table, { NoData, WithAction } from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { useSearchParams } from "@/utlis/format"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom, useSetAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import Accordion from "@/Components/Accordion"
import AnswerDeleteModal from "./Modal/AnswerDeleteModal"
import AnswerFormModal from "./Modal/AnswerFormModal"
import { AnswerCorrectIcon } from "@/Components/Icons"
import { Fragment } from "react"
import useLang from "@/utlis/useLang"

function Index(props) {
  const pageUrl = props?.page?.base_path ?? props?.page?.url

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
        <li><Link href={props.location} className="hover:underline">Pertanyaan: {currentLabel}</Link></li>
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
        // filter
        cardChecbox={false}
        filterOptions={filterOptions}
        tableHeader={tableHeader}
        tableBody={props?.["questions"]?.data ?? []}
        tablePage={props?.["questions"]?.links}
        maxWidth="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-10rem)]"
        headerLeftButton={() => {
          return <p className="text-gray-600">Daftar Pertanyaan Kuis</p>
        }}
        tableRender={TableRender}
        {...tableProps}
      />

      {show ? (
        <>
          <DeleteModal id={show?.id} label={show.title} data={show} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <AnswerDeleteModal
            id={show?.id}
            label={show.title}
            data={show}
            isForceDelete={show.deleted_at != null}
            handleClick={() => handleShow(null)}
          />
          <AnswerFormModal id={show?.id} label={show?.title} data={show} handleClick={() => handleShow(null)} />

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

      <AnswerFormModal id={"create"} handleClick={() => handleShow(null)} />
    </>
  )
}

const TableRender = () => {
  const { props } = usePage()
  const questions = props?.["questions"]?.data ?? []
  const { params } = useSearchParams(props.location)

  if (questions.length === 0)
    return (
      <div className="my-8">
        <NoData />
      </div>
    )

  const handleChange = (data) => {
    params.set("question_id", data?.active?.[0]?.id)

    router.get(
      `?${params.toString()}`,
      {},
      {
        preserveScroll: true,
        preserveState: true,
        async: false,
        only: ["question", "location"],
      },
    )
  }

  return (
    <div className="w-full text-base px-2 sm:px-0">
      <Accordion options={questions} Content={QuestionContent} onChange={handleChange} defaultParams="question_id" customLabel={(data) => {
        return (
          <div className="flex gap-2 items-center text-sm">
            <div className="flex-none">
              <p>{data.question_text}</p>
              <p className="font-normal opacity-80">{useLang(`question.${data.type}`)}</p>
            </div>
          </div>
        )
      }} />
    </div>
  )
}

const QuestionContent = ({ data }) => {
  const { props } = usePage()
  const setShow = useSetAtom(showModalAtom)

  return (
    <div className="">
      <div className={`text-gray-600`}>
        <p>{data.description}</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        <Link href={`${props?.page?.url}/${data.id}/edit`} className="btn btn-xs px-2 rounded btn-primary">
          <i className="fas fa-edit"></i>
          Edit Pertanyaan
        </Link>
        <ModalButton
          id={`modal_delete_${data?.id}`}
          onClick={() => setShow(data)}
          className="btn btn-xs px-2 rounded btn-error bg-red-700 text-white"
        >
          <i className="fas fa-trash"></i>
          Hapus Pertanyaan
        </ModalButton>

        {["single_choice", "multiple_choice"].includes(data.type) ? (
          <ModalButton id={`answer_form_create`} onClick={() => setShow(null)} className="btn btn-xs px-2 rounded btn-primary">
            <i className="fas fa-plus"></i>
            Tambah Jawaban
          </ModalButton>
        ) : null}
      </div>

      {["single_choice", "multiple_choice"].includes(data.type) ? (
        <>
          {!props.question || props?.question?.answers?.length == 0 ? (
            <div className="mt-2">
              <p>Belum ada jawaban yang ditambahkan</p>
            </div>
          ) : (
            <QuestionShow answers={props?.question?.answers} />
          )}
        </>
      ) : null}
      <div className=""></div>
    </div>
  )
}

const QuestionShow = ({ answers }) => {
  const { props } = usePage()
  const { params } = useSearchParams(props.location)

  if (answers.length === 0)
    return (
      <div className="my-8">
        <NoData />
      </div>
    )

  const setShow = useSetAtom(showModalAtom)

  return (
    <div className="mt-4 text-base border-2 p-4 mb-10">
      <p className="">Pilihan Jawaban</p>

      {answers.map((answer, index) => (
        <Fragment key={index}>
          <div className="flex gap-2 items-center text-sm">
            <div className="flex items-center gap-1">
              <WithAction btnClassName={"px-2"} item={answer} isTable={false} align="right" actionMenu={(data) => (
                <div className='border-2'>
                  <li>
                    <ModalButton id={`answer_form_${data?.id}`} onClick={() => setShow(data)}>
                      Edit Jawaban
                    </ModalButton>
                  </li>
                  <li>
                    <ModalButton id={`answer_delete_${data?.id}`} onClick={() => setShow(data)}>
                      Hapus Jawaban
                    </ModalButton>
                  </li>
                </div>
              )} />
              <AnswerCorrectIcon type={answer?.is_correct} />
            </div>
            <div className="flex-none">
              <p className="max-w-[65vw] md:max-w-[77vw]">{answer.answer_text}</p>
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

const useTableHeader = () => {
  const header = [
    {
      label: "#",
      value: "id",
      type: "numbering",
    },
    {
      label: "Teks Pertanyaan",
      value: "question_text",
      isSearchable: true,
    },
    {
      label: "Tipe",
      value: "type",
      isSearchable: true,
    },
    {
      label: "Dibuat",
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
      label: "Aksi",
      value: "id",
      type: "action",
    },
  ]

  return header
}

const useFilterOptions = () => {
  const filterOptions = []
  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const QuestionIndex = Index
export default QuestionIndex
