import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("en");

  // 🌐 آدرس بک‌اند (Render یا Local)
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  // 🌍 ترجمه‌ها
  const texts = {
    en: {
      title: "🧍 New User Registration",
      fullname: "Full Name",
      email: "Email",
      password: "Password",
      male: "Male",
      female: "Female",
      signup: "Sign Up",
      hasAccount: "Already have an account?",
      login: "Login",
      success: "✅ Registered successfully! Redirecting to login...",
      fail: "❌ Error during registration",
      serverError: "❌ Server connection error",
    },
    fa: {
      title: "🧍 ثبت‌نام کاربر جدید",
      fullname: "نام و نام خانوادگی",
      email: "ایمیل",
      password: "رمز عبور",
      male: "مرد",
      female: "زن",
      signup: "ثبت‌نام",
      hasAccount: "حساب داری؟",
      login: "ورود",
      success: "✅ ثبت‌نام با موفقیت انجام شد! انتقال به صفحه ورود...",
      fail: "❌ خطا در ثبت‌نام",
      serverError: "❌ خطا در ارتباط با سرور",
    },
    ro: {
      title: "🧍 Sabt nam karbar jadid",
      fullname: "Nam o famil",
      email: "Email",
      password: "Ramz oboor",
      male: "Mard",
      female: "Zan",
      signup: "Sabt nam",
      hasAccount: "Hesab dari?",
      login: "Vorood",
      success: "✅ Sabt nam ba movafaghiat anjam shod! Dar hale enteghal...",
      fail: "❌ Khata dar sabt nam",
      serverError: "❌ Khatâ dar ertebat bâ server",
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, gender }),
      });

      const data = await res.json();

      if (res.ok && !data.error) {
        setMessage(texts[lang].success);
        // 🕓 هدایت خودکار به صفحه لاگین بعد از 1.5 ثانیه
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage(data.error ? `❌ ${data.error}` : texts[lang].fail);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(texts[lang].serverError);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-green-100 relative"
      >
        {/* 🌍 انتخاب زبان */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {["en", "fa", "ro"].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`text-sm px-2 py-1 rounded ${
                lang === code ? "bg-green-600 text-white" : "bg-gray-100"
              }`}
            >
              {code === "en" ? "EN" : code === "fa" ? "فارسی" : "Roman"}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center text-green-700 mb-6 mt-6">
          {texts[lang].title}
        </h2>

        {message && (
          <div className="mb-3 text-center text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-xl py-2">
            {message}
          </div>
        )}

        {/* 👤 نام */}
        <input
          type="text"
          placeholder={texts[lang].fullname}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        {/* ✉️ ایمیل */}
        <input
          type="email"
          placeholder={texts[lang].email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        {/* 🔒 رمز عبور */}
        <input
          type="password"
          placeholder={texts[lang].password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-green-400 outline-none"
          required
        />

        {/* 🚻 انتخاب جنسیت */}
        <div className="flex justify-center gap-6 mb-6">
          {[
            { value: "male", label: texts[lang].male, img: "/images/avatar_male.png" },
            { value: "female", label: texts[lang].female, img: "/images/avatar_female.png" },
          ].map((opt) => (
            <label
              key={opt.value}
              onClick={() => setGender(opt.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border transition-all ${
                gender === opt.value
                  ? opt.value === "male"
                    ? "bg-green-100 border-green-400 text-green-700 shadow-inner"
                    : "bg-pink-100 border-pink-400 text-pink-700 shadow-inner"
                  : "bg-gray-50 border-gray-300 text-gray-600"
              }`}
            >
              <img src={opt.img} alt={opt.label} className="w-8 h-8 rounded-full" />
              <span>{opt.label}</span>
            </label>
          ))}
        </div>

        {/* دکمه ثبت‌نام */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded-xl py-2 hover:bg-green-700 transition"
        >
          {texts[lang].signup}
        </button>

        <p className="text-center text-sm mt-4">
          {texts[lang].hasAccount}{" "}
          <span
            className="text-green-600 cursor-pointer font-medium"
            onClick={() => navigate("/login")}
          >
            {texts[lang].login}
          </span>
        </p>
      </form>
    </div>
  );
}
