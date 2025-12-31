import { Link, router, usePage } from '@inertiajs/react'
import FilterItem from './FilterItem'
import WithModal from '@/Components/WithModal'
import { useRef } from 'react'
import { useSearchParams } from '@/utils/format'

const FilterCard = () => {
  const { props } = usePage()

  return (
    <div className="hidden sm:block w-full sm:max-w-xs 2xl:max-w-md 2xl:px-8 bg-white h-max sm:px-4 pt-4 pb-8 rounded-lg">
      <div className="flex w-full justify-between items-center">
        <p><ButtonLabel /></p>
        {props.filter ? (
          <Link href='/' className='btn btn-xs btn-outline'>Reset Filter</Link>
        ) : null}
      </div>
      <FilterItem />
    </div>
  )
}

export const FilterModal = (props) => {
  const { handleClick, ButtonLabel = null, buttonLabel = "Filter", isButton = true, options } = props
  const MODAL_TYPE = `filter`
  const backButtonRef = useRef()

  return (
    <WithModal type={MODAL_TYPE} modalBoxSize='p-0' backdrop={true} onClick={handleClick} >
      <div className="p-4">
        {ButtonLabel ? (
          <ButtonLabel />
        ) : (
          <span className='text-lg font-semibold'><i className='fas fa-filter opacity-70 pr-2'></i> {buttonLabel}</span>
        )}

        <FilterItem options={options} isButton={isButton} />

        <div className="grid justify-center mt-4">
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='underline cursor-pointer'>
            <span className="btn btn-sm btn-circle btn-neutral absolute right-4 top-4">✕</span>
          </label>
        </div>
      </div>
    </WithModal>
  )
}

export function ButtonLabel() {
  return (
    <span className='text-lg font-semibold'><i className='fas fa-filter opacity-70 pr-2'></i> Filter</span>
  )
}

export function filterResetAction(e, location, filters) {
  e.preventDefault()  
  const { params } = useSearchParams(location)  

  for (const filter of filters) {
    params.delete(filter)
  }



  return router.get(`?${params.toString()}`)
}

export default FilterCard