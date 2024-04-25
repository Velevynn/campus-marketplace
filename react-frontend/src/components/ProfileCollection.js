import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Link } from "react-router-dom"; 

function ProfileCollection(props) {
    console.log(props.bookmarks);
    const slidesToScroll = Math.ceil(props.bookmarks.length / 3);
    // Configuration options for the Slick carousel
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: slidesToScroll,
        arrows: false,
    };

    
    return (
        <div>
            <div className="vertical-center margin">
                <h5>{props.title}</h5>
            </div>
            <div className="vertical-center margin">
                <div className="small-container drop-shadow">
                <Slider {...settings}>
                {props.bookmarks.map((bookmark) => (
                <div key={bookmark.bookmarkID}>
                    <Link to={`/listings/${bookmark.listingID}`} className="entry-link">
                        <img src = {`https://haggleimgs.s3.amazonaws.com/${bookmark.listingID}/image0`} className="collection-image" />
                        <h5>{bookmark.title}</h5>
                    </Link>
                </div>
                ))}
            </Slider>
                </div>
            </div>
        </div>
    );
  }
  
  ProfileCollection.propTypes = {
    title: PropTypes.string.isRequired,
    bookmarks: PropTypes.array.isRequired,
    userID: PropTypes.string.isRequried,
  };

  export default ProfileCollection;