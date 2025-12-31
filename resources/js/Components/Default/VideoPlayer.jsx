import { isFunction } from "@/utlis/format"
import { useRef } from "react"
import ReactPlayer from "react-player/youtube"

function VideoPlayer({ url, onEnded = null, isPlaying = null, setIsPlaying = null, onPause = null }) {
  const playerRef = useRef(null)
  const wrapperRef = useRef(null)

  const handleEnded = (data) => {
    setIsPlaying(false)

    if (isFunction(onEnded)) {
      onEnded(data)
    }
  }

  const handlePause = isFunction(onPause)
    ? onPause
    : () => {
        setIsPlaying(false)
      }

  return (
    <div ref={wrapperRef} className="relative aspect-video bg-black">
      <ReactPlayer
        ref={playerRef}
        url={url}
        playing={isPlaying}
        controls={true}
        width="100%"
        height="100%"
        className="absolute top-0 left-0"
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onEnded={handleEnded}
      />
    </div>
  )
}

export default VideoPlayer
