import { Children, useMemo, useState, isValidElement } from "react"
import ImageGallery from "react-image-gallery"
import { Globe, Youtube } from "lucide-react"
import "react-image-gallery/styles/css/image-gallery.css"
import { useAtom } from "jotai"
import { galleryFullscreenAtom } from "@/atoms"
const URL_DEFAULT_IMG = "/image/default_image.svg"

const ReactImageGalleryCard = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useAtom(galleryFullscreenAtom)

  const items = useMemo(() => {
    return Children.toArray(children)
      .filter(isValidElement)
      .map((child, idx) => {
        const {
          src,
          link,
          youtubeId,
          type = "image",
        } = child.props

        const isYoutube = type === "youtube" && youtubeId
        const finalSrc = src || URL_DEFAULT_IMG

        return {
          original: finalSrc,
          thumbnail: finalSrc,

          renderItem: () => (
            <div
              className={`
                relative w-full bg-gray-100 overflow-hidden
                ${isFullscreen
                  ? "h-[90vh] rounded-none"
                  : "h-[200px] md:h-[400px] rounded-lg"}
              `}
            >
              {link && !isYoutube && (
                <div className="absolute left-2 top-2 z-10">
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-circle bg-opacity-50 border-none"
                  >
                    <Globe size={28} className="text-blue-600" />
                  </a>
                </div>
              )}

              {isYoutube ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  allow="fullscreen; autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <img
                  src={finalSrc}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ),

          renderThumbInner: () => (
            <div className="relative w-full h-[60px] rounded-md overflow-hidden">
              {(link || isYoutube) && (
                <div className="absolute left-1 top-1 z-10 bg-black/30 rounded-full p-0.5">
                  {isYoutube ? (
                    <Youtube size={16} className="text-red-500 fill-white" />
                  ) : (
                    <Globe size={16} className="text-blue-500 fill-white" />
                  )}
                </div>
              )}

              <img
                src={finalSrc}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ),
        }
      })
  }, [children, isFullscreen])

  if (!items.length) return null

  return (
    <ImageGallery
      items={items}
      showPlayButton={false}
      showNav
      showFullscreenButton
      thumbnailPosition="bottom"
      lazyLoad
      onScreenChange={setIsFullscreen}
    />
  )
}

export default ReactImageGalleryCard
