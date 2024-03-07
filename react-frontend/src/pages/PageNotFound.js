import React from "react";
import "./pages.css";
import notFound from "../assets/notfound.jpg"

function PageNotFound() {
    return (
        <div>
            <div className="divider" />
            <div className="prompt"> 
                <img className = "not-found-img" src={notFound} alt="not-found" />
                <div className = "prompt-text">
                        Page does not exist.
                    <div className = "desc-prompt">
                        Error 404
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default PageNotFound;