import React, { useState, useEffect } from "react";
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

import "./index.css";
import './ScoreTableRound1.css';
import './Roundtwo.css';

import CountdownTimer from './CountdownTimer';
import FeedbackComponent from "./FeedbackComponent";
import { useParams, useNavigate } from 'react-router-dom';

function ExpLearningEdit() {
  const { posterId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reflectionScore, setReflectionScore] = useState(0);
  const [communicationScore, setCommunicationScore] = useState(0);
  const [presentationScore, setPresentationScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.title = `Edit Poster Score`;
  }, []);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/explearning?poster_id=${posterId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!ignore && response.status === 200) {
          const data = await response.json();
          const poster = data.Exp_learning_posters[0];
          setReflectionScore(poster.reflection_score || 0);
          setCommunicationScore(poster.communication_score || 0);
          setPresentationScore(poster.presentation_score || 0);
          setFeedback(poster.feedback || '');
        }
      } catch (err) {
        console.error('Failed to fetch poster data', err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => { ignore = true; };
  }, [posterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setShowSuccess(false);

    const response = await fetch(`${process.env.REACT_APP_API_URL}/explearning/update/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        poster_id: Number(posterId),
        reflection_score: Number(reflectionScore),
        communication_score: Number(communicationScore),
        presentation_score: Number(presentationScore),
        feedback: feedback
      })
    });

    if (response.status === 200) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/judge/exp-learning');
      }, 2000);
    } else {
      const data = await response.json();
      setError(data?.error || 'Update failed');
    }

    setSubmitLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <CountdownTimer targetDate={new Date('2023-04-22T09:00:00-05:00')} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600] min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-xl font-bold mb-4">Edit Poster Score</h1>

            <div style={{ height: '40px' }} className="mt-2">
              {showSuccess && (
                <div className="p-2 rounded bg-green-100 border border-green-300 text-green-800 text-sm transition-opacity duration-300">
                  ✅ Scores updated successfully!
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <FormInput label="Reflection Score (0-50)" value={reflectionScore} onChange={setReflectionScore} />
              <FormInput label="Communication Score (0-30)" value={communicationScore} onChange={setCommunicationScore} />
              <FormInput label="Presentation Score (0-20)" value={presentationScore} onChange={setPresentationScore} />

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Feedback</label>
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
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">{label}</label>
      <input
        type="number"
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default ExpLearningEdit;
