"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, ShieldCheck } from "lucide-react";
import SchoolBrandMark from "@/components/SchoolBrandMark";

type Role = "admin" | "teacher" | "student";

const roles: { value: Role; label: string; description: string; icon: typeof ShieldCheck }[] = [
  { value: "admin", label: "Administrator", description: "Manage your school", icon: ShieldCheck },
  { value: "teacher", label: "Teacher", description: "Manage your classes", icon: BookOpen },
  { value: "student", label: "Student", description: "View your learning", icon: GraduationCap },
];

export default function LoginPageClient({ schoolName, logo }: { schoolName: string; logo: string }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>("admin");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password, role }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.detail ? `${result.error ?? "Unable to sign in."} ${result.detail}` : result.error ?? "Unable to sign in. Please try again.");
        return;
      }

      router.replace(result.user?.role === "teacher" ? "/teacher" : result.user?.role === "student" ? "/student" : "/dashboard");
      router.refresh();
    } catch {
      setError("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="signin-page">
      <nav className="signin-topbar relative z-30">
        <div className="signin-topbar-inner">
          <Link href="/" prefetch className="signin-brand"><SchoolBrandMark compact schoolName={schoolName} logo={logo} /></Link>
          <div className="signin-top-links">
            <Link prefetch href="/">Home</Link>
            <Link prefetch href="/about-us">About us</Link>
            <Link prefetch href="/contact">Contact</Link>
          </div>
          <button type="button" onClick={() => setMenuOpen((current) => !current)} aria-expanded={menuOpen} aria-controls="login-mobile-menu" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} className="signin-menu-toggle">
            {menuOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
        {menuOpen && (
          <div id="login-mobile-menu" className="signin-mobile-menu">
            <Link prefetch href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link prefetch href="/about-us" onClick={() => setMenuOpen(false)}>About us</Link>
            <Link prefetch href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </nav>
      <div className="signin-layout">
        <section className="signin-story">
          <div className="signin-story-content">
            <p className="signin-story-kicker"><ShieldCheck size={16} aria-hidden="true" /> School portal</p>
            <p className="signin-story-overline">Everything your school needs, together</p>
            <h1>Make every school day <span>simpler.</span></h1>
            <p className="signin-story-description">Manage attendance, classes, fees, results, and school communication from one secure workspace for {schoolName}.</p>
            <div className="signin-story-features">
              <span><BookOpen size={17} aria-hidden="true" /> Learning and class tools</span>
              <span><ShieldCheck size={17} aria-hidden="true" /> Secure role-based access</span>
            </div>
          </div>
          <p className="signin-story-footer">A focused workspace for your school community.</p>
        </section>

        <section className="signin-form-panel">
          <div className="signin-form-content">
            <div className="signin-form-mark"><GraduationCap size={23} aria-hidden="true" /></div>
            <p className="signin-eyebrow">Welcome back</p>
            <h2>Sign in to your school</h2>
            <p className="signin-intro">Choose your account type to continue.</p>
            <Link href="/" prefetch className="signin-back-link">
              <ArrowLeft size={15} aria-hidden="true" /> Back to home
            </Link>

            <div className="signin-role-grid" role="group" aria-label="Choose account type">
              {roles.map((item) => (
                <button key={item.value} type="button" aria-pressed={role === item.value} onClick={() => setRole(item.value)} className={`signin-role${role === item.value ? " is-selected" : ""}`}>
                  <item.icon size={18} aria-hidden="true" />
                  <span className="signin-role-label">{item.label}</span>
                  <span className="signin-role-description">{item.description}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="signin-form">
              <label className="signin-label">
                {role === "student" ? "CNIC" : "Email or CNIC"}
                <input value={identifier} onChange={(event) => setIdentifier(event.target.value)} required autoComplete="username" autoCapitalize="none" spellCheck={false} className="signin-input" placeholder={role === "student" ? "42101-1234567-1" : "teacher@school.com or CNIC"} />
              </label>
              <label className="signin-label">
                Password
                <span className="signin-password-field">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" className="signin-input" placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="signin-password-toggle">
                    {showPassword ? <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 4.2A10.7 10.7 0 0 1 12 4c5 0 8.5 4 9.5 6a11.5 11.5 0 0 1-3.2 3.8M6.2 6.2C4.4 7.4 3.2 9 2.5 10c1 2 4.5 6 9.5 6 1 0 2-.2 2.8-.5" /></svg> : <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6S18 18 12 18s-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></svg>}
                  </button>
                </span>
              </label>
              {error && <p role="alert" className="signin-error">{error}</p>}
              <button type="submit" disabled={loading} className="signin-submit">{loading ? <span className="signin-loading"><span className="spinner" />Signing in…</span> : "Sign in"}</button>
            </form>
            <p className="signin-security-note"><ShieldCheck size={15} aria-hidden="true" /> Sign in with the account details provided by your school.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
