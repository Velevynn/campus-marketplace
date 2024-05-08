import React, { useState, useEffect } from "react";
import "./ImageCarousel.css"
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";

function ImageCarousel({ images }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    setCurrentImage(0); // Reset currentImage when images prop changes
  }, [images]);

  // Render the ImageCarousel component only if images is defined
  if (!images || images.length === 0) {
    return (
      <div className="image-carousel">
        <LoadingSpinner />
      </div>
    );
  }

  function selectImage(index) {
    setCurrentImage(index);
  }

  return (
    <div>
      <div className="image-carousel">
        <img src={images[currentImage].imageURL} alt={`Image ${currentImage}`} />
      </div>
      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.imageURL}
            alt={`Thumbnail ${index}`}
            className={currentImage === index ? "" : "inactive"}
            onClick={() => selectImage(index)}
          />
        ))}
      </div>
    </div>
  );
}

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      imageURL: PropTypes.string.isRequired
    })
  )
};

export default ImageCarousel;
