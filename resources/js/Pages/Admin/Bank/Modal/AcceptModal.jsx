import WithModal from "@/Components/WithModal"
import { useForm } from "@inertiajs/react"
import { useRef } from "react"

const AcceptModal = (state) => {
  const { data: bank, handleClick } = state
  const MODAL_TYPE = `accept_${bank?.id}`
  const backButtonRef = useRef()
  const { post, errors, processing } = useForm({
    _method: "put",
    verified: 1,
  })

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
      <p className="font-semibold mb-3 text-purple-600 text-lg">Konfirmasi Verifikasi Rekening Bank</p>
      <form action="">
        <div className="modal-action">
          <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-neutral btn-outline">
            Kembali
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-success `} disabled={processing}>
            <span className={`${processing && "loading"}`}>Verifikasi</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default AcceptModal
