import React from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import successLogo from './images/new_logo_stacked.jpg';
import doneGif from './images/done.gif';

function Confirmation() {
    const navigate = useNavigate();

    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-[#ffbd00] to-[#eca600]">
                <br />
                <div className="container mx-auto px-4">
                    <div id="successcontainer" className="text-center">
                        <img
                            id="image"
                            src={successLogo}
                            alt="success logo"
                            className="mx-auto"
                        />

                        <br />

                        <h3 className="text-xl font-semibold my-4">
                            Student Research Poster Competition
                        </h3>

                        <p className="text-xl mb-4">
                            Thank you for registering to be a judge.
                        </p>

                        <p className="text-md mb-6">
                            Your registration has been submitted successfully. Please continue to the login page.
                        </p>

                        <br />

                        {/* <img id="image" src={doneGif} alt="done" className="mx-auto" /> */}

                        <div className="mx-auto w-[90px]">
                            <svg className="circle-check" viewBox="0 0 52 52">
                                <circle className="fill-circle" cx="26" cy="26" r="25" />
                                <path className="check" d="M16 27l8 8 14-16" />
                            </svg>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="md:hidden w-full max-w-xs bg-black text-white px-6 py-3 rounded-lg font-medium hover:opacity-80 transition"
                            >
                                Login
                            </button>
                        </div>

                        <p id="status" className="text-sm mt-2"></p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Confirmation;