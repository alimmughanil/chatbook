import { Link, useForm, usePage } from "@inertiajs/react"
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
import DraggableFeatured from "./Section/DraggableFeatured"
import { useEffect } from "react"
import GroupedBtn from "@/Components/GroupedBtn"

function Index(props) {
  const { isAdmin } = usePage().props
  const location = new URL(props.location)
  const toggleOpt = [{ label: 'Semua Produk', value: 'all' }, { label: 'Atur Featured', value: 'featured' }]
  useEffect(() => {
    setData((state) => ({ ...state, products: props.product.data }))
  }, [props.product.data])
  const { data, setData, post } = useForm({
    ['_method']: 'put',
    products: props.product.data
  })
  const handleSubmitFeatured = () => {
    post('/admin/products');
  }

  if (isAdmin && new URLSearchParams(location.search).get('showProduct') === 'featured') {
    return (
      <AuthenticatedLayout title={props.title}>
        <div className='flex flex-col justify-center gap-4 mt-4'>
          <div className='flex justify-between'>
            <GroupedBtn options={toggleOpt} paramName={"showProduct"} />
            <button onClick={handleSubmitFeatured} className='btn btn-primary btn-sm'>Simpan</button>
          </div>
          <DraggableFeatured setData={setData} products={data.products} />
        </div>
      </AuthenticatedLayout>
    )
  }

  return (
    <AuthenticatedLayout title={props?.title}>
      <TableIndex toggleOpt={toggleOpt} />
    </AuthenticatedLayout>
  )
}

const TableIndex = (tableProps) => {
  let { tableHeader = null, toggleOpt } = tableProps

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
            {data.status == 'review' && props.isAdmin ? (
              <li>
                <ModalButton id={`modal_publish_${data?.id}`} btnLabel={'Publikasi'} onClick={() => handleShow(data)} className="text-green-600 capitalize cursor-pointer" />
              </li>
            ) : null}
          </>
        )}
        headerCenterButton={() => {
          if (!props.isAdmin) return <></>

          return (
            <div className="flex sm:justify-start justify-center my-1 w-full">
              <GroupedBtn options={toggleOpt} paramName={"showProduct"} />
            </div>
          )
        }}
        {...tableProps}
      />

      {show ? (
        <>
          <DeleteModal id={show?.id} label={show.name} isForceDelete={show.deleted_at != null} handleClick={() => handleShow(null)} />
          <RestoreModal id={show?.id} label={show.name} handleClick={() => handleShow(null)} />
          <DetailModal id={show?.id} tableHeader={tableHeader} data={show} handleClick={() => handleShow(null)} content={(data) => DetailModalContent(data, tableHeader)} size="max-w-2xl" />
          <PublishModal data={show} handleClick={() => handleShow(null)} status='publish' />
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
      label: "Nama Produk",
      value: "name",
      isSearchable: true,
      actionUrl: ({ data }) => `/admin/product/${data.id}`,
    },
    {
      label: "Kategori",
      value: "category.name",
    },
    {
      label: "Ditambahkan Oleh",
      value: "user.name",
    },
    {
      label: "Status",
      value: "status",
      type: "status",
      prefix: "product",
    },
    {
      label: "Terakhir Diperbarui",
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
      name: "categories",
      data: props?.categories ?? [],
      label: "Filter Kategori",
    },
    {
      name: "addedBy",
      data: props?.partner ?? [],
      label: "Filter User",
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

const ProductIndex = Index
export default ProductIndex
