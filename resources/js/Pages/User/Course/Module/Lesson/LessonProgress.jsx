import { useState } from "react"
import HomeLayout from "@/Layouts/HomeLayout"
import { PlayCircle, ArrowRight, Menu, CheckCircle2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/Components/ui/sheet"
import { useEffect, useRef } from "react"
import { Link, router, usePage } from "@inertiajs/react"
import { CourseBreadcrumb } from "../../Show"
import { FileUploaderPreview } from "@/Components/Form/FileUploaderInput"
import { Fragment } from "react"
import { LessonIcon, AttachmentContentType, QuizIcon } from "@/Components/Icons"
import { cn } from "@/lib/utils"
import { toast } from "react-toastify"
import VideoPlayer from "@/Components/Default/VideoPlayer"

const ModuleSidebar = ({ modules, selectedLesson, onSelectLesson }) => {
  const { props } = usePage()
  const lessonRefs = useRef({})

  useEffect(() => {
    if (selectedLesson && lessonRefs.current[selectedLesson.id]) {
      lessonRefs.current[selectedLesson.id].scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [selectedLesson])

  return (
    <div className="h-full overflow-y-auto pr-2 max-h-[calc(100vh-8rem)] lg:max-h-[99vh]">
      {modules.map((module, mi) => (
        <div key={mi} className="mb-6">
          <h3 className="font-semibold text-base mb-2">{module.title}</h3>
          <ul className="space-y-3">
            {module.lessons.map((lesson, li) => {
              const isActive = selectedLesson?.id === lesson.id
              const progress = props.lessonProgress?.[lesson.id] ?? null
              const status = progress?.status ?? "lock"

              return (
                <li
                  key={li}
                  ref={(el) => (lessonRefs.current[lesson.id] = el)}
                  onClick={() => onSelectLesson(lesson)}
                  className={cn(
                    "flex items-start gap-3 cursor-pointer rounded-lg p-2 transition-colors",
                    isActive ? "bg-primary/10 text-primary font-semibold" : "hover:bg-base-200 text-base-content",
                  )}
                >
                  <LessonIcon type={status} />
                  <div>
                    <p className="text-sm">{lesson.title}</p>
                    <p className="text-xs text-base-500">{lesson.duration}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function LessonProgress() {
  const { props } = usePage()
  const { lesson, course } = usePage().props
  const { modules } = course

  const selectedLesson = lesson
  const currentModule = lesson.module

  const handleSelectedLesson = (lesson) => {
    router.get("?", { lesson: btoa(lesson.id) })
  }

  const currentModuleIndex = modules.findIndex((mod) => mod.id === lesson.module.id)
  const currentLessonIndex = modules[currentModuleIndex].lessons.findIndex((les) => les.id === lesson.id)

  const isLastLessonInModule = currentLessonIndex === modules[currentModuleIndex].lessons.length - 1
  const isLastModule = currentModuleIndex === modules.length - 1
  const isLastLesson = isLastLessonInModule && isLastModule

  let isDisableFinishLesson = false
  let isAllQuizSubmitted = false

  if (selectedLesson?.quizzes?.length > 0) {
    isAllQuizSubmitted = selectedLesson.quizzes.length === 0 || selectedLesson.quizzes.every((q) => (q.submissions?.length ?? 0) > 0)
    isDisableFinishLesson = !isAllQuizSubmitted
  }

  const handleNextLesson = (lesson) => {
    if (!lesson) return

    let nextLesson = null
    if (currentLessonIndex < modules[currentModuleIndex].lessons.length - 1) {
      nextLesson = modules[currentModuleIndex].lessons[currentLessonIndex + 1]
    } else if (currentModuleIndex < modules.length - 1) {
      nextLesson = modules[currentModuleIndex + 1].lessons[0]
    }

    if (nextLesson) {
      router.get("?", { lesson: btoa(nextLesson.id) })
    }
  }

  const handleFinishLesson = (lesson) => {
    if (!lesson) return

    router.visit(`/course/${course.slug}/lesson/${btoa(lesson.id)}`, {
      method: "put",
      data: {
        finish: 1,
      },
    })
  }

  const handleEndVideo = () => {
    setIsPlaying(false)
    const hasQuiz = selectedLesson?.quizzes?.length > 0

    if (hasQuiz && !isAllQuizSubmitted) {
      toast("Silahkan mengerjakan kuis untuk menyelesaikan materi ini", { type: "info" })
      return
    }

    return handleFinishLesson(selectedLesson)
  }

  const [isPlaying, setIsPlaying] = useState(false)
  const moduleTitle = currentModule ? currentModule.title : "Course"

  const renderContent = () => {
    if (!selectedLesson) {
      return (
        <div className="relative aspect-video rounded-lg bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Silakan pilih pelajaran.</p>
        </div>
      )
    }

    switch (selectedLesson.content_type) {
      case "video":
        if (isPlaying) {
          return (
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
              <VideoPlayer url={selectedLesson.video_url} onEnded={handleEndVideo} onPause={() => {}} {...{ isPlaying, setIsPlaying }} />
            </div>
          )
        }

        return (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-black text-white p-6 flex flex-col justify-between">
            <img
              src={selectedLesson.thumbnail}
              alt={`Thumbnail for ${selectedLesson.title}`}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/50 to-transparent"></div>

            <div className="relative z-10 flex items-center gap-2">{/* <span className="font-semibold">{moduleTitle}</span> */}</div>

            <div className="relative z-10 ">
              <p>
                <span className="font-base text-sm">{moduleTitle}</span>
              </p>
              <h2 className="text-base md:text-lg font-bold drop-shadow-md max-w-lg">{selectedLesson.title}</h2>
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={() => setIsPlaying(true)}
                className="text-white opacity-80 hover:opacity-100 hover:scale-105 transition-all"
                aria-label="Play Video"
              >
                <PlayCircle size={72} className="drop-shadow-lg text-primary bg-white rounded-full" />
              </button>
            </div>
          </div>
        )

      case "exam":
        return (
          <div className="px-4 py-16 border rounded-lg w-full text-center overflow-y-auto prose">
            <p>Silahkan kerjakan kuis dibawah sebagai ujian akhir kursus ini.</p>
          </div>
        )

      case "text":
        return (
          <div className="p-4 border rounded-lg max-h-[60vh] overflow-y-auto prose">
            <h2>{selectedLesson.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
          </div>
        )

      default:
        return (
          <div className="relative aspect-video rounded-lg bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Tipe konten tidak didukung.</p>
          </div>
        )
    }
  }

  return (
    <HomeLayout>
      <div className="min-h-screen w-full max-w-[100rem] ">
        <CourseBreadcrumb course={course} isLink={true} />
        <div className="mx-auto grid lg:grid-cols-[400px_1fr] mt-2 gap-8 rounded-2xl lg:shadow-lg pb-4 bg-white">
          <aside className="hidden lg:block border-r pr-4 border-base-300 p-4">
            <ModuleSidebar modules={modules} selectedLesson={selectedLesson} onSelectLesson={handleSelectedLesson} />
          </aside>

          <main>
            <div className="flex items-center justify-start mb-4 lg:hidden">
              <Sheet>
                <SheetTrigger className="btn btn-ghost btn-sm">
                  <Menu className="w-5 h-5" />
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-4 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-lg font-bold mb-4">Daftar Modul</SheetTitle>
                  </SheetHeader>
                  <ModuleSidebar modules={modules} selectedLesson={selectedLesson} onSelectLesson={handleSelectedLesson} />
                </SheetContent>
              </Sheet>

              <h1 className="text-sm font-bold">{selectedLesson.title}</h1>
            </div>

            {renderContent()}

            <div className="flex justify-end items-center mt-6 lg:mr-2">
              {selectedLesson.content_type == "video" && selectedLesson.status == "completed" ? (
                <button className="btn btn-primary btn-sm" onClick={() => handleNextLesson(selectedLesson)} disabled={isLastLesson}>
                  Selanjutnya
                  <ArrowRight size={18} className="inline" />
                </button>
              ) : null}

              {selectedLesson.status == "current" ? (
                <button
                  className="btn btn-success btn-sm text-white bg-green-800"
                  onClick={() => handleFinishLesson(selectedLesson)}
                  disabled={isDisableFinishLesson}
                >
                  <CheckCircle2 size={18} className="inline" />
                  Selesaikan Materi
                </button>
              ) : null}
            </div>

            {!!lesson?.description ? (
              <div>
                <h2 className="text-xl font-bold mb-3 text-gray-900">Keterangan</h2>
                <div className={`text-gray-700 transition-all duration-300`}>
                  <p>{lesson?.description ?? "-"}</p>
                </div>
              </div>
            ) : null}

            {selectedLesson?.quizzes?.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-xl font-bold text-gray-900">Kuis</h2>
                <p className="text-gray-600">Kerjakan semua kuis dibawah untuk menyelesaikan materi ini</p>
                <div className="p-0 mt-2">
                  <div className="flex flex-col gap-2 w-full text-gray-800 max-w-4xl 2xl:text-base">
                    {selectedLesson?.quizzes.map((quiz, index) => {
                      let submission = quiz.submissions?.[0] ?? null

                      return (
                        <Fragment key={index}>
                          <Link
                            href={`/course/${props?.course?.slug}/quiz/${btoa(quiz.id)}`}
                            className="w-full [&_p]:underline flex gap-2 items-center"
                          >
                            <QuizIcon type={submission?.status ?? "pending"} />
                            <p>{quiz.title}</p>
                          </Link>
                        </Fragment>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {selectedLesson?.attachment?.length > 0 ? (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-3 text-gray-900">Materi Pendukung</h2>
                <div className="p-0">
                  <div className="flex flex-wrap gap-2 w-full text-gray-700 max-w-4xl">
                    {selectedLesson?.attachment?.map((file, index) => {
                      return (
                        <Fragment key={index}>
                          <a target="_blank" href={file.value} className="w-full [&_p]:underline flex gap-2 items-center">
                            <AttachmentContentType type={file.content_type} />
                            <FileUploaderPreview
                              file={file}
                              isRemoveButton={false}
                              wrapperClassName={"text-primary hover:underline text-sm md:text-base font-medium"}
                            />
                          </a>
                        </Fragment>
                      )
                    })}
                    {selectedLesson?.attachment_link?.map((file, index) => {
                      return (
                        <Fragment key={index}>
                          <a target="_blank" href={file.value} className="w-full [&_p]:underline flex gap-2 items-center">
                            <AttachmentContentType type={file.content_type} />
                            <FileUploaderPreview
                              file={file}
                              isRemoveButton={false}
                              wrapperClassName={"text-primary hover:underline text-sm md:text-base font-medium"}
                            />
                          </a>
                        </Fragment>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </HomeLayout>
  )
}
