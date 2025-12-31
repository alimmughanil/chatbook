import TextArea from '@/Components/Form/TextArea'
import WithModal from '@/Components/WithModal'
import {router, useForm} from '@inertiajs/react'
import {useRef} from 'react'
import Rating from '@/Components/Form/Rating'

const RatingFormModal = (state) => {
  const {data: order, isAdmin = false, handleClick} = state
  const MODAL_TYPE = `rating_form_${order?.id}`
  const backButtonRef = useRef()

  let feedback = order?.ratings?.length > 0 ? order?.ratings?.[0] : null

  const {data, setData, post, errors, processing} = useForm({
    type: 'rating',
    rating: feedback?.rating ?? 5,
    message: feedback?.message,
    order_id: order?.id,
    product_id: order?.product_id
  })

  function handleChange(e) {
    const {name, value} = e.target

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post(`/app/feedback`, {
      onSuccess: () => {
        router.reload({only: ['order'], async: false})
        backButtonRef.current?.click()
      }
    })
  }

  const inputProps = {handleChange, data, errors}
  const fileTypes = ['PDF', 'ZIP', 'RAR']

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        {isAdmin && !feedback ? (
          <p>Penilaian belum diberikan</p>
        ) : (
          <>
            <div className='flex flex-col items-center justify-center gap-2 mb-2'>
              {isAdmin ? null : <p>Berikan penilaianmu untuk pesanan ini</p>}
              <Rating name='rating' {...inputProps} disabled={!!feedback || isAdmin} />
              <p className='text-sm'>(1 Mengecewakan, 5 Mantap)</p>

              <div className='flex flex-col items-center'>
                {isAdmin ? <p>Penilaian pelanggan</p> : <p>Penilaianmu</p>}
                <p className=''>
                  <i className='fas fa-star text-orange-500 pr-1'></i>
                  <span>{data?.rating}</span>
                </p>
              </div>
            </div>
            <TextArea name='message' placeHolder='Tulis pesanmu disini' className='disabled:bg-white disabled:text-gray-900 disabled:cursor-default' isLabel={false} disabled={!!feedback || isAdmin} {...inputProps} />
          </>
        )}

        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
          {!!feedback || isAdmin ? null : (
            <button onClick={handleSubmit} className={`btn btn-sm btn-neutral`} disabled={processing}>
              <span className={`${processing && 'loading'}`}>Kirim</span>
            </button>
          )}
        </div>
      </form>
    </WithModal>
  )
}

export default RatingFormModal
