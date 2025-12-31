import WithModal from '@/Components/WithModal'
import { usePage } from '@inertiajs/react'
import { useRef } from 'react'
import MainForm from '../../Lesson/Form/MainForm'

const LessonFormModal = (state) => {
  const { id = 'create', data = null, handleClick } = state
  const MODAL_TYPE = `lesson_form_${id}`

  const { page, module, lesson_content_type } = usePage().props
  const backButtonRef = useRef()
  let defaultData = {
    content_type: data?.content_type ?? lesson_content_type[0],
    attachment: data?.attachment ?? [],
    attachment_link: data?.attachment_link ?? [],
  }

  if (data) {
    defaultData = {...defaultData, ...data}
  }  

  const handleSubmit = (e, form) => {
    e.preventDefault()
    const { data, post, reset } = form
    let targetUrl = `${page.url}/${module.id}/lessons`
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
      <h1 className='text-lg font-bold'>{id == "create" ? "Tambah" : "Edit"} Materi</h1>

      <MainForm isEdit={id == "create"} initialData={defaultData} isLabel={false} onSubmit={handleSubmit} BackButton={() => (
        <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
          Batal
        </label>
      )} />
    </WithModal>
  )
}

export default LessonFormModal
