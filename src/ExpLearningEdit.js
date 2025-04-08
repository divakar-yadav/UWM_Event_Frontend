import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";  // <--- Import Spinner from react-bootstrap

import "./index.css";
import "./ScoreTableRound1.css";
import "./Roundtwo.css";
import Badge from "react-bootstrap/Badge";

import CountdownTimer from "./CountdownTimer";

function ExpLearningEdit() {
  const { posterId } = useParams();
  const navigate = useNavigate();

  // Store numeric fields as strings, so user can blank them out
  const [reflectionScore, setReflectionScore] = useState("");
  const [communicationScore, setCommunicationScore] = useState("");
  const [presentationScore, setPresentationScore] = useState("");
  const [feedback, setFeedback] = useState("");

  // Additional fields from the updated API
  const [posterTitle, setPosterTitle] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState(null);

  // UI states
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [reflectionError, setReflectionError] = useState("");
  const [communicationError, setCommunicationError] = useState("");
  const [presentationError, setPresentationError] = useState("");
  useEffect(() => {
    document.title = "Edit Poster Score";
  }, []);

  // Fetch existing data for this poster
  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/explearning?poster_id=${posterId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!ignore && response.ok) {
          const data = await response.json();
          const poster = data?.Exp_learning_posters?.[0];
          if (poster) {
            // Additional fields: poster_title, student_name, student_email
            setPosterTitle(poster.poster_title || "Untitled");
            setStudentName(poster.student_name || "Unknown");
            setStudentEmail(poster.student_email || "No email");

            // Convert fetched numeric fields to strings
            setReflectionScore(
              poster.reflection_score != null
                ? String(poster.reflection_score)
                : ""
            );
            setCommunicationScore(
              poster.communication_score != null
                ? String(poster.communication_score)
                : ""
            );
            setPresentationScore(
              poster.presentation_score != null
                ? String(poster.presentation_score)
                : ""
            );
            setFeedback(poster.feedback || "");
            setStudentId(poster.student_id || null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch poster data", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      ignore = true;
    };
  }, [posterId]);

  // Show a spinner if still loading data
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Fetching Poster Data...</p>
      </div>
    );
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");
    setShowSuccess(false);

    // Convert empty strings to 0, or parse valid numbers
    setReflectionError("");
    setCommunicationError("");
    setPresentationError("");

  let hasError = false;

  if (reflectionScore === "") {
    setReflectionError("Reflection score is required.");
    hasError = true;
  } else if (Number(reflectionScore) < 0 || Number(reflectionScore) > 50) {
    setReflectionError("Must be between 0–50.");
    hasError = true;
  }

  if (communicationScore === "") {
    setCommunicationError("Communication score is required.");
    hasError = true;
  } else if (Number(communicationScore) < 0 || Number(communicationScore) > 30) {
    setCommunicationError("Must be between 0–30.");
    hasError = true;
  }

  if (presentationScore === "") {
    setPresentationError("Presentation score is required.");
    hasError = true;
  } else if (Number(presentationScore) < 0 || Number(presentationScore) > 20) {
    setPresentationError("Must be between 0–20.");
    hasError = true;
  }

  if (hasError) {
    setSubmitLoading(false);
    return;
  } 
    const reflectionVal = Number(reflectionScore) ;
    const communicationVal = Number(communicationScore);
    const presentationVal = Number(presentationScore) ;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/explearning/update/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            poster_id: Number(posterId),
            student: studentId,
            reflection_score: reflectionVal,
            communication_score: communicationVal,
            presentation_score: presentationVal,
            feedback: feedback,
          }),
        }
      );

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/judge/exp-learning");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data?.error || "Update failed");
      }
    } catch (err) {
      console.error("Failed to submit data:", err);
      setError("Network or server error. Please try again.");
    }
    setSubmitLoading(false);
  };

  return (
    <>
      <CountdownTimer targetDate={new Date("2023-04-22T09:00:00-05:00")} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600] min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-xl font-bold mb-4">Exp Learning Poster Score</h1>

            {/* Additional Poster Info */}
            <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge pill className="round-badge">
                    Poster ID: {posterId}
                  </Badge>
                  
                </div>
              <p><strong>Poster Title:</strong> {posterTitle}</p>

              <p><strong>Student Name:</strong> {studentName}</p>
              <p><strong>Student Email:</strong> {studentEmail}</p>
              
            </div>
            
                <div>
                <a href="/judge/exp-learning">
            <button className="mt-4 bg-black hover:bg-yellow-600 text-yellow-400 font-bold py-2 px-4 rounded border border-yellow-400">
            &lt;&lt; Go back
              </button>
            </a> </div>
            <div style={{ height: "40px" }} className="mt-2">
              {showSuccess && (
                <div className="p-2 rounded bg-green-100 border border-green-300 text-green-800 text-sm transition-opacity duration-300">
                  ✅ Scores updated successfully!
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <FormInput
                label="Reflection Score (0-50)"
                value={reflectionScore}
                onChange={setReflectionScore}
                error={reflectionError}
              />
              <FormInput
                label="Communication Score (0-30)"
                value={communicationScore}
                onChange={setCommunicationScore}
                error={communicationError}
              />
              <FormInput
                label="Presentation Score (0-20)"
                value={presentationScore}
                onChange={setPresentationScore}
                error={presentationError}
              />

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Feedback
                </label>
                <textarea
                  rows={5}
                  className="w-full border rounded px-3 py-2"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                disabled={submitLoading}
              >
                {submitLoading ? "Submitting..." : "Submit Scores"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable text input field
function FormInput({ label, value, onChange, error }) {
  const handleChange = (e) => {
    onChange(e.target.value); // store raw string
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">{label}</label>
      <input
        type="number"
        step ="any"
        inputMode="decimal"
        pattern="[0-9]*"
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={handleChange}
      />{error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

export default ExpLearningEdit;
