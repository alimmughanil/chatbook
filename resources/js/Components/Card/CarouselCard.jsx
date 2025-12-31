import ReactImageGalleryCard from "./Carousel/ReactImageGalleryCard"
import ReactSlickCarouselCard from "./Carousel/ReactSlickCarouselCard"

const CarouselCard = (props) => {
  const { provider = "react-slick" } = props
  if (provider == "react-slick") return <ReactSlickCarouselCard {...props} />
  if (provider == "react-image-gallery") return <ReactImageGalleryCard {...props} />

  return <></>
}

export default CarouselCard
