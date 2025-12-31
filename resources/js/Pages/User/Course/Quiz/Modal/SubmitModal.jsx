import { answeredCountAtom, submitAtom, submitProcessAtom, totalQuestionsAtom } from "@/atoms/quizStore"
import WithModal from "@/Components/WithModal"
import { useAtomValue, useSetAtom } from "jotai"
import { useRef } from "react"

const SubmitModal = (state) => {
  const { id, data = null, isLabel = true, content = null, handleClick } = state
  const MODAL_TYPE = `submit_${id}`
  const answeredCount = useAtomValue(answeredCountAtom)
  const totalQuestions = useAtomValue(totalQuestionsAtom)
  const processing = useAtomValue(submitProcessAtom)
  const onSubmit = useSetAtom(submitAtom)

  const backButtonRef = useRef()

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ backButtonRef })
  }

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick}>
      <form action="">
        <h1 className="text-lg font-bold">Konfirmasi</h1>
        {isLabel ? <p>Apakah anda yakin ingin mengirim jawaban kuis ini?</p> : null}

        <p>
          Anda sudah menjawab <span className="font-semibold">{answeredCount}</span> dari{" "}
          <span className="font-semibold">{totalQuestions} pertanyaan</span>.
        </p>

        <div className="">{!!data && !!content && typeof content === "function" && content(data)}</div>
        <div className="modal-action">
          <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-neutral btn-outline">
            Batal
          </label>
          <button onClick={handleSubmit} className={`btn btn-sm btn-success bg-green-600 text-white `} disabled={processing}>
            <span className={`${processing && "loading"}`}></span>
            <span>Submit Kuis</span>
          </button>
        </div>
      </form>
    </WithModal>
  )
}

export default SubmitModal
