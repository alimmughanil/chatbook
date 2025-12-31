import { currency, date, getDurationTotal } from '@/utlis/format'
import useLang from '@/utlis/useLang';
import { Award, BookCopy, BookOpen, Clock, FileQuestion, GraduationCap, PlaySquare } from 'lucide-react';
import moment from 'moment';
import { useState } from 'react';

const CourseCard = ({ course }) => {
  let imageDefault = '/image/default_image.svg'
  let imageCover = course?.thumbnail ?? imageDefault

  const [imageError, setImageError] = useState(imageCover == imageDefault);
  let isClosed = false
  if (course.time_limit == 'limited') {
    isClosed = moment(course.close_at).diff(moment(), 'minutes') < 0
  }

  const courseTime = moment(course.start_at).format('HH:mm')
  return (
    <a href={`/course/${course.slug}`} key={course.id} className="flex flex-col p-[8px] sm:p-[16px] rounded-[8px] max-w-[30rem] relative" style={{ border: '1px solid rgba(216, 216, 216, 1)' }}>
      <div className="flex-1">
        <div className={`aspect-[16/9] overflow-hidden`}>
          <img
            src={imageError ? imageDefault : imageCover}
            alt={course.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="">
          <p className="text-main-blue lg:text-base text-[12px] mt-[6px] sm:mt-[16px] text-ellipsis overflow-hidden ... line-clamp-2">
            {course.title}
          </p>
          {course.time_limit == 'limited' && !!course.start_at ? (
            <div className="grid md:grid-cols-2 grid-cols-1 gap-[4px] sm:gap-[16px] mt-[8px] sm:mt-[16px]" >
              <div className="flex items-center">
                <img
                  src="/assets/icons/Calendar.svg"
                  className="w-[12px] lg:w-[24px] mr-[8px]"
                />
                <p className="text-main-gray lg:text-[14px] text-[10px]">
                  {date(course.start_at)}
                </p>
              </div>
              <div className="flex items-center">
                <img
                  src="/assets/icons/Time Circle.svg"
                  className="w-[12px] lg:w-[24px] mr-[8px]"
                />
                <p className="text-main-gray lg:text-[14px] text-[10px]">{courseTime}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center">
          <GraduationCap className="w-[20px] mr-[8px] sm:mr-[12px]" strokeWidth={2} />
          <p className="text-main-gray lg:text-sm text-[12px] ">
            Level: {useLang(`course.${course.level}`)}
          </p>
        </div>

        <div className="flex items-center">
          <BookOpen className="w-[20px] mr-[8px] sm:mr-[12px]" strokeWidth={2} />
          <p className="text-main-gray lg:text-sm text-[12px]">
            {course?.modules_count ?? 0} Modul
          </p>
        </div>

        <div className="mx-auto lg:mx-0">
          <button type="button" class="bg-success text-[14px] text-white sm:px-[24px] px-[12px] lg:py-[10px] py-[6px] rounded-[10px] mt-[10px] cursor-pointer">
            Lihat Kursus
          </button>
        </div>
      </div>

      <p className='absolute top-0 right-0'>
        <span className="rounded-md lg:rounded-lg bg-tag-free px-[20px] py-[6px] lg:py-[8px] text-main-black font-normal lg:font-medium text-xs lg:text-sm">
          {course?.price > 0 ? currency(course.price) : "Gratis"}
        </span>
      </p>
    </a>
  )
}

export const CourseDetailCard = ({ course, title = null, children, wrapperImageClassName = "aspect-[16/9] overflow-hidden" }) => {
  let imageDefault = '/image/default_image.svg'
  let imageCover = course?.thumbnail ?? imageDefault
  const [imageError, setImageError] = useState(imageCover == imageDefault);

  const courseTime = moment(course.start_at).format('HH:mm')
  return (
    <>
      {title ? (
        <p className='text-center font-semibold md:text-lg capitalize my-4'>{title}</p>
      ) : null}

      <div className='mx-auto'>
        <div className={wrapperImageClassName}>
          <img
            src={imageError ? imageDefault : imageCover}
            alt={course.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
          />
        </div>
      </div>


      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600 sm:gap-[16px] mt-[8px] sm:mt-[16px]">
        {!!course?.total_modules && <span className='flex items-center gap-1.5'><BookCopy size={20} /> {course?.total_modules} Modul</span> }
        {!!course?.total_duration_seconds && <span className='flex items-center gap-1.5'><Clock size={20} /> {getDurationTotal(course?.total_duration_seconds)}</span> }
        {!!course?.total_video_lessons && <span className='flex items-center gap-1.5'><PlaySquare size={20} /> {course?.total_video_lessons} Video</span> }
        {!!course?.total_assessment && <span className='flex items-center gap-1.5'><FileQuestion size={20} /> {course?.total_assessment} Kuis</span> }
        {course.certificate && <span className='flex items-center gap-1.5'><Award size={20} /> Sertifikat</span>}
      </div>

      {children}
    </>
  )
}

export default CourseCard
