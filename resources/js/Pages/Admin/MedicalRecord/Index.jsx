import { Link, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useState } from "react"
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
  const tableHeader = useTableHeader()
  const filterOptions = useFilterOptions()

  const [show, setShow] = useAtom(showModalAtom)
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
        headerButton={() => (
          <>
            <Link href={`${props?.page?.url}/create`} className="btn btn-primary w-max btn-sm text-white">
              Tambah {props?.page?.label}
            </Link>
          </>
        )}
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

export const useTableHeader = () => {
  const { page, isAdmin, location } = usePage().props
  const { params } = useSearchParams(location)

  const header = [
    {
      label: "#",
      value: "id",
      type: "numbering",
    },
    {
      label: "Dokter",
      value: "doctor.name",
      isSearchable: true,
      isModalDetail: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: "Pasien",
      value: "patient.name",
      isSearchable: true,
      isModalDetail: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: "Tanggal",
      value: "date",
      type: "date",
      dateFormat: "DD MMM YYYY",
      isSearchable: true,
      isModalDetail: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: "Keluhan",
      value: "complaint",
      isSearchable: true,
      isModalDetail: true,
      type: "list",
      className: 'text-[13px] w-[10%] md:w-[200px] !whitespace-pre',
    },
    {
      label: "Keterangan",
      value: "note",
      isSearchable: true,
      isModalDetail: true,
      type: "list",
      className: 'text-[13px] w-[10%] md:w-[200px] !whitespace-pre',
    },
    {
      label: "Tindakan",
      value: "treatment",
      isSearchable: true,
      isModalDetail: true,
      type: "list",
      className: 'text-[13px] w-[10%] md:w-[200px] !whitespace-pre',
    },
    {
      label: "Ditambahkan",
      value: "created_at",
      type: "date",
      isSearchable: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: "Diperbarui",
      value: "updated_at",
      type: "date",
      isSearchable: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: "Aksi",
      value: "action",
      type: "action",
      isSortable: false,
    },
  ]

  return header
}

const useFilterOptions = () => {
  const { props } = usePage()
  const filterOptions = [
    {
      name: "doctor_id",
      data: props?.doctor_id,
      label: "Filter Dokter",
      isReactSelect: true,
    },
    {
      name: "institute",
      data: props?.institute,
      label: "Filter Instansi Dokter",
      isReactSelect: true,
    },
    {
      name: "patient_id",
      data: props?.patient_id,
      label: "Filter Pasien",
      isReactSelect: true,
    },
  ]

  return filterOptions
}

export default Index
