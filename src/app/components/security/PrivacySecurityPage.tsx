<<<<<<< HEAD
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Lock, Eye, Download, Trash2, Shield, Key } from "lucide-react";
import { useApp } from "../../context/AppContext";
=======
import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Lock, Eye, Download, Trash2, Shield, Key } from "lucide-react";
>>>>>>> 99e24f9592138587d512874a69224916a427016c

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
<<<<<<< HEAD
  const { changePassword, setTwoFactorEnabled, getUserSettings, setProfileVisibility, setReviewPrivacy, exportUserData, deleteAccount } = useApp();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [changePwdMessage, setChangePwdMessage] = useState<string | null>(null);

  const [twoFactorEnabledLocal, setTwoFactorEnabledLocal] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [profileVisibilityLocal, setProfileVisibilityLocal] = useState<"public" | "private">("public");
  const [reviewPrivacyLocal, setReviewPrivacyLocal] = useState<"public" | "private">("public");

  useEffect(() => {
    const s = getUserSettings();
    if (s) {
      setTwoFactorEnabledLocal(s.twoFactorEnabled);
      setProfileVisibilityLocal((s.profileVisibility as "public" | "private") || "public");
      setReviewPrivacyLocal((s.reviewPrivacy as "public" | "private") || "public");
    }
  }, []);

  const handleChangePassword = () => {
    setShowChangePassword(true);
  };

  const handleEnableTwoFactor = () => {
    // toggle via AppContext; if enabling, receive secret
    (async () => {
      const res = await setTwoFactorEnabled(!twoFactorEnabledLocal);
      if (res.success) {
        setTwoFactorEnabledLocal(!twoFactorEnabledLocal);
        if (res.secret) setTwoFactorSecret(res.secret);
        else if (!twoFactorEnabledLocal) setTwoFactorSecret(null);
        alert(`Two-factor ${!twoFactorEnabledLocal ? "enabled" : "disabled"}`);
      } else {
        alert(res.error || "Failed to update two-factor setting");
      }
    })();
  };

  const handleDownloadData = () => {
    exportUserData();
    alert("Your data export has been prepared and is downloading.");
=======
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleChangePassword = () => {
    alert("Password change flow would open here");
  };

  const handleEnableTwoFactor = () => {
    alert("Two-factor authentication setup would open here");
  };

  const handleDownloadData = () => {
    alert("Your data export is being prepared. You'll receive it via email shortly.");
>>>>>>> 99e24f9592138587d512874a69224916a427016c
  };

  const handleDeleteAccount = () => {
    if (showDeleteConfirm) {
<<<<<<< HEAD
      (async () => {
        const res = await deleteAccount();
        if (res.success) {
          alert("Account deleted. You will be redirected to login.");
          navigate("/");
        } else {
          alert(res.error || "Failed to delete account");
        }
        setShowDeleteConfirm(false);
      })();
=======
      alert("Account deletion initiated. You will be logged out.");
      setShowDeleteConfirm(false);
>>>>>>> 99e24f9592138587d512874a69224916a427016c
    } else {
      setShowDeleteConfirm(true);
    }
  };

<<<<<<< HEAD
  const submitChangePassword = async () => {
    setChangePwdMessage(null);
    if (!currentPwd || !newPwd) {
      setChangePwdMessage("Please fill all fields");
      return;
    }
    if (newPwd !== confirmPwd) {
      setChangePwdMessage("New passwords do not match");
      return;
    }
    const res = await changePassword(currentPwd, newPwd);
    if (res.success) {
      setChangePwdMessage("Password updated successfully");
      setTimeout(() => {
        setShowChangePassword(false);
        setCurrentPwd("");
        setNewPwd("");
        setConfirmPwd("");
        setChangePwdMessage(null);
      }, 1000);
    } else {
      setChangePwdMessage(res.error || "Failed to update password");
    }
  };

  const onProfileVisibilityChange = (v: "public" | "private") => {
    setProfileVisibilityLocal(v);
    setProfileVisibility(v);
  };

  const onReviewPrivacyChange = (v: "public" | "private") => {
    setReviewPrivacyLocal(v);
    setReviewPrivacy(v);
  };

=======
>>>>>>> 99e24f9592138587d512874a69224916a427016c
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
<<<<<<< HEAD
            right={
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={twoFactorEnabledLocal}
                  onChange={() => handleEnableTwoFactor()}
                />
              </label>
            }
=======
            onClick={handleEnableTwoFactor}
>>>>>>> 99e24f9592138587d512874a69224916a427016c
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
<<<<<<< HEAD
            right={(
              <select
                value={profileVisibilityLocal}
                onChange={(e) => onProfileVisibilityChange(e.target.value as any)}
                className="text-xs"
                style={{
                  color: "var(--spwn-text)",
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  padding: "4px 8px",
                  borderRadius: 8,
                  minWidth: 120,
                  WebkitAppearance: "menulist",
                  appearance: "auto",
                }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            )}
=======
            onClick={() => alert("Profile visibility settings would open here")}
>>>>>>> 99e24f9592138587d512874a69224916a427016c
          />
          <SettingRow
            icon={Lock}
            label="Review Privacy"
            subtitle="Manage who can see your reviews"
<<<<<<< HEAD
            right={(
              <select
                value={reviewPrivacyLocal}
                onChange={(e) => onReviewPrivacyChange(e.target.value as any)}
                className="text-xs"
                style={{
                  color: "var(--spwn-text)",
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  padding: "4px 8px",
                  borderRadius: 8,
                  minWidth: 100,
                  WebkitAppearance: "menulist",
                  appearance: "auto",
                }}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            )}
=======
            onClick={() => alert("Review privacy settings would open here")}
>>>>>>> 99e24f9592138587d512874a69224916a427016c
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
<<<<<<< HEAD
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="w-11/12 max-w-md p-4 rounded-lg" style={{ background: "var(--spwn-card)", border: `1px solid ${BORDER}`, color: "var(--spwn-text)" }}>
            <h2 className="text-lg mb-2" style={{ color: "var(--spwn-text)", fontWeight: 700 }}>Change Password</h2>
            <div className="flex flex-col gap-2">
              <input
                type="password"
                placeholder="Current password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full px-3 py-2 rounded"
                style={{ background: CARD, border: `1px solid ${BORDER}`, color: "var(--spwn-text)" }}
              />
              <input
                type="password"
                placeholder="New password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full px-3 py-2 rounded"
                style={{ background: CARD, border: `1px solid ${BORDER}`, color: "var(--spwn-text)" }}
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="w-full px-3 py-2 rounded"
                style={{ background: CARD, border: `1px solid ${BORDER}`, color: "var(--spwn-text)" }}
              />
              {changePwdMessage && <p className="text-xs mt-1" style={{ color: "var(--spwn-faint)" }}>{changePwdMessage}</p>}
              <div className="flex justify-end gap-2 mt-3">
                <button className="px-3 py-2 rounded" onClick={() => setShowChangePassword(false)} style={{ background: "transparent", border: `1px solid ${BORDER}` }}>Cancel</button>
                <button className="px-3 py-2 rounded" onClick={submitChangePassword} style={{ background: ACCENT, color: "white" }}>Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
=======
>>>>>>> 99e24f9592138587d512874a69224916a427016c
    </div>
  );
}
