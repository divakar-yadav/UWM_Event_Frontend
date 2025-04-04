import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner"; // <-- Import Spinner
import CountdownTimer from "./CountdownTimer";
import Badge from "react-bootstrap/Badge";

import "./index.css";
import "./ScoreTableRound1.css";
import "./Roundtwo.css";

function ThreeMTEdit() {
  const { posterId } = useParams();
  const navigate = useNavigate();

  // Store numeric fields as strings, so they can be blanked out
  const [comprehensionContent, setComprehensionContent] = useState("");
  const [engagement, setEngagement] = useState("");
  const [communication, setCommunication] = useState("");
  const [overallImpression, setOverallImpression] = useState("");
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

  useEffect(() => {
    document.title = "Edit ThreeMT Score";
  }, []);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/three-mt?poster_id=${posterId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!ignore && res.ok) {
          const data = await res.json();
          // find the correct poster entry
          const poster = data.ThreeMT_posters.find(
            (p) => String(p.poster_id) === posterId
          );

          if (poster) {
            // Numeric fields => store as string for free backspace
            setComprehensionContent(
              poster.comprehension_content != null
                ? String(poster.comprehension_content)
                : ""
            );
            setEngagement(
              poster.engagement != null ? String(poster.engagement) : ""
            );
            setCommunication(
              poster.communication != null ? String(poster.communication) : ""
            );
            setOverallImpression(
              poster.overall_impression != null
                ? String(poster.overall_impression)
                : ""
            );
            setFeedback(poster.feedback || "");

            // Additional fields from the updated API
            setPosterTitle(poster.poster_title || "Untitled");
            setStudentName(poster.student_name || "Unknown");
            setStudentEmail(poster.student_email || "No email");
            setStudentId(poster.student || null);
          }
        }
      } catch (err) {
        console.error("Error fetching ThreeMT poster", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [posterId]);

  // Show a spinner if still loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Fetching ThreeMT Poster...</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    // Convert the string values to integers (default to 0 if blank/NaN)
    const comprehensionVal = parseInt(comprehensionContent, 10) || 0;
    const engagementVal = parseInt(engagement, 10) || 0;
    const communicationVal = parseInt(communication, 10) || 0;
    const overallVal = parseInt(overallImpression, 10) || 0;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/three-mt/update/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            poster_id: Number(posterId),
            student: studentId,
            comprehension_content: comprehensionVal,
            engagement: engagementVal,
            communication: communicationVal,
            overall_impression: overallVal,
            feedback: feedback,
          }),
        }
      );

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/judge/three-mt");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data?.error || "Failed to update");
      }
    } catch (err) {
      console.error("Error updating scores:", err);
      setError("Server error or network problem.");
    }

    setSubmitLoading(false);
  };

  return (
    <>
      <CountdownTimer targetDate={new Date("2023-04-22T09:00:00-05:00")} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600] min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-3">
              ThreeMT Poster Score
            </h1>

            {/* Show additional info about the poster */}
            <div className="mb-4">
              <p><strong>Poster Title:</strong> {posterTitle}</p>
              <p><strong>Student Name:</strong> {studentName}</p>
              <p><strong>Student Email:</strong> {studentEmail}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge pill className="round-badge">
                    Poster ID: {posterId}
                  </Badge>
                </div>
            {/* Success message */}
            <div style={{ height: "40px" }} className="mt-1">
              {showSuccess && (
                <div className="p-2 rounded bg-green-100 border border-green-300 text-green-800 text-sm transition-opacity duration-300">
                  ✅ Scores updated successfully!
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
            <FormInput
                label="Communication (0-10)"
                value={communication}
                onChange={setCommunication}
              />
            <FormInput
                label="Engagement (0-10)"
                value={engagement}
                onChange={setEngagement}
              />
              <FormInput
                label="Comprehension & Content (0-10)"
                value={comprehensionContent}
                onChange={setComprehensionContent}
              />
              <FormInput
                label="Overall Impression (0-10)"
                value={overallImpression}
                onChange={setOverallImpression}
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
                />
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

function FormInput({ label, value, onChange }) {
  const handleChange = (e) => {
    onChange(e.target.value); // store raw string
  };

  return (
    <div className="mb-3">
      <label className="block text-gray-700 font-bold mb-1">{label}</label>
      <input
        type="text"
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
}

export default ThreeMTEdit;
