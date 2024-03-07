import React from "react";
import "./pages.css";
import notFound from "../assets/missing.jpg"

function PageNotFound() {
    return (
        <div>
            <div className="divider" />
            <div className="prompt"> 
                <img src={notFound} alt="not-found" />
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