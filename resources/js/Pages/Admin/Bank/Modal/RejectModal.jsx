import TextArea from "@/Components/Form/TextArea"
import WithModal from "@/Components/WithModal"
import { useForm } from "@inertiajs/react"
import { useRef } from "react"

const RejectModal = (state) => {
  const { data: bank, handleClick } = state
  const MODAL_TYPE = `reject_${bank?.id}`
  const backButtonRef = useRef()
  const { data, setData, post, errors, processing } = useForm({
    _method: "put",
    status_message: "",
    rejected: 1,
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
    post(`/admin/bank/${bank?.id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      },
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <p className="font-semibold mb-3">Konfirmasi Penolakan Rekening Bank</p>
      <form action="">
        <TextArea
          required={true}
          type="text"
          placeHolder="Tulis alasan penolakan"
          name="status_message"
          isLabel={false}
          handleChange={handleChange}
          data={data}
          errors={errors}
        />

        <div className="modal-action">
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-neutral btn-outline">
            Kembali
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-error `} disabled={processing}>
            <span className={`${processing && "loading"}`}>Tolak</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default RejectModal
