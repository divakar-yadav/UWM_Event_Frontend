import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

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
      className={`min-h-[46px] px-4 py-3 font-extrabold transition-all duration-150 focus:outline-none focus-visible:ring-4 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      style={{ ...style, "--tw-ring-color": theme.ring }}
    >
      {children}
    </button>
  );
}

function ThemeSwitch({ themeMode, setThemeMode, theme }) {
  return (
    <div style={{ ...raised(theme, 18), padding: 8 }} className="grid grid-cols-2 gap-2">
      <ClayButton
        theme={theme}
        active={themeMode === "dark"}
        variant={themeMode === "dark" ? "gold" : "default"}
        onClick={() => setThemeMode("dark")}
        ariaLabel="Switch to dark mode"
      >
        Dark
      </ClayButton>
      <ClayButton
        theme={theme}
        active={themeMode === "light"}
        variant={themeMode === "light" ? "gold" : "default"}
        onClick={() => setThemeMode("light")}
        ariaLabel="Switch to light mode"
      >
        Light
      </ClayButton>
    </div>
  );
}

export default function DashboardLogin() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [themeMode, setThemeMode] = useState(getInitialTheme);

  const theme = useMemo(() => getTheme(themeMode), [themeMode]);

  useEffect(() => {
    localStorage.setItem("dashboard_theme", themeMode);
    applyThemeToDocument(theme);
  }, [themeMode, theme]);

  useEffect(() => {
    document.title = "SRPC Dashboard Login";

    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API_URL}/home/validate_token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          window.location.replace("/");
        }
      })
      .catch(() => {});
  }, [API_URL]);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/pa-283771828/signin/`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      localStorage.setItem("first_name", res.data.first_name || "");
      window.location.replace("/");
    } catch (ex) {
      setErr(ex?.response?.data?.detail || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{
        background:
          theme.mode === "light"
            ? `radial-gradient(circle at 0% 0%, rgba(255,189,0,0.16), transparent 22%), linear-gradient(135deg, ${theme.bg}, ${theme.bg2})`
            : `radial-gradient(circle at 0% 0%, rgba(255,189,0,0.16), transparent 22%), linear-gradient(135deg, ${theme.bg}, ${theme.bg2})`,
      }}
    >
      <div className="w-full max-w-md" style={{ ...raised(theme, 28), padding: 24 }}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 style={{ color: theme.text }} className="text-3xl sm:text-4xl font-black m-0">
                SRPC Dashboard Login
              </h1>
              <p style={{ color: theme.muted }} className="mt-2 text-sm font-semibold">
                Authorized users only.
              </p>
            </div>

            <div className="w-[180px] shrink-0 hidden sm:block">
              <ThemeSwitch themeMode={themeMode} setThemeMode={setThemeMode} theme={theme} />
            </div>
          </div>

          <div className="sm:hidden">
            <ThemeSwitch themeMode={themeMode} setThemeMode={setThemeMode} theme={theme} />
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label htmlFor="email" style={{ color: theme.text }} className="block text-sm font-black uppercase tracking-wide mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="username"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 focus:outline-none focus-visible:ring-4"
                style={{
                  ...inset(theme, 14),
                  color: theme.text,
                  "--tw-ring-color": theme.ring,
                }}
              />
            </div>

            <div>
              <label htmlFor="password" style={{ color: theme.text }} className="block text-sm font-black uppercase tracking-wide mb-2">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 focus:outline-none focus-visible:ring-4"
                style={{
                  ...inset(theme, 14),
                  color: theme.text,
                  "--tw-ring-color": theme.ring,
                }}
              />
            </div>

            <label
              htmlFor="showPassword"
              className="flex items-center gap-3 text-sm font-bold select-none"
              style={{ color: theme.text }}
            >
              <input
                id="showPassword"
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword((v) => !v)}
                className="h-4 w-4"
              />
              Show Password
            </label>

            {err && (
              <p
                role="alert"
                aria-live="polite"
                className="text-sm font-bold"
                style={{ color: theme.danger }}
              >
                {err}
              </p>
            )}

            <ClayButton
              theme={theme}
              type="submit"
              variant="gold"
              disabled={loading}
              className="w-full"
              ariaLabel="Log in to dashboard"
            >
              {loading ? "Loading..." : "Login"}
            </ClayButton>
          </form>
        </div>
      </div>
    </div>
  );
}