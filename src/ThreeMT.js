import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner"; // <-- Import Spinner
import { useNavigate } from "react-router-dom";

import CountdownTimer from "./CountdownTimer";
import FeedbackComponent from "./FeedbackComponent";

import "./index.css";
import "./ScoreTableRound1.css";
import "./Roundtwo.css";

function ThreeMT() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "ThreeMT Score Entry Page";
  }, []);

  const [judge, setJudge] = useState("");
  const [scores, setScores] = useState([]);
  const [posterId, setPosterId] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/home?scoring_type=threemt`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setJudge(data.Judge);
        setScores(data.threemt_scores);
        setStatus(data.status_of_threemt_table);
      } catch (err) {
        console.error("Error fetching ThreeMT data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/three-mt?poster_id=${posterId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) {
        const data = await response.json();
        if (data.status) {
          alert(data.status);
        } else {
          alert("Something went wrong. Please refresh the page.");
        }
        setLoading(false);
      } else {
        setLoading(false);
        navigate("/editscore/threemt/" + posterId);
      }
    } catch (error) {
      console.error("Error checking poster:", error);
      setLoading(false);
      alert("An error occurred. Please try again.");
    }
  };

  // Show spinner while loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Fetching ThreeMT Data...</p>
      </div>
    );
  }

  return (
    <>
      <CountdownTimer targetDate={new Date("2023-04-22T09:00:00-05:00")} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600]">
        <JudgeInfo judge={judge} />
        <div className="container">
          <PosterInputForm
            posterId={posterId}
            setPosterId={setPosterId}
            handleSubmit={handleSubmit}
          />
          <ScoreTable scores={scores} status={status} judge={judge} />
        </div>
      </div>
    </>
  );
}

function JudgeInfo({ judge }) {
  return (
    <div className="container mx-auto px-4 py-6 sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="bg-white shadow-md rounded-lg p-8 animate__animated animate__fadeIn">
        <h1 className="text-4xl font-bold text-center mb-6 animate__animated animate__fadeInDown">
          Three Minutes Thesis Score Entry
        </h1>
        <h2 className="mb-4">Welcome {judge}!</h2>
        <p className="mb-4">
          Thank you for being a judge today! Please enter scores for one poster
          at a time. After submission, your scores appear below. You can edit
          them as needed. Click "Rubric" in the top menu for more info.
        </p>
      </div>
    </div>
  );
}

function PosterInputForm({ posterId, setPosterId, handleSubmit }) {
  return (
    <div className="text-2xl font-bold text-center mb-4 bg-white shadow-md rounded-lg p-4">
      <form onSubmit={handleSubmit} className="roundone-form">
        <div className="mb-3">
          <label htmlFor="posterId" className="block font-bold mb-1">
            Poster ID Number
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            id="posterId"
            value={posterId}
            onChange={(e) => setPosterId(e.target.value)}
          />
          <div className="text-sm text-gray-500">Enter Poster ID</div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex items-center justify-center roundone-btn"
        >
          Begin Judging
        </button>
        <p id="poster-1-error" className="text-red-500 text-sm mt-2"></p>
      </form>
    </div>
  );
}

function ScoreTable({ scores, status, judge }) {
  if (!status || scores.length === 0) return null;

  return (
    <div className="container-card">
      <h3 className="text-2xl font-bold text-center mb-4 bg-white shadow-md rounded-lg p-4 animate__animated animate__fadeInDown">
        Posters Scored by <u>{judge}</u>
      </h3>
      <div className="row">
        {scores.map((score, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <Card className="h-100 shadow-sm rounded score-card">
              <Card.Body>
                {/* Additional fields from the updated API */}
                <Card.Title className="mb-3 student-name">
                  <strong>{score.student_name || "Unknown Student"}</strong>
                </Card.Title>
                <div className="mb-2">
                  <strong>Poster Title:</strong>{" "}
                  {score.poster_title || "No Title"}
                </div>

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <Badge pill className="round-badge">
                    Poster ID: {score.poster_id}
                  </Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div><strong>Communication (0-10)</strong></div>
                  <div>{score.communication}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div><strong>Engagement (0-10)</strong></div>
                  <div>{score.engagement}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div><strong>Comprehension Content (0-10)</strong></div>
                  <div>{score.comprehension_content}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div><strong>Overall Impression (0-10)</strong></div>
                  <div>{score.overall_impression}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div><strong>Total Score (40)</strong></div>
                  <div>
                    {(score.comprehension_content || 0) +
                      (score.engagement || 0) +
                      (score.communication || 0) +
                      (score.overall_impression || 0)}
                  </div>
                </div>
                <hr />
                <div className="feedback-section mt-2">
                  <div className="font-bold">Feedback:</div>
                  <FeedbackComponent feedback={score.feedback} maxLength={100} />
                </div>

                <div className="text-right mt-4">
                  <button
                    type="button"
                    className="btn edit-score-btn"
                    onClick={() =>
                      (window.location.href = `/editscore/threemt/${score.poster_id}`)
                    }
                  >
                    Edit Score
                  </button>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ThreeMT;
