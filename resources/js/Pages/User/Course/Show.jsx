import HomeLayout from "@/Layouts/HomeLayout"
import { Link, router, usePage } from "@inertiajs/react"
import { useState } from "react"
import { Star, ChevronDown, GraduationCap } from "lucide-react"
import { CourseDetailCard } from "@/Components/Card/CourseCard"
import { currency, useSearchParams, whatsappNumber } from "@/utlis/format"
import moment from "moment"
import { NoData } from "@/Components/Table"
import { Fragment } from "react"
import useLang from "@/utlis/useLang"
import { LessonTypeIcon } from "@/Components/Icons"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import { showModalAtom } from "@/atoms"
import PreviewModal from "./Modal/PreviewModal"
import { ModalButton } from "@/Components/WithModal"
import RatingModal from "@/Components/Modal/RatingShowModal"

const mockStats = {
  rating: "4.8",
  ratingCount: "500+",
  courseCount: 4,
  totalDuration: "15h 11m",
  videoCount: 80,
  quizCount: 25,
}

export const CourseBreadcrumb = ({ course, isLink = false }) => {
  return (
    <div className="text-sm text-gray-500 breadcrumbs overflow-auto scrollbar-none">
      <ul>
        <li>
          <Link href="/" className="text-primary hover:underline">
            Beranda
          </Link>
        </li>
        <li>
          <Link href={`/app/course`} className="text-primary hover:underline">
            Kursus Populer
          </Link>
        </li>
        {isLink ? (
          <li>
            <Link href={`/course/${course.slug}`} className="text-primary hover:underline">
              {course.title}
            </Link>
          </li>
        ) : (
          <li>
            <span className="text-gray-700">{course.title}</span>
          </li>
        )}
      </ul>
    </div>
  )
}

const StatsSection = ({ course }) => {
  const setShowModal = useSetAtom(showModalAtom)
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-600">
      {course.ratings_avg_rating ? (
        <ModalButton id={`rating_show_${course?.id}`} onClick={() => setShowModal(course)} className="flex items-center gap-1.5 cursor-pointer">
          <Star size={20} className="text-yellow-400" fill="currentColor" />
          <span className="font-bold text-gray-900">{parseInt(course.ratings_avg_rating)}</span>
          <span className="text-sm">({course.ratings_count})</span>
        </ModalButton>
      ) : null}

      <div className="flex items-center">
        <GraduationCap className="w-[20px] mr-[8px] sm:mr-[12px]" strokeWidth={2} />
        <p className="text-main-gray lg:text-[14px] ">Level: {useLang(`course.${course.level}`)}</p>
      </div>
    </div>
  )
}

const CourseDescription = ({ description }) => {
  if (!description) return <></>
  const [isExpanded, setIsExpanded] = useState(false)
  const previewText = description?.split(". ").slice(0, 3).join(". ") + "..."

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 text-gray-900">Deskripsi</h2>
      <div className={`text-gray-700 transition-all duration-300 ${isExpanded ? "max-h-full" : "max-h-32 overflow-hidden"}`}>
        <div className="text-editor-content" dangerouslySetInnerHTML={{ __html: isExpanded ? description : previewText }} />
      </div>
      <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-1 font-semibold text-primary mt-3">
        {isExpanded ? "Lebih Sedikit" : "Selengkapnya"}
        <ChevronDown size={20} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
      </button>
    </div>
  )
}

const ModuleAccordionItem = ({ module, index }) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between items-center w-full p-4 text-left">
        <span className="font-semibold text-gray-900">
          {index + 1}. {module.title}
        </span>
        <ChevronDown size={24} className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: module.description }} />

          {module?.lessons?.length == 0 ? (
            <div className="mt-2">
              <p>Belum ada materi yang ditambahkan</p>
            </div>
          ) : (
            <LessonIndex lessons={module?.lessons} />
          )}
        </div>
      )}
    </div>
  )
}

const LessonIndex = ({ lessons }) => {
  if (lessons.length === 0) {
    return (
      <div className="my-8">
        <NoData />
      </div>
    )
  }

  const [_, setShowModal] = useAtom(showModalAtom)

  return (
    <div className="text-base mt-4">
      <p className="text-sm font-medium mb-2">Daftar Materi</p>

      <div className="flex flex-col gap-2">
        {lessons.map((data, index) => (
          <Fragment key={index}>
            <ModalButton
              id={`preview_${data?.id}`}
              onClick={() => (data.visibility == "public" ? setShowModal(data) : null)}
              className={`flex gap-2 items-center text-sm ${data.visibility == 'public' ? 'cursor-pointer' : ''}`}
            >
              <LessonTypeIcon type={data.visibility == "public" ? data?.content_type : "lock"} />
              <div className="flex-none">
                <p className="max-w-[65vw] md:max-w-[77vw]">{data.title}</p>
                <p className="text-xs text-base-400 font-normal">{data.duration}</p>
              </div>
            </ModalButton>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

const ActionCard = ({ course }) => {
  const { schema, phoneNumber, appName, location } = usePage().props
  const { url, params } = useSearchParams(location)
  let baseUrl = url.origin

  const handleRedirect = () => {
    return router.get(`/course/${course.slug}/registration`)
  }

  let price = course.price == 0 ? "Gratis" : currency(course.price)
  let isDisabled = course.quota == 0
  if (params.get("mode") == "preview") {
    isDisabled = true
  }

  let whatsappUrl = null
  if (phoneNumber) {
    let whatsappText = `Halo ${course.user.name}, saya berminat dengan kursus ${course.title} yang ditawarkan di ${appName}. `
    whatsappText = new URLSearchParams(whatsappText)
    whatsappUrl = `https://wa.me/${whatsappNumber(phoneNumber)}?text=${whatsappText}`

    if (whatsappUrl.endsWith("=")) {
      whatsappUrl = whatsappUrl.slice(0, -1)
    }
  }

  let isClosed = false
  if (course.time_limit == "limited") {
    isClosed = moment(course.close_at).diff(moment(), "minutes") < 0
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden p-4">
      <CourseDetailCard course={course} />
      <div className="">
        {isClosed ? (
          <button
            type="button"
            className="bg-disabled lg:text-[14px]  text-main-gray sm:px-[24px] px-[12px] lg:py-[14px] py-[6px] rounded-[10px] mt-[10px] cursor-pointer w-full"
          >
            Pendaftaran Tutup
          </button>
        ) : (
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleRedirect}
            class="bg-success disabled:bg-disabled disabled:text-gray-400 lg:text-[14px] text-white sm:px-[24px] px-[12px] lg:py-[14px] py-[6px] rounded-[10px] mt-[10px] cursor-pointer flex flex-row items-center justify-between w-full"
          >
            <span className="font-semibold">Daftar Sekarang</span>
            <span className="opacity-90">{price}</span>
          </button>
        )}

        {params.get("mode") == "preview" ? (
          <a href={`/course/${course.slug}`} className="text-red-500 text-center underline">
            Keluar Mode Preview
          </a>
        ) : null}
      </div>
    </div>
  )
}

const MobileActionCard = ({ course }) => {
  const { schema, phoneNumber, appName, location } = usePage().props
  const { url, params } = useSearchParams(location)
  let baseUrl = url.origin

  const handleRedirect = () => {
    return router.get(`/course/${course.slug}/registration`)
  }

  let price = course.price == 0 ? "Gratis" : currency(course.price)
  let isDisabled = course.quota == 0
  if (params.get("mode") == "preview") {
    isDisabled = true
  }

  let whatsappUrl = null
  if (phoneNumber) {
    let whatsappText = `Halo ${course.user.name}, saya berminat dengan kursus ${course.title} yang ditawarkan di ${appName}. `
    whatsappText = new URLSearchParams(whatsappText)
    whatsappUrl = `https://wa.me/${whatsappNumber(phoneNumber)}?text=${whatsappText}`

    if (whatsappUrl.endsWith("=")) {
      whatsappUrl = whatsappUrl.slice(0, -1)
    }
  }

  let isClosed = false
  if (course.time_limit == "limited") {
    isClosed = moment(course.close_at).diff(moment(), "minutes") < 0
  }

  return (
    <div className="block lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] p-4">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-bold text-lg text-gray-900">{price}</p>
        </div>

        {isClosed ? (
          <button
            type="button"
            className="bg-disabled lg:text-[14px]  text-main-gray sm:px-[24px] px-[12px] lg:py-[14px] py-[6px] rounded-[10px] cursor-pointer w-max"
          >
            Pendaftaran Tutup
          </button>
        ) : (
          <button
            type="button"
            disabled={isDisabled}
            onClick={handleRedirect}
            class="bg-success disabled:bg-disabled disabled:text-gray-400 lg:text-[14px] text-white sm:px-[24px] px-[12px] lg:py-[14px] py-[6px] rounded-[10px] cursor-pointer flex flex-row items-center justify-between w-max"
          >
            <span className="font-semibold">Daftar Sekarang</span>
          </button>
        )}
      </div>

      {params.get("mode") == "preview" ? (
        <a href={`/course/${course.slug}`} className="text-red-500 text-center underline">
          Keluar Mode Preview
        </a>
      ) : null}
    </div>
  )
}

function Show(props) {
  const { course } = props
  const { modules = [] } = course
  const [showModal, setShowModal] = useAtom(showModalAtom)

  return (
    <HomeLayout auth={props.auth} className="mb-16 sm:mb-0 relative flex flex-col justify-between w-full min-h-screen max-w-[100vw] overflow-hidden">
      <div className="bg-white text-gray-900 min-h-screen\">
        <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pb-28 lg:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-6">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <CourseBreadcrumb course={course} />
              <div className="flex flex-col gap-4">
                <h1 className="text-lg sm:text-xl md:text-4xl font-bold text-gray-900">{course.title}</h1>
                <StatsSection course={course} stats={mockStats} />
              </div>

              <div className="block lg:hidden">
                <CourseDetailCard course={course} />
              </div>

              <main className="flex flex-col gap-8">
                <CourseDescription description={course.description} />
                <div>
                  <h2 className="text-xl font-bold mb-4 text-gray-900">Modul Pembelajaran</h2>
                  <div className="space-y-4">
                    {modules.length > 0 ? (
                      modules.map((modul, index) => <ModuleAccordionItem key={modul.id || index} module={modul} index={index} />)
                    ) : (
                      <p className="text-gray-500">Belum ada modul untuk kursus ini.</p>
                    )}
                  </div>
                </div>
              </main>
            </div>

            <div className="hidden lg:block lg:col-span-1">
              <div className="sticky top-[10rem]">
                <ActionCard course={course} pricing={course.price} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileActionCard course={course} />
      {showModal ? (
        <>
          <PreviewModal id={showModal?.id} data={showModal} handleClick={() => setShowModal(null)} />
          <RatingModal data={showModal} ratings={showModal?.ratings} handleClick={() => setShowModal(null)} />
        </>
      ) : null}
    </HomeLayout>
  )
}

export default Show
