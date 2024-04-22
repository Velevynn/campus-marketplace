import React from "react";
import notFound from "../assets/notfound.jpg"

function PageNotFound() {
    return (
        <div className="vertical-center">
            <div className="small-container"> 
                <img src={notFound} alt="not-found" />
                <h5 className="vertical-center">Error 404: Page does not exist.</h5>
            </div>
        </div>
    );
}

export default PageNotFound;