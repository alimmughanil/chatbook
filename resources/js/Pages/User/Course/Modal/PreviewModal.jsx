import VideoPlayer from "@/Components/Default/VideoPlayer"
import WithModal from "@/Components/WithModal"
import { router, usePage } from "@inertiajs/react"
import { useEffect, useRef, useState } from "react"

const PreviewModal = (state) => {
  const { id, data = null, handleClick } = state
  const MODAL_TYPE = `preview_${id}`
  const backButtonRef = useRef()
  const { lesson = null } = usePage().props
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (data?.id && lesson?.id != data.id) {
      router.visit(`?lesson=${btoa(data.id)}`, {
        method: "get",
        async: false,
        only: ["lesson"],
        preserveState: true,
        preserveScroll: true,
      })
    }

    return () => {}
  }, [id, lesson?.id])

  return (
    <WithModal type={MODAL_TYPE} backdrop={true} onClick={handleClick} modalBoxSize="max-w-3xl">
      <h1 className="text-base font-bold mb-4">{data?.title}</h1>
      {lesson && lesson.content_type == "video" ? <VideoPlayer url={lesson.video_url} {...{isPlaying, setIsPlaying}} /> : <p>Materi ini belum dapat diakses</p>}
      <div className="modal-action">
        <label ref={backButtonRef} onClick={handleClick} htmlFor={`modal_${MODAL_TYPE}`} className="btn btn-sm btn-neutral btn-outline">
          Tutup
        </label>
      </div>
    </WithModal>
  )
}

export default PreviewModal
