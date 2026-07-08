import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/authContext";
import { updateProfile, changePassword } from "../api/profile";
import {
  User, Mail, Shield, Save, Loader2, Check, AlertCircle, Camera, Lock, KeyRound
} from "lucide-react";

export default function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user?.username) setUsername(user.username);
  }, [user]);

  const handleSaveProfile = async () => {
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const res = await updateProfile({ username });
      if (res.data.success) {
        updateUser(res.data.user);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSaved(false);
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSaved(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
        <p className="mt-1 text-slate-500">Manage your account settings and password</p>
      </div>

      {/* Profile Info Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg">
              {user?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-6 w-6 text-white" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{user?.email || "User"}</h2>
            <p className="text-sm text-slate-500 capitalize">{user?.plan || "free"} plan</p>
            <p className="text-xs text-slate-400">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
          </div>
          <div className="ml-auto">
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${user?.plan === "pro" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
              {user?.plan || "free"}
            </span>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Display Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Set a display name"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              {user?.email || "No email"}
              <span className="ml-auto rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Verified</span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
              saved ? "bg-emerald-500" : "bg-cyan-500 hover:bg-cyan-600"
            } disabled:opacity-60`}
          >
            {saving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check className="h-4 w-4" /> Saved</>
            ) : (
              <><Save className="h-4 w-4" /> Save Profile</>
            )}
          </button>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
            <p className="text-sm text-slate-500">Update your account password</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              placeholder="Enter current password"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Repeat new password"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              />
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4" />
              {passwordError}
            </div>
          )}

          <button
            onClick={handleChangePassword}
            disabled={passwordSaving}
            className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition ${
              passwordSaved ? "bg-emerald-500" : "bg-slate-800 hover:bg-slate-700"
            } disabled:opacity-60`}
          >
            {passwordSaving ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</>
            ) : passwordSaved ? (
              <><Check className="h-4 w-4" /> Password Updated</>
            ) : (
              <><KeyRound className="h-4 w-4" /> Change Password</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
