import { useAtom, useAtomValue, useSetAtom } from "jotai"
import {
  currentQuestionIndexAtom,
  totalQuestionsAtom,
  currentQuestionAtom,
  allAnswersAtom,
  quizDataAtom,
  answeredCountAtom,
  progressPercentageAtom,
  submitAtom,
  canNextAtom,
  isEssayAtom,
  isMultipleAtom,
  isSingleAtom,
  quizIdAtom,
  pagePropsAtom,
  isFileUploadAtom
} from "@/atoms/quizStore"

import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet"
import { ChevronLeft, ChevronRight, PanelLeft } from "lucide-react"
import { usePage } from "@inertiajs/react"
import Countdown from "@/Components/Countdown"
import { useEffect } from "react"
import { jsonParse } from "@/utlis/format"
import { ModalButton } from "@/Components/WithModal"
import SubmitModal from "../Modal/SubmitModal"
import { toast } from "react-toastify"

function QuestionCard() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(currentQuestionIndexAtom)
  const currentQuestion = useAtomValue(currentQuestionAtom)
  const totalQuestions = useAtomValue(totalQuestionsAtom)
  const canNext = useAtomValue(canNextAtom)
  const isEssay = useAtomValue(isEssayAtom)
  const isSingle = useAtomValue(isSingleAtom)
  const isMultiple = useAtomValue(isMultipleAtom)
  const isFileUpload = useAtomValue(isFileUploadAtom)
  const [allAnswers, setAllAnswers] = useAtom(allAnswersAtom)

  const currentValue = allAnswers[currentQuestion?.id] ?? null

  const handleSingleSelect = (questionId, answerId) => {
    setAllAnswers((prev) => ({ ...prev, [questionId]: answerId }))
  }

  const handleMultiSelect = (questionId, answerId) => {
    const prev = allAnswers[questionId] || []
    const updated = prev.includes(answerId) ? prev.filter((id) => id !== answerId) : [...prev, answerId]

    setAllAnswers((prev) => ({ ...prev, [questionId]: updated }))
  }

  const handleEssayChange = (questionId, value) => {
    setAllAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleFileChange = (questionId, files) => {
    setAllAnswers((prev) => ({ ...prev, [questionId]: files }), {isLocalStorage: false})
  }

  if (!currentQuestion) {
    return (
      <div className="card bg-base-100 shadow-xl flex-1">
        <div className="card-body items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-100 shadow-xl flex-1 lg:border">
      <div className="card-body">
        <p className="text-sm text-base-content text-opacity-70">
          Pertanyaan {currentQuestionIndex + 1}/{totalQuestions}
        </p>

        <h2 className="card-title text-xl my-4">{currentQuestion.question_text}</h2>

        <div className="space-y-3">
          {isEssay && (
            <textarea
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Your answer..."
              value={currentValue ?? ""}
              onChange={(e) => handleEssayChange(currentQuestion.id, e.target.value)}
            />
          )}

          {isFileUpload && (
            <div className="space-y-2">
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={(e) => handleFileChange(currentQuestion.id, e.target.files)}
              />

              {currentValue && currentValue.length > 0 && (
                <div className="text-sm text-base-content text-opacity-70">
                  File terpilih: {Array.from(currentValue).map((f) => f.name).join(", ")}
                </div>
              )}
            </div>
          )}

          {isSingle &&
            currentQuestion.answers?.map((answer) => (
              <div
                key={answer.id}
                className={`
                  form-control border rounded-lg transition-all hover:border-primary
                  ${currentValue === answer.id ? "border-primary bg-primary/10" : "border-base-300"}
                `}
              >
                <label className="label cursor-pointer gap-4 p-4 justify-start">
                  <input
                    type="radio"
                    checked={currentValue === answer.id}
                    onChange={() => handleSingleSelect(currentQuestion.id, answer.id)}
                    className="radio checked:bg-primary"
                  />
                  <span>{answer.answer_text}</span>
                </label>
              </div>
            ))}

          {isMultiple &&
            currentQuestion.answers?.map((answer) => (
              <div
                key={answer.id}
                className={`
                  form-control border rounded-lg transition-all hover:border-primary
                  ${currentValue?.includes(answer.id) ? "border-primary bg-primary/10" : "border-base-300"}
                `}
              >
                <label className="label cursor-pointer gap-4 p-4 justify-start">
                  <input
                    type="checkbox"
                    checked={currentValue?.includes(answer.id)}
                    onChange={() => handleMultiSelect(currentQuestion.id, answer.id)}
                    className={`checkbox ${currentValue?.includes(answer.id) ? "checkbox-primary" : ""}`}
                  />
                  <span>{answer.answer_text}</span>
                </label>
              </div>
            ))}
        </div>

        <div className="card-actions justify-between mt-8 hidden lg:flex">
          <button className="btn btn-ghost btn-sm px-4" onClick={() => setCurrentQuestionIndex((i) => i - 1)} disabled={currentQuestionIndex === 0}>
            <i className="fas fa-arrow-left"></i>
            Sebelumnya
          </button>

          <button className="btn btn-primary btn-sm px-4" onClick={() => setCurrentQuestionIndex((i) => i + 1)} disabled={!canNext}>
            Selanjutnya
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

function ProgressSidebar() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(currentQuestionIndexAtom)
  const quizId = useAtomValue(quizIdAtom)
  const quizData = useAtomValue(quizDataAtom)
  const allAnswers = useAtomValue(allAnswersAtom)
  const answeredCount = useAtomValue(answeredCountAtom)
  const totalQuestions = useAtomValue(totalQuestionsAtom)
  const progressPercentage = useAtomValue(progressPercentageAtom)

  const handleGridClick = (index) => {
    setCurrentQuestionIndex(index)
  }

  return (
    <div>
      <div className="card bg-white mt-2 sm:mt-0">
        <div className="card-body p-0 sm:p-4">
          <h3 className="card-title text-base">
            Progress: {answeredCount}/{totalQuestions}
          </h3>
          <progress className="progress progress-primary w-full" value={progressPercentage} max="100"></progress>

          <div className="grid grid-cols-7 gap-2 my-4 overflow-y-auto max-h-60">
            {quizData.map((question, index) => {
              const isAnswered = (() => {
                const ans = allAnswers[question.id]
                if (question.type === "essay") return ans && ans.trim() !== ""
                if (question.type === "single_choice") return !!ans
                if (question.type === "multiple_choice") return Array.isArray(ans) && ans.length > 0
                if (question.type === "file_upload") return !!ans
                return false
              })()
              const isCurrent = index === currentQuestionIndex

              let btnClass = "btn btn-sm btn-outline"
              if (isCurrent) {
                btnClass = "btn btn-sm btn-primary"
              } else if (isAnswered) {
                btnClass = "btn btn-sm btn-primary bg-opacity-70"
              }

              return (
                <button key={question.id} className={btnClass} onClick={() => handleGridClick(index)}>
                  {index + 1}
                </button>
              )
            })}
          </div>

          <ModalButton id={`submit_${quizId}`} className="btn btn-sm btn-primary bg-opacity-30 border-opacity-20 text-black w-full">
            Submit Kuis
          </ModalButton>
        </div>
      </div>
    </div>
  )
}

function MobileQuizFooter() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useAtom(currentQuestionIndexAtom)
  const quizId = useAtomValue(quizIdAtom)
  const answeredCount = useAtomValue(answeredCountAtom)
  const progressPercentage = useAtomValue(progressPercentageAtom)
  const totalQuestions = useAtomValue(totalQuestionsAtom)
  const canNext = useAtomValue(canNextAtom)

  return (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg z-50">
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="font-semibold">Progress:</span>
        <span>
          {answeredCount}/{totalQuestions}
        </span>
      </div>

      <progress className="progress progress-primary w-full h-1 mb-4" value={progressPercentage} max="100" />

      <div className="flex justify-between items-center">
        <ModalButton id={`submit_${quizId}`} className="btn btn-sm btn-primary bg-opacity-30 border-opacity-20 text-black w-[45%]">
          Submit Kuis
        </ModalButton>

        <div className="flex items-center gap-2">
          <button
            className="btn btn-outline btn-square btn-sm"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex((i) => i - 1)}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button className="btn btn-primary btn-square btn-sm" disabled={!canNext} onClick={() => setCurrentQuestionIndex((i) => i + 1)}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

function QuizHeader() {
  const { props } = usePage()

  const handleSubmit = useSetAtom(submitAtom)
  const handleTimeUp = () => {
    toast("Waktu habis, jawaban sedang dikirim", { type: "warning", autoClose: false })
    handleSubmit({ backButtonRef: null })
  }

  return (
    <div className="mb-4 flex justify-between items-center">
      <div>
        <h1 className="text-base md:text-2xl font-bold">{props.quiz?.title}</h1>
        <Countdown
          saveKey={`quizTimer.${props.quiz.id}`}
          autoSaveIntervalInSeconds={5}
          durationInSeconds={props.quiz.duration_seconds}
          onTimeUp={handleTimeUp}
        />
      </div>

      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button className="btn btn-ghost btn-circle">
              <PanelLeft className="w-8 h-8" />
            </button>
          </SheetTrigger>
          <SheetContent className="p-4 overflow-y-auto" side="right">
            <div className="mt-5">
              <ProgressSidebar />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

function QuizCard() {
  const { props } = usePage()
  const setPageProps = useSetAtom(pagePropsAtom)
  const setQuizData = useSetAtom(quizDataAtom)
  const setAllAnswers = useSetAtom(allAnswersAtom)
  const setQuizId = useSetAtom(quizIdAtom)
  const setCurrentQuestionIndex = useSetAtom(currentQuestionIndexAtom)

  useEffect(() => {
    const currentQuizId = props?.quiz?.id
    setQuizId(currentQuizId)
    setQuizData(props.questions)
    setPageProps(props)

    const savedAnswers = localStorage.getItem(`quizAnswers.${currentQuizId}`)
    if (savedAnswers) {
      setAllAnswers(jsonParse(savedAnswers) ?? {})
    } else {
      setAllAnswers({})
    }

    setCurrentQuestionIndex(0)
  }, [props.quiz.id, props.questions])

  return (
    <div className="lg:border min-h-screen md:p-8 lg:pb-8 pb-32 w-full">
      <div className="mx-auto">
        <QuizHeader />
        <div className="flex flex-col lg:flex-row gap-6">
          <QuestionCard />
          <div className="hidden lg:block lg:w-1/3">
            <ProgressSidebar />
          </div>
        </div>
      </div>

      <MobileQuizFooter />
      <SubmitModal id={props.quiz.id} handleClick={() => { }} />
    </div>
  )
}

export default QuizCard
