import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import emptyBookmark from "../assets/empty-bookmark.png";
import filledBookmark from "../assets/filled-bookmark.png";

function BookmarksCollection(props) {
  const { bookmarks } = props;
  const [bookmarkStatus, setBookmarkStatus] = useState(
    bookmarks.reduce((acc, bookmark) => {
      acc[bookmark.listingID] = true; // All items are initially bookmarked
      return acc;
    }, {})
  );

  const toggleBookmark = async (listingID, listingTitle, userID) => {
    const isBookmarked = bookmarkStatus[listingID];
    if (isBookmarked) {
      try {
        await deleteBookmark(listingID, userID); // Pass the listingID to deleteBookmark function
        setBookmarkStatus((prevStatus) => ({
          ...prevStatus,
          [listingID]: false,
        }));
      } catch (error) {
        console.error("Error removing bookmark: ", error);
      }
    } else if (!isBookmarked) {
      try {
        setBookmarkStatus((prevStatus) => ({
          ...prevStatus,
          [listingID]: true,
        }));
        await createBookmark(listingID, listingTitle, userID);
      } catch (error) {
        console.error("Error creating bookmark: ", error);
      }
    }
  };

  const createBookmark = async (listingID, listingTitle, userID) => {
    try {
      await axios.post(
        process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}/bookmark`, {
          'userID': userID,
          'listingID': listingID,
          'title': listingTitle
        }
      );
    } catch (error) {
      console.error("Error creating bookmark: ", error);
    }
  };

  const deleteBookmark = async (listingID, userID) => {
    try {
      await axios.delete(
        process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}/bookmark`,
        {
          params: {
            userID: userID,
            listingID: listingID,
          }
        }
      );
    } catch (error) {
      console.error("Error deleting bookmark: ", error);
    }
  };

  return (
    <div>
      <div className="vertical-center margin">
        <h4>My Bookmarks</h4>
      </div>
      <div className="vertical-center margin">
        <div className="small-container bookmarks-height">
          {bookmarks.length === 0 ? (
            <p> There are no Bookmarks </p>
          ) : (
            <ul className="collection-list collection-list-bookmark">
              {bookmarks.map((bookmark) => (
                <div key={bookmark.bookmarkID} className="collection-item">
                  <Link to={`/listings/${bookmark.listingID}`} className="collection-link">
                    <div className="collection-container">
                      <img
                        src={`https://haggleimgs.s3.amazonaws.com/${bookmark.listingID}/image0`}
                        className="collection-image"
                        alt={`Listing ${bookmark.title}`}
                      />
                    </div>
                    <div className="collection-container margin-right">
                      <h5 className="collection-text">{bookmark.title}</h5>
                    </div>
                  </Link>
                  <div
                    className="bookmark-container"
                    onClick={() => toggleBookmark(bookmark.listingID, bookmark.title, bookmark.userID)}
                  >
                    {bookmarkStatus[bookmark.listingID] ? (
                      <img className="bookmark" src={filledBookmark} alt="Filled Bookmark"/>
                    ) : (
                      <img className="bookmark" src={emptyBookmark} alt="Empty Bookmark"/>
                    )}
                  </div>
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
  bookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      bookmarkID: PropTypes.string.isRequired,
      listingID: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default BookmarksCollection;
