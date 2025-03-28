// Import React and necessary styles
import React from 'react';
import './index.css';
// Import images used in the component
import successLogo from './images/new_logo_stacked.jpg';
import doneGif from './images/done.gif';

// Confirmation component used to display the success message after a user action (e.g., registration)
function Confirmation() {
    return (
        <>
            {/* Full screen container with a background gradient */}
            <div className="min-h-screen bg-gradient-to-r from-ffbd00 to-[#eca600]">
                {/* Top margin for spacing */}
                <br />
                {/* Centered container for the content */}
                <div className="container mx-auto px-4 ">
                    {/* Text-center aligns all children to the center */}
                    <div id="successcontainer" className="text-center">
                        {/* Logo image for visual confirmation of success */}
                        <img
                            id="image"
                            src={successLogo}
                            alt="success logo"
                            className="mx-auto"
                        />
                        {/* Spacing between elements */}
                        <br />
                        {/* Event title and date information */}
                        <h3 className="text-xl font-semibold my-4">
                            2025 Student Research Poster Competition
                        </h3>
                        {/* Confirmation message for the user */}
                        <p className="text-xl mb-4">
                            Thank you for registering to be a judge.
                            <br />
                            {/* Contact information in case of questions */}
                            {/* <b className="font-bold">
                                Questions? Contact ceas-events@uwm.edu
                            </b> */}
                        </p>
                        {/* Additional spacing */}
                        <br />
                        {/* Animated GIF for visual feedback */}
                        <img id="image" src={doneGif} alt="done" className="mx-auto" />
                        {/* Placeholder for potential status messages */}
                        <p id="status" className="text-sm mt-2"></p>
                    </div>
                </div>
            </div>
        </>
    );
}

// Export the component for use in other parts of the application
export default Confirmation;
