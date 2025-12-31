import { Link, router, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import Table, { NoData } from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { useSearchParams } from "@/utlis/format"
import RestoreModal from "@/Components/Modal/RestoreModal"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import { useAtom, useSetAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import ShowNavigation from "@/Components/Default/ShowNavigation"
import CourseShow from "../../Course/Show"
import Accordion from "@/Components/Accordion"
import LessonDeleteModal from "./Modal/LessonDeleteModal"
import LessonFormModal from "./Modal/LessonFormModal"
import YouTubePlayer from "@/Components/YoutubePlayer"
import { Fragment } from "react"
import { FileUploaderPreview } from "@/Components/Form/FileUploaderInput"
import QuizCard from "./Card/QuizCard"
import QuizFormModal from "./Modal/QuizFormModal"
import QuizDeleteModal from "./Modal/QuizDeleteModal"
import { AttachmentContentType, LessonTypeIcon } from "@/Components/Icons"

function Index(props) {
  const pageUrl = props?.page?.base_path ?? props?.page?.url
  const links = CourseShow.navigation(pageUrl)

  return (
    <AuthenticatedLayout title={props?.title} Breadcrumb={Breadcrumb}>
      <ShowNavigation links={links} pageUrl={`${pageUrl}/modules`} defaultActive="modules" />
    </AuthenticatedLayout>
  )
}

const Breadcrumb = ({ currentLabel }) => {
  const { props } = usePage()
  return (
    <div className='text-sm text-gray-500 breadcrumbs overflow-auto scrollbar-none'>
      <ul>
        <li><Link href='/admin/courses' className="text-primary hover:underline">Kursus</Link></li>
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
        // filter
        cardChecbox={false}
        filterOptions={filterOptions}
        tableHeader={tableHeader}
        tableBody={props?.[props?.page?.name]?.data ?? []}
        tablePage={props?.[props?.page?.name]?.links}
        maxWidth="max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-10rem)]"
        headerLeftButton={() => {
          return <p className="text-gray-600">Daftar Modul Tersedia</p>
        }}
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
        tableRender={TableRender}
        {...tableProps}
      />

      {show ? (
        <>
          <DeleteModal id={show?.id} label={show.title} data={show} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <LessonDeleteModal id={show?.id} label={show.title} data={show} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <QuizDeleteModal id={show?.id} label={show.title} data={show} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <RestoreModal id={show?.id} label={show.title} handleClick={() => handleShow(null)} />
          <LessonFormModal id={show?.id} label={show?.title} data={show} handleClick={() => handleShow(null)} />
          <QuizFormModal id={show?.id} label={show?.title} data={show} handleClick={() => handleShow(null)} />

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

      <LessonFormModal id={"create"} handleClick={() => handleShow(null)} />
      <QuizFormModal id={"create"} handleClick={() => handleShow(null)} />
    </>
  )
}

const TableRender = () => {
  const { props } = usePage()
  const modules = props?.[props?.page?.name]?.data ?? []
  const { params } = useSearchParams(props.location)

  if (modules.length === 0) return (
    <div className="my-8"><NoData /></div>
  )

  const handleChange = (data) => {
    params.set("module_id", data?.active?.[0]?.id)

    router.get(`?${params.toString()}`, {}, {
      preserveScroll: true,
      preserveState: true,
      async: false,
      only: ["module", "location"]
    })
  }

  return (
    <div className="w-full text-base px-2 sm:px-0">
      <Accordion labelField="title" options={modules} Content={ModuleContent} onChange={handleChange} defaultParams="module_id" />
    </div>
  )
}

const ModuleContent = ({ data }) => {
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
          Edit Modul
        </Link>
        <ModalButton id={`modal_delete_${data?.id}`} onClick={() => setShow(data)} className="btn btn-xs px-2 rounded btn-error bg-red-700 text-white">
          <i className="fas fa-trash"></i>
          Hapus {data.deleted_at ? "Permanen" : ""} Modul
        </ModalButton>

        <ModalButton id={`lesson_form_create`} onClick={() => setShow(null)} className="btn btn-xs px-2 rounded btn-primary">
          <i className="fas fa-plus"></i>
          Tambah Materi
        </ModalButton>
      </div>

      {!props.module || props?.module?.lessons?.length == 0 ? (
        <div className="mt-2">
          <p>Belum ada materi yang ditambahkan</p>
        </div>
      ) : <LessonIndex lessons={props?.module?.lessons} />}
      <div className="">

      </div>

    </div >
  )
}

const LessonIndex = ({ lessons }) => {
  const { props } = usePage()
  const { params } = useSearchParams(props.location)

  if (lessons.length === 0) return (
    <div className="my-8"><NoData /></div>
  )

  const handleChange = (data) => {
    params.set("lesson_id", data?.active?.[0]?.id)

    router.get(`?${params.toString()}`, {}, {
      preserveScroll: true,
      preserveState: true,
      async: false,
      only: ["lesson", "location"]
    })
  }

  return (
    <div className="mt-4 text-base border-2 p-4">
      <p className="">Daftar Materi</p>
      <Accordion
        labelField="title"
        options={lessons}
        Content={LessonContent}
        onChange={handleChange}
        defaultParams="lesson_id"
        customLabel={(data) => {
          return (
            <div className="flex gap-2 items-center text-sm">
              <LessonTypeIcon type={data?.content_type} />
              <div className="flex-none">
                <p className="max-w-[65vw] md:max-w-[77vw]">{data.title}</p>
                <p className="text-xs text-base-400 font-normal">{data.duration}</p>
              </div>
            </div>
          )
        }}
      />
    </div>
  )
}

const LessonContent = ({ data }) => {
  const { props } = usePage()
  const setShow = useSetAtom(showModalAtom)  

  return (
    <div className="">
      <div className="flex flex-wrap gap-2 mb-2">
        <ModalButton id={`lesson_form_${data?.id}`} onClick={() => setShow(data)} className="btn btn-xs px-2 rounded btn-primary">
          <i className="fas fa-edit"></i>
          Edit Materi
        </ModalButton>
        <ModalButton id={`lesson_delete_${data?.id}`} onClick={() => setShow(data)} className="btn btn-xs px-2 rounded btn-error bg-red-700 text-white">
          <i className="fas fa-trash"></i>
          Hapus Materi
        </ModalButton>
        <ModalButton id={`quiz_form_create`} onClick={() => setShow(null)} className="btn btn-xs px-2 rounded btn-primary">
          <i className="fas fa-plus"></i>
          Tambah Kuis
        </ModalButton>
      </div>
      <div className={`text-gray-600`}>
        <p>{data.description}</p>
      </div>
      {data?.content_type == 'video' && !!data?.video_url ? (
        <div className="w-full max-w-xl">
          <YouTubePlayer url={data?.video_url} title={data?.title} />
        </div>
      ) : null}

      {data?.quizzes?.length > 0 ? (
        <div className="my-4">
          <p>
            <span>Kuis</span>
          </p>
          <div className="flex flex-col gap-2 w-full text-gray-700 max-w-4xl">
            {data?.quizzes.map((quiz, index) => {
              return (
                <Fragment key={index}>
                  <QuizCard quiz={quiz} lesson={data} />
                </Fragment>
              )
            })}
          </div>
        </div>
      ) : null}

      {data?.attachment?.length > 0 ? (
        <div className="my-4">
          <p>
            <i className="fas fa-paperclip pr-2"></i>
            <span>Lampiran</span>
          </p>
          <div className="flex flex-wrap gap-2 w-full text-gray-700 max-w-4xl">
            {data?.attachment.map((file, index) => {
              return (
                <Fragment key={index}>
                  <a target="_blank" href={file.value} className="w-full [&_p]:underline flex gap-2 items-center">
                    <AttachmentContentType type={file.content_type} />
                    <FileUploaderPreview file={file} isRemoveButton={false} wrapperClassName={"text-primary hover:underline text-sm md:text-base font-medium"} />
                  </a>
                </Fragment>
              )
            })}
            {data?.attachment_link?.map((file, index) => {
              return (
                <Fragment key={index}>
                  <a target="_blank" href={file.value} className="w-full [&_p]:underline flex gap-2 items-center">
                    <AttachmentContentType type={file.content_type} />
                    <FileUploaderPreview file={file} isRemoveButton={false} wrapperClassName={"text-primary hover:underline text-sm md:text-base font-medium"} />
                  </a>
                </Fragment>
              )
            })}
          </div>
        </div>
      ) : null}
    </div >
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
      label: "Id Kursus",
      value: "course_id",
    },
    {
      label: "Nama Modul",
      value: "title",
      isSearchable: true,
    },
    {
      label: "Deskripsi",
      value: "description",
      isSearchable: true,
      isDetail: true,
    },
    {
      label: "Thumbnail",
      value: "thumbnail",
      isDetail: true,
    },
    {
      label: "Urutan",
      value: "order",
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

const ModuleIndex = Index
export default ModuleIndex
