import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function SampleNextArrow(props) {
  const { className, style, onClick } = props
  return <div className={`${className}`} style={{ display: "flex", position: "absolute" }} onClick={onClick} />
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props
  return <div className={className} style={{ display: "flex", position: "absolute" }} onClick={onClick} />
}
const ReactSlickCarouselCard = ({ children, sliderCount }) => {
  let settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    centerMode: true,
    rows: 1,
    slidesPerRow: 1,
    speed: 1000,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          centerPadding: "100px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "60px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "10px",
        },
      },
    ],
  }

  return sliderCount == 0 ? (
    <div></div>
  ) : (
    <>
      <Slider {...settings} className="">
        {children}
      </Slider>
    </>
  )
}

export default ReactSlickCarouselCard
