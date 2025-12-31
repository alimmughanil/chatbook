import { Link, router, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table, { NoData } from "@/Components/Table"
import { useSearchParams } from "@/utlis/format"
import { useAtom, useSetAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import { AnswerCorrectIcon, AnswerStatusIcon } from "@/Components/Icons"
import { Fragment } from "react"
import useStatus, { useStatusLabel } from "@/utlis/useStatus"
import { ModalButton } from "@/Components/WithModal"
import SubmissionAnswerFormModal from "./Modal/SubmissionAnswerFormModal"
import Accordion from "@/Components/Accordion"

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

  let submissionUrl = props.location.split(`quiz_submissions`)
  submissionUrl = `${submissionUrl[0]}quiz_submissions`

  return (
    <div className='text-sm text-gray-500 breadcrumbs overflow-auto scrollbar-none'>
      <ul>
        <li><Link href='/admin/courses' className="text-primary hover:underline">Kursus</Link></li>
        <li><Link href={moduleUrl} className="text-primary hover:underline">Modul</Link></li>
        <li><Link href={submissionUrl} className="text-primary hover:underline">Submission</Link></li>
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
        cardChecbox={false}
        addButton={false}
        filterOptions={filterOptions}
        tableHeader={tableHeader}
        tableBody={props?.["questions"]?.data ?? []}
        tablePage={props?.["questions"]?.links}
        maxWidth="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-10rem)]"
        // bottomLeftSection={() => {
        //   return (
        //     <div className="text-gray-800">
        //       <p>Total Poin: {number(props.pointTotal)}</p>
        //       <p>Nilai Akhir: {number(props.finalScore)}</p>
        //     </div>
        //   )
        // }}
        tableRender={TableRender}
        {...tableProps}
      />

      {show ? (
        <>
          <SubmissionAnswerFormModal id={show?.id} label={show?.title} data={show} handleClick={() => handleShow(null)} />
        </>
      ) : null}
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
    params.set("question_id", data?.active?.[0]?.id ?? '')

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
              <div className="flex items-center gap-1">
                <div className={`badge badge-sm px-3 py-2 ${useStatus(`answer.${data.answer_status}`)}`}>{useStatusLabel(`answer.${data.answer_status}`)}</div>
                {/* <div className="">
                  <p>Poin: {data.answer_score}</p>
                </div> */}
              </div>
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
      {data.answers?.length > 0 ? (
        <QuestionShow answers={data?.answers} />
      ) : null}

      {["essay"].includes(data.type) ? (
        <>
          {data.essay_answers?.length > 0 ? (
            <>
              <p>Jawab:</p>
              <ul className="pl-2 list-disc list-inside">
                {data.essay_answers.map((answer, index) => (
                  <li key={index}>
                    {answer}
                  </li>
                ))}
              </ul>
            </>
          ) : '-'}
        </>
      ) : null}

      {["file_upload"].includes(data.type) ? (
        <>
          {data.submission_answers?.length > 0 ? (
            <>
              <p>Jawab:</p>
              <ul className="pl-2 list-disc list-inside">
                {data.submission_answers.map((answer, index) => {
                  let label = answer?.file_answer?.replace("submission_answers/", "")
                  return (
                    <li key={index}>
                      <a target="_blank" href={`/files/${answer.id}/submission_answers`} className="underline hover:text-primary">
                        {label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : '-'}
        </>
      ) : null}

      {["single_choice", "multiple_choice"].includes(data.type) ? (
        <>
          {data.choice_answers?.length > 0 ? (
            <>
              <p>Jawab:</p>
              <div className="pl-2">
                {data.choice_answers.map((answer, index) => (
                  <div key={index} className="flex gap-2 items-center text-sm">
                    <div className="flex items-center gap-1">
                      <AnswerStatusIcon type={answer?.is_correct ? 'corrent' : 'incorrent'} />
                    </div>
                    <div className="flex-none">
                      <p className="max-w-[65vw] md:max-w-[77vw]">{answer.answer_text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : '-'}
        </>
      ) : null}
      <div className="mt-4">
        <ModalButton id={`submission_answer_form_${data.id}`} onClick={() => setShow(data)} className="btn btn-xs px-2 rounded btn-primary">
          {data.answer_status == 'pending' ? (
            <>
              <i className="fas fa-plus"></i>
              Tambah Penilaian
            </>
          ) : (
            <>
              <i className="fas fa-edit"></i>
              Edit Penilaian
            </>
          )}
        </ModalButton>
      </div>
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
  const { props } = usePage()
  const filterOptions = [
    {
      name: "status",
      data: props?.status ?? [],
      label: "Filter Status",
      prefix: "answer"
    },
  ]
  return filterOptions
}

Index.tableHeader = useTableHeader
Index.filterOptions = useFilterOptions
Index.Table = TableIndex

const QuestionIndex = Index
export default QuestionIndex
