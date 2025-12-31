import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { useEffect, useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { dateTime, useSearchParams } from '@/utils/format'
import useStatus, { useStatusLabel } from '@/utils/useStatus'
import DeleteModal from './Modal/DeleteModal'
import PacketIndex from './Packet/Index'
import DeleteThumbnailModal from './Modal/DeleteThumbnailModal'
import AddImageModal from './Modal/AddImageModal'

function Show(props) {
  const { product, auth, location } = props;

  const { params } = useSearchParams(location)
  const show = params.get('show') || 'detail';

  const isPublish = product.status === 'publish';
  const isReview = product.status === 'review';
  const isAdmin = auth.user.role === 'admin';

  const targetStatus = isPublish ? 'unpublish' : 'publish';

  let statusLabel = targetStatus;
  if (isReview) {
    statusLabel = isAdmin ? 'publish' : 'review';
  }

  const isReviewProcess = isReview && !isAdmin;

  const updateStatus = (e) => {
    e.preventDefault();
    router.put(`/admin/product/${product.id}`, { update_status: targetStatus });
  };

  return (
    <AuthenticatedLayout title={props.title} auth={props.auth}>
      <div className='relative w-full gap-4 p-4 mt-4 border rounded-lg'>
        <NavbarButton params={params} />

        {show == 'detail' && <ShowDetail />}
        {show == 'packet' && <PacketIndex />}
        <div className='absolute top-4 right-4'>
          <button disabled={isReviewProcess} onClick={updateStatus} className={`btn btn-sm capitalize ${useStatus(statusLabel)} disabled:text-gray-700`}>
            {useStatusLabel(`${props.auth?.user?.role}.product.action.${statusLabel}`)}
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}

const NavbarButton = ({ params }) => {
  const show = params.get('show') ?? 'detail'

  return (
    <div className='flex gap-2 mb-4 overflow-auto scrollbar-none'>
      <Link href={'?show=detail'} className={`btn btn-sm btn-primary text-white ${show == 'detail' ? '' : 'btn-outline'}`}>
        Detail
      </Link>
      <Link href={'?show=packet'} className={`btn btn-sm btn-primary text-white ${show == 'packet' ? '' : 'btn-outline'}`}>
        Paket
      </Link>
    </div>
  )
}
const ShowDetail = () => {
  const { product, tags, productDetail, images, isAdmin } = usePage().props
  const adminProperty = ['Featured']
  const properties = [
    {
      type: 'text',
      label: 'Nama produk',
      value: product.name
    },
    {
      type: 'text',
      label: 'Kategori produk',
      value: product.category?.name
    },
    {
      type: 'text',
      label: 'Tag',
      value: tags
    },
    {
      type: 'text',
      label: 'Featured',
      value: product.is_featured == 1 ? 'Ya' : 'Tidak'
    },
    {
      type: 'text',
      label: 'Dibuat',
      value: dateTime(product.created_at)
    },
    {
      type: 'text',
      label: 'Terakhir diperbarui',
      value: dateTime(product.updated_at)
    },
    {
      type: 'text',
      label: 'Status',
      value: product.status
    }
  ]

  return (
    <div className='flex flex-col gap-1'>
      <div className='flex flex-wrap gap-4'>
        <ShowThumbnail product={product} images={images} productDetail={productDetail} deleteButton={isAdmin} />
        <div className='flex-1'>
          <div className='flex flex-col gap-2'>
            {properties.map((property, i) => {
              if (property.type != 'text') return
              if (!isAdmin && adminProperty.includes(property.label)) return

              return (
                <div key={i} className='grid py-1 capitalize lg:grid-cols-12 sm:py-0'>
                  <p className='col-span-4 font-semibold whitespace-pre lg:col-span-3 2xl:col-span-2'>{property.label}</p>
                  {property.label != 'Status' && property.label != 'Tag' ? <p className='col-span-6'>{property.value}</p> : null}
                  {property.label == 'Status' ? <div className={`capitalize badge col-span-6 ${useStatus(property.value)}`}>{useStatusLabel(property.value)}</div> : null}
                  {property.label == 'Tag' ? <div className='flex flex-wrap w-full col-span-8 gap-1'>{property.value.length == 0 ? <p>-</p> : property.value.map((tag) => <div className={`capitalize badge badge-neutral`}>{tag.title}</div>)}</div> : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {isAdmin && (
        <div className='flex justify-center gap-1'>
          <Link href={`/admin/product/${product.id}/edit`} className='text-white bg-blue-600 btn btn-sm hover:bg-blue-700'>
            Edit
          </Link>
          <DeleteModal data={product} btnLabel='Hapus' btnClassName='btn btn-sm bg-red-600 hover:bg-red-700 text-white' />
        </div>
      )}
    </div>
  )
}

export const ShowThumbnail = ({ product, images, productDetail, deleteButton = false, isFull = false }) => {
  const [thumbnail, setThumbnail] = useState({
    src: product.thumbnail ?? null,
    alt: product.name ?? null,
    id: product.id ?? null,
    link: product.link ?? null,
    type: 'product',
    assetType: 'file',
    youtubeId: null
  })

  useEffect(() => {
    if (!thumbnail.src && productDetail.length > 0) {
      const detail = productDetail.filter((detail) => detail.thumbnail != null)
      if (detail.length > 0) {
        handleChangeThumbnail(detail[0])
      }
    }
    return () => { }
  }, [thumbnail])

  const handleChangeThumbnail = (data, type = 'detail') => {
    if (data?.thumbnail || data?.file) {
      setThumbnail((state) => ({
        ...state,
        src: data?.file,
        alt: type == 'image' ? '' : data?.name,
        id: data?.id,
        link: data?.link,
        type: type,
        assetType: data.type,
        youtubeId: data.youtubeId ?? null
      }))
    }
  }

  return (
    <div className='flex flex-col gap-2'>
      {!thumbnail?.src ? null : (
        <div className='relative'>
          {deleteButton && (
            <>
              <AddImageModal data={product} btnClassName='btn btn-sm btn-circle absolute top-2 right-12' />
              <DeleteThumbnailModal data={thumbnail} btnClassName='btn btn-sm btn-circle absolute top-2 right-2' />
            </>
          )}
          {thumbnail.link && thumbnail.assetType != 'youtube' ? (
            <div className='absolute z-50 left-1 top-1'>
              <a href={thumbnail.link} target='__blank'>
                <i className='text-blue-600 fas fa-globe fa-2x'></i>
              </a>
            </div>
          ) : null}
          {thumbnail.youtubeId ? (
            <iframe
              className='rounded-lg'
              width='400'
              height='315'
              src={`https://www.youtube.com/embed/${thumbnail.youtubeId}`}
              title='YouTube video player'
              frameborder='0'
              allow='fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              allowfullscreen
            ></iframe>
          ) : (
            <figure>
              <img src={thumbnail.src} alt={thumbnail.alt} className={`rounded-lg w-full ${isFull ? 'max-h-[36rem]' : 'max-w-sm max-h-[20rem]'} object-cover`} />
            </figure>
          )}
        </div>
      )}
      <div className='flex flex-wrap w-full max-w-sm gap-2'>
        {images.length == 0
          ? null
          : images.map((image, index) => (
            <button key={index} onClick={() => handleChangeThumbnail(image, image.ref)} className='relative'>
              {image.link ? (
                <div className='absolute z-50 left-1 top-1'>
                  {image.type == 'youtube' ? (
                    <i className='text-red-600 fab fa-youtube fa-2x'></i>
                  ) : (
                    <a href={image.link} target='__blank'>
                      <i className='text-blue-600 fas fa-globe fa-2x'></i>
                    </a>
                  )}
                </div>
              ) : null}
              <img src={image.file} alt={image?.name ?? ''} className={`rounded-lg ${isFull ? 'w-40 sm:w-52 h-36' : 'w-20 h-20'} object-cover border shadow-md ${thumbnail?.src == image.file ? 'border-primary shadow-sm' : ''}`} />
            </button>
          ))}
      </div>
    </div>
  )
}

export default Show
