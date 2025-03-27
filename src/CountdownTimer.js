// Import necessary hooks and utility functions
import { differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';

// CountdownTimer component that takes a 'targetDate' prop and counts down to it
const CountdownTimer = ({ targetDate }) => {
    // State to store time remaining until the event starts
    const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
    // State to determine if the event has started
    const [eventStarted, setEventStarted] = useState(false);
  
    // Effect hook to set up an interval timer and calculate time remaining
    useEffect(() => {
      // Function to calculate the difference between target date and current date
      const calculateTimeRemaining = () => {
        const now = new Date();
        const secondsRemaining = differenceInSeconds(targetDate, now);
  
        // If the event hasn't started, calculate the time parts
        if (secondsRemaining > 0) {
          const hours = Math.floor(secondsRemaining / 3600);
          const minutes = Math.floor((secondsRemaining % 3600) / 60);
          const seconds = secondsRemaining % 60;
  
          // Update state with the new time remaining
          setTimeRemaining({ hours, minutes, seconds });
        } else {
          // Once the event starts, set time remaining to zero and indicate event has started
          setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
          setEventStarted(true);
        }
      };
  
      // Initial calculation and interval setup
      calculateTimeRemaining();
      const interval = setInterval(calculateTimeRemaining, 1000);
      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }, [targetDate]); // Depend on targetDate, so the interval resets if the date changes
  
    // If the event has started, render nothing
    if (eventStarted) {
      return <></>;
    }
  
    // Preparing time parts for rendering
    const timeParts = [
      { value: timeRemaining.hours, label: 'Hours' },
      { value: timeRemaining.minutes, label: 'Minutes' },
      { value: timeRemaining.seconds, label: 'Seconds' },
    ];
  
    // Render the countdown timer display
    return (
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-4">Event starts in:</h3>
        <div className="flex justify-center space-x-2">
          {timeParts.map((part, index) => (
            // Map over each part of the time remaining and render them with labels
            <div key={index} className="flex flex-col items-center">
              <div className="bg-gray-800 p-2 rounded-md shadow-lg">
                <span className="text-white text-2xl font-bold">{part.value.toString().padStart(2, '0')}</span>
              </div>
              <span className="text-gray-600 mt-1">{part.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

// Export the CountdownTimer component for use in other parts of the application
export default CountdownTimer;
