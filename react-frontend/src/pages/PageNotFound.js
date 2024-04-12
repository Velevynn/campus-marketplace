import React from "react";
import notFound from "../assets/notfound.jpg"

function PageNotFound() {
    return (
        <div className="small-container"> 
            <img src={notFound} alt="not-found" />
            <h5>Error 404: Page does not exist.</h5>
        </div>
    );
}

export default PageNotFound;