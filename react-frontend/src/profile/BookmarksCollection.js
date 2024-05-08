import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function BookmarksCollection(props) {
  console.log(props.bookmarks);

  return (
    <div>
      <div className="vertical-center margin">
        <h4>My {props.title}</h4>
      </div>
      <div className="vertical-center margin">
        <div className="small-container bookmarks-height">
          {props.bookmarks.length === 0 ? (
              <p> There are no {props.title} </p>
            ) : (
            <ul className="collection-list collection-list-bookmark">
            {props.bookmarks.map((bookmark) => (
              <div key={bookmark.bookmarkID} className="collection-item">
                  <Link to={`/listings/${bookmark.listingID}`} className="collection-link">
                  <div className="collection-container">
                      <img src={`https://haggleimgs.s3.amazonaws.com/${bookmark.listingID}/image0`} className="collection-image" alt={`Listing ${bookmark.title}`} />
                  </div>
                  <div className="collection-container">
                      <h5 className="collection-text">{bookmark.title}</h5>
                  </div>
                  </Link>
              </div>
              ))}
              
            </ul>
          )}
        </div>
        
      </div>
    </div>
  );
}

BookmarksCollection.propTypes = {
  title: PropTypes.string.isRequired,
  bookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      bookmarkID: PropTypes.string.isRequired,
      listingID: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  ).isRequired,
};

export default BookmarksCollection;
