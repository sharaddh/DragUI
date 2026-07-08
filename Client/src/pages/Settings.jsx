import { useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Bell, Globe, Shield, Palette, ChevronRight, Moon, Sun } from "lucide-react";

const SETTINGS_SECTIONS = [
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Manage email and in-app notifications" },
  { id: "appearance", label: "Appearance", icon: Palette, desc: "Customize your interface theme" },
  { id: "privacy", label: "Privacy", icon: Shield, desc: "Control your data and privacy settings" },
  { id: "language", label: "Language & Region", icon: Globe, desc: "Set your preferred language and timezone" },
];

export default function Settings() {
  const { user } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState("notifications");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("dropui-dark") === "true");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("dropui-dark", next);
    document.documentElement.classList.toggle("dark", next);
  };

  const saveSetting = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500">Customize your DropUI experience</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        {/* Settings Navigation */}
        <div className="space-y-1">
          {SETTINGS_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                activeSection === section.id
                  ? "bg-cyan-50 text-cyan-700 shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <section.icon className="h-4 w-4" />
              {section.label}
              <ChevronRight className="ml-auto h-4 w-4 text-slate-300" />
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm min-h-[300px]">
          {activeSection === "notifications" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Notification Preferences</h2>
                <p className="text-sm text-slate-500">Control what notifications you receive</p>
              </div>
              <div className="space-y-4">
                <label className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Email Notifications</p>
                    <p className="text-xs text-slate-500">Receive updates about your projects</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                </label>
                <label className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div>
                    <p className="text-sm font-medium text-slate-900">Project Updates</p>
                    <p className="text-xs text-slate-500">When team members make changes</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500" />
                </label>
              </div>
              <button onClick={saveSetting} className="rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-600">
                {saved ? "Saved!" : "Save Preferences"}
              </button>
            </div>
          )}

          {activeSection === "appearance" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Appearance</h2>
                <p className="text-sm text-slate-500">Customize how DropUI looks for you</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="h-5 w-5 text-slate-600" /> : <Sun className="h-5 w-5 text-amber-500" />}
                    <div>
                      <p className="text-sm font-medium text-slate-900">Dark Mode</p>
                      <p className="text-xs text-slate-500">{darkMode ? "Dark theme active" : "Light theme active"}</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${darkMode ? "bg-cyan-600" : "bg-slate-300"}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition ${darkMode ? "translate-x-6" : "translate-x-0.5"}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Privacy</h2>
                <p className="text-sm text-slate-500">Manage your privacy settings</p>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
                <Shield className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p>Your privacy settings are managed through your account preferences.</p>
                <p className="mt-2">By default, your projects are private.</p>
              </div>
            </div>
          )}

          {activeSection === "language" && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Language & Region</h2>
                <p className="text-sm text-slate-500">Set your preferences for language and regional settings</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Language</label>
                  <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200">
                    <option value="en">English</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Timezone</label>
                  <select className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200">
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="America/New_York">Eastern Time (US & Canada)</option>
                    <option value="America/Chicago">Central Time (US & Canada)</option>
                    <option value="America/Denver">Mountain Time (US & Canada)</option>
                    <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                    <option value="Asia/Shanghai">Shanghai (CST)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
