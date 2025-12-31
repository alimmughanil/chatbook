import WithModal from '@/Components/WithModal'
import { useRef } from 'react'
import DetailModalItem from '../Default/DetailModalItem'
import { usePage } from '@inertiajs/react'

const DetailModal = (state) => {
  const { id, data = null, tableHeader, content = null, handleClick, size='' } = state
  const {props} = usePage()
  const MODAL_TYPE = `detail_${id}`
  const backButtonRef = useRef()

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize={size}>
      <form action=''>
        <h1 className='text-lg font-bold'>Detail {props.page?.label}</h1>

        <div className="">
          {!!data && !!content && typeof content === 'function' ? content(data) : (
            <DetailModalItem data={data} tableHeader={tableHeader} />
          )}
        </div>
        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
        </div>
      </form>
    </WithModal>
  )
}

export default DetailModal
