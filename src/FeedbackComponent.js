import React, { useState } from 'react';

const FeedbackComponent = ({ feedback, maxLength = 100 }) => {
    const [showFullFeedback, setShowFullFeedback] = useState(false);

    const toggleFeedback = () => {
        setShowFullFeedback(!showFullFeedback);
    };

    if (feedback.length <= maxLength) {
        return <p>{feedback}</p>;
    }

    return (
        <div>
            {showFullFeedback ? <p>{feedback}</p> : <p>{feedback.substring(0, maxLength)}...</p>}
            <button onClick={toggleFeedback} className="btn btn-link p-0">
                {showFullFeedback ? 'Show Less' : 'Show More'}
            </button>
        </div>
    );
};

export default FeedbackComponent;
