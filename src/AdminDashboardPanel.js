import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboardPanel() {
  const [isSuperUser, setIsSuperUser] = useState(null);
  const [category, setCategory] = useState("3mt");
  const [view, setView] = useState("scores");
  const [data, setData] = useState([]);
  const [aggregateDataUG, setAggregateDataUG] = useState([]);
  const [aggregateDataGrad, setAggregateDataGrad] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshMs, setRefreshMs] = useState(5000);
  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const LOCAL_BASE_URL = "http://localhost:8000";
const [aggStatus, setAggStatus] = useState({ loading: false, error: "", lastRun: "" });

useEffect(() => {
  if (!isSuperUser || !token) return;
  fetchAggregateData();
}, [category, isSuperUser, token]);
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

const setFilter = (key, value) => {
  setFilters((prev) => ({ ...prev, [key]: value }));
};

const requestSort = (key) => {
  setSortConfig((prev) => {
    if (prev.key === key) {
      return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
    }
    return { key, direction: "asc" };
  });
};

const applyFilterSort = (rows, columns) => {
  let data = [...rows];

  data = data.filter((row) =>
    columns.every((col) => {
      const f = (filters[col] ?? "").toString().trim().toLowerCase();
      if (!f) return true;
      const v = (row[col] ?? "").toString().toLowerCase();
      return v.includes(f);
    })
  );

  const { key, direction } = sortConfig;
  if (key) {
    data.sort((a, b) => {
      const va = a[key];
      const vb = b[key];

      const na = Number(va);
      const nb = Number(vb);
      const bothNumeric = !Number.isNaN(na) && !Number.isNaN(nb);

      if (bothNumeric) return direction === "asc" ? na - nb : nb - na;

      const sa = (va ?? "").toString().toLowerCase();
      const sb = (vb ?? "").toString().toLowerCase();
      if (sa < sb) return direction === "asc" ? -1 : 1;
      if (sa > sb) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  return data;
};

  useEffect(() => {
    if (isSuperUser) {
      fetchData();
    }
  }, [isSuperUser, category, view]);

  useEffect(() => {
      if (!isSuperUser || !autoRefresh) return;
      const id = setInterval(() => {
        fetchData();
      }, refreshMs);
      return () => clearInterval(id);
    }, [isSuperUser, autoRefresh, refreshMs, category, view]);

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

    axios.get(`${API_URL}/pa-283771828/judge_poster_status/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      setData(res.data);
    })
    .catch(() => {
      setData([]);
    });
  };
  const exportToExcel = async () => {
  if (!token) return;

  const res = await axios.get(
    `${API_URL}/pa-283771828/export_excel/?category=${category}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    }
  );

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `${category}_scores.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

  const fetchAggregateData = () => {
    if (!token) return;
    setAggStatus({ loading: true, error: "", lastRun: "" });
    axios.get(`${API_URL}/pa-283771828/aggregate/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(res => {
      const rawData = res.data || [];
  
      const finalStudents = rawData.map(student => {
        const avgScore = (student.total_score && student.judges_count)
          ? Number(student.total_score).toFixed(2)
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
      setAggStatus({ loading: false, error: "", lastRun: new Date().toLocaleTimeString() });
    })
    .catch(() => {
      setAggregateDataUG([]);
      setAggregateDataGrad([]);
      setAggStatus({ loading: false, error: "Aggregate fetch failed", lastRun: "" });
    });
  };

  if (isSuperUser === null) {
    return <p>Loading Admin Dashboard...</p>;
  }

  if (isSuperUser === false) {
    return <p>Access Denied — Admins only.</p>;
  }
  // Build normalized rows + columns for filter/sort
const rows =
  view === "judge"
    ? data.map((x) => ({
        judge_first_name: x.judge_first_name ?? "",
        judge_email: x.judge_email ?? "",
        posters_scored_count:
          x.posters_scored_count ??
          (Array.isArray(x.posters_scored) ? x.posters_scored.length : 0),
        total_posters: x.total_posters ?? x.total_scored ?? 0,
        poster_ids: Array.isArray(x.posters_scored) ? x.posters_scored.join(", ") : "",
      }))
    : view === "scores"
    ? data.map((x) => ({
        student_name: x.student__Name ?? x.Student__Name ?? "",
        poster_id: x.student__poster_ID ?? x.Student__poster_ID ?? "",
        avg_score: x.avg_score ?? "",
        judge_count: x.judge_count ?? "",
      }))
    : data.map((x) => ({
        student: x.student ?? "",
        poster_id: x.poster_id ?? "",
        scored_by: `${x.scored ?? 0}/${x.total ?? 0}`,
      }));

const columns =
  view === "judge"
    ? ["judge_first_name", "judge_email", "posters_scored_count", "total_posters", "poster_ids"]
    : view === "scores"
    ? ["student_name", "poster_id", "avg_score", "judge_count"]
    : ["student", "poster_id", "scored_by"];

const tableRows = applyFilterSort(rows, columns);
const sortArrow = (k) =>
  sortConfig.key === k ? (sortConfig.direction === "asc" ? " ▲" : " ▼") : "";
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
         <label className="ml-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
          />
          <span className="font-bold">Auto-refresh</span>
        </label>

        <select
          value={refreshMs}
          onChange={(e) => setRefreshMs(Number(e.target.value))}
          className="border p-2 rounded"
          disabled={!autoRefresh}
        >
          <option value={2000}>2s</option>
          <option value={5000}>5s</option>
          <option value={10000}>10s</option>
          <option value={20000}>20s</option>
        </select>
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
        <div className="text-sm">
        {aggStatus.loading && <span>Calculating...</span>}
        {aggStatus.error && <span className="text-red-600">{aggStatus.error}</span>}
        {aggStatus.lastRun && <span>Last updated: {aggStatus.lastRun}</span>}
</div>
      </div>

     {(aggregateDataUG.length > 0 || aggregateDataGrad.length > 0) && (
  <div className="mb-6">
    {category === "respost" ? (
      <>
        {aggregateDataUG.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-2">Top 3 Students (UG)</h3>
            <AggregateTable students={aggregateDataUG} />
          </>
        )}

        {aggregateDataGrad.length > 0 && (
          <>
            <h3 className="text-xl font-bold mt-6 mb-2">Top 3 Students (Grad)</h3>
            <AggregateTable students={aggregateDataGrad} />
          </>
        )}
      </>
    ) : (
      <>
        <h3 className="text-xl font-bold mb-2">Top 3 Students</h3>
        <AggregateTable students={aggregateDataUG} />
      </>
    )}
  </div>
)}

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-300">
          <thead>

     
            <tr className="bg-gray-200">
              {view === "scores" && (
                <>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("student_name")}>Student Name{sortArrow("student_name")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("poster_id")}>Poster ID{sortArrow("poster_id")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("avg_score")}>Average Score{sortArrow("avg_score")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("judge_count")}>Judge Count{sortArrow("judge_count")}</th>
                </>
              )}

              {view === "judge" && (
                <>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("judge_first_name")}>Judge First Name{sortArrow("judge_first_name")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("judge_email")}>Judge Email{sortArrow("judge_email")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("posters_scored_count")}>Posters Scored{sortArrow("posters_scored_count")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("total_posters")}>Total Posters{sortArrow("total_posters")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("poster_ids")}>Poster IDs{sortArrow("poster_ids")}</th>
                </>
              )}

              {view === "student" && (
                <>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("student")}>Student Name{sortArrow("student")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("poster_id")}>Poster ID{sortArrow("poster_id")}</th>
                  <th className="border px-4 py-2 cursor-pointer" onClick={() => requestSort("scored_by")}>Scored By{sortArrow("scored_by")}</th>
                </>
              )}
            </tr>

            <tr className="bg-gray-100">
              {columns.map((col) => (
                <th key={col} className="border px-2 py-1">
                  <input
                    className="w-full border p-1 rounded"
                    placeholder="filter..."
                    value={filters[col] || ""}
                    onChange={(e) => setFilter(col, e.target.value)}
                  />
                </th>
              ))}
            </tr>


            {/* <tr className="bg-gray-200">
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
            </tr> */}
            
          </thead>
          <tbody>
            {tableRows.length > 0 ? (
            tableRows.map((item, idx) => (
              <tr key={idx}>
                {view === "scores" && (
                  <>
                    <td className="border px-4 py-2">{item.student_name}</td>
                    <td className="border px-4 py-2">{item.poster_id}</td>
                    <td className="border px-4 py-2">{item.avg_score}</td>
                    <td className="border px-4 py-2">{item.judge_count}</td>
                  </>
                )}

                {view === "judge" && (
                  <>
                    <td className="border px-4 py-2">{item.judge_first_name}</td>
                    <td className="border px-4 py-2">{item.judge_email}</td>
                    <td className="border px-4 py-2">{item.posters_scored_count}</td>
                    <td className="border px-4 py-2">{item.total_posters}</td>
                    <td className="border px-4 py-2">{item.poster_ids}</td>
                  </>
                )}

                {view === "student" && (
                  <>
                    <td className="border px-4 py-2">{item.student}</td>
                    <td className="border px-4 py-2">{item.poster_id}</td>
                    <td className="border px-4 py-2">{item.scored_by}</td>
                  </>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td className="border px-4 py-2" colSpan={columns.length}>No data available for this view.</td>
            </tr>
          )}
            {/* {data.length > 0 ? (
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
            )} */}
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
              <td className="border px-4 py-2">{student.avg_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
