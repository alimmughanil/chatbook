import WithModal from '@/Components/WithModal'
import { usePage } from '@inertiajs/react'
import { useRef } from 'react'
import MainForm from '../../Quiz/Form/MainForm'

const QuizFormModal = (state) => {
  const { id = 'create', data = null, handleClick } = state
  const MODAL_TYPE = `quiz_form_${id}`

  const { page, module, quiz_grading_type, lesson } = usePage().props
  const backButtonRef = useRef()
  let defaultData = {
    grading_type: data?.grading_type ?? quiz_grading_type[0],
    title: data?.title ?? '',
    description: data?.description ?? '',
  }

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const { data, post, reset } = form
    let targetUrl = `${page.url}/${module?.id}/lessons/${lesson?.id}/quizzes`
    if (id != 'create') {
      data._method = 'put'
      targetUrl += `/${data.id}`
    }

    post(targetUrl, {
      onSuccess: () => {
        backButtonRef.current?.click()
        reset()
      }
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-6xl" boxClassName='modal-box scrollbar-thin overflow-auto'>
      <h1 className='text-lg font-bold'>{id == "create" ? "Tambah" : "Edit"} Kuis</h1>

      <MainForm isEdit={id == "create"} initialData={data ?? defaultData} isLabel={false} onSubmit={handleSubmit} BackButton={() => (
        <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
          Batal
        </label>
      )} />
    </WithModal>
  )
}

export default QuizFormModal
