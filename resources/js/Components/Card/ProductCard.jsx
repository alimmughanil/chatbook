import { currency } from '@/utils/format'
import { Star, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const imageDefault = '/image/default_image.svg'
  const imageCover = product?.thumbnail ?? imageDefault
  const [imageError, setImageError] = useState(imageCover === imageDefault);

  const user = product?.assignedUser ?? product?.user ?? {
    name: 'Freelancer',
    picture: null,
    username: null,
  };

  const avatarUrl = user?.picture ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
  const location = user?.profile?.country ?? null;
  const category = product?.category?.name;

  const rating = product?.rating ? Number(product.rating).toFixed(1) : null;
  const reviews = product?.reviews_count ?? 0;

  return (
    <div
      key={product.id}
      className="group flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 w-full max-w-[24rem] overflow-hidden "
    >
      <a href={`/service/${product.slug}`} className="relative aspect-[16/10] overflow-hidden block">
        <img
          src={imageError ? imageDefault : imageCover}
          alt={product?.name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-gray-700 shadow-sm">
            {category}
          </div>
        )}
      </a>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <a href={user?.username ? `/u/${user?.username}` : '#'} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1 -ml-1 transition-colors z-10">
            <img
              src={avatarUrl}
              alt={user.name}
              className="w-6 h-6 rounded-full object-cover border border-gray-200"
            />
            <div className="flex flex-col">
              <p className="text-xs text-gray-700 font-medium truncate max-w-[100px]">
                {user.name}
              </p>
              {!!location ? (
                <div className="flex items-center text-[10px] text-gray-400">
                  <MapPin size={10} className="mr-0.5" />
                  {location}
                </div>
              ) : null}
            </div>
          </a>

          {rating && (
            <div className='flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md'>
              <Star size={12} fill="currentColor" />
              <span className="text-xs font-bold text-gray-800">{rating}</span>
              <span className="text-gray-400 text-[10px]">({reviews})</span>
            </div>
          )}
        </div>

        <a href={`/service/${product.slug}`} className="block">
          <h3 className="text-main-black font-bold text-[15px] leading-snug line-clamp-2 mb-2 group-hover:text-[#6017BE] transition-colors">
            {product?.name}
          </h3>
        </a>

        <div className="flex-1"></div>
        <div className="h-px w-full bg-gray-50 my-3"></div>

        <a href={`/service/${product.slug}`} className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Mulai dari</span>
            <p className="text-[#6017BE] font-bold text-lg">
              {product?.price > 0 ? currency(product.price) : "Hubungi Kami"}
            </p>
          </div>
          <div className="text-gray-400 hover:text-[#6017BE] transition-colors">
            <span className="text-xs font-medium">Lihat Detail</span>
          </div>
        </a>
      </div>
    </div>
  )
}

export const ProductDetailCard = ({ service, title = null, children, wrapperImageClassName = "aspect-[16/9] overflow-hidden rounded-xl shadow-md" }) => {
  const imageDefault = '/image/default_image.svg'
  const imageCover = service?.thumbnail ?? imageDefault
  const [imageError, setImageError] = useState(imageCover === imageDefault);

  const rating = service?.rating ? Number(service.rating).toFixed(1) : '4.9';
  const orders = service?.orders_count ?? 0;
  const duration = service?.duration ?? 1;

  return (
    <>
      {title ? (
        <h1 className='text-left font-bold text-2xl md:text-3xl text-gray-900 mb-6'>{title}</h1>
      ) : null}

      <div className='w-full mb-6'>
        <div className={wrapperImageClassName}>
          <img
            src={imageError ? imageDefault : imageCover}
            alt={service?.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
        <div className="flex items-center gap-3 pr-6 border-r border-gray-200">
          <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
            <Star size={20} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-none">{rating}</span>
            <span className="text-xs text-gray-500 font-medium">Rating</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pr-6 border-r border-gray-200">
          <div className="p-2 bg-green-100 rounded-full text-green-600">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-none">{orders}+</span>
            <span className="text-xs text-gray-500 font-medium">Pesanan Selesai</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full text-blue-600">
            <Clock size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 text-lg leading-none">{duration} Hari</span>
            <span className="text-xs text-gray-500 font-medium">Estimasi Kerja</span>
          </div>
        </div>
      </div>

      <div className="prose max-w-none text-gray-600 leading-relaxed">
        {children}
      </div>
    </>
  )
}

export default ProductCard