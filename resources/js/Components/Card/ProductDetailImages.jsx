import React, { useMemo } from "react"
import ImageGallery from "react-image-gallery"
import { Youtube, Globe } from "lucide-react"
import "react-image-gallery/styles/css/image-gallery.css"
import { useState } from "react"

export default function ProductDetailImages({ images }) {
  const URL_DEFAULT_IMG = "/image/default_image.svg"
  const safeImages = images || []
  const [isFullscreen, setIsFullscreen] = useState(false)

  const items = useMemo(() => {
    return safeImages.map((el, idx) => {
      const isYoutube = el?.type === "youtube" && !!el?.youtubeId
      const src = el?.file || URL_DEFAULT_IMG

      return {
        original: src,
        thumbnail: src,

        renderItem: () => (
          <div
            className={`
              relative w-full bg-gray-100 overflow-hidden
              ${isFullscreen
                ? "h-[90vh] rounded-none"
                : "h-[200px] md:h-[400px] rounded-lg"
              }
            `}
          >
            {/* Link badge */}
            {el?.link && !isYoutube && (
              <div className="absolute left-2 top-2 z-10">
                <a
                  href={el.link}
                  target="_blank"
                  rel="noreferrer"
                  className="btn transition btn-circle bg-opacity-50 outline-none border-none"
                >
                  <Globe size={28} className="text-blue-600" />
                </a>
              </div>
            )}

            {isYoutube ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${el.youtubeId}`}
                title="YouTube video player"
                allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={src}
                alt={`Product ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ),

        renderThumbInner: () => (
          <div className="relative w-full h-[60px] rounded-md overflow-hidden">
            {el?.link && (
              <div className="absolute left-1 top-1 z-10 bg-black/30 rounded-full p-0.5">
                {isYoutube ? (
                  <Youtube size={16} className="text-red-500 fill-white" />
                ) : (
                  <Globe size={16} className="text-blue-500 fill-white" />
                )}
              </div>
            )}

            <img
              src={src}
              alt={`Thumbnail ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ),
      }
    })
  }, [safeImages, isFullscreen])

  if (!items.length) {
    return (
      <div className="w-full h-[200px] md:h-[400px] bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={URL_DEFAULT_IMG}
          alt="Default"
          className="w-full h-full object-cover"
        />
      </div>
    )
  }

  return (
    <div className="gallery-thumb-left">
      <ImageGallery
        items={items}
        showPlayButton={false}
        showNav={false}
        showBullets={false}
        showFullscreenButton={true}
        thumbnailPosition="bottom"
        lazyLoad
        onScreenChange={(isFull) => setIsFullscreen(isFull)}
      />
    </div>
  )
}
