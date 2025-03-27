import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import CountdownTimer from './CountdownTimer';
import Toast from 'react-bootstrap/Toast';
import { useNavigate } from 'react-router-dom';

function EditRound({ round }) {
  const { posterId } = useParams();
  const [posterIdRound] = useState(posterId);
  const [posterTitle, setPosterTitle] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentDepartment, setStudentDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [researchScore, setResearchScore] = useState(0);
  const [communicationScore, setCommunicationScore] = useState(0);
  const [presentationScore, setPresentationScore] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    document.title = `Edit Poster Score`;
  }, [round]);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/insertgrade/round${round}_edit/${posterId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!ignore && response.status === 200) {
        const data = await response.json();
        setPosterTitle(data.poster_title);
        setStudentName(data.student_name);
        setStudentEmail(data.student_email);
        setStudentDepartment(data.student_department);
        setResearchScore(data.research_score);
        setCommunicationScore(data.communication_score);
        setPresentationScore(data.presentation_score);
        setFeedback(data.feedback);
        setLoading(false);
      }
    };

    fetchData();
    return () => { ignore = true; };
  }, [posterIdRound, round]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <CountdownTimer targetDate={new Date('2023-04-22T09:00:00-05:00')} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600] min-h-screen py-6">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white shadow-md rounded-lg p-8 mb-6">
            <h1 className="text-3xl font-bold text-center mb-4">Edit Poster Score</h1>
            <p className="text-gray-700 mb-2"><strong>Poster ID:</strong> {posterIdRound}</p>
            <p className="text-gray-700 mb-2"><strong>Poster Title:</strong> {posterTitle}</p>
            <p className="text-gray-700 mb-2"><strong>Student Name:</strong> {studentName}</p>
            <p className="text-gray-700 mb-2"><strong>Student Department:</strong> {studentDepartment}</p>
            <a href='/judge/research-poster'>
              <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                &lt;&lt; Go back
              </button>
            </a>
          </div>

          <Scoringfields
            posterIdRound={posterIdRound}
            researchScore={researchScore}
            communicationScore={communicationScore}
            presentationScore={presentationScore}
            feedback={feedback}
            setResearchScore={setResearchScore}
            setCommunicationScore={setCommunicationScore}
            setPresentationScore={setPresentationScore}
            setFeedback={setFeedback}
            round={round}
          />
        </div>
      </div>
    </>
  );
}

function Scoringfields({
  posterIdRound,
  researchScore,
  communicationScore,
  presentationScore,
  feedback,
  setResearchScore,
  setCommunicationScore,
  setPresentationScore,
  setFeedback,
  round,
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFormsubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/insertgrade/round${round}_edit/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        poster_id: posterIdRound,
        research_score: researchScore,
        communication_score: communicationScore,
        presentation_score: presentationScore,
        feedback: feedback,
      }),
    });

    if (response.status === 200) {
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      navigate('/judge/research-poster')
    } else {
      const data = await response.json();
      setError(data.error);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-8 mb-6">
        <form onSubmit={handleFormsubmit}>
          <div className="mb-4">
            <label htmlFor="researchScore" className="block text-gray-700 font-bold mb-2">Research Score (0-50)</label>
            <input type="number" className="w-full border px-3 py-2 rounded" id="researchScore" value={researchScore} onChange={(e) => setResearchScore(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="communicationScore" className="block text-gray-700 font-bold mb-2">Communication Score (0-30)</label>
            <input type="number" className="w-full border px-3 py-2 rounded" id="communicationScore" value={communicationScore} onChange={(e) => setCommunicationScore(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="presentationScore" className="block text-gray-700 font-bold mb-2">Presentation Score (0-20)</label>
            <input type="number" className="w-full border px-3 py-2 rounded" id="presentationScore" value={presentationScore} onChange={(e) => setPresentationScore(e.target.value)} />
          </div>
          <div className="mb-4">
            <label htmlFor="feedback" className="block text-gray-700 font-bold mb-2">Feedback</label>
            <textarea className="w-full border px-3 py-2 rounded" id="feedback" rows={4} value={feedback} onChange={(e) => setFeedback(e.target.value)} />
          </div>
          <p className="text-red-500 text-sm italic mb-4">{error}</p>
          <button type="submit" className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            {loading ? "Submitting..." : "Submit Scores"}
          </button>
        </form>
      </div>

      <Toast
        onClose={() => setShowSuccess(false)}
        show={showSuccess}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          top: '20px',
          right: '30px',
          minWidth: '250px',
          backgroundColor: '#d1fae5',
          border: '1px solid #10b981',
          color: '#065f46',
          zIndex: 9999,
        }}
      >
        <Toast.Body><strong>Success:</strong> Scores submitted successfully!</Toast.Body>
      </Toast>
    </>
  );
}

export default EditRound;
