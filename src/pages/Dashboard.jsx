import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { logout } from "../firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

const tokens = {
  bgDeep:       "#050505",
  bgElevated:   "#141210",
  bgGlass:      "rgba(24, 24, 27, 0.4)",
  accentGold:   "#f59e0b",
  textPrimary:  "#f2ede4",
  textMuted:    "#78716f",
  borderSubtle: "#2a2720",
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) { navigate("/login"); return; }
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: tokens.bgDeep }}>
        <div style={{ color: tokens.textMuted, fontSize: "14px" }}>Loading…</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${tokens.bgDeep}; font-family: 'DM Sans', sans-serif; color: ${tokens.textPrimary}; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: tokens.bgDeep, padding: "0 0 60px" }}>
        {/* Navbar */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 40px", borderBottom: `1px solid ${tokens.borderSubtle}`, background: "rgba(5,5,5,0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", background: `linear-gradient(135deg, ${tokens.accentGold}, #fbbf24)`, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#050505" strokeWidth="2"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#050505" strokeWidth="2"/>
              </svg>
            </div>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: tokens.textPrimary }}>KitobOlami</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontSize: "13px", color: tokens.textMuted }}>{user?.email}</span>
            <button onClick={handleLogout}
              style={{ padding: "8px 18px", background: "transparent", border: `1px solid ${tokens.borderSubtle}`, borderRadius: "8px", color: tokens.textPrimary, fontSize: "13px", cursor: "pointer", fontFamily: "inherit" }}>
              Sign out
            </button>
          </div>
        </nav>

        {/* Content */}
        <div style={{ maxWidth: "800px", margin: "60px auto", padding: "0 24px", animation: "fadeIn 0.5s ease-out" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontWeight: 300, color: tokens.accentGold, marginBottom: "12px" }}>
              Welcome{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}!
            </h1>
            <p style={{ fontSize: "16px", color: tokens.textMuted }}>Your literary journey continues here.</p>
          </div>

          {/* User Info Card */}
          <div style={{ background: tokens.bgGlass, border: `1px solid ${tokens.borderSubtle}`, borderRadius: "16px", padding: "32px", marginBottom: "24px", backdropFilter: "blur(12px)" }}>
            <h2 style={{ fontSize: "14px", color: tokens.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}>Account Details</h2>
            <div style={{ display: "grid", gap: "16px" }}>
              {[
                { label: "Name", value: user?.displayName || "—" },
                { label: "Email", value: user?.email },
                { label: "Email Verified", value: user?.emailVerified ? "✓ Verified" : "⚠ Not verified" },
                { label: "Provider", value: user?.providerData?.[0]?.providerId === "google.com" ? "Google" : user?.providerData?.[0]?.providerId === "apple.com" ? "Apple" : "Email / Password" },
                { label: "Member since", value: user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${tokens.borderSubtle}` }}>
                  <span style={{ fontSize: "13px", color: tokens.textMuted }}>{label}</span>
                  <span style={{ fontSize: "14px", color: tokens.textPrimary }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {!user?.emailVerified && user?.providerData?.[0]?.providerId === "password" && (
            <div style={{ background: "#f59e0b10", border: `1px solid ${tokens.accentGold}40`, borderRadius: "12px", padding: "16px 20px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "12px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={tokens.accentGold} strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: "13px", color: tokens.accentGold }}>Please check your inbox and verify your email address to access all features.</p>
            </div>
          )}

          <div style={{ background: tokens.bgGlass, border: `1px solid ${tokens.borderSubtle}`, borderRadius: "16px", padding: "32px", backdropFilter: "blur(12px)", textAlign: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={tokens.textMuted} strokeWidth="1" style={{ marginBottom: "16px" }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <p style={{ fontSize: "16px", color: tokens.textMuted }}>Your library is empty. Start exploring books!</p>
          </div>
        </div>
      </div>
    </>
  );
}
