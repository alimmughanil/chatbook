import Input from '@/Components/Form/Input'
import TextArea from '@/Components/Form/TextArea'
import BaseForm from '@/Components/Form/BaseForm'
import WithModal from '@/Components/WithModal'
import { router, useForm, usePage } from '@inertiajs/react'
import { useRef } from 'react'
import { FileUploader } from "react-drag-drop-files";
import { dateHumanize } from '@/utils/format'
import { useEffect } from 'react'

const ChatModal = (state) => {
  const { auth } = usePage().props
  const { data: order, chats, handleClick } = state
  const MODAL_TYPE = `chat_${order?.id}`
  const backButtonRef = useRef()
  const bottomRef = useRef(null);
  const { data, setData, post, errors, processing } = useForm({
    type: 'comment',
    message: '',
  })

  function handleChange(e) {
    const { name, value } = e.target

    setData((state) => ({
      ...state,
      [name]: value
    }))
  }

  function handleSetFiles(files) {
    setData((state) => ({
      ...state,
      ['attachment_files']: [...state.attachment_files, ...files]
    }))
  }

  function handleRemoveFile(file) {
    const files = data.attachment_files.filter((state) => state != file)
    setData((state) => ({
      ...state,
      ['attachment_files']: files
    }))
  }

  useEffect(() => {
    let interval
    if (!!chats) {
      interval = setInterval(() => {
        router.reload({ only: ['order'], async: false })
      }, 5000);
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    return () => {
      if (interval) {
        window?.clearInterval(interval)
      }
    }
  }, [chats])


  const handleSubmit = (e) => {
    e.preventDefault()
    post(`/app/order/${order.id}/feedback`, {
      onSuccess: () => {
        setData('message', '')
        router.reload({ only: ['chats', 'order'], async: false })
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    })
  }

  const inputProps = { handleChange, data, errors }
  const fileTypes = ["PDF", "ZIP", "RAR"];

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action=''>
        <p className='font-semibold text-lg'>Pesanan #{order?.order_number}</p>
        <div className='h-full max-h-[50vh] overflow-auto'>
          {chats.map((chat, index) => (
            <div key={index} className={`p-2 my-2 rounded-lg border ${chat?.user_id == auth?.user?.id ? "text-right bg-green-100" : "text-left bg-white"}`}>
              <p>{chat.message}</p>

              <div className="">
                <p className="text-xs text-gray-500">{dateHumanize(chat.created_at)}</p>
              </div>
              {index + 1 >= chats?.length ? (
                <div ref={bottomRef} />
              ) : null}
            </div>
          ))}
        </div>
        <TextArea name='message' placeHolder='Tulis pesanmu disini' isLabel={false} {...inputProps} />

        <div className='modal-action'>
          <label onClick={handleClick} ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className='btn btn-sm btn-neutral btn-outline'>
            Kembali
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-neutral`} disabled={processing} >
            <span className={`${processing && 'loading'}`}>
              Kirim
            </span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default ChatModal
