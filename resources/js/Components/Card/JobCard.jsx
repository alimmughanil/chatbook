import { currency, htmlToString } from '@/utlis/format';
import { useState } from 'react';

const JobCard = ({ job, isPoster = true }) => {
  const detailIcons = {
    work_type: '/assets/icons/news.svg',
    experience: '/assets/icons/case.svg',
    work_policy: '/assets/icons/location.svg',
    salary: '/assets/icons/usd.svg',
  };

  let salary = job.salary_min
  if (!!salary) {
    salary = currency(salary)
  }
  if (salary && !!job.salary_max) {
    salary += `- ${currency(job?.salary_max)}`
  }
  if (salary && !!job.salary_type) {
    salary += ` (${job?.salary_type})`
  }

  let imageDefault = '/image/default_image.svg'
  let imageCover = job?.poster ?? imageDefault

  const [imageError, setImageError] = useState(imageCover == imageDefault);

  return (
    <div
      className="flex flex-col p-[8px] sm:p-[16px] rounded-[8px] max-w-[30rem]"
      style={{ border: '1px solid rgba(216, 216, 216, 1)' }}
    >
      {isPoster && !!job?.poster ? (
        <a href={`/job/${job.slug}`}>
          <img
            src={imageError ? imageDefault : imageCover}
            onError={() => setImageError(true)}
            alt={job.title}
            className="w-full h-full sm:h-[28rem] object-cover rounded-[4px]"
          />
        </a>
      ) : null}
      {job?.is_pin ? (
        <span className="absolute top-0 left-0 z-10 text-white capitalize bg-red-700 badge">
          Pin
        </span>
      ) : null}
      <a href={`/job/${job.slug}`}>
        <div className="flex justify-between">
          <button
            className="rounded-full linear-gradient-red px-[8px] sm:px-[20px] py-[2px] sm:py-[6px] text-white font-normal lg:font-normal text-[10px] lg:text-[12px] mt-[16px]"
          >
            {job?.company?.name}
          </button>
        </div>
        <p
          className="text-main-red lg:text-[20px] text-[12px] font-medium mt-[6px] sm:mt-[8px]"
        >
          {job.title}
        </p>
        {!!job.description ? (
          <div dangerouslySetInnerHTML={{ __html: htmlToString(job.description) }} className="text-editor-content [&_*]:text-sm text-main-gray lg:text-[14px] text-[10px] mt-[4px] text-ellipsis overflow-hidden ... line-clamp-3">
          </div>
        ) : null}
        <div
          className="grid grid-cols-1 gap-[4px] sm:gap-[16px] mt-[8px] sm:mt-[16px]"
        >
          {job.main_detail.map((detail, detailIndex) => {
            return (
              <div key={detailIndex} className="flex items-center">
                <img
                  src={detailIcons[detail.type]}
                  className="w-[12px] lg:w-[24px] mr-[4px] sm:mr-[8px]"
                  alt={detail.type}
                />
                <p className="text-black-main lg:text-[14px] text-[10px]">
                  {detail.value}
                </p>
              </div>
            )
          })}

          {!!salary ? (
            <div className="flex items-center">
              <img
                src={detailIcons['salary']}
                className="w-[12px] lg:w-[24px] mr-[4px] sm:mr-[8px]"
                alt={'salary'}
              />
              <p className="text-black-main lg:text-[14px] text-[10px]">
                {salary}
              </p>
            </div>
          ) : null}

        </div>
      </a>
      <div className="mx-auto lg:mx-0 pt-8 mt-auto">
        <a
          href={`/job/${job.slug}`}
          type="button"
          className="linear-gradient-blue lg:text-[14px] text-[10px] text-white sm:px-[24px] px-[12px] lg:py-[14px] py-[6px] rounded-[10px] mt-[16px] cursor-pointer"
        >
          Lihat Detail Lowongan
        </a>
      </div>
    </div>
  )
}

export default JobCard