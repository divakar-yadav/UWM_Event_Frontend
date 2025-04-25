import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboardPanel() {
  const [isSuperUser, setIsSuperUser] = useState(null);
  const [data, setData] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    axios
      .get("/api/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setIsSuperUser(res.data.is_superuser))
      .catch(() => setIsSuperUser(false));
  }, [token]);

  useEffect(() => {
    if (isSuperUser) {
      axios
        .get("/api/pa-283771828/sorted_scores/?category=3mt", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setData(res.data));
    }
  }, [isSuperUser]);

  if (isSuperUser === null) return <p>Loading...</p>;
  if (isSuperUser === false) return <p>Access Denied – Admins only</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Admin Dashboard</h2>
      <ul>
        {data.map((item, i) => (
          <li key={i}>
            {item.student__Name} - {item.student__poster_ID} : {item.avg_score}
          </li>
        ))}
      </ul>
    </div>
  );
}
