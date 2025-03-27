import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import CountdownTimer from './CountdownTimer';
import FeedbackComponent from "./FeedbackComponent";

import "./index.css";
import './ScoreTableRound1.css';
import './Roundtwo.css';

function ThreeMT() {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/home?scoring_type=threemt`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      setJudge(data.Judge);
      setScores(data.threemt_scores);
      setStatus(data.status_of_threemt_table);
      setLoading(false);
    };

    fetchData();
  }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     window.location.href = `/editscore/1/threemt/${posterId}`;
//   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // url to check if the poster id is valid or not
    // http://127.0.0.1:8000/precheckposter/round1_pre_check/ + round1PosterId

    const response = await fetch(`${process.env.REACT_APP_API_URL}/three-mt?poster_id=${posterId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    console.log(data);

    // if the response is apart from 200 then show the error message
    if (response.status !== 200) {
      const data = await response.json();
      // if there is data.status then show the error message
      if (data.status) {
        document.getElementById("poster-1-error").innerHTML = data.status;
        document.getElementById("poster-1-error").style.color = "red";
        setLoading(false);
      }
      else {
        document.getElementById("poster-1-error").innerHTML = "Something went wrong, Please refresh the page; <button onClick={window.location.reload()}>Refresh</button>";
        document.getElementById("poster-1-error").style.color = "red";
        setLoading(false);
      }
    }
    else {
        setScores(data.ThreeMT_posters)
        setStatus(true)
        window.location.href = `/editscore/1/threemt/${posterId}`;
        setLoading(false);
    }
  }
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <CountdownTimer targetDate={new Date('2023-04-22T09:00:00-05:00')} />

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
          Thank you for being a judge today! Please enter scores numerically for one poster at a time.
          Once you have clicked Submit Scores you will see all of your scores at the bottom of the page.
          You can edit your scores later if necessary. To see the scoring rubric, click on Rubric on the above menu.
        </p>
      </div>
    </div>
  );
}

function PosterInputForm({ posterId, setPosterId, handleSubmit }) {
  return (
    <div className="text-2xl font-bold text-center mb-4 bg-white shadow-md rounded-lg p-4">
      <form onSubmit={handleSubmit}>
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
        {scores.map((score) => (
          <div className="col-md-4 mb-4" key={score.poster_id}>
            <Card className="h-100 shadow-sm rounded score-card">
              <Card.Body>
                <Card.Title className="mb-3 student-name">Poster ID: {score.poster_id}</Card.Title>

                <div className="d-flex justify-content-between mb-2">
                  <div>Comprehension Content (0-10)</div>
                  <div>{score.comprehension_content}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div>Engagement (0-10)</div>
                  <div>{score.engagement}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div>Communication (0-10)</div>
                  <div>{score.communication}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div>Overall Impression(0-10)</div>
                  <div>{score.overall_impression}</div>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <div>Total Score (40)</div>
                  <div>{score.comprehension_content + score.engagement + score.communication + score.overall_impression}</div>
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
                    onClick={() => window.location.href = `/editscore/1/threemt/${score.poster_id}`}
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
