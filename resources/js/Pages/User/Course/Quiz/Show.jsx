import HomeLayout from "@/Layouts/HomeLayout"
import QuizCard from "./Card/QuizCard"
import { useEffect, useState } from "react"
import { Clock, HelpCircle } from "lucide-react"

function Show(props) {
  const { quiz, questions } = props
  const [isStart, setIsStart] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(`quiz.${quiz.id}`)) {
      setIsStart(true)
    }
  }, [quiz.id])

  const handleStartQuiz = () => {
    localStorage.setItem(`quiz.${quiz.id}`, "true")
    setIsStart(true)
  }

  return (
    <HomeLayout>
      {isStart ? (
        <QuizCard quiz={quiz} />
      ) : (
        <div className="mx-auto max-w-3xl w-full">
          <div className="card w-full bg-white lg:border-2 lg:shadow-xl">
            <div className="card-body items-center text-center">
              <h1 className="card-title text-lg lg:text-xl font-bold mb-2">{quiz?.title}</h1>

              <p className="text-sm lg:text-base text-base-content/80 mb-6 max-w-xl">{quiz?.description}</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="stat bg-primary bg-opacity-5 rounded-lg">
                  <div className="stat-figure text-primary">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="stat-title">Durasi</div>
                  <div className="stat-value text-xl">{quiz?.duration}</div>
                </div>
                <div className="stat bg-primary bg-opacity-5 rounded-lg">
                  <div className="stat-figure text-primary">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <div className="stat-title">Jumlah Soal</div>
                  <div className="stat-value text-xl">{questions?.length} Soal</div>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-lg lg:text-base font-semibold">Selamat Datang!</p>
                <p className="text-sm">
                  Siapkah untuk menguji pengetahuanmu?
                  <br />
                  Klik tombol di bawah ini untuk memulai kuis.
                </p>
              </div>

              <div className="card-actions">
                <button onClick={handleStartQuiz} className="btn btn-primary">
                  Mulai Mengerjakan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HomeLayout>
  )
}

export default Show
