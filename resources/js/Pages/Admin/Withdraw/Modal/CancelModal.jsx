import TextArea from "@/Components/Form/TextArea"
import WithModal from "@/Components/WithModal"
import { useForm, usePage } from "@inertiajs/react"
import { useRef } from "react"

const CancelModal = (state) => {
  const { data: withdraw, handleClick } = state
  const { isAdmin } = usePage().props
  const MODAL_TYPE = `cancel_${withdraw?.id}`
  const backButtonRef = useRef()
  const { data, setData, post, errors, processing } = useForm({
    _method: "put",
    cancel: 1,
    status_message: "",
  })

  function handleChange(e) {
    const { name, value } = e.target

    setData((state) => ({
      ...state,
      [name]: value,
    }))
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    post(`/admin/withdraw/${withdraw?.id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      },
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <p className="font-semibold mb-3">Konfirmasi Pembatalan</p>
      <div className="mb-3 p-2 bg-orange-200 rounded-md flex">
        <i className="fas fa-circle-exclamation mr-2 mt-1" />
        Saldo yang terpotong akan dikembalikan
      </div>
      <form action="">
        {isAdmin ? (
          <TextArea
            required={true}
            type="text"
            placeHolder="Tulis alasan pembatalan"
            name="status_message"
            isLabel={false}
            handleChange={handleChange}
            data={data}
            errors={errors}
          />
        ) : null}

        <div className="modal-action">
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-neutral btn-outline">
            Kembali
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error `} disabled={processing}>
            <span className={`${processing && "loading"}`}>Batalkan</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default CancelModal
