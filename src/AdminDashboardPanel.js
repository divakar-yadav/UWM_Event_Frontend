// AdminDashboardPanel.js
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";

const getInitialTheme = () => {
  const saved = localStorage.getItem("dashboard_theme");
  if (saved === "dark" || saved === "light") return saved;
  if (window.matchMedia?.("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
};

const getTheme = (mode) => {
  if (mode === "light") {
    return {
      mode: "light",
      bg: "#eef2f7",
      bg2: "#e7ebf2",
      panel: "#f7f9fc",
      panel2: "#edf1f7",
      text: "#16181d",
      muted: "#5e6675",
      border: "#d7dde7",
      gold: "#ffbd00",
      goldDeep: "#d69a00",
      inputBg: "#eef2f7",
      ring: "rgba(255, 189, 0, 0.32)",
      danger: "#b42318",
      raisedShadow: "12px 12px 26px rgba(160, 173, 196, 0.34), -10px -10px 24px rgba(255,255,255,0.95)",
      insetShadow: "inset 6px 6px 14px rgba(160, 173, 196, 0.22), inset -6px -6px 14px rgba(255,255,255,0.95)",
      goldShadow: "10px 10px 20px rgba(184, 134, 11, 0.22), -6px -6px 16px rgba(255,255,255,0.82)",
      goldInset: "inset 4px 4px 10px rgba(184, 134, 11, 0.26), inset -4px -4px 10px rgba(255,255,255,0.25)",
      success: "#1f7a38",
    };
  }

  return {
    mode: "dark",
    bg: "#0f1013",
    bg2: "#17191f",
    panel: "#1a1c22",
    panel2: "#23262f",
    text: "#f6f7fb",
    muted: "#bcc3cf",
    border: "#323744",
    gold: "#ffbd00",
    goldDeep: "#d69a00",
    inputBg: "#23262f",
    ring: "rgba(255, 189, 0, 0.28)",
    danger: "#ff8a80",
    raisedShadow: "12px 12px 28px rgba(0,0,0,0.34), -8px -8px 22px rgba(255,255,255,0.03)",
    insetShadow: "inset 7px 7px 15px rgba(0,0,0,0.34), inset -5px -5px 12px rgba(255,255,255,0.02)",
    goldShadow: "10px 10px 24px rgba(0,0,0,0.28), -6px -6px 14px rgba(255,255,255,0.08)",
    goldInset: "inset 4px 4px 10px rgba(0,0,0,0.2), inset -4px -4px 10px rgba(255,255,255,0.12)",
    success: "#8ce99a",
  };
};

const applyThemeToDocument = (theme) => {
  document.documentElement.style.colorScheme = theme.mode;
  document.body.style.background = theme.bg;
  document.body.style.color = theme.text;
};

const raised = (theme, radius = 24) => ({
  background: `linear-gradient(145deg, ${theme.panel2}, ${theme.panel})`,
  border: `1px solid ${theme.border}`,
  borderRadius: radius,
  boxShadow: theme.raisedShadow,
});

const inset = (theme, radius = 18) => ({
  background: `linear-gradient(145deg, ${theme.inputBg}, ${theme.panel2})`,
  border: `1px solid ${theme.border}`,
  borderRadius: radius,
  boxShadow: theme.insetShadow,
});

const goldRaised = (theme, radius = 18) => ({
  background: `linear-gradient(145deg, ${theme.gold}, ${theme.goldDeep})`,
  border: `1px solid rgba(255,255,255,0.18)`,
  borderRadius: radius,
  boxShadow: theme.goldShadow,
});

const numericValue = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : -Infinity;
};
const NUMERIC_FILTER_KEYS = new Set([
  "poster_id",
  "avg_score",
  "judge_count",
  "posters_scored_count",
  "total_posters",
]);

const FILTER_PLACEHOLDERS = {
  student_name: "Filter by student name",
  judge_first_name: "Filter by judge name",
  judge_email: "Filter by judge email",
  poster_id: "Filter by poster ID",
  avg_score: "Filter by average score",
  judge_count: "Filter by judge count",
  posters_scored_count: "Filter by posters scored",
  total_posters: "Filter by total posters",
  scored_by: "Filter by scored progress (e.g. 1/4)",
  poster_ids: "Filter by poster IDs",
  student: "Filter by student name",
};

const normalizeFilterValue = (key, value) => {
  const raw = String(value ?? "");
  return NUMERIC_FILTER_KEYS.has(key)
    ? raw.replace(/[^\d]/g, "")
    : raw.toLowerCase().trim();
};
const SORT_OPTIONS = {
  scores: [
    { value: "student_name", label: "Student Name" },
    { value: "poster_id", label: "Poster ID" },
    { value: "avg_score", label: "Average Score" },
    { value: "judge_count", label: "Judge Count" },
  ],
  judge: [
    { value: "judge_first_name", label: "Judge Name" },
    { value: "judge_email", label: "Judge Email" },
    { value: "posters_scored_count", label: "Posters Scored" },
    { value: "poster_ids", label: "Poster IDs" },
  ],
  student: [
    { value: "student", label: "Student Name" },
    { value: "poster_id", label: "Poster ID" },
    { value: "scored_by", label: "Scored Progress" },
  ],
};
const normalizeCellValue = (key, value) => {
  const raw = String(value ?? "");
  return NUMERIC_FILTER_KEYS.has(key)
    ? raw.replace(/[^\d]/g, "")
    : raw.toLowerCase();
};
function MobileSortControls({ theme, view, sortConfig, setSortConfig }) {
  return (
    <div style={{ ...raised(theme, 18), padding: 12 }} className="grid grid-cols-1 gap-3 lg:hidden">
      <select
        value={sortConfig.key || ""}
        onChange={(e) =>
          setSortConfig((prev) => ({
            ...prev,
            key: e.target.value || null,
          }))
        }
        className="w-full px-4 py-3 text-sm font-bold focus:outline-none focus-visible:ring-4"
        style={{ ...inset(theme, 14), color: theme.text, "--tw-ring-color": theme.ring }}
        aria-label="Sort field"
      >
        <option value="" style={{ color: "#111" }}>
          Sort by...
        </option>
        {SORT_OPTIONS[view].map((opt) => (
          <option key={opt.value} value={opt.value} style={{ color: "#111" }}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={sortConfig.direction}
        onChange={(e) =>
          setSortConfig((prev) => ({
            ...prev,
            direction: e.target.value,
          }))
        }
        className="w-full px-4 py-3 text-sm font-bold focus:outline-none focus-visible:ring-4"
        style={{ ...inset(theme, 14), color: theme.text, "--tw-ring-color": theme.ring }}
        aria-label="Sort direction"
      >
        <option value="asc" style={{ color: "#111" }}>Ascending</option>
        <option value="desc" style={{ color: "#111" }}>Descending</option>
      </select>
    </div>
  );
}
function ControlCard({ theme, label, children }) {
  return (
    <div
      className="h-full flex flex-col justify-between"
      style={{ ...raised(theme, 22), padding: 16, minHeight: 170 }}
    >
      <div
        className="inline-flex items-center self-start rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-wide"
        style={{
          background: theme.mode === "light" ? "rgba(255,189,0,0.14)" : "rgba(255,189,0,0.18)",
          color: theme.mode === "light" ? "#7a5a00" : theme.goldDeep,
          border: `1px solid ${theme.border}`,
          minHeight: 42,
        }}
      >
        {label}
      </div>

      <div className="mt-5 flex-1 flex items-center">
        <div
          className="w-full"
          style={{ ...inset(theme, 18), padding: 18, minHeight: 104, display: "flex", alignItems: "center" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
function ActionCard({ theme, onClick }) {
  return (
    <div
      className="h-full flex items-center justify-center"
      style={{ ...raised(theme, 22), padding: 16, minHeight: 170 }}
    >
      <div className="w-full flex items-center justify-center">
        <ClayButton
          theme={theme}
          variant="gold"
          onClick={onClick}
          className="w-full max-w-[420px] min-h-[112px] px-6 text-[28px] sm:text-[32px]"
          ariaLabel="Calculate aggregate scores"
        >
          Calculate Aggregate Scores
        </ClayButton>
      </div>
    </div>
  );
}
function ClayToggle({ id, checked, onChange, theme, label = "Auto-refresh" }) {
  return (
    <label
      htmlFor={id}
      className="w-full flex items-center justify-between gap-4 cursor-pointer"
      style={{ color: theme.text }}
    >
      <span className="text-sm font-extrabold">{label}</span>

      <span
        aria-hidden="true"
        style={{
          ...inset(theme, 999),
          width: 64,
          height: 34,
          padding: 4,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: checked ? "flex-end" : "flex-start",
          transition: "all 160ms ease",
          border: `1px solid ${checked ? theme.gold : theme.border}`,
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: 999,
            background: checked
              ? `linear-gradient(145deg, ${theme.gold}, ${theme.goldDeep})`
              : theme.mode === "light"
              ? "#c7cfdb"
              : "#5a6270",
            boxShadow: checked ? theme.goldShadow : theme.raisedShadow,
            transition: "all 160ms ease",
          }}
        />
      </span>

      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        role="switch"
        aria-checked={checked}
        className="sr-only"
      />
    </label>
  );
}
function ClayButton({
  theme,
  children,
  onClick,
  type = "button",
  disabled = false,
  active = false,
  variant = "default",
  className = "",
  ariaLabel,
}) {
  const [pressed, setPressed] = useState(false);

  const style =
    variant === "gold" || active
      ? {
          ...goldRaised(theme, 16),
          color: "#111111",
          transform: pressed ? "translateY(2px)" : "translateY(0)",
          boxShadow: pressed ? theme.goldInset : theme.goldShadow,
        }
      : {
          ...raised(theme, 16),
          color: theme.text,
          transform: pressed ? "translateY(2px)" : "translateY(0)",
          boxShadow: pressed ? theme.insetShadow : theme.raisedShadow,
        };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onBlur={() => setPressed(false)}
      className={`inline-flex items-center justify-center text-center min-h-[46px] px-4 py-3 font-extrabold leading-none whitespace-normal break-words transition-all duration-150 focus:outline-none focus-visible:ring-4 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      style={{
        ...style,
        "--tw-ring-color": theme.ring,
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          textAlign: "center",
          lineHeight: 1.15,
        }}
      >
        {children}
      </span>
    </button>
  );
}

function ThemeSwitch({ themeMode, setThemeMode, theme }) {
  return (
    <div
      style={{ ...raised(theme, 18), padding: 8 }}
      className="grid grid-cols-2 gap-2 items-stretch"
    >
      <ClayButton
        theme={theme}
        active={themeMode === "dark"}
        variant={themeMode === "dark" ? "gold" : "default"}
        onClick={() => setThemeMode("dark")}
        className="min-h-[82px] text-[20px] sm:text-[22px]"
        ariaLabel="Switch to dark mode"
      >
        Dark
      </ClayButton>

      <ClayButton
        theme={theme}
        active={themeMode === "light"}
        variant={themeMode === "light" ? "gold" : "default"}
        onClick={() => setThemeMode("light")}
        className="min-h-[82px] text-[20px] sm:text-[22px]"
        ariaLabel="Switch to light mode"
      >
        Light
      </ClayButton>
    </div>
  );
}

function MetricCard({ title, value, theme, accent = false }) {
  return (
    <section
      aria-label={title}
      style={{
        ...(accent ? goldRaised(theme, 22) : raised(theme, 22)),
        padding: 18,
        color: accent ? "#111111" : theme.text,
        minHeight: 120,
      }}
    >
      <div
        className="text-xs font-black uppercase tracking-wide"
        style={{ color: accent ? "#333333" : theme.muted }}
      >
        {title}
      </div>
      <div className="mt-2 text-2xl sm:text-3xl font-black leading-tight">{value}</div>
    </section>
  );
}

function FilterInput({ value, onChange, placeholder, theme, ariaLabel, inputMode = "text" }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      aria-label={ariaLabel}
      inputMode={inputMode}
      className="w-full px-3 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-4"
      style={{
        ...inset(theme, 12),
        color: theme.text,
        "--tw-ring-color": theme.ring,
      }}
    />
  );
}
// function SelectBox({ id, value, onChange, theme, children, disabled = false, ariaLabel }) {
//   return (
//     <select
//       id={id}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       aria-label={ariaLabel}
//       className="w-full px-4 py-3 focus:outline-none focus-visible:ring-4"
//       style={{
//         ...inset(theme, 14),
//         color: theme.text,
//         "--tw-ring-color": theme.ring,
//       }}
//     >
//       {children}
//     </select>
//   );
// }

function MobileRowCard({ view, item, theme }) {
  return (
    <article style={{ ...raised(theme, 20), padding: 16 }}>
      {view === "scores" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 text-lg font-black" style={{ color: theme.text }}>
            {item.student_name}
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Poster ID
            </div>
            <div style={{ color: theme.text }}>{item.poster_id}</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Judge Count
            </div>
            <div style={{ color: theme.text }}>{item.judge_count}</div>
          </div>
          <div className="col-span-2">
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Average Score
            </div>
            <div className="text-lg font-black" style={{ color: theme.text }}>
              {item.avg_score}
            </div>
          </div>
        </div>
      )}

      {view === "judge" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 text-lg font-black" style={{ color: theme.text }}>
            {item.judge_first_name}
          </div>
          <div className="col-span-2 break-all">
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Judge Email
            </div>
            <div style={{ color: theme.text }}>{item.judge_email}</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Posters Scored
            </div>
            <div style={{ color: theme.text }}>{item.posters_scored_count}</div>
          </div>
          {/* <div>
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Total Posters
            </div>
            <div style={{ color: theme.text }}>{item.total_posters}</div>
          </div> */}
          <div className="col-span-2 break-words">
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Poster IDs
            </div>
            <div style={{ color: theme.text }}>{item.poster_ids || "—"}</div>
          </div>
        </div>
      )}

      {view === "student" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 text-lg font-black" style={{ color: theme.text }}>
            {item.student}
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Poster ID
            </div>
            <div style={{ color: theme.text }}>{item.poster_id}</div>
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
              Scored Progress
            </div>
            <div style={{ color: theme.text }}>{item.scored_by}</div>
          </div>
        </div>
      )}
    </article>
  );
}

function AggregateTable({ students, theme }) {
  return (
    <>
      <div className="hidden lg:block overflow-x-auto" style={{ ...raised(theme, 22) }}>
        <table className="w-full text-sm" aria-label="Aggregate ranking table">
          <thead>
            <tr>
              {["Name", "Poster ID", "Department", "Advisor", "Title", "Category", "Average Score"].map((head) => (
                <th
                  key={head}
                  scope="col"
                  className="px-4 py-4 text-left font-black"
                  style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={idx}>
                <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{student.name}</td>
                <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{student.poster_id}</td>
                <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{student.department}</td>
                <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{student.advisor}</td>
                <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{student.title}</td>
                <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                  {student.poster_id >= 101 && student.poster_id <= 199 ? "UG" : "Grad"}
                </td>
                <td className="px-4 py-4 font-black" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>
                  {student.avg_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {students.map((student, idx) => (
          <article key={idx} style={{ ...raised(theme, 20), padding: 16 }}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-lg font-black" style={{ color: theme.text }}>
                  {student.name}
                </div>
                <div className="text-sm break-words" style={{ color: theme.muted }}>
                  {student.title}
                </div>
              </div>
              <div
                className="shrink-0 rounded-full px-3 py-1 text-sm font-black"
                style={{ ...raised(theme, 999), color: theme.text }}
              >
                {student.avg_score}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
                  Poster ID
                </div>
                <div style={{ color: theme.text }}>{student.poster_id}</div>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
                  Category
                </div>
                <div style={{ color: theme.text }}>
                  {student.poster_id >= 101 && student.poster_id <= 199 ? "UG" : "Grad"}
                </div>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
                  Department
                </div>
                <div style={{ color: theme.text }}>{student.department}</div>
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wide" style={{ color: theme.muted }}>
                  Advisor
                </div>
                <div style={{ color: theme.text }}>{student.advisor}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default function AdminDashboardPanel() {
  const [category, setCategory] = useState("respost");
  const [view, setView] = useState("scores");
  const [data, setData] = useState([]);
  const [aggregateDataUG, setAggregateDataUG] = useState([]);
  const [aggregateDataGrad, setAggregateDataGrad] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshMs, setRefreshMs] = useState(5000);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [canAccessDashboard, setCanAccessDashboard] = useState(null);
  const [aggStatus, setAggStatus] = useState({ loading: false, error: "", lastRun: "" });
  const [themeMode, setThemeMode] = useState(getInitialTheme);

  const token = localStorage.getItem("token");
  const API_URL = process.env.REACT_APP_API_URL;
  const firstName = localStorage.getItem("first_name") || "User";

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  useEffect(() => {
    localStorage.setItem("dashboard_theme", themeMode);
    applyThemeToDocument(theme);
  }, [themeMode, theme]);

  useEffect(() => {
    setAggregateDataUG([]);
    setAggregateDataGrad([]);
  }, [category]);

  useEffect(() => {
    if (!token) {
      setCanAccessDashboard(false);
      return;
    }

    axios
      .get(`${API_URL}/signin/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCanAccessDashboard(Boolean(res.data.can_access_dashboard));
      })
      .catch(() => {
        setCanAccessDashboard(false);
      });
  }, [token, API_URL]);

  useEffect(() => {
    if (canAccessDashboard) fetchData();
  }, [canAccessDashboard, category, view]);

  useEffect(() => {
    if (!canAccessDashboard || !autoRefresh) return;
    const id = setInterval(() => {
      fetchData();
    }, refreshMs);
    return () => clearInterval(id);
  }, [canAccessDashboard, autoRefresh, refreshMs, category, view]);

  useEffect(() => {
    if (!canAccessDashboard || !token) return;
    fetchAggregateData();
  }, [category, canAccessDashboard, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("first_name");
    window.location.replace("/login");
  };

  const setFilter = (key, value) => {
  setFilters((prev) => ({
    ...prev,
    [key]: NUMERIC_FILTER_KEYS.has(key) ? value.replace(/[^\d]/g, "") : value,
  }));
};
  const requestSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const fetchJudgeProgress = useCallback(() => {
  if (!token) return;

  axios
    .get(`${API_URL}/pa-283771828/judge_poster_status/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setData(res.data);
    })
    .catch(() => {
      setData([]);
    });
}, [API_URL, category, token]);

 
const fetchData = useCallback(() => {
  if (!token) return;

  if (view === "judge") {
    fetchJudgeProgress();
    return;
  }

  let endpoint = "";
  if (view === "scores") endpoint = "sorted_scores";
  if (view === "student") endpoint = "status";

  axios
    .get(`${API_URL}/pa-283771828/${endpoint}/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      setData(res.data);
    })
    .catch(() => {
      setData([]);
    });
}, [API_URL, category, token, view, fetchJudgeProgress]);

  const exportToExcel = async () => {
    if (!token) return;

    const res = await axios.get(`${API_URL}/pa-283771828/export_excel/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${category}_scores.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

 
const fetchAggregateData = useCallback(() => {
  if (!token) return;

  setAggStatus({ loading: true, error: "", lastRun: "" });

  axios
    .get(`${API_URL}/pa-283771828/aggregate/?category=${category}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const rawData = res.data || [];

      const finalStudents = rawData.map((student) => {
        const avgScore =
          student.total_score && student.judges_count
            ? Number(student.total_score).toFixed(2)
            : "N/A";

        return {
          name: student.name || "Unknown",
          poster_id: Number(student.poster_id || 0),
          department: student.department || "Unknown",
          advisor: student.advisor || "Unknown",
          title: student.title || "Unknown",
          category:
            Number(student.poster_id) >= 101 && Number(student.poster_id) <= 199 ? "UG" : "Grad",
          avg_score: avgScore,
        };
      });

      if (category === "respost") {
        const ug = finalStudents
          .filter((s) => s.category === "UG")
          .sort((a, b) => numericValue(b.avg_score) - numericValue(a.avg_score))
          .slice(0, 3);

        const grad = finalStudents
          .filter((s) => s.category === "Grad")
          .sort((a, b) => numericValue(b.avg_score) - numericValue(a.avg_score))
          .slice(0, 3);

        setAggregateDataUG(ug);
        setAggregateDataGrad(grad);
      } else {
        const top3 = finalStudents
          .sort((a, b) => numericValue(b.avg_score) - numericValue(a.avg_score))
          .slice(0, 3);

        setAggregateDataUG(top3);
        setAggregateDataGrad([]);
      }

      setAggStatus({
        loading: false,
        error: "",
        lastRun: new Date().toLocaleString(),
      });
    })
    .catch(() => {
      setAggregateDataUG([]);
      setAggregateDataGrad([]);
      setAggStatus({
        loading: false,
        error: "Aggregate fetch failed",
        lastRun: "",
      });
    });
}, [API_URL, category, token]);

  const rows = useMemo(() => {
  if (view === "judge") {
    return data.map((x) => ({
      judge_first_name: x.judge_first_name ?? "",
      judge_email: x.judge_email ?? "",
      posters_scored_count:
        x.posters_scored_count ?? (Array.isArray(x.posters_scored) ? x.posters_scored.length : 0),
      // total_posters: x.total_posters ?? x.total_scored ?? 0,
      poster_ids:
        Array.isArray(x.posters_scored) && x.posters_scored.length > 0
          ? x.posters_scored.join(", ")
          : "No posters scored yet",
    }));
  }

  if (view === "scores") {
    return data.map((x) => ({
      student_name: x.student__Name ?? x.Student__Name ?? "",
      poster_id: x.student__poster_ID ?? x.Student__poster_ID ?? "",
      avg_score: x.avg_score ?? "",
      judge_count: x.judge_count ?? "",
    }));
  }

  return data.map((x) => ({
    student: x.student ?? "",
    poster_id: x.poster_id ?? "",
    scored_by: `${x.scored ?? 0}/${x.total ?? 0}`,
  }));
}, [data, view]);

  const columns = useMemo(() => {
    if (view === "judge") return ["judge_first_name", "judge_email", "posters_scored_count",  "poster_ids"];
    if (view === "scores") return ["student_name", "poster_id", "avg_score", "judge_count"];
    return ["student", "poster_id", "scored_by"];
  }, [view]);

  const tableRows = useMemo(() => {
  const filtered = [...rows].filter((row) =>
    columns.every((col) => {
      const f = normalizeFilterValue(col, filters[col] ?? "");
      if (!f) return true;
      const v = normalizeCellValue(col, row[col]);
      return v.includes(f);
    })
  );

  const { key, direction } = sortConfig;
  if (!key) return filtered;

  filtered.sort((a, b) => {
    const va = a[key];
    const vb = b[key];

    const na = Number(va);
    const nb = Number(vb);
    const bothNumeric = !Number.isNaN(na) && !Number.isNaN(nb);

    if (bothNumeric) return direction === "asc" ? na - nb : nb - na;

    const sa = String(va ?? "").toLowerCase();
    const sb = String(vb ?? "").toLowerCase();

    if (sa < sb) return direction === "asc" ? -1 : 1;
    if (sa > sb) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return filtered;
}, [rows, columns, filters, sortConfig]);

  const stats = useMemo(() => {
    const scoreRows = tableRows.filter((row) => !Number.isNaN(Number(row.avg_score)));
    const averageScore =
      scoreRows.length > 0
        ? (scoreRows.reduce((sum, row) => sum + Number(row.avg_score), 0) / scoreRows.length).toFixed(2)
        : null;

    return {
      currentCategory:
        category === "3mt"
          ? "Three Minute Thesis"
          : category === "exp"
          ? "Experiential Learning"
          : "Research Poster",
      totalRows: tableRows.length,
      fullyScoredStudents:
        view === "student"
          ? tableRows.filter((row) => {
              const [done, total] = String(row.scored_by || "0/0").split("/").map(Number);
              return done === total && total > 0;
            }).length
          : null,
      pendingStudents:
        view === "student"
          ? tableRows.filter((row) => {
              const [done, total] = String(row.scored_by || "0/0").split("/").map(Number);
              return done < total;
            }).length
          : null,
      averageScore: view === "scores" ? averageScore : null,
      highestScore:
        view === "scores" && tableRows.length > 0
          ? Math.max(...tableRows.map((row) => Number(row.avg_score) || 0)).toFixed(2)
          : null,
      judgesActive:
        view === "judge"
          ? tableRows.filter((row) => Number(row.posters_scored_count) > 0).length
          : null,
      judgesNotStarted:
        view === "judge"
          ? tableRows.filter((row) => Number(row.posters_scored_count) === 0).length
          : null,
    };
  }, [category, tableRows, view]);

  const sortArrow = (key) => {
  if (sortConfig.key !== key) return " ↕";
  return sortConfig.direction === "asc" ? " ↑" : " ↓";
};
  if (canAccessDashboard === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: `radial-gradient(circle at 0% 0%, rgba(255,189,0,0.16), transparent 22%), linear-gradient(135deg, ${theme.bg}, ${theme.bg2})`,
        }}
      >
        <div style={{ ...raised(theme, 26), padding: 24, color: theme.text }} className="text-lg font-black">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (canAccessDashboard === false) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: `radial-gradient(circle at 0% 0%, rgba(255,189,0,0.16), transparent 22%), linear-gradient(135deg, ${theme.bg}, ${theme.bg2})`,
        }}
      >
        <div style={{ ...raised(theme, 26), padding: 24, color: theme.text }} className="text-lg font-black">
          Access Denied — Dashboard users only
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-3 py-4 sm:px-5 sm:py-6"
      style={{
        background: `radial-gradient(circle at 0% 0%, rgba(255,189,0,0.16), transparent 22%), linear-gradient(135deg, ${theme.bg}, ${theme.bg2})`,
      }}
    >
      <div className="mx-auto max-w-7xl">
        <section style={{ ...raised(theme, 30), padding: 18 }} className="sm:p-6 lg:p-8">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight" style={{ color: theme.text }}>
                Welcome, {firstName}
              </h1>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:w-[560px]">
              <ThemeSwitch themeMode={themeMode} setThemeMode={setThemeMode} theme={theme} />
              <ClayButton
                theme={theme}
                variant="gold"
                onClick={exportToExcel}
                className="w-full"
                ariaLabel="Export dashboard data to Excel"
              >
                Export to Excel
              </ClayButton>
              <ClayButton
                theme={theme}
                onClick={handleLogout}
                className="w-full"
                ariaLabel="Log out of dashboard"
              >
                Logout
              </ClayButton>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Current Category" value={stats.currentCategory} theme={theme} accent />
            {view === "scores" && (
              <>
                <MetricCard title="Students in Ranking" value={stats.totalRows} theme={theme} />
                <MetricCard title="Average Score" value={stats.averageScore ?? "N/A"} theme={theme} />
                <MetricCard title="Highest Score" value={stats.highestScore ?? "N/A"} theme={theme} />
              </>
            )}
            {view === "judge" && (
              <>
                <MetricCard title="Total Judges" value={stats.totalRows} theme={theme} />
                <MetricCard title="Active Judges" value={stats.judgesActive ?? 0} theme={theme} />
                <MetricCard title="Judges Not Started" value={stats.judgesNotStarted ?? 0} theme={theme} />
              </>
            )}
            {view === "student" && (
              <>
                <MetricCard title="Total Students" value={stats.totalRows} theme={theme} />
                <MetricCard title="Fully Scored" value={stats.fullyScoredStudents ?? 0} theme={theme} />
                <MetricCard title="Pending Review" value={stats.pendingStudents ?? 0} theme={theme} />
              </>
            )}
          </div>
          <section className="mt-6" aria-label="Dashboard view switcher">
  <div style={{ ...raised(theme, 18), padding: 8 }}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ClayButton
        theme={theme}
        active={view === "scores"}
        variant={view === "scores" ? "gold" : "default"}
        onClick={() => setView("scores")}
        className="w-full min-h-[64px] text-base sm:text-lg"
        ariaLabel="Show scores view"
      >
        Scores View
      </ClayButton>

      <ClayButton
        theme={theme}
        active={view === "judge"}
        variant={view === "judge" ? "gold" : "default"}
        onClick={() => setView("judge")}
        className="w-full min-h-[64px] text-base sm:text-lg"
        ariaLabel="Show judge view"
      >
        Judge View
      </ClayButton>

      <ClayButton
        theme={theme}
        active={view === "student"}
        variant={view === "student" ? "gold" : "default"}
        onClick={() => setView("student")}
        className="w-full min-h-[64px] text-base sm:text-lg"
        ariaLabel="Show student view"
      >
        Student View
      </ClayButton>
    </div>
  </div>
</section>
  <section
  className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-12 items-stretch"
  aria-label="Dashboard controls"
>
  <div className="xl:col-span-3 h-full">
    <ControlCard theme={theme} label="Category">
      <label htmlFor="category" className="sr-only">
        Category
      </label>
      <select
        id="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Select category"
        className="w-full px-4 py-3 text-sm sm:text-base font-bold focus:outline-none focus-visible:ring-4"
        style={{
          ...inset(theme, 16),
          color: theme.text,
          background: `linear-gradient(145deg, ${theme.inputBg}, ${theme.panel2})`,
          ["--tw-ring-color"]: theme.ring,
          minHeight: 58,
        }}
      >
        <option style={{ color: "#111111" }} value="respost">
          Research Poster
        </option>
        <option style={{ color: "#111111" }} value="exp">
          Experiential Learning
        </option>
        <option style={{ color: "#111111" }} value="3mt">
          Three Minute Thesis (3MT)
        </option>
      </select>
    </ControlCard>
  </div>

  <div className="xl:col-span-3 h-full">
    <ControlCard theme={theme} label="Refresh Interval">
      <label htmlFor="refreshMs" className="sr-only">
        Refresh Interval
      </label>
      <select
        id="refreshMs"
        value={refreshMs}
        onChange={(e) => setRefreshMs(Number(e.target.value))}
        disabled={!autoRefresh}
        aria-label="Select auto refresh interval"
        className="w-full px-4 py-3 text-sm sm:text-base font-bold focus:outline-none focus-visible:ring-4 disabled:opacity-60"
        style={{
          ...inset(theme, 16),
          color: theme.text,
          background: `linear-gradient(145deg, ${theme.inputBg}, ${theme.panel2})`,
          ["--tw-ring-color"]: theme.ring,
          minHeight: 58,
        }}
      >
        <option style={{ color: "#111111" }} value={2000}>
          2 seconds
        </option>
        <option style={{ color: "#111111" }} value={5000}>
          5 seconds
        </option>
        <option style={{ color: "#111111" }} value={10000}>
          10 seconds
        </option>
        <option style={{ color: "#111111" }} value={20000}>
          20 seconds
        </option>
      </select>
    </ControlCard>
  </div>

  <div className="xl:col-span-3 h-full">
    <ControlCard theme={theme} label="Auto-refresh">
      <ClayToggle
        id="autoRefresh"
        checked={autoRefresh}
        onChange={(e) => setAutoRefresh(e.target.checked)}
        theme={theme}
        label={autoRefresh ? "Enabled" : "Disabled"}
      />
    </ControlCard>
  </div>

  <div className="xl:col-span-3 h-full">
    <ActionCard theme={theme} onClick={fetchAggregateData} />
  </div>

  <div className="xl:col-span-12">
    <div
      role="status"
      aria-live="polite"
      className="text-sm font-bold"
      style={{ ...raised(theme, 18), padding: 16, color: theme.text }}
    >
      {aggStatus.loading && <span>Calculating...</span>}
      {!aggStatus.loading && aggStatus.error && <span style={{ color: theme.danger }}>{aggStatus.error}</span>}
      {!aggStatus.loading && !aggStatus.error && aggStatus.lastRun && (
        <span style={{ color: theme.muted }}>Last updated: {aggStatus.lastRun}</span>
      )}
    </div>
  </div>
</section>
          {(aggregateDataUG.length > 0 || aggregateDataGrad.length > 0) && (
            <section className="mt-6 space-y-6" aria-label="Aggregate results">
              {category === "respost" ? (
                <>
                  {aggregateDataUG.length > 0 && (
                    <div>
                      <h2 className="mb-3 text-2xl font-black" style={{ color: theme.text }}>
                        Top 3 Students (UG)
                      </h2>
                      <AggregateTable students={aggregateDataUG} theme={theme} />
                    </div>
                  )}
                  {aggregateDataGrad.length > 0 && (
                    <div>
                      <h2 className="mb-3 text-2xl font-black" style={{ color: theme.text }}>
                        Top 3 Students (Grad)
                      </h2>
                      <AggregateTable students={aggregateDataGrad} theme={theme} />
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <h2 className="mb-3 text-2xl font-black" style={{ color: theme.text }}>
                    Top 3 Students
                  </h2>
                  <AggregateTable students={aggregateDataUG} theme={theme} />
                </div>
              )}
            </section>
          )}

          <section className="mt-6" aria-label="Detailed dashboard data">
            <div className="hidden lg:block overflow-x-auto" style={{ ...raised(theme, 20) }}>
              <table className="w-full text-sm" aria-label={`${view} table`}>
                <thead>
                  <tr>
                    {view === "scores" && (
                      <>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("student_name")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Student Name{sortArrow("student_name")}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("poster_id")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Poster ID{sortArrow("poster_id")}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("avg_score")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Average Score{sortArrow("avg_score")}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("judge_count")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Judge Count{sortArrow("judge_count")}
                          </button>
                        </th>
                      </>
                    )}

                    {view === "judge" && (
                      <>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("judge_first_name")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Judge First Name{sortArrow("judge_first_name")}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("judge_email")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Judge Email{sortArrow("judge_email")}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("posters_scored_count")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Posters Scored{sortArrow("posters_scored_count")}
                          </button>
                        </th>
                        {/* <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("total_posters")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Total Posters{sortArrow("total_posters")}
                          </button>
                        </th> */}
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("poster_ids")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Poster IDs{sortArrow("poster_ids")}
                          </button>
                        </th>
                      </>
                    )}

                    {view === "student" && (
                      <>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("student")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Student Name{sortArrow("student")}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("poster_id")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Poster ID{sortArrow("poster_id")}
                          </button>
                        </th>
                        <th className="px-4 py-4 text-left" style={{ borderBottom: `1px solid ${theme.border}` }}>
                          <button
                            type="button"
                            onClick={() => requestSort("scored_by")}
                            className="font-black focus:outline-none focus-visible:ring-4"
                            style={{ color: theme.text, background: "transparent", border: "none", "--tw-ring-color": theme.ring }}
                          >
                            Scored Progress{sortArrow("scored_by")}
                          </button>
                        </th>
                      </>
                    )}
                  </tr>

                                  <tr>
                  {columns.map((col) => (
                    <th key={col} className="px-3 py-3" style={{ borderBottom: `1px solid ${theme.border}` }}>
                      <FilterInput
                        value={filters[col] || ""}
                        onChange={(e) => setFilter(col, e.target.value)}
                        placeholder={FILTER_PLACEHOLDERS[col] || "Filter"}
                        theme={theme}
                        ariaLabel={FILTER_PLACEHOLDERS[col] || `Filter ${col}`}
                        inputMode={NUMERIC_FILTER_KEYS.has(col) ? "numeric" : "text"}
                      />
                    </th>
                  ))}
                </tr>
                </thead>

                <tbody>
                  {tableRows.length > 0 ? (
                    tableRows.map((item, idx) => (
                      <tr key={idx}>
                        {view === "scores" && (
                          <>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.student_name}</td>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.poster_id}</td>
                            <td className="px-4 py-4 font-black" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.avg_score}</td>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.judge_count}</td>
                          </>
                        )}

                        {view === "judge" && (
                          <>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.judge_first_name}</td>
                            <td className="px-4 py-4 break-all" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.judge_email}</td>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.posters_scored_count}</td>
                            {/* <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.total_posters}</td> */}
                            <td className="px-4 py-4 break-words" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.poster_ids}</td>
                          </>
                        )}

                        {view === "student" && (
                          <>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.student}</td>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.poster_id}</td>
                            <td className="px-4 py-4" style={{ color: theme.text, borderBottom: `1px solid ${theme.border}` }}>{item.scored_by}</td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-8 text-center font-bold" style={{ color: theme.muted }}>
                        No data available for this view.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:hidden">
              <MobileSortControls
                theme={theme}
                view={view}
                sortConfig={sortConfig}
                setSortConfig={setSortConfig}
              />

              <div style={{ ...raised(theme, 18), padding: 12 }}>
              <div className="grid grid-cols-1 gap-3">
                {columns.map((col) => (
                  <FilterInput
                    key={col}
                    value={filters[col] || ""}
                    onChange={(e) => setFilter(col, e.target.value)}
                    placeholder={FILTER_PLACEHOLDERS[col] || `Filter ${col}`}
                    theme={theme}
                    ariaLabel={FILTER_PLACEHOLDERS[col] || `Filter ${col}`}
                    inputMode={NUMERIC_FILTER_KEYS.has(col) ? "numeric" : "text"}
                  />
                ))}
              </div>
            </div>

              {tableRows.length > 0 ? (
                tableRows.map((item, idx) => <MobileRowCard key={idx} view={view} item={item} theme={theme} />)
              ) : (
                <div style={{ ...raised(theme, 18), padding: 18, color: theme.muted }} className="text-center font-bold">
                  No data available for this view.
                </div>
              )}
            </div>
          </section>
        </section>
        <footer
  className="mt-8"
  style={{ ...raised(theme, 20), padding: 16 }}
>
  <div
    className="text-center text-sm sm:text-base font-black tracking-wide"
    style={{ color: theme.muted }}
  >
    UWM SRPC Dashboard - 2026
  </div>
</footer>
      </div>

    </div>
  );
}