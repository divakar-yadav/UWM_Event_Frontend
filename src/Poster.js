import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner"; // NEW import for the spinner
import { useNavigate } from "react-router-dom";

import CountdownTimer from "./CountdownTimer";
import FeedbackComponent from "./FeedbackComponent";

import "./index.css";
import "./ScoreTableRound1.css";
import "./Roundtwo.css";

function ScoreEntry() {
  useEffect(() => {
    document.title = "Score Entry Page";
  }, []);

  const [judge, setJudge] = useState("");
  const [round1Score, setRound1Score] = useState([]);
  const [finalistPosterId, setFinalistPosterId] = useState([]);
  const [loading, setLoading] = useState(true);
  const [round1PosterId, setRound1PosterId] = useState("");
  const [status_of_round_1_table, set_status_of_round_1_table] = useState(true);
  const [posterError, setPosterError] = useState(""); // for error message
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/home?scoring_type=research poster`,
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
        setRound1Score(data.score_round_1);
        setFinalistPosterId(data.finalist_poster_id);
        set_status_of_round_1_table(data.status_of_round_1_table);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Show spinner while loading
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          {/* <span className="visually-hidden">Loading...</span> */}
        </Spinner>
        <p className="mt-3">Fetching Scores...</p>
      </div>
    );
  }

  return (
    <>
      <CountdownTimer targetDate={new Date("2023-04-22T09:00:00-05:00")} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600]">
        <Judgeinfo judge={judge} />
        <div className="container">
          <Roundone
            finalistPosterId={finalistPosterId}
            round1PosterId={round1PosterId}
            setRound1PosterId={setRound1PosterId}
            posterError={posterError}
            setPosterError={setPosterError}
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

function Judgeinfo({ judge }) {
  return (
    <div className="container mx-auto px-4 py-6 sm:max-w-md md:max-w-lg lg:max-w-xl">
      <div className="bg-white shadow-md rounded-lg p-8 animate__animated animate__fadeIn">
        <h1 className="text-4xl font-bold text-center mb-6 animate__animated animate__fadeInDown">
          Research Poster Score Entry
        </h1>
        <h2 className="text-center mb-4">Welcome {judge}!</h2>
        <br />
        <div>
          <p className="mb-4">
          <strong>
    Thank you for being a judge today! Click "Begin Judging" to enter each poster's scores. You can edit your scores later if necessary. Check "Rubric" in
    the top menu for scoring guidelines.
  </strong>
          </p>
        </div>
      </div>
    </div>
  );
}

function Roundone({ finalistPosterId, round1PosterId, setRound1PosterId, posterError, setPosterError }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = parseInt(round1PosterId);
  if (isNaN(id) || id < 100 || id > 299) {
    setPosterError("Only Poster IDs between 100 and 299 are allowed.");
    return;
  }
  setPosterError("");
    setLoading(true);

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/precheckposter/round1_pre_check/${round1PosterId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    // handle response
    if (response.status !== 200) {
      const data = await response.json();
      setPosterError(data.status || "Invalid Poster ID.");
     {/*} if (data.status) {
        document.getElementById("poster-1-error").innerHTML = data.status;
        document.getElementById("poster-1-error").style.color = "red";
      } else {
        document.getElementById("poster-1-error").innerHTML =
          'Something went wrong, Please refresh the page; <button onClick={window.location.reload()}>Refresh</button>';
        document.getElementById("poster-1-error").style.color = "red";
      }*/}
      setLoading(false);
    } else {
      navigate("/editscore/1/research-poster/" + round1PosterId);
      setLoading(false);
    }
  };

  return (
    <>
      {finalistPosterId.length === 0 && (
        <div className="text-2xl font-bold text-center mb-4 bg-white shadow-md rounded-lg p-4">
          <form onSubmit={handleSubmit} className="roundone-form">
            <div className="mb-3">
              <label htmlFor="posterId" className="block font-bold mb-1">
                Poster ID Number
              </label>
              <input
                type="number"
                inputMode="numeric"
                //min = "100"
                //max = "299"
                onWheel={(e) => e.target.blur()}
                className="w-full p-2 border border-gray-300 rounded no-spinner"
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
                  {/* Loading... */}
                </>
              ) : (
                "Begin Judging"
              )}
            </button>
            {posterError && (
            <p id="poster-1-error" className="text-red-500 text-sm mt-2">
          {posterError}</p>)}
          </form>
        </div>
      )}
      <br />
    </>
  );
}

function ScoreTableRound1({ round1Score, status_of_round_1_table,judge }) {
  if (!status_of_round_1_table || round1Score.length === 0) return null;

  return (
    <>
      <div className="container-card">
        <h3 className="text-2xl font-bold text-center mb-4 bg-white shadow-md rounded-lg p-4 animate__animated animate__fadeInDown">
          Posters Scored by :
          <br />
        <span className="block text-center"><u>{judge}</u></span>
        </h3>
        <div className="row">
          {round1Score.map((score) => (
            <div className="col-md-4 mb-4" key={score.id}>
              <Card className="h-100 shadow-sm rounded score-card">
                <Card.Body>
                  <Card.Title className="mb-3 student-name">
                    <strong>{score.student_name}</strong> 
                  </Card.Title>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Badge pill className="round-badge">
                      Poster ID: {score.poster_id}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <div><strong>Research Score (0-50)</strong></div>
                    <div>{score.research_score}</div>
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
                    <div><strong>Total Score(100)</strong></div>
                    <div>{score.total_score}</div>
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
                        (window.location.href =
                          "/editscore/1/research-poster/" + score.poster_id)
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
      <br />
    </>
  );
}

export default ScoreEntry;
