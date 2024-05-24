import React, { useState, useEffect } from "react";
import "./ImageCarousel.css"
import PropTypes from "prop-types";
import LoadingSpinner from "./LoadingSpinner";
import ArrowButton from "./ArrowButton";

function ImageCarousel({ images }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0); // Reset currentImage when images prop changes
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
    setCurrentImageIndex(index);
  }

  function nextImage() {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  }

  function prevImage() {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    } else {
      setCurrentImageIndex(images.length - 1);
    }
  }

  return (
    <div>
      <div className="image-carousel">
      {images.length > 1 && (
        <>
        <div className="next-button" onClick={() => nextImage()}>
          <ArrowButton></ArrowButton>
        </div>
        <div className="prev-button" onClick={() => prevImage()}>
          <ArrowButton></ArrowButton>
        </div>
        </>
      )}
        
        <img src={images[currentImageIndex].imageURL} alt={`Image ${currentImageIndex}`} />
      </div>
      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.imageURL}
            alt={`Thumbnail ${index}`}
            className={currentImageIndex === index ? "" : "inactive"}
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
