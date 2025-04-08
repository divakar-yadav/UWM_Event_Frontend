import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const firstName = localStorage.getItem('first_name');

  useEffect(() => {
    document.title = 'UWM Research Poster Competition & Experiential Learning Expo & Three Minute Thesis - 2025';
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4" style={{ backgroundColor: '#ffbd00' }}>
      
      {/* Conditionally render greeting */}
      {firstName && (
        <h2 className="text-2xl font-semibold mb-4">Hi {firstName} 👋</h2>
      )}

      <h1 className="text-3xl font-bold text-center mb-4 mt-2">
        Welcome to 2025 Research Poster Competition & Experiential Learning Expo & Three Minute Thesis!
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center relative">
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 text-black text-2xl">📌</div>
          <h3 className="text-xl font-bold mb-2">Research Poster</h3>
          <ul className="list-disc list-inside text-left">
            <li>Research (up to 50 points)</li>
            <li>Communication (up to 30 points)</li>
            <li>Appearance & Presentation (up to 20 points)</li>
          </ul>
          <p className="text-sm mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-2 rounded">
  <strong>Note for Judges:</strong><br />
  <strong>IDs starting with 100:</strong> Undergraduate Research Poster<br />
  <strong>IDs starting with 200:</strong> Graduate Research Poster
</p>
<button
          className="w-full bg-black text-white py-3 px-6 rounded-lg shadow-md mb-4 hover:bg-gray-800 transition duration-300"
          onClick={() => navigate('/judge/research-poster')}
        >
          Begin Judging for the Research Poster
        </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 text-center relative">
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 text-black text-2xl">📌</div>
          <h3 className="text-xl font-bold mb-2">Experiential Learning Poster</h3>
          <ul className="list-disc list-inside text-left">
            <li>Reflection (up to 50 points)</li>
            <li>Communication (up to 30 points)</li>
            <li>Appearance & Presentation (up to 20 points)</li>
          </ul>
          <p className="text-sm mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-2 rounded">
  <strong>Note for Judges:</strong><br />
  <strong>IDs starting with 300:</strong> Experiential Learning
</p>
<button
          className="w-full bg-black text-white py-3 px-6 rounded-lg shadow-md mb-4 hover:bg-gray-800 transition duration-300"
          onClick={() => navigate('/judge/exp-learning')}
        >
          Begin Judging for the Exp Learning
        </button>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 text-center relative">
          <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 text-black text-2xl">📌</div>
          <h3 className="text-xl font-bold mb-2">Three Minute Thesis</h3>
          <ul className="list-disc list-inside text-left">
            <li>Comprehension & Content (up to 10 points)</li>
            <li>Engagement (up to 10 points)</li>
            <li>Communication (up to 10 points)</li>
            <li>Overall Impression (up to 10 points)</li>
          </ul>
          <p className="text-sm mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-900 p-2 rounded">
  <strong>Note for Judges:</strong><br />
  <strong>IDs starting with 400:</strong> Three Minute Thesis (3MT)
</p> <button
          className="w-full bg-black text-white py-3 px-6 rounded-lg shadow-md mb-4 hover:bg-gray-800 transition duration-300"
          onClick={() => navigate('/judge/three-mt')}
        >
          Begin Judging for the 3 Minute Thesis
        </button>
        </div>
      </div>

      

      <div className="w-full max-w-md flex flex-col items-center">
       
      </div>
    </div>
  );
};

export default Home;
