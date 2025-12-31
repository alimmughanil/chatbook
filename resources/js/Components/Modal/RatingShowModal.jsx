import WithModal from '@/Components/WithModal'
import {useRef} from 'react'
import {dateHumanize, number} from '@/utlis/format'
import {useEffect} from 'react'

const RatingShowModal = (state) => {
  const {data: course, handleClick} = state
  const MODAL_TYPE = `rating_show_${course?.id}`
  const backButtonRef = useRef()
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({behavior: 'smooth'})
    return () => {}
  }, [course])

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-2xl">
      <div>
        <p className='font-semibold text-lg'>Review</p>
        <p className='text-sm opacity-80'>{course.title}</p>
        <div className='h-full max-h-[50vh] mt-4 overflow-auto'>
          {course?.ratings?.length > 0 ? course?.ratings.map((rating, index) => (
            <div key={index} className={'p-2 rounded-lg border text-left bg-white relative'}>
              <div className='flex items-center justify-between'>
                <p>{rating?.user?.name}</p>
                <div className='flex items-center gap-1 text-sm'>
                  <i className='fas fa-star text-orange-500'></i>
                  <p>{number(rating.rating) ?? '-'}</p>
                </div>
              </div>
              <div className='flex justify-between items-start'>
                <p className='text-xs text-gray-500'>{dateHumanize(rating.created_at)}</p>
              </div>
              <div className={`text-sm`}>
                <p>{rating.message ?? ''}</p>
              </div>

              {index + 1 >= course?.ratings?.length ? <div ref={bottomRef} /> : null}
            </div>
          )) : (
            <p>Belum ada data yang dapat ditampilkan</p>
          )}
        </div>

        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} onClick={handleClick} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
        </div>
      </div>
    </WithModal>
  )
}

export default RatingShowModal
