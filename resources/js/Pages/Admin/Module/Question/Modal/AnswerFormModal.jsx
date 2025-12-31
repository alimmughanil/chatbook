import WithModal from '@/Components/WithModal'
import { usePage } from '@inertiajs/react'
import { useRef } from 'react'
import MainForm from '../../Answer/Form/MainForm'
import { useSearchParams } from '@/utlis/format'

const AnswerFormModal = (state) => {
  const { id = 'create', data = null, handleClick } = state
  const MODAL_TYPE = `answer_form_${id}`

  const { page, question, location } = usePage().props
  const backButtonRef = useRef()

  let defaultData = {
    answer_text: data?.answer_text ?? "",
    is_correct: data?.is_correct ?? 0
  }  

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const { data, post, reset, setData } = form

    let targetUrl = `${page.url}/${question?.id}/answers`
    if (id != 'create') {
      data._method = 'put'
      targetUrl += `/${data.id}`
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
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-6xl" boxClassName='modal-box scrollbar-thin overflow-auto'>
      <h1 className='text-lg font-bold'>{id == "create" ? "Tambah" : "Edit"} {["quiz"].includes(data?.content_type) ? "Kuis" : "Materi"}</h1>

      <MainForm isEdit={id == "create"} initialData={data ?? defaultData} isLabel={false} onSubmit={handleSubmit} BackButton={() => (
        <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
          Batal
        </label>
      )} />
    </WithModal>
  )
}

export default AnswerFormModal
