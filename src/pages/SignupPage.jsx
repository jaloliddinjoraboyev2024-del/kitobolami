import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupWithEmail, loginWithGoogle, loginWithApple } from "../firebase/auth";

const tokens = {
  bgDeep:       "#050505",
  bgSurface:    "#0a0a0a",
  bgElevated:   "#141210",
  bgGlass:      "rgba(24, 24, 27, 0.4)",
  accentGold:   "#f59e0b",
  textPrimary:  "#f2ede4",
  textMuted:    "#78716f",
  borderSubtle: "#2a2720",
  error:        "#c0614a",
  success:      "#10b981",
};

const inputStyle = (hasError) => ({
  width: "100%", padding: "12px 16px",
  background: tokens.bgElevated,
  border: `1px solid ${hasError ? tokens.error : tokens.borderSubtle}`,
  borderRadius: "8px", color: tokens.textPrimary,
  fontSize: "15px", outline: "none",
  boxSizing: "border-box", fontFamily: "inherit",
  transition: "border-color 0.2s, box-shadow 0.2s",
});

const labelStyle = {
  display: "block", fontSize: "12px", color: tokens.textMuted,
  letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px",
};

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

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [screen, setScreen] = useState("signup");

  const getPasswordStrength = (p) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[a-z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[!@#$%^&*]/.test(p)) score++;
    return score;
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required.";
    if (!formData.email) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Enter a valid email address.";
    if (!formData.password) errs.password = "Password is required.";
    else if (formData.password.length < 8) errs.password = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(formData.password)) errs.password = "Password must include an uppercase letter.";
    else if (!/[a-z]/.test(formData.password)) errs.password = "Password must include a lowercase letter.";
    else if (!/[0-9]/.test(formData.password)) errs.password = "Password must include a number.";
    else if (!/[!@#$%^&*]/.test(formData.password)) errs.password = "Password must include a special character (!@#$%^&*).";
    if (!formData.confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords do not match.";
    if (!agreedToTerms) errs.terms = "You must agree to the terms and privacy policy.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({}); setLoading(true);
    try {
      await signupWithEmail(formData.fullName, formData.email, formData.password);
      setLoading(false);
      setScreen("verification");
    } catch (err) {
      setLoading(false);
      let msg = "Signup failed. Please try again.";
      if (err.code === "auth/email-already-in-use") msg = "This email is already registered. Try signing in.";
      else if (err.code === "auth/weak-password") msg = "Password is too weak.";
      setErrors({ submit: msg });
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch {
      setLoading(false);
      setErrors({ submit: "Google sign-in failed." });
    }
  };

  const handleApple = async () => {
    setLoading(true);
    try {
      await loginWithApple();
      navigate("/dashboard");
    } catch {
      setLoading(false);
      setErrors({ submit: "Apple sign-in failed." });
    }
  };

  const strength = getPasswordStrength(formData.password);
  const strengthColor = ["#c0614a", "#c0614a", "#f59e0b", "#f59e0b", "#10b981"][strength - 1] || tokens.borderSubtle;
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][strength] || "";

  const btnPrimary = (l) => ({
    width: "100%", padding: "12px",
    background: l ? tokens.bgElevated : tokens.accentGold,
    border: "none", borderRadius: "8px",
    color: l ? tokens.textMuted : "#050505",
    fontWeight: 600, cursor: l ? "not-allowed" : "pointer",
    fontFamily: "inherit", marginBottom: "16px",
  });

  const btnSecondary = {
    width: "100%", padding: "12px",
    background: "transparent", border: `1px solid ${tokens.borderSubtle}`,
    borderRadius: "8px", color: tokens.textPrimary,
    cursor: "pointer", fontFamily: "inherit",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
    marginBottom: "10px",
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

      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 20px 40px", background: tokens.bgDeep, position: "relative" }}>
        <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "40%", height: "40%", background: `radial-gradient(circle, ${tokens.accentGold}12, transparent)`, borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: "420px", background: tokens.bgGlass, backdropFilter: "blur(20px)", border: `1px solid ${tokens.borderSubtle}`, borderRadius: "20px", padding: "48px 32px", animation: "fadeIn 0.4s ease-out" }}>
          {/* Logo */}
          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ width: "40px", height: "40px", background: `linear-gradient(135deg, ${tokens.accentGold}, #fbbf24)`, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#050505" strokeWidth="2"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#050505" strokeWidth="2"/></svg>
              </div>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, color: tokens.textPrimary }}>KitobOlami</span>
            </div>
            {screen === "signup" && (
              <>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 300, color: tokens.accentGold, marginBottom: "6px" }}>Create account</h1>
                <p style={{ fontSize: "14px", color: tokens.textMuted }}>Join our literary community today</p>
              </>
            )}
          </div>

          {/* ── Signup Form ── */}
          {screen === "signup" && (
            <form onSubmit={handleSubmit} noValidate>
              {errors.submit && (
                <div style={{ padding: "12px", background: tokens.error + "20", border: `1px solid ${tokens.error}`, borderRadius: "8px", color: tokens.error, fontSize: "13px", marginBottom: "16px" }}>
                  {errors.submit}
                </div>
              )}

              {/* Social buttons at top */}
              <button type="button" onClick={handleGoogle} disabled={loading} style={btnSecondary}>
                <GoogleIcon /> Continue with Google
              </button>
              <button type="button" onClick={handleApple} disabled={loading} style={{ ...btnSecondary, marginBottom: "20px" }}>
                <AppleIcon /> Continue with Apple
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ flex: 1, height: "1px", background: tokens.borderSubtle }} />
                <span style={{ fontSize: "12px", color: tokens.textMuted }}>or with email</span>
                <div style={{ flex: 1, height: "1px", background: tokens.borderSubtle }} />
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Full name</label>
                <input type="text" value={formData.fullName}
                  onChange={(e) => { setFormData({ ...formData, fullName: e.target.value }); if (errors.fullName) setErrors(p => ({...p, fullName: null})); }}
                  placeholder="Your full name" style={inputStyle(errors.fullName)}
                  onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${tokens.accentGold}15`)}
                  onBlur={(e) => (e.target.style.boxShadow = "none")} />
                {errors.fullName && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "4px" }}>{errors.fullName}</p>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Email address</label>
                <input type="email" value={formData.email}
                  onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors(p => ({...p, email: null})); }}
                  placeholder="you@example.com" style={inputStyle(errors.email)}
                  onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${tokens.accentGold}15`)}
                  onBlur={(e) => (e.target.style.boxShadow = "none")} />
                {errors.email && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "4px" }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPassword ? "text" : "password"} value={formData.password}
                    onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (errors.password) setErrors(p => ({...p, password: null})); }}
                    placeholder="••••••••" style={{ ...inputStyle(errors.password), padding: "12px 44px 12px 16px" }}
                    onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${tokens.accentGold}15`)}
                    onBlur={(e) => (e.target.style.boxShadow = "none")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: tokens.textMuted, padding: "4px" }}>
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
                {/* Strength bar */}
                {formData.password && (
                  <div style={{ marginTop: "8px" }}>
                    <div style={{ display: "flex", gap: "4px", marginBottom: "4px" }}>
                      {[1,2,3,4,5].map(i => (
                        <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: i <= strength ? strengthColor : tokens.borderSubtle, transition: "background 0.3s" }} />
                      ))}
                    </div>
                    <p style={{ fontSize: "11px", color: strengthColor }}>{strengthLabel}</p>
                  </div>
                )}
                {errors.password && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "4px" }}>{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>Confirm password</label>
                <div style={{ position: "relative" }}>
                  <input type={showConfirm ? "text" : "password"} value={formData.confirmPassword}
                    onChange={(e) => { setFormData({ ...formData, confirmPassword: e.target.value }); if (errors.confirmPassword) setErrors(p => ({...p, confirmPassword: null})); }}
                    placeholder="••••••••" style={{ ...inputStyle(errors.confirmPassword), padding: "12px 44px 12px 16px" }}
                    onFocus={(e) => (e.target.style.boxShadow = `0 0 0 3px ${tokens.accentGold}15`)}
                    onBlur={(e) => (e.target.style.boxShadow = "none")} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: tokens.textMuted, padding: "4px" }}>
                    {showConfirm ? "🙈" : "👁"}
                  </button>
                </div>
                {errors.confirmPassword && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "4px" }}>{errors.confirmPassword}</p>}
              </div>

              {/* Terms */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12px", color: tokens.textMuted, cursor: "pointer" }}>
                  <input type="checkbox" checked={agreedToTerms}
                    onChange={(e) => { setAgreedToTerms(e.target.checked); if (e.target.checked) setErrors(p => ({...p, terms: null})); }}
                    style={{ marginTop: "3px", accentColor: tokens.accentGold, cursor: "pointer" }} />
                  <span>
                    I agree to the{" "}
                    <a href="#" style={{ color: tokens.accentGold, textDecoration: "underline" }}>Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" style={{ color: tokens.accentGold, textDecoration: "underline" }}>Privacy Policy</a>
                  </span>
                </label>
                {errors.terms && <p style={{ fontSize: "12px", color: tokens.error, marginTop: "4px" }}>{errors.terms}</p>}
              </div>

              <button type="submit" disabled={loading} style={btnPrimary(loading)}>
                {loading ? "Creating account…" : "Create account"}
              </button>

              <p style={{ textAlign: "center", fontSize: "13px", color: tokens.textMuted }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: tokens.accentGold, textDecoration: "none" }}>Sign in</Link>
              </p>
            </form>
          )}

          {/* ── Verification Screen ── */}
          {screen === "verification" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "72px", height: "72px", background: tokens.accentGold + "20", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={tokens.accentGold} strokeWidth="1.5">
                  <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 300, color: tokens.accentGold, marginBottom: "8px" }}>Verify your email</h2>
              <p style={{ fontSize: "14px", color: tokens.textMuted, marginBottom: "8px" }}>
                A verification link has been sent to:
              </p>
              <p style={{ fontSize: "15px", color: tokens.textPrimary, fontWeight: 500, marginBottom: "24px" }}>{formData.email}</p>
              <p style={{ fontSize: "13px", color: tokens.textMuted, marginBottom: "32px", lineHeight: 1.6 }}>
                Click the link in your email to verify your account, then sign in below.
              </p>
              <button onClick={() => navigate("/login")}
                style={{ ...btnPrimary(false), marginBottom: "10px" }}>
                Go to login
              </button>
              <button onClick={() => setScreen("signup")} style={{ ...btnSecondary, justifyContent: "center" }}>
                Back to signup
              </button>
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
