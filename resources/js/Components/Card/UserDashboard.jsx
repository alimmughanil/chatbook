import { currency, isFunction } from '@/utils/format';
import useStatus, { useStatusLabel } from '@/utils/useStatus';
import {
  Folder,
  PlayCircle,
  Award,
  ChevronDown,
  CreditCard,
  Star
} from 'lucide-react';
import { ModalButton } from '../WithModal';
import { useAtom } from 'jotai';
import { showModalAtom } from '@/atoms';

export const EmptyCourse = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 lg:py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <div className="relative mb-4">
        <div className="bg-yellow-100 p-4 rounded-full">
          <Folder size={64} className="text-yellow-500 fill-yellow-500" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
        Belum ada kelas di kategori ini
      </h3>

      <p className="text-gray-500 text-center max-w-sm px-4 text-sm leading-relaxed">
        Jelajahi katalog kami dan pilih kelas yang menarik untuk mulai mencatat progres belajar Anda.
      </p>

      <button className="mt-6 px-6 py-2.5 bg-primary text-white font-medium rounded-md hover:bg-primary transition-colors text-sm shadow-md flex items-center gap-2">
        Cari Kelas Sekarang
      </button>
    </div>
  )
}

export const EmptyData = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 lg:py-20 bg-white rounded-xl border border-dashed border-gray-300">
      <div className="relative mb-4">
        <div className="bg-yellow-100 p-4 rounded-full">
          <Folder size={64} className="text-yellow-500 fill-yellow-500" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
        {message}
      </h3>
    </div>
  )
}

export const CourseCard = ({ course }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* Badge Status (Opsional) */}
        {course.progress === 100 && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
            <Award size={12} /> Selesai
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 text-lg leading-snug mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>

        <div className="mt-auto">
          {/* Progress Info */}
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <PlayCircle size={14} /> {course.completedModules}/{course.totalModules} Modul
            </span>
            <span className="font-semibold text-primary">{course.progress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${course.progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>

          {/* Button */}
          <button className="w-full py-2.5 rounded-lg border border-gray-200 bg-white text-slate-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all">
            {course.progress === 100 ? 'Lihat Sertifikat' : 'Lanjutkan Belajar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CourseCardList = ({ course, onClick = null }) => {
  let progress = course?.progress;
  const [_, setShow] = useAtom(showModalAtom)

  const handleClick = (isModal = false) => {
    if (isModal) {
      setShow(course)
      return
    }

    isFunction(onClick) && onClick(course)
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row w-full cursor-pointer">
      <div onClick={() => handleClick(false)} className="relative h-48 lg:w-72 shrink-0 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

        {progress === 100 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 z-10">
            <Award size={12} /> Selesai
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div onClick={() => handleClick(false)} className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <h3 className="font-bold text-slate-900 lg:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>

            <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md whitespace-nowrap">
              <PlayCircle size={14} />
              {course.lesson_total} Pelajaran
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2 line-clamp-1">
            Terakhir dipelajari: {course.completed_lesson_total} Pelajaran
          </p>
        </div>

        <div>
          <div onClick={() => handleClick(false)} className="flex justify-between items-center text-xs text-gray-500 pb-2">
            <span className="font-medium text-slate-700">Progres Belajar</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <div onClick={() => handleClick(false)} className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex-1">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-primary'}`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {progress === 100 ? (
              <ModalButton onClick={() => handleClick(true)} id={`rating_form_${course.id}`} className={`
              cursor-pointer w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap
              bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100
              flex items-center gap-2
            `}>
                <Star size={16} />
                {course?.ratings?.length > 0 ? (
                  <span>{course?.ratings[0].rating}</span>
                ) : (
                  <span>Berikan Penilaian</span>
                )}
              </ModalButton>
            ) : (
              <button onClick={() => handleClick(false)} className={`
              w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap
              ${progress === 100
                  ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                  : 'bg-primary text-white border-transparent hover:bg-primary/90 shadow-md shadow-primary/20'}
            `}>
                {progress === 100 ? 'Lihat Sertifikat' : 'Lanjutkan'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export const EmptyCourseFilter = () => (
  <div className="flex flex-col items-center justify-center py-12 lg:py-20 bg-white rounded-xl border border-dashed border-gray-300 mt-6">
    <div className="bg-yellow-100 p-4 rounded-full mb-4">
      <Folder size={64} className="text-yellow-500 fill-yellow-500" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2 text-center">
      Belum ada kelas di kategori ini
    </h3>
    <p className="text-gray-500 text-center max-w-sm px-4 text-sm leading-relaxed">
      Coba ganti filter kategori atau mulai cari kelas baru untuk dipelajari.
    </p>
  </div>
);

export const FilterTabMenu = ({ options, onChange, active }) => {
  return (
    <div className="hidden lg:block w-1/4 min-w-[250px]">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-[8.5rem] shadow-sm">
        <div className="flex flex-col">
          {options.map((filter, index) => (
            <button
              key={index}
              onClick={() => onChange(filter.value)}
              className={`
                      text-left px-4 py-3 text-sm font-medium transition-all border-l-4
                      ${active === filter.value
                  ? 'bg-blue-50 border-primary text-primary font-bold'
                  : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export const FilterTabSelect = ({ options, onChange, active }) => {
  return (
    <div className="lg:hidden mb-6 relative">
      <div className="relative">
        <select
          value={active}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full pl-4 pr-10 py-3 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm rounded-lg appearance-none bg-white text-slate-900 shadow-sm"
        >
          {options.map((filter, index) => (
            <option key={index} value={filter.value}>{filter.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  )
}

export const CertificateCardList = ({ item, onClick = null }) => {
  return (
    <div
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row w-full cursor-pointer"
      onClick={() => item.status == 'active' && isFunction(onClick) && onClick(course)}
    >
      <div className="relative h-48 lg:w-72 shrink-0 overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.product_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

        <div
          className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 z-10 ${useStatus(`certificate.${item.status}`)}`}
        >
          <Award size={12} /> {useStatusLabel(`certificate.${item.status}`)}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 lg:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {item.product_name}
          </h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {item.certificate_title}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span className="font-medium text-slate-700">Sertifikat</span>
            <span className="font-bold text-primary capitalize">{useStatusLabel(`certificate.${item.status}`)}</span>
          </div>

          {item.status == 'active' ? (
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
              <button
                onClick={() => onClick(item)}
                className="
                w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap
                bg-primary text-white border-transparent hover:bg-primary/90 shadow-md shadow-primary/20
              "
              >
                Lihat Sertifikat
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const OrderCardList = ({ item, onClick = null }) => {
  return (
    <div
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row w-full cursor-pointer"
      onClick={() => isFunction(onClick) && onClick(item)}
    >
      <div className="relative h-48 lg:w-72 shrink-0 overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.product_name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

        <div
          className={`absolute top-3 left-3 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm flex items-center gap-1 z-10 ${useStatus(`order.${item.status}`)}`}
        >
          <CreditCard size={12} /> {useStatusLabel(`order.${item.status}`)}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="mb-4">
          <h3 className="font-bold text-slate-900 lg:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            Pesanan #{item.order_number}
          </h3>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {item.product_name}
          </p>

          <p className="text-xs text-gray-400 mt-1">
            Total: <span className="font-semibold text-slate-700">{currency(item.price_total)}</span>
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span className="font-medium text-slate-700">Status Pembayaran</span>
            <span className="font-bold text-primary capitalize">{useStatusLabel(`payment.${item?.payment?.status ?? item?.status}`)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <button
              onClick={() => onClick(item)}
              className="
                w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap
                bg-primary text-white border-transparent hover:bg-primary/90 shadow-md shadow-primary/20
              "
            >
              Lihat Detail Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TransactionCardList = ({ item, onClick = null }) => {
  return (
    <div
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col md:flex-row w-full cursor-pointer"
      onClick={() => isFunction(onClick) && onClick(item)}
    >
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div className="mb-4">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-slate-900 lg:text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {item.shop_name || 'Transaksi'} {item.description ? `- ${item.description}` : ''}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {item.type === 'income' ? 'Masuk' : 'Keluar'}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {item.category?.name ?? 'Tanpa Kategori'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {item.date}
          </p>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
            <span className="font-bold text-lg text-slate-700">{currency(item.amount)}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <button
              onClick={() => onClick(item)}
              className="
                w-full sm:w-auto px-6 py-2 rounded-lg text-sm font-semibold transition-all border whitespace-nowrap
                bg-primary text-white border-transparent hover:bg-primary/90 shadow-md shadow-primary/20
              "
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
