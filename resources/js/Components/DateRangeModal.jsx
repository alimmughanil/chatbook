import WithModal from '@/Components/WithModal'
import { useForm } from '@inertiajs/react'
import { useRef } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import * as dateFnsLocales from "date-fns/locale";
import moment from 'moment';

const DateRangeModal = (state) => {
  const { selectionRange, handleChange, label = null, searchData = null, id = '' } = state
  const MODAL_TYPE = `date_range${id}`
  const backButtonRef = useRef()
  const { get, processing } = useForm()

  const handleSubmit = (e) => {
    e.preventDefault()
    const startDate = moment(selectionRange.startDate).format('YYYY-MM-DD')
    const endDate = moment(selectionRange.endDate).format('YYYY-MM-DD')
    const params = new URLSearchParams()
    params.set('startDate', startDate)
    params.set('endDate', endDate)

    if (searchData && searchData?.searchBy) {
      params.set('searchBy', encodeURIComponent(searchData?.searchBy))
    }

    get(`?${params.toString()}`, {
      preserveState: true,
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} modalBoxSize="w-11/12 max-w-2xl">
      <form action=''>
        {label ? (
          <h1 className='text-lg font-bold'>{label}</h1>
        ) : null}
        <div className="grid justify-center">
          <DateRangePicker
            locale={dateFnsLocales['id']}
            ranges={[selectionRange]}
            onChange={handleChange}
            className='border rounded-lg'
          />
        </div>
        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-primary text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Pilih Tanggal</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default DateRangeModal
