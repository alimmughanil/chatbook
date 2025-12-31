import { Link, usePage } from "@inertiajs/react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { useState } from "react"
import Table from "@/Components/Table"
import DeleteModal from "@/Components/Modal/DeleteModal"
import { ModalButton } from "@/Components/WithModal"
import { getDurationDate, useSearchParams } from "@/utlis/format"
import RestoreModal from "@/Components/Modal/RestoreModal"
import DetailModal from "@/Components/Modal/DetailModal"
import DetailModalContent from "@/Components/Default/DetailModalContent"
import RowLabel from "@/Components/RowLabel"
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
            <li>
              <Link href={`/admin/medical_records/create?patient_id=${data?.id}`} className="">
                Rekam Medis
              </Link>
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
      label: 'Nama',
      value: 'name',
      isSearchable: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
      actionUrl: ({ data }) => `/admin/medical_records/create?patient_id=${data?.id}`,
    },
    {
      label: 'Tanggal Lahir',
      value: 'birth_date',
      type: 'date',
      dateFormat: "DD MMMM YYYY",
      isSearchable: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: "Umur",
      value: "age",
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
      isDetail: false,
      isSortable: false,
      custom: ({ data, key, header, defaultClassName }) => {
        return (
          <td key={key} className={`${defaultClassName?.tdBodyClassName} ${header?.className ?? ''}`}>
            <p>{getDurationDate(data.birth_date)}</p>
          </td>
        )
      }
    },
    {
      label: "Umur",
      value: "age",
      isDetail: true,
      custom: ({ data, key, header, defaultClassName }) => {
        return (
          <div key={key}>
            <RowLabel label={header?.label} {...defaultClassName} >
              <p>{getDurationDate(data.birth_date)}</p>
            </RowLabel>
          </div>
        )
      }
    },
    {
      label: 'Jenis Kelamin',
      value: 'gender',
      isSearchable: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: 'No. Hp',
      value: 'phone',
      isSearchable: true,
      className: 'text-[13px] w-[10%] md:w-[100px] !whitespace-pre',
    },
    {
      label: 'Alamat',
      value: 'address',
      isSearchable: true,
      className: 'text-[13px] w-[10%] md:w-[300px] !whitespace-pre',
    },
    {
      label: 'Riwayat Penyakit',
      value: 'medical_history',
      type: 'list',
      isSearchable: true,
      isDetail: true,
    },
    {
      label: 'Alergi Obat',
      value: 'medication_allergy',
      type: 'list',
      isSearchable: true,
      isDetail: true,
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
      name: "deleted_at",
      label: "Filter Data Terhapus",
    },
  ]

  return filterOptions
}

export default Index
