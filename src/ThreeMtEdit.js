import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { useNavigate } from 'react-router-dom';

function ThreeMTEdit() {
  const { posterId } = useParams();
  const [loading, setLoading] = useState(true);
  const [comprehensionContent, setComprehensionContent] = useState(0);
  const [engagement, setEngagement] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [overallImpression, setOverallImpression] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [studentId, setStudentId] = useState(null); // ✅ New state

  useEffect(() => {
    document.title = "Edit ThreeMT Score";
  }, []);
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/three-mt?poster_id=${posterId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!ignore && res.ok) {
          const data = await res.json();
          const poster = data.ThreeMT_posters.find(p => String(p.poster_id) === posterId);
          if (poster) {
            setComprehensionContent(poster.comprehension_content || 0);
            setEngagement(poster.engagement || 0);
            setCommunication(poster.communication || 0);
            setOverallImpression(poster.overall_impression || 0);
            setFeedback(poster.feedback || '');
            setStudentId(poster.student || null);
          }
        }
      } catch (err) {
        console.error("Error fetching ThreeMT poster", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();
    return () => { ignore = true };
  }, [posterId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    const res = await fetch(`${process.env.REACT_APP_API_URL}/three-mt/update/`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        poster_id: Number(posterId),
        student:studentId,
        comprehension_content: comprehensionContent,
        engagement: engagement,
        communication: communication,
        overall_impression: overallImpression,
        feedback: feedback
      })
    });

    if (res.ok) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      navigate('/judge/three-mt');
    } else {
      const data = await res.json();
      setError(data?.error || 'Failed to update');
    }

    setSubmitLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <CountdownTimer targetDate={new Date('2023-04-22T09:00:00-05:00')} />
      <div className="bg-gradient-to-r from-ffbd00 to-[#eca600] min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-lg p-6 shadow-md max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-3">Edit ThreeMT Poster Score</h1>
            <div style={{ height: '40px' }} className="mt-1">
              {showSuccess && (
                <div className="p-2 rounded bg-green-100 border border-green-300 text-green-800 text-sm transition-opacity duration-300">
                  ✅ Scores updated successfully!
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <FormInput label="Comprehension & Content (0-10)" value={comprehensionContent} onChange={setComprehensionContent} />
              <FormInput label="Engagement (0-10)" value={engagement} onChange={setEngagement} />
              <FormInput label="Communication (0-10)" value={communication} onChange={setCommunication} />
              <FormInput label="Overall Impression (0-10)" value={overallImpression} onChange={setOverallImpression} />

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
    <div className="mb-3">
      <label className="block text-gray-700 font-bold mb-1">{label}</label>
      <input
        type="number"
        className="w-full border rounded px-3 py-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

export default ThreeMTEdit;
