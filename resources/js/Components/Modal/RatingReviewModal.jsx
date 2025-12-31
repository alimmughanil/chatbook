import WithModal from '@/Components/WithModal'
import { Link, router, usePage } from '@inertiajs/react'
import { useRef } from 'react'
import { dateHumanize, number } from '@/utlis/format'
import { useEffect } from 'react'
import useStatus, { useStatusLabel } from '@/utlis/useStatus'

const RatingReviewModal = (state) => {
  const { data: course, ratings, handleClick } = state
  const MODAL_TYPE = `rating_review_${course?.id}`
  const backButtonRef = useRef()
  const bottomRef = useRef(null)
  const { isAdmin } = usePage().props

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    return () => { }
  }, [course])

  const handleSuccessUpdate = () => {
    router.reload({
      only: ['courses'],
      async: false
    })
  }

  const statusUpdateProps = {
    async: false,
    method: 'put',
    preverseState: true,
    preverseScroll: true,
    onSuccess: handleSuccessUpdate,
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <div>
        <p className='font-semibold text-lg'>Review</p>
        <p className='text-sm opacity-80'>{course.title}</p>
        <div className='h-full max-h-[50vh] overflow-auto'>
          {ratings?.length > 0 ? ratings.map((rating, index) => (
            <div key={index} className={'p-2 rounded-lg border text-left bg-white relative'}>
              <div className='flex items-center justify-between'>
                <p>{rating?.user?.name}</p>
                <div className='flex items-center gap-1 text-sm'>
                  <i className='fas fa-star text-orange-500'></i>
                  <p>{number(rating.rating) ?? '-'}</p>
                  {isAdmin ? (
                    <div className='dropdown dropdown-left'>
                      <div tabIndex={0} role='button' className='m-1 btn btn-ghost btn-sm'>
                        <i className='fas fa-ellipsis-vertical'></i>
                      </div>
                      <ul tabIndex={0} className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box'>
                        <li>
                          {rating.status == 'hidden' ? (
                            <Link {...statusUpdateProps} href={`/admin/course/${rating?.course_id}/feedback/${rating.id}?status=sent`}>
                              Tampilkan
                            </Link>
                          ) : (
                            <Link {...statusUpdateProps} href={`/admin/course/${rating?.course_id}/feedback/${rating.id}?status=hidden`}>
                              Sembunyikan
                            </Link>
                          )}
                        </li>
                      </ul>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className='flex justify-between items-start'>
                <p className='text-xs text-gray-500'>{dateHumanize(rating.created_at)}</p>
                {rating.status == 'hidden' ? <div className={`capitalize badge ${useStatus('feedback.' + rating?.status)}`}>{useStatusLabel('feedback.' + rating?.status)}</div> : null}
              </div>
              <div className={`text-sm`}>
                <p>{rating.message ?? ''}</p>
              </div>

              {index + 1 >= ratings?.length ? <div ref={bottomRef} /> : null}
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

export default RatingReviewModal
