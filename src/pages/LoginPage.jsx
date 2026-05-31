import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginWithEmail, loginWithGoogle, loginWithApple, resetPassword } from "../firebase/auth";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const tokens = {
  bgDeep:       "#050505",
  bgSurface:    "#0a0a0a",
  bgElevated:   "#141210",
  bgGlass:      "rgba(24, 24, 27, 0.4)",
  accentGold:   "#f59e0b",
  accentWarm:   "#fde68a",
  textPrimary:  "#f2ede4",
  textMuted:    "#78716f",
  borderSubtle: "#2a2720",
  error:        "#c0614a",
  success:      "#10b981",
};

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
      <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 376.8 1 308.9 1 224.3c0-120.7 78.3-184.7 154.7-184.7 54.4 0 99.7 36.8 133.5 36.8 32.8 0 83.7-38.9 144.7-38.9 23.2 0 105.6 2 155.5 77.3zm-120.1-141.8c24.9-30.1 42.1-71.4 42.1-112.7 0-5.8-.5-11.7-1.5-16.9-39.7 1.5-86.1 26.5-114.3 58.3-21.5 24.6-41.6 65.8-41.6 107.7 0 6.4 1 12.8 1.5 14.9 2.5.5 6.5 1 10.5 1 35.2 0 79.3-23.6 103.3-52.3z"/>
    </svg>
  );
}

function OtpInput({ value, onChange, disabled }) {
  const handleChange = (index, val) => {
    const newOtp = [...value];
    newOtp[index] = val.replace(/[^0-9]/g, "");
    if (newOtp[index] && index < 5) document.getElementById(`otp-${index + 1}`)?.focus();
    onChange(newOtp);
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !value[index] && index > 0) document.getElementById(`otp-${index - 1}`)?.focus();
  };
  return (
    <div style={{ display: "flex", gap: "12px", justifyContent: "center", margin: "24px 0" }}>
      {[0,1,2,3,4,5].map((i) => (
        <input
          key={i} id={`otp-${i}`} type="text" maxLength="1"
          value={value[i]} onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)} disabled={disabled}
          style={{
            width: "48px", height: "52px", textAlign: "center", fontSize: "24px", fontWeight: "600",
            background: tokens.bgElevated, border: `2px solid ${tokens.borderSubtle}`,
            borderRadius: "12px", color: tokens.textPrimary, outline: "none",
            cursor: disabled ? "not-allowed" : "text", opacity: disabled ? 0.6 : 1, transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = tokens.accentGold)}
          onBlur={(e) => (e.target.style.borderColor = tokens.borderSubtle)}
        />
      ))}
    </div>
  );
}

const inputStyle = (hasError) => ({
  width: "100%", padding: "12px 16px",
  background: tokens.bgElevated,
  border: `1px solid ${hasError ? tokens.error : tokens.borderSubtle}`,
  borderRadius: "8px", color: tokens.textPrimary,
  fontSize: "15px", outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
  boxSizing: "border-box", fontFamily: "inherit",
});

const btnPrimary = (loading) => ({
  width: "100%", padding: "14px",
  background: loading ? tokens.bgElevated : tokens.accentGold,
  border: "none", borderRadius: "8px",
  color: loading ? tokens.textMuted : "#050505",
  fontSize: "15px", fontWeight: 600,
  cursor: loading ? "not-allowed" : "pointer",
  letterSpacing: "0.02em", transition: "background 0.2s",
  marginBottom: "16px", fontFamily: "inherit",
});

const btnSecondary = {
  width: "100%", padding: "12px",
  background: "transparent",
  border: `1px solid ${tokens.borderSubtle}`,
  borderRadius: "8px", color: tokens.textPrimary,
  cursor: "pointer", fontFamily: "inherit", marginBottom: "12px",
};

const labelStyle = {
  display: "block", fontSize: "12px", color: tokens.textMuted,
  letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState(["","","","","",""]);
  const [emailSent, setEmailSent] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 6) e.password = "Password must be at least 6 characters.";
    return e;
  };

  const handleLogin = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await loginWithEmail(email, password);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      let msg = "Login failed. Please try again.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") msg = "Incorrect email or password.";
      else if (err.code === "auth/too-many-requests") msg = "Too many attempts. Please try again later.";
      setErrors({ submit: msg });
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrors({ submit: "Google sign-in failed." });
    }
  };

  const handleApple = async () => {
    setLoading(true);
    try {
      await loginWithApple();
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setErrors({ submit: "Apple sign-in failed." });
    }
  };

  const handleForgot = async (ev) => {
    ev.preventDefault();
    if (!email) { setErrors({ email: "Email is required." }); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setLoading(false);
      setEmailSent(true);
    } catch (err) {
      setLoading(false);
      setErrors({ email: "Could not send reset email. Check your address." });
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${tokens.bgDeep}; font-family: 'DM Sans', sans-serif; color: ${tokens.textPrimary}; }
        input::placeholder { color: #4a4438; }
        input:disabled, button:disabled { opacity: 0.6; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", background: tokens.bgDeep, position: "relative" }}>
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", background: `radial-gradient(circle, ${tokens.accentGold}15, transparent)`, borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-5%", right: "-5%", width: "30%", height: "30%", background: `radial-gradient(circle, ${tokens.accentGold}08, transparent)`, borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px", background: tokens.bgGlass, backdropFilter: "blur(20px)", border: `1px solid ${tokens.borderSubtle}`, borderRadius: "20px", padding: "48px 32px", animation: "fadeIn 0.4s ease-out" }}>
          {/* Logo */}
          <div style={{ marginBottom: "36px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{ width: "40px", height: "40px", background: `linear-gradient(135deg, ${tokens.accentGold}, #fbbf24)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#050505"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#050505" strokeWidth="2" fill="none"/></svg>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: tokens.textPrimary }}>KitobOlami</span>
            </div>

            {screen === "login" && (
              <>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 300, color: tokens.accentGold, marginBottom: "6px" }}>Welcome back</h1>
                <p style={{ fontSize: "14px", color: tokens.textMuted }}>Sign in to continue to your library</p>
              </>
            )}
            {screen === "forgotPassword" && (
              <>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, color: tokens.accentGold, marginBottom: "6px" }}>Reset password</h1>
                <p style={{ fontSize: "14px", color: tokens.textMuted }}>We'll send you a reset link</p>
              </>
            )}
          </div>

          {/* ── Login Screen ── */}
          {screen === "login" && (
            <form onSubmit={handleLogin} noValidate>
              {errors.submit && (
                <div style={{ padding: "12px", background: tokens.error + "20", border: `1px solid ${tokens.error}`, borderRadius: "8px", color: tokens.error, fontSize: "13px", marginBottom: "20px" }}>
                  {errors.submit}
                </div>
              )}
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle} htmlFor="email">Email address</label>
                <input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: null})); }} placeholder="you@example.com" style={inputStyle(errors.email)}
                  onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${tokens.accentGold}15`)}
                  onBlur={(e) => (e.target.style.boxShadow = "none")} />
                {errors.email && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "6px" }}>{errors.email}</p>}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle} htmlFor="password">Password</label>
                <div style={{ position: "relative" }}>
                  <input id="password" type={showPassword ? "text" : "password"} value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: null})); }}
                    placeholder="••••••••" style={{ ...inputStyle(errors.password), padding: "12px 44px 12px 16px" }}
                    onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${tokens.accentGold}15`)}
                    onBlur={(e) => (e.target.style.boxShadow = "none")} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: tokens.textMuted, padding: "4px", display: "flex", alignItems: "center" }}>
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "6px" }}>{errors.password}</p>}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: tokens.textMuted, cursor: "pointer" }}>
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} style={{ accentColor: tokens.accentGold, cursor: "pointer" }} />
                  Remember me
                </label>
                <button type="button" onClick={() => { setScreen("forgotPassword"); setErrors({}); }}
                  style={{ fontSize: "13px", color: tokens.accentGold, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} style={btnPrimary(loading)}>
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1, height: "1px", background: tokens.borderSubtle }} />
                <span style={{ fontSize: "12px", color: tokens.textMuted, letterSpacing: "0.05em" }}>or</span>
                <div style={{ flex: 1, height: "1px", background: tokens.borderSubtle }} />
              </div>

              <button type="button" onClick={handleGoogle} disabled={loading}
                style={{ ...btnSecondary, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
                <GoogleIcon /> Continue with Google
              </button>
              <button type="button" onClick={handleApple} disabled={loading}
                style={{ ...btnSecondary, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "0" }}>
                <AppleIcon /> Continue with Apple
              </button>

              <p style={{ textAlign: "center", fontSize: "13px", color: tokens.textMuted, marginTop: "28px" }}>
                New to KitobOlami?{" "}
                <Link to="/signup" style={{ color: tokens.accentGold, textDecoration: "none" }}>Create an account</Link>
              </p>
            </form>
          )}

          {/* ── Forgot Password Screen ── */}
          {screen === "forgotPassword" && !emailSent && (
            <form onSubmit={handleForgot} noValidate>
              <div style={{ marginBottom: "20px" }}>
                <label style={labelStyle} htmlFor="forgot-email">Email address</label>
                <input id="forgot-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors({}); }} placeholder="you@example.com" style={inputStyle(errors.email)} />
                {errors.email && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "6px" }}>{errors.email}</p>}
              </div>
              <button type="submit" disabled={loading} style={btnPrimary(loading)}>
                {loading ? "Sending…" : "Send reset link"}
              </button>
              <button type="button" onClick={() => setScreen("login")} style={btnSecondary}>Back to login</button>
            </form>
          )}

          {emailSent && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "64px", height: "64px", background: tokens.accentGold + "20", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={tokens.accentGold} strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: tokens.textPrimary, marginBottom: "8px" }}>Check your email</h2>
              <p style={{ fontSize: "14px", color: tokens.textMuted, marginBottom: "24px" }}>
                We've sent a password reset link to <strong style={{ color: tokens.textPrimary }}>{email}</strong>
              </p>
              <button onClick={() => { setScreen("login"); setEmailSent(false); setEmail(""); }} style={{ ...btnPrimary(false), marginBottom: "10px" }}>Back to login</button>
              <button onClick={() => setEmailSent(false)} style={btnSecondary}>Resend email</button>
            </div>
          )}
        </div>

        <div style={{ marginTop: "40px", textAlign: "center", color: tokens.textMuted, fontSize: "12px" }}>
          <p>© 2024 KitobOlami. All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
