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
import { hiddenField } from "@/utlis/useFormBuilder"
import PublishModal from "@/Components/Modal/PublishModal"
import ArchivedModal from "@/Components/Modal/ArchivedModal"
import RatingReviewModal from "@/Components/Modal/RatingReviewModal"
import { useState } from "react"

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
  const [showIndex, setShowIndex] = useState(-1)

  const handleShow = (data) => {
    setShow(data)

    let index = null
    if (data) {
      index = props.courses?.data?.findIndex((course) => course.id == data?.id)
    }

    if (index > -1) {
      setShowIndex(index)
    }
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
              <ModalButton id={`rating_review_${data?.id}`} onClick={() => handleShow(data)} className='flex items-center gap-1 btn btn-sm btn-ghost w-max'>
                <i className='fas fa-star text-orange-500'></i>
                <p>Lihat Review</p>
              </ModalButton>
            </li>
            <li>
              <Link href={`${props?.page?.url}/${data.id}/edit`} className="">
                Edit
              </Link>
            </li>
            <li>
              <ModalButton id={`delete_${data?.id}`} onClick={() => handleShow(data)}>
                Hapus {data.deleted_at ? "Permanen" : ""}
              </ModalButton>
            </li>
            <li>
              <ModalButton id={`publish_${data?.id}`} onClick={() => handleShow(data)} className={"text-green-600"}>
                Publikasikan {props.page?.label ?? ""}
              </ModalButton>
            </li>
            <li>
              <ModalButton id={`archived_${data?.id}`} onClick={() => handleShow(data)} className={"text-red-600"}>
                Arsipkan {props.page?.label ?? ""}
              </ModalButton>
            </li>
          </>
        )}
        {...tableProps}
      />

      {show ? (
        <>
          <DeleteModal id={show?.id} label={show.name} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <RestoreModal id={show?.id} label={show.name} handleClick={() => handleShow(null)} />
          <PublishModal id={show?.id} label={show.name} handleClick={() => handleShow(null)} />
          <ArchivedModal id={show?.id} label={show.name} handleClick={() => handleShow(null)} />
          <DetailModal
            id={show?.id}
            tableHeader={tableHeader}
            data={show}
            handleClick={() => handleShow(null)}
            content={(data) => DetailModalContent(data, tableHeader)}
            size="max-w-2xl"
          />
          <RatingReviewModal data={show} ratings={showIndex > -1 ? props?.courses?.data?.[showIndex]?.ratings : show?.ratings} handleClick={() => handleShow(null)} />
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
      label: "Judul",
      value: "title",
      isSearchable: true,
      actionUrl: ({ data }) => `/admin/courses/${data.id}`,
    },
    {
      label: "Kategori",
      value: "category.name",
    },
    {
      label: "Tipe Pembayaran",
      value: "payment_type",
      isSearchable: true,
      isDetail: true,
    },
    {
      label: "Harga",
      value: "price",
      defaultValue: "0",
      type: "currency",
    },
    {
      label: "Nomor Mulai Peserta",
      value: "participant_start_number",
      isDetail: true,
    },
    {
      label: "Format Nomor Peserta",
      value: "participant_format_number",
      isDetail: true,
    },
    {
      label: "Batas Waktu",
      value: "time_limit",
      prefix: "course",
    },
    {
      label: "Mulai Kursus",
      value: "start_at",
      type: "date",
      isDetail: true,
      customHeader: (props) => hiddenField(props, "time_limit", ["limited"]),
      isHidden: "not null",
    },
    {
      label: "Selesai Kursus",
      value: "close_at",
      type: "date",
      isDetail: true,
      customHeader: (props) => hiddenField(props, "time_limit", ["limited"]),
      isHidden: "not null",
    },
    {
      label: "Mulai Pendaftaran Kursus",
      value: "registration_start_at",
      type: "date",
      isDetail: true,
      customHeader: (props) => hiddenField(props, "time_limit", ["limited"]),
      isHidden: "not null",
    },
    {
      label: "Tutup Pendaftaran Kursus",
      value: "registration_close_at",
      type: "date",
      isDetail: true,
      customHeader: (props) => hiddenField(props, "time_limit", ["limited"]),
      isHidden: "not null",
    },
    {
      label: "Level",
      value: "level",
      prefix: "course",
    },
    {
      label: "Status",
      value: "status",
      type: "status",
      prefix: "course.",
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
    {
      isDetail: true,
      label: "Gambar",
      value: "thumbnail",
      type: "image",
      className: "border p-4 rounded-md",
      wrapperClassName: "flex flex-col",
      isHidden: "not null",
    },
    {
      isDetail: true,
      isSearchable: true,
      label: "Deskripsi",
      value: "description",
      wrapperClassName: "flex flex-col max-w-[85vw] overflow-auto",
      type: "html",
      defaultValue: "-",
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

const CourseIndex = Index
export default CourseIndex
