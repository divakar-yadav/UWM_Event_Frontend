import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboardPanel() {
  const [isSuperUser, setIsSuperUser] = useState(null);
  const [category, setCategory] = useState("3mt");
  const [view, setView] = useState("scores");
  const [data, setData] = useState([]);
  const [aggregateDataUG, setAggregateDataUG] = useState([]);
  const [aggregateDataGrad, setAggregateDataGrad] = useState([]);
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;

  const LOCAL_BASE_URL = "http://localhost:8000";

  useEffect(() => {
    if (!token) {
      setIsSuperUser(false);
      return;
    }
    axios.get(`${API_URL}/signin/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setIsSuperUser(res.data.is_superuser);
    })
    .catch(() => {
      setIsSuperUser(false);
    });
  }, [token, API_URL]);

  useEffect(() => {
    if (isSuperUser) {
      fetchData();
    }
  }, [isSuperUser, category, view]);

  const fetchData = () => {
    if (!token) return;
  
    if (view === "judge") {
      fetchJudgeProgress();
      return;
    }
    
    let endpoint = "";
    if (view === "scores") endpoint = "sorted_scores";
    if (view === "student") endpoint = "status";
  
    axios.get(`${API_URL}/pa-283771828/${endpoint}/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setData(res.data);
    })
    .catch(() => {
      setData([]);
    });
  };
  const fetchJudgeProgress = () => {
    if (!token) return;

    axios.get(`${API_URL}/pa-283771828/judge_poster_status/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setData(res.data);
    })
    .catch(() => {
      setData([]);
    });
  };
  const exportToExcel = () => {
    window.open(`${API_URL}/pa-283771828/export_excel/?category=${category}`, "_blank");
  };

  const fetchAggregateData = () => {
    if (!token) return;

    axios.get(`${API_URL}/pa-283771828/category_aggregate/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const rawData = res.data || [];
  
      const finalStudents = rawData.map(student => {
        const avgScore = (student.total_score && student.judges_count)
          ? (student.total_score / student.judges_count).toFixed(2)
          : "N/A";
  
        return {
          name: student.name || "Unknown",
          poster_id: student.poster_id || "Unknown",
          department: student.department || "Unknown",
          advisor: student.advisor || "Unknown",
          title: student.title || "Unknown",
          category: student.poster_id >= 101 && student.poster_id <= 199 ? "UG" : "Grad",
          avg_score: avgScore
        };
      });
  
      if (category === "respost") {
        const ug = finalStudents.filter(s => s.category === "UG")
          .sort((a, b) => b.avg_score - a.avg_score)
          .slice(0, 3);
  
        const grad = finalStudents.filter(s => s.category === "Grad")
          .sort((a, b) => b.avg_score - a.avg_score)
          .slice(0, 3);
  
        setAggregateDataUG(ug);
        setAggregateDataGrad(grad);
      } else {
        const top3 = finalStudents.sort((a, b) => b.avg_score - a.avg_score).slice(0, 3);
        setAggregateDataUG(top3);
        setAggregateDataGrad([]);
      }
    })
    .catch(() => {
      setAggregateDataUG([]);
      setAggregateDataGrad([]);
    });
  };

  if (isSuperUser === null) {
    return <p>Loading Admin Dashboard...</p>;
  }

  if (isSuperUser === false) {
    return <p>Access Denied — Admins only.</p>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-center">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h2>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <label className="font-bold">Select Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="3mt">Three Minute Thesis (3MT)</option>
          <option value="exp">Experiential Learning</option>
          <option value="respost">Research Poster</option>
        </select>
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Export to Excel
        </button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={() => setView("scores")} className={`px-4 py-2 rounded ${view === "scores" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Scores</button>
        <button onClick={() => setView("judge")} className={`px-4 py-2 rounded ${view === "judge" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Judge Progress</button>
        <button onClick={() => setView("student")} className={`px-4 py-2 rounded ${view === "student" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Student Status</button>
      </div>

      <div className="flex space-x-4 mb-6">
        <button onClick={fetchAggregateData} className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Calculate Aggregate Scores
        </button>
      </div>

      {(aggregateDataUG.length > 0 || aggregateDataGrad.length > 0) && (
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Top 3 Students (UG)</h3>
          <AggregateTable students={aggregateDataUG} />
          <h3 className="text-xl font-bold mt-6 mb-2">Top 3 Students (Grad)</h3>
          <AggregateTable students={aggregateDataGrad} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              {view === "scores" && (<>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Poster ID</th>
                <th className="border px-4 py-2">Average Score</th>
                <th className="border px-4 py-2">Judge Count</th>
              </>)}
              {view === "judge" && (<>
                <th className="border px-4 py-2">Judge First Name</th>
                <th className="border px-4 py-2">Judge Email</th>
                <th className="border px-4 py-2">Posters Scored</th>
                <th className="border px-4 py-2">Total Posters</th>
              </>)}
              {view === "student" && (<>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Poster ID</th>
                <th className="border px-4 py-2">Scored By</th>
              </>)}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, idx) => (
                <tr key={idx}>
                  {view === "scores" && (<>
                    <td className="border px-4 py-2">{item.student__Name || item.Student__Name}</td>
                    <td className="border px-4 py-2">{item.student__poster_ID || item.Student__poster_ID}</td>
                    <td className="border px-4 py-2">{item.avg_score}</td>
                    <td className="border px-4 py-2">{item.judge_count}</td>
                  </>)}
                  {view === "judge" && (<>
                    <td className="border px-4 py-2">{item.judge_first_name}</td>
                    <td className="border px-4 py-2">{item.judge_email}</td>
                    <td className="border px-4 py-2">{item.posters_scored?.join(", ")}</td>
                    <td className="border px-4 py-2">{item.total_scored}</td>
                  </>)}
                  {view === "student" && (<>
                    <td className="border px-4 py-2">{item.student}</td>
                    <td className="border px-4 py-2">{item.poster_id}</td>
                    <td className="border px-4 py-2">{item.scored}/{item.total}</td>
                  </>)}
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2" colSpan="4">No data available for this view.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AggregateTable({ students }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Poster ID</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Advisor</th>
            <th className="border px-4 py-2">Title</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Average Score</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, idx) => (
            <tr key={idx}>
              <td className="border px-4 py-2">{student.name}</td>
              <td className="border px-4 py-2">{student.poster_id}</td>
              <td className="border px-4 py-2">{student.department}</td>
              <td className="border px-4 py-2">{student.advisor}</td>
              <td className="border px-4 py-2">{student.title}</td>
              <td className="border px-4 py-2">{student.poster_id >= 101 && student.poster_id <= 199 ? "UG" : "Grad"}</td>
              <td className="border px-4 py-2">{student.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
