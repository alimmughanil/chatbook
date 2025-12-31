import HomeLayout from "@/Layouts/HomeLayout"
import { Link, usePage } from "@inertiajs/react"
import { Trophy, Clock, FileQuestion, CheckCircle, ArrowLeft, XCircle, RotateCcw } from "lucide-react"
import { useEffect } from "react"

function Result() {
  return (
    <HomeLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-base-100">
        <ResultContent />
      </div>
    </HomeLayout>
  )
}

const ResultContent = () => {
  const { props } = usePage()
  const { quiz, submission } = props

  const isFailed = submission.grade_status === 'failed'
  const isGraded = submission.status === "graded"

  const uiConfig = isFailed
    ? {
      headerBg: "bg-error/10",
      iconBg: "bg-white",
      icon: <XCircle className="w-12 h-12 text-error" />,
      title: "Mohon Maaf",
      subtitle: "Anda belum mencapai nilai kelulusan.",
      scoreColor: "text-error",
      badge: "badge-error",
    }
    : {
      headerBg: "bg-primary/10",
      iconBg: "bg-white",
      icon: <Trophy className="w-12 h-12 text-yellow-500" />,
      title: "Selamat! Kuis Selesai",
      subtitle: (
        <>
          Anda telah menyelesaikan <span className="font-semibold text-primary">{quiz.title}</span>
        </>
      ),
      scoreColor: "text-primary",
      badge: "badge-warning",
    }

  useEffect(() => {
    if (localStorage.getItem(`quiz.${quiz.id}`)) {
      localStorage.removeItem(`quiz.${quiz.id}`)
    }
  }, [])

  return (
    <div className="card w-full max-w-2xl bg-base-100 shadow-xl border border-base-200 overflow-hidden">

      <div className={`${uiConfig.headerBg} w-full p-8 flex flex-col items-center justify-center text-center transition-colors duration-300`}>
        <div className={`p-4 ${uiConfig.iconBg} rounded-full shadow-sm mb-4 ${!isFailed && 'animate-bounce'}`}>
          {uiConfig.icon}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-base-content">
          {uiConfig.title}
        </h1>
        <p className="text-base-content/70 mt-2">
          {uiConfig.subtitle}
        </p>
      </div>

      <div className="card-body gap-6">

        <div className="flex flex-col items-center justify-center py-4 border-b border-base-100 pb-8">
          <span className="text-sm uppercase tracking-wider font-semibold text-base-content/60 mb-2">
            Nilai Akhir Anda
          </span>

          {isGraded ? (
            <div className={`text-6xl md:text-7xl font-black ${uiConfig.scoreColor}`}>
              {submission.final_score}
            </div>
          ) : (
            <div className={`badge ${uiConfig.badge} badge-lg py-4 px-6 text-lg text-white`}>
              Menunggu Diproses
            </div>
          )}

          {isFailed && (
            <div className="mt-4 px-4 py-2 bg-error/10 text-error rounded-lg text-sm font-medium text-center">
              Nilai minimum kelulusan: {quiz.min_score || 0}
            </div>
          )}

          <p className="text-center text-sm text-base-content/60 mt-4 max-w-md">
            {quiz.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatBox
            icon={<CheckCircle className="w-6 h-6 text-success mb-2" />}
            label="Terjawab"
            value={`${submission.answers_count} / ${quiz.questions_count}`}
          />
          <StatBox
            icon={<Clock className="w-6 h-6 text-info mb-2" />}
            label="Durasi"
            value={`${quiz.duration} Mnt`}
          />
          <StatBox
            icon={<FileQuestion className="w-6 h-6 text-secondary mb-2" />}
            label="Total Soal"
            value={quiz.questions_count}
          />
        </div>

        <div className="card-actions flex-col sm:flex-row justify-center mt-6 gap-3">

          <Link
            href={props.modulePageUrl}
            className={`btn btn-outline ${isFailed ? 'btn-sm sm:btn-md' : 'btn-wide'}`}
          >
            <ArrowLeft size={18} />
            Kembali Ke Kursus
          </Link>

          {isFailed && (
            <Link
              href={props.quizPageUrl || "#"}
              className="btn btn-error btn-wide gap-2 text-white"
            >
              <RotateCcw size={18} />
              Ulangi Kuis
            </Link>
          )}

        </div>

      </div>
    </div>
  )
}

const StatBox = ({ icon, label, value }) => (
  <div className="flex flex-col items-center p-4 bg-base-200/50 rounded-lg">
    {icon}
    <span className="text-xs text-base-content/60 uppercase font-bold">{label}</span>
    <span className="text-xl font-bold">{value}</span>
  </div>
)

export default Result