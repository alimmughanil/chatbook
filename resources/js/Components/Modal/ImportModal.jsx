import Input from '@/Components/Form/Input'
import WithModal from '@/Components/WithModal'
import { mimeType } from '@/utils/format'
import { useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'

const ImportModal = (state) => {
  const { data: importData, type = 'participant' } = state
  const MODAL_TYPE = `import_${importData?.id}`
  const backButtonRef = useRef()
  const { page } = usePage().props
  
  const { data, setData, post, errors, processing } = useForm({
    ...importData,
    excel: '',
  });

  function handleChange(e) {
    let { name, value, files, type, checked } = e.target

    if (type == 'file') {
      value = files[0]
    }

    if (type == 'checkbox') {
      value = checked ? 1 : 0
    }

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    return post(`/admin/courses/${importData?.id}/import?type=${type}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      }
    });
  };

  return (
    <WithModal type={MODAL_TYPE} backdrop={true}>
      <form action=''>
        <h1 className='text-lg font-bold'>Import Data Peserta</h1>
        <a target='_blank' href="/assets/import-file-example.xlsx" className='underline text-blue-600 text-sm'>Lihat Contoh File</a>
        <Input type="file" name="excel" label={`Upload File Excel`} handleChange={handleChange} data={data} errors={errors} accept={mimeType('excel')} />

        <div className='modal-action'>
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-primary`} disabled={processing}>
            <span className={`${processing && 'loading'}`}>Import Data</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default ImportModal
