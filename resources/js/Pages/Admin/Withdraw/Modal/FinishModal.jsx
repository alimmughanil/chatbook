import Input from "@/Components/Form/Input"
import WithModal from "@/Components/WithModal"
import { mimeType } from "@/utils/format"
import { useForm } from "@inertiajs/react"
import { useRef } from "react"

const FinishModal = (state) => {
  const { data: withdraw, handleClick } = state
  const MODAL_TYPE = `finish_${withdraw?.id}`
  const backButtonRef = useRef()
  const { data, setData, post, errors, processing } = useForm({
    _method: "put",
    finish: true,
    attachment: "",
  })

  function handleChange(e) {
    const { name, value, files } = e.target

    if (name == "attachment") {
      setData((state) => ({
        ...state,
        [name]: files[0],
      }))
    } else {
      setData((state) => ({
        ...state,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    post(`/admin/withdraw/${withdraw.id}`, {
      onSuccess: () => {
        backButtonRef.current?.click()
      },
    })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <p className="font-semibold mb-3">Konfirmasi Selesaikan Penarikan Dana</p>
      <form action="">
        <Input
          type="file"
          name="attachment"
          label="Upload Bukti Pembayaran"
          accept={mimeType("image")}
          handleChange={handleChange}
          data={data}
          errors={errors}
        />
      </form>
      <div className="modal-action">
        <label ref={backButtonRef} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-neutral btn-outline">
          Kembali
        </label>
        <button onClick={handleSubmit} className={`btn btn-sm btn-primary `} disabled={processing}>
          <span className={`${processing && "loading"}`}>Simpan</span>
        </button>
      </div>
    </WithModal>
  )
}

export default FinishModal
