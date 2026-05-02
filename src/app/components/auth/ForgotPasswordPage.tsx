import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import spwnLogo from "@/assets/spwn-logo.png";
import { ChevronLeft, CheckCircle2 } from "lucide-react";

const ACCENT = "#00aaff";
const BORDER = "rgba(255,255,255,0.08)";
const CARD = "#0e0e1c";

function SpwnInput({
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-white/50 text-xs tracking-widest uppercase" style={{ fontWeight: 600 }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg text-white text-sm placeholder-white/25 outline-none transition-all duration-200"
        style={{
          background: "#141425",
          border: `1px solid ${BORDER}`,
          boxShadow: "inset 0 1px 4px rgba(0,0,0,0.3)",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(0,170,255,0.5)")}
        onBlur={(e) => (e.target.style.borderColor = BORDER)}
      />
    </div>
  );
}

function GlassButton({
  onClick,
  children,
  variant = "primary",
  disabled = false,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  disabled?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => !disabled && setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => !disabled && setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      className="w-full py-3.5 rounded-lg text-white text-sm transition-all duration-150"
      style={
        variant === "primary"
          ? {
            background: disabled ? "rgba(0,170,255,0.5)" : ACCENT,
            fontWeight: 700,
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
            boxShadow: pressed && !disabled
              ? `0 2px 8px rgba(0,170,255,0.3)`
              : `0 4px 16px rgba(0,170,255,0.35), 0 8px 24px rgba(0,170,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)`,
            transform: pressed && !disabled ? "scale(0.98) translateY(1px)" : "scale(1)",
          }
          : {
            background: "rgba(255,255,255,0.06)",
            border: `1px solid rgba(255,255,255,0.15)`,
            fontWeight: 600,
            cursor: "pointer",
            transform: pressed && !disabled ? "scale(0.98)" : "scale(1)",
          }
      }
    >
      {children}
    </button>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setError("");
    if (!email) {
      setError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    // Simulate email sending
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);
  };

  if (success) {
    return (
      <div className="w-full h-full overflow-y-auto" style={{ background: "#08080f" }}>
        {/* Top nav bar */}
        <div
          className="flex items-center gap-3 px-5 h-20 border-b shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.4)" }}
        >
          <img src={spwnLogo} alt="SPWN" className="w-20 h-20 object-contain" />
          <span className="text-white text-base" style={{ fontWeight: 800, letterSpacing: "0.05em" }}>SPWN</span>
        </div>

        {/* Success Card */}
        <div className="flex flex-col items-center justify-center px-5 py-10 min-h-[calc(100%-80px)]">
          <div className="w-full rounded-xl p-6 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="flex justify-center mb-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: "rgba(52,211,153,0.2)", border: "2px solid #34d399" }}
              >
                <CheckCircle2 size={32} color="#34d399" strokeWidth={1.5} />
              </div>
            </div>

            <h1 className="text-white text-2xl mb-2" style={{ fontWeight: 700 }}>
              Check Your Email
            </h1>
            <p className="text-white/40 text-sm mb-6 leading-relaxed">
              If an account exists for <span className="text-white/60">{email}</span>, we've sent a password reset link to your inbox. Check your email and follow the instructions.
            </p>

            <p className="text-white/30 text-xs mb-6 px-4" style={{ lineHeight: "1.6" }}>
              Didn't receive the email? Check your spam folder or try again with a different email address.
            </p>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 rounded-lg text-white text-sm transition-all duration-150"
              style={{
                background: ACCENT,
                fontWeight: 700,
                boxShadow: "0 4px 16px rgba(0,170,255,0.35), 0 8px 24px rgba(0,170,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto" style={{ background: "#08080f" }}>
      {/* Top nav bar */}
      <div
        className="flex items-center gap-3 px-5 h-20 border-b shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(0,0,0,0.4)" }}
      >
        <img src={spwnLogo} alt="SPWN" className="w-20 h-20 object-contain" />
        <span className="text-white text-base" style={{ fontWeight: 800, letterSpacing: "0.05em" }}>SPWN</span>
      </div>

      {/* Card */}
      <div className="flex flex-col items-center justify-center px-5 py-10 min-h-[calc(100%-80px)]">
        <div className="w-full rounded-xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="text-center mb-2">
              <h1 className="text-white text-2xl" style={{ fontWeight: 700 }}>Reset Password</h1>
              <p className="text-white/40 text-sm mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Email Input */}
            <SpwnInput
              label="Email Address"
              type="email"
              placeholder="gamer@example.com"
              value={email}
              onChange={setEmail}
            />

            {/* Error Message */}
            {error && (
              <div className="text-xs text-red-400 text-center px-3 py-2 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <GlassButton onClick={handleReset} disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </GlassButton>

            {/* Back to Login */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 text-white/40 hover:text-white/60 transition-colors"
            >
              <ChevronLeft size={16} />
              <span className="text-sm">Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
