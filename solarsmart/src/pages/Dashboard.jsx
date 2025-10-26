import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    latestUsers: [],
  });
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState("en"); // 🌍 default: English

  const translations = {
    fa: {
      title: "📊 داشبورد سیستم",
      totalUsers: "تعداد کل کاربران",
      latestUsers: "آخرین کاربران ثبت‌شده",
      loading: "⏳ در حال بارگذاری داشبورد...",
      footer:
        "این فقط شروعشه 😎 — می‌تونیم تولید انرژی خورشیدی، صرفه‌جویی مالی، و ROI رو هم اینجا نشون بدیم.",
    },
    en: {
      title: "📊 System Dashboard",
      totalUsers: "Total Users",
      latestUsers: "Latest Registered Users",
      loading: "⏳ Loading dashboard...",
      footer:
        "This is just the beginning 😎 — We can also show solar energy output, financial savings, and ROI here.",
    },
    ro: {
      title: "📊 Panou de control al sistemului",
      totalUsers: "Numărul total de utilizatori",
      latestUsers: "Cei mai recenți utilizatori înregistrați",
      loading: "⏳ Se încarcă tabloul de bord...",
      footer:
        "Acesta este doar începutul 😎 — Putem adăuga producția de energie solară, economiile financiare și ROI aici.",
    },
  };

  useEffect(() => {
    fetch("http://localhost:4000/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-gray-600">
        {translations[lang].loading}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center px-4 py-10 font-[Poppins]">
      <div className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border border-white/40 w-full max-w-4xl">
        {/* 🌍 Language selector */}
        <div className="flex justify-end mb-4">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="border border-green-300 rounded-lg px-3 py-1 text-sm font-medium text-green-800 focus:ring-2 focus:ring-green-400"
          >
            <option value="fa">🇮🇷 فارسی</option>
            <option value="en">🇬🇧 English</option>
            <option value="ro">🇷🇴 Română</option>
          </select>
        </div>

        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          {translations[lang].title}
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-green-100 rounded-2xl p-6 shadow-inner border border-green-200 text-center">
            <div className="text-4xl font-extrabold text-green-700">
              {stats.totalUsers}
            </div>
            <div className="text-gray-700 mt-2 font-semibold">
              {translations[lang].totalUsers}
            </div>
          </div>

          <div className="bg-blue-100 rounded-2xl p-6 shadow-inner border border-blue-200 text-center">
            <div className="text-xl font-bold text-blue-700 mb-2">
              {translations[lang].latestUsers}
            </div>
            <ul className="text-left text-gray-700 text-sm space-y-1">
              {stats.latestUsers.map((u) => (
                <li key={u.id}>
                  <b className="text-gray-900">{u.name}</b>{" "}
                  <span className="text-gray-500">&lt;{u.email}&gt;</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs">
          {translations[lang].footer}
        </p>
      </div>
    </div>
  );
}
