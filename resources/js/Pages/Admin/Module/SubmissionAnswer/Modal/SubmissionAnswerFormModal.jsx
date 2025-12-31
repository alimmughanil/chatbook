import WithModal from '@/Components/WithModal'
import { usePage } from '@inertiajs/react'
import { useRef } from 'react'
import MainForm from '../Form/MainForm'
import { useSearchParams } from '@/utlis/format'
import { toast } from 'react-toastify'

const SubmissionAnswerFormModal = (state) => {
  const { id = 'create', data = null, handleClick } = state
  const MODAL_TYPE = `submission_answer_form_${id}`

  const { page, location } = usePage().props
  const backButtonRef = useRef()

  let submissionAnswer = data.submission_answers?.[0]

  let defaultData = {
    status: submissionAnswer?.status ?? "",
  }  

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const { data, post, setData } = form

    let targetUrl = `${page.url}`    
    let submissionAnswerId = submissionAnswer?.id
   
    if (!submissionAnswerId) {
      return toast("Tidak dapat memperbarui nilai pada pertanyaan yang tidak dikerjakan")
    }
    
    if (id != 'create') {
      targetUrl += `/${submissionAnswerId}`
      data._method = 'put'
    }    

    if (data.ref_url) {
      const { url, params } = useSearchParams(data.ref_url)
      params.set("ref", location)
      data.ref_url = `${url}?${params.toString()}`
    }

    post(targetUrl, {
      onSuccess: () => {
        backButtonRef.current?.click()
        setData((state) => ({ ...state, ...defaultData }))
      }
    })
  }

  

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-2xl" boxClassName='modal-box scrollbar-thin overflow-auto'>
      <h1 className='text-lg font-bold'>{id == "create" ? "Tambah" : "Edit"} Penilaian</h1>

      <MainForm isEdit={id == "create"} initialData={defaultData} isLabel={false} onSubmit={handleSubmit} BackButton={() => (
        <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
          Batal
        </label>
      )} />
    </WithModal>
  )
}

export default SubmissionAnswerFormModal
