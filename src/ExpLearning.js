import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner"; // <-- Import the Spinner
import { useNavigate } from "react-router-dom";

import CountdownTimer from "./CountdownTimer";
import FeedbackComponent from "./FeedbackComponent";

import "./index.css";
import "./ScoreTableRound1.css";
import "./Roundtwo.css";

function ExpLearning() {
  useEffect(() => {
    document.title = "Score Entry Page";
  }, []);

  const [judge, setJudge] = useState("");
  const [round1Score, setRound1Score] = useState([]);
  const [finalistPosterId, setFinalistPosterId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [round1PosterId, setRound1PosterId] = useState("");
  const [status_of_round_1_table, set_status_of_round_1_table] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/home?scoring_type=explearning`,
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
        setRound1Score(data.exp_learning_scores);
        setFinalistPosterId(data.finalist_poster_id);
        set_status_of_round_1_table(data.status_of_exp_learning_table);
      } catch (error) {
        console.error("Error fetching ExpLearning data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show a spinner if still loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Fetching Scores...</p>
      </div>
    );
  }

  return (
    <>
      <CountdownTimer targetDate={new Date("2023-04-22T09:00:00-05:00")} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600]">
        <JudgeInfo judge={judge} />
        <div className="container">
          <RoundOne
            finalistPosterId={finalistPosterId}
            round1PosterId={round1PosterId}
            setRound1PosterId={setRound1PosterId}
            setRound1Score={setRound1Score}
          />
          <ScoreTableRound1
            round1Score={round1Score}
            status_of_round_1_table={status_of_round_1_table}
            judge={judge}

          />
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
          Experiential Learning Score Entry
        </h1>
        <h2 className="mb-4">Welcome {judge}!</h2>
        <br />
        <div>
          <p className="mb-4">
            Thank you for being a judge today! Please enter scores numerically
            for one poster at a time. When you enter the poster ID, the
            student's name and poster title will display (if your API includes
            that info). Once you have clicked "Begin Judging," you can
            enter/edit that poster's scores. You can edit your scores later if
            necessary. Click "Rubric" on the above menu to view the scoring
            rubric if needed.
          </p>
        </div>
      </div>
    </div>
  );
}

function RoundOne({
  finalistPosterId,
  round1PosterId,
  setRound1PosterId,
  setRound1Score,
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit1 = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/explearning?poster_id=${round1PosterId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    console.log(data);

    // Update local data with what we got
    setRound1Score(data.Exp_learning_posters);

    if (response.status !== 200) {
      alert(data.status);
      setLoading(false);
    } else {
      // If everything is ok, go to edit page
      navigate("/editscore/1/explearning/" + round1PosterId);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="text-2xl font-bold text-center mb-4 bg-white shadow-md rounded-lg p-4">
        <form onSubmit={handleSubmit1} className="roundone-form">
          <div className="mb-3">
            <label htmlFor="posterId" className="block font-bold mb-1">
              Poster ID Number
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded"
              id="posterId"
              aria-describedby="posterId"
              value={round1PosterId}
              onChange={(e) => setRound1PosterId(e.target.value)}
            />
            <div id="Round-1" className="text-sm text-gray-500">
              Enter Poster ID
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-full flex items-center justify-center roundone-btn"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2" aria-hidden="true">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm5.5 9a1.5 1.5 0 01-1.5 1.5h-3v3a1.5 1.5 0 01-3 0v-3h-3a1.5 1.5 0 010-3h3v-3a1.5 1.5 0 013 0v3h3a1.5 1.5 0 011.5 1.5z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Loading...
              </>
            ) : (
              "Begin Judging"
            )}
          </button>
          <p id="poster-1-error" className="text-red-500 text-sm mt-2"></p>
        </form>
      </div>
      <br />
    </>
  );
}

function ScoreTableRound1({ round1Score, status_of_round_1_table, judge }) {
  if (!round1Score?.length) return null;

  return (
    <>
      <div className="container-card">
      <h3 className="text-2xl font-bold text-center mb-4 bg-white shadow-md rounded-lg p-4 animate__animated animate__fadeInDown">
        Posters scored by <u>{judge}</u>
      </h3>
        <div className="row">
          {round1Score.map((score, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <Card className="h-100 shadow-sm rounded score-card">
                <Card.Body>
                  {/* Show student name + poster title from the updated API */}
                  <Card.Title className="mb-3 student-name">
                    <strong>{score.student_name || "No Student Name"}</strong>
                    
                  </Card.Title>
                  <div className="mb-2">
                    <strong>Poster Title:</strong> {score.poster_title || "N/A"}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Badge pill className="round-badge">
                      Poster ID: {score.poster_id}
                    </Badge>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <div><strong>Reflection Score (0-50)</strong></div>
                    <div>{score.reflection_score}</div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <div><strong>Communication Score (0-30)</strong></div>
                    <div>{score.communication_score}</div>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <div><strong>Presentation Score (0-20)</strong></div>
                    <div>{score.presentation_score}</div>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <div><strong>Total Score (100)</strong></div>
                    <div>
                      {(score.reflection_score || 0) +
                        (score.communication_score || 0) +
                        (score.presentation_score || 0)}
                    </div>
                  </div>
                  <hr />
                  <div className="feedback-section mt-2">
                    <div className="font-bold">Feedback:</div>
                    <FeedbackComponent
                      feedback={score.feedback}
                      maxLength={100}
                    />
                  </div>

                  <div className="text-right mt-4">
                    <button
                      type="button"
                      className="btn edit-score-btn"
                      onClick={() =>
                        (window.location.href =
                          "/editscore/1/explearning/" + score.poster_id)
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
        <br />
      </div>
    </>
  );
}

export default ExpLearning;
