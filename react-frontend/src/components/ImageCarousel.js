import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ImageCarousel.css";
import PropTypes from "prop-types";

function ImageCarousel({ images }) {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  

  return (
    <div className = "image-carousel-container"> {}

        <div className="image-carousel"> {/* Add this class */}
        <Slider {...settings}>
            {images.map((imageNum, index) => (
            <div key={index}>
                <img src={imageNum.imageURL} alt={`Image ${index}`} />
            </div>
            ))}
        </Slider>
        </div>
    </div>
  );
}

ImageCarousel.propTypes = {
    images: PropTypes.arrayOf(
      PropTypes.shape({
        imageURL: PropTypes.string.isRequired
      })
    ).isRequired
  };

export default ImageCarousel;