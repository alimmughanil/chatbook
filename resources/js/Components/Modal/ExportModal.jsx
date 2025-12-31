import WithModal from '@/Components/WithModal'
import useFormBuilder from '@/utils/useFormBuilder'
import { usePage } from '@inertiajs/react'
import { useRef } from 'react'
import { FormProperty } from '../FormBuilder'

const ExportModal = (state) => {
  const { id, data = {}, content = null, handleClick = null } = state
  const MODAL_TYPE = `export_${id}`
  const { page } = usePage().props

  const backButtonRef = useRef()

  let getProperties = () => { }

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const { data } = form

    const filteredEntries = Object.entries(data).filter(([key, value]) => value !== null && value !== '' && value !== undefined);
    const filteredData = Object.fromEntries(filteredEntries);
    const queryParams = new URLSearchParams(filteredData).toString();
    window.location.href = `/admin/export?${queryParams}`;
  }

  const initialData = {
    ...data,
    page_name: page?.name,
    export: '1',
  }

  const formConfig = { isEdit: false, getProperties, onSubmit: handleSubmit, initialData }
  const builderProps = useFormBuilder(formConfig)

  const { processing } = builderProps.form
  const { properties, inputProps } = builderProps

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalClassName="z-[999]">
      <form action=''>
        <h1 className='text-lg font-bold'>Konfirmasi</h1>
        <div className="">
          {!!data && !!content && typeof content === 'function' && content(data)}
        </div>

        {properties?.length > 0 ? (
          <FormProperty properties={properties} inputProps={inputProps} />
        ) : null}

        <div className='modal-action'>
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={builderProps.handleSubmit} className={`btn btn-sm btn-success bg-green-700 text-white `} disabled={processing}>
            <span className={`${processing && 'loading'}`}></span>
            <span>Ekspor</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default ExportModal
