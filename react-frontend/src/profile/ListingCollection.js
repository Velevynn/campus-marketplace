import React, {useState} from "react";
import Notify from '../components/ErrorNotification';
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import axios from "axios";
import editHover from "../assets/edit-hover.png";
import editNeutral from "../assets/edit-neutral.png";
import deletePic from "../assets/delete-button.png";

function ListingCollection(props) {
  const [showNotification, setShowNotification] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [listings, setBookmarks] = useState(props.bookmarks);
  const [notificationMsg, setNotificationMsg] = useState('');
  console.log(props.bookmarks);

  const handleDeleteListing = async (listingID) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    
    if (confirmed) {
      try {
        console.log("listingID deleting: ", listingID);
        await axios.delete(process.env.REACT_APP_BACKEND_LINK + `/listings/${listingID}`);
        setBookmarks((prevBookmarks) => prevBookmarks.filter(bookmark => bookmark.listingID !== listingID));
        setIsSuccessful(true);
        setNotificationMsg('Successfully deleted');
        setShowNotification(true);
      } catch (error) {
        setIsSuccessful(false);
        setNotificationMsg('Error Deleting Listing');
        setShowNotification(true);
      }
    } else {
      console.log("Deletion cancelled by user.");
    }
  };

  return (
    <div>
      <div className="vertical-center margin">
        <h4>My Listings</h4>
      </div>
      <div className="vertical-center margin">
        <div className="small-container listing-height">
          {props.bookmarks.length === 0 ? (
              <p> There are no Listings </p>
            ) : (
            <ul className="collection-list collection-list-listing">
            {listings.map((listing) => (
              <div key={listing.bookmarkID} className="collection-item">
                  <Link to={`/listings/${listing.listingID}`} className="collection-link">
                  <div className="collection-container">
                      <img src={`https://haggleimgs.s3.amazonaws.com/${listing.listingID}/image0`} className="collection-image" alt={`Listing ${listing.title}`} />
                  </div>
                  <div className="collection-container">
                      <h5 className="collection-text">{listing.title}</h5>
                  </div>
                  </Link>
                  <Link to={`/listings/${listing.listingID}/edit`}>
                  <div className="edit-container">
                    <img
                      className="edit-neutral"
                      src={editNeutral}
                      alt="Edit"
                      onMouseOver={(e) => e.currentTarget.src = editHover}
                      onMouseOut={(e) => e.currentTarget.src = editNeutral}
                    />
                  </div>
                  </Link>
                  <div
                      className="edit-container"
                      onClick={() => handleDeleteListing(listing.listingID)}
                    >
                      <img
                        className="edit-neutral"
                        src={deletePic}
                        alt="Delete"
                      />
                  </div>
                {showNotification && <Notify message={notificationMsg} isSuccessful = {isSuccessful}/>}
              </div>
              ))}  
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

ListingCollection.propTypes = {
  bookmarks: PropTypes.arrayOf(
    PropTypes.shape({
      bookmarkID: PropTypes.string.isRequired,
      listingID: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      userID: PropTypes.string.isRequired
    })
  ).isRequired,
};

export default ListingCollection;
