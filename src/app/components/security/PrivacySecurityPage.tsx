import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Lock, Eye, Download, Trash2, Shield, Key } from "lucide-react";

const ACCENT = "var(--spwn-accent)";
const BORDER = "var(--spwn-border)";
const CARD = "var(--spwn-card)";

function SettingRow({
  icon: Icon,
  label,
  subtitle,
  right,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  subtitle?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 transition-all active:opacity-70"
      style={{
        borderBottom: `1px solid ${BORDER}`,
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: danger ? "rgba(239,68,68,0.1)" : "var(--spwn-glass)",
          border: `1px solid ${danger ? "rgba(239,68,68,0.2)" : BORDER}`,
        }}
      >
        <Icon size={15} style={{ color: danger ? "#ef4444" : ACCENT }} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm" style={{ color: danger ? "#ef4444" : "var(--spwn-text)", fontWeight: 600 }}>
          {label}
        </p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--spwn-faint)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {right && (
        <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
          {right}
        </div>
      )}
    </div>
  );
}

export function PrivacySecurityPage() {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChangePassword = () => {
    alert("Password change flow would open here");
  };

  const handleEnableTwoFactor = () => {
    alert("Two-factor authentication setup would open here");
  };

  const handleDownloadData = () => {
    alert("Your data export is being prepared. You'll receive it via email shortly.");
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
      alert("Account deletion initiated. You will be logged out.");
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: "var(--spwn-bg)" }}>
      {/* Header */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 h-16 border-b"
        style={{ borderColor: BORDER }}
      >
        <button onClick={() => navigate("/app/profile")} className="p-2 -ml-2">
          <ChevronLeft size={20} style={{ color: ACCENT }} />
        </button>
        <h1 className="text-lg" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>
          Privacy & Security
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {/* Password & Auth Section */}
        <div className="border-t" style={{ borderColor: BORDER }}>
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
              Password & Authentication
            </p>
          </div>
          <SettingRow
            icon={Key}
            label="Change Password"
            subtitle="Update your account password"
            onClick={handleChangePassword}
          />
          <SettingRow
            icon={Shield}
            label="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            onClick={handleEnableTwoFactor}
          />
        </div>

        {/* Privacy Section */}
        <div className="border-t mt-2" style={{ borderColor: BORDER }}>
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
              Privacy Controls
            </p>
          </div>
          <SettingRow
            icon={Eye}
            label="Profile Visibility"
            subtitle="Control who can see your profile"
            onClick={() => alert("Profile visibility settings would open here")}
          />
          <SettingRow
            icon={Lock}
            label="Review Privacy"
            subtitle="Manage who can see your reviews"
            onClick={() => alert("Review privacy settings would open here")}
          />
        </div>

        {/* Data Management Section */}
        <div className="border-t mt-2" style={{ borderColor: BORDER }}>
          <div className="px-4 pt-4 pb-2">
            <p className="text-xs tracking-widest uppercase" style={{ color: "var(--spwn-faint)", fontWeight: 700 }}>
              Data Management
            </p>
          </div>
          <SettingRow
            icon={Download}
            label="Download Your Data"
            subtitle="Export all your account data"
            onClick={handleDownloadData}
          />
          <SettingRow
            icon={Trash2}
            label={showDeleteConfirm ? "Confirm Account Deletion" : "Delete Account"}
            subtitle={showDeleteConfirm ? "This action cannot be undone" : "Permanently delete your account"}
            onClick={handleDeleteAccount}
            danger
          />
        </div>

        {/* Info */}
        <div className="px-4 mt-6 pb-4">
          <div
            className="p-3 rounded-lg"
            style={{ background: "var(--spwn-glass)", border: `1px solid ${BORDER}` }}
          >
            <p className="text-xs" style={{ color: "var(--spwn-faint)", lineHeight: 1.5 }}>
              We take your privacy and security seriously. Your data is encrypted and stored securely. For more details, please review our Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
