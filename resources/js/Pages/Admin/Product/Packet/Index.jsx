import {Link, router, usePage} from '@inertiajs/react'
import ProductDetailForm from './Form/ProductDetailForm'
import {useState} from 'react'
import {currency} from '@/utils/format'
import DeleteModal from './Modal/DeleteModal'
import useStatus, {useStatusLabel} from '@/utils/useStatus'

function Index() {
  const {location, isAdmin} = usePage().props
  const params = new URLSearchParams(new URL(location).search)
  const [productDetail, setProductDetail] = useState(null)
  const isForm = params.has('create') || params.has('edit')

  return (
    <div className='flex flex-col justify-center gap-4'>
      {isAdmin && (
        <Link href='?show=packet&create=true' className='mx-auto btn btn-sm btn-neutral w-max'>
          Tambah Paket
        </Link>
      )}

      {params.get('create') ? <ProductDetailCreate /> : null}
      {productDetail ? <ProductDetailEdit productDetail={productDetail} params={params} /> : null}
      {!isForm ? <ProductDetailIndex setProductDetail={setProductDetail} /> : null}
    </div>
  )
}

function ProductDetailIndex({setProductDetail}) {
  const {productDetail, isAdmin} = usePage().props

  const handleEdit = (productDetail) => {
    setProductDetail(productDetail)
    router.visit('?show=packet&edit=true', {
      method: 'get',
      preserveScroll: true,
      preserveState: true
    })
  }

  return (
    <div className='grid gap-5 md:grid-cols-3'>
      {productDetail.length == 0 ? (
        <p>Belum ada paket yang ditambahkan</p>
      ) : (
        productDetail.map((productDetail, index) => (
          <div key={index} className='relative w-full mx-auto border-2 card h-max bg-base-100'>
            {!productDetail.thumbnail ? null : (
              <figure>
                <img src={productDetail.thumbnail} alt={productDetail.name} className='rounded-lg w-full h-full max-h-[15rem] object-cover' />
              </figure>
            )}
            <div className='px-4 pt-2 pb-4'>
              <p className='font-bold'>{productDetail?.name}</p>
              <p className=''>{currency(productDetail?.price)}</p>
              <div className='flex gap-1'>
                <div className={`badge capitalize ${useStatus(productDetail.status)}`}>{useStatusLabel(productDetail.status)}</div>
                {productDetail?.is_custom == 1 ? <div className='badge badge-primary'>Custom</div> : null}
              </div>
              <div className=''>
                <details className='bg-white collapse collapse-arrow'>
                  <summary className='font-medium collapse-title text-md'>Lihat Deskripsi</summary>
                  <div className='collapse-content'>
                    <div className='' dangerouslySetInnerHTML={{__html: productDetail.description}}></div>
                  </div>
                </details>
              </div>
            </div>
            {isAdmin && (
              <div className='flex justify-center gap-1 pb-4'>
                <button onClick={() => handleEdit(productDetail)} className='text-white bg-blue-600 btn btn-sm hover:bg-blue-700'>
                  Edit
                </button>
                <DeleteModal data={productDetail} btnLabel='Hapus' btnClassName='btn btn-sm bg-red-600 hover:bg-red-700 text-white' />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
function ProductDetailCreate() {
  const {product} = usePage().props

  return (
    <div className='grid justify-center'>
      <ProductDetailForm product={product} />
    </div>
  )
}
function ProductDetailEdit({productDetail}) {
  const {product} = usePage().props

  return (
    <div className='grid justify-center'>
      <ProductDetailForm product={product} productDetail={productDetail} />
    </div>
  )
}

export default Index
