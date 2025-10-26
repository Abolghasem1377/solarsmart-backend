import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("en"); // 🌍 پیش‌فرض: انگلیسی

  // ✅ استفاده از متغیر محیطی برای آدرس API
  const API_URL =
    process.env.REACT_APP_API_URL || "http://localhost:4000";

  // 🌐 ترجمه‌ها
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
      success: "✅ Registered successfully!",
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
      success: "✅ ثبت‌نام با موفقیت انجام شد!",
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
      success: "✅ Sabt nam ba movafaghiat anjam shod!",
      fail: "❌ Khata dar sabt nam",
      serverError: "❌ Khatâ dar ertebat bâ server",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, gender }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setMessage("❌ " + data.error);
        } else {
          setMessage(texts[lang].success);
          setTimeout(() => navigate("/login"), 1200);
        }
      })
      .catch(() => setMessage(texts[lang].serverError));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-100 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md border border-green-100 relative"
      >
        {/* 🌍 انتخاب زبان */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`text-sm px-2 py-1 rounded ${
              lang === "en" ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("fa")}
            className={`text-sm px-2 py-1 rounded ${
              lang === "fa" ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            فارسی
          </button>
          <button
            type="button"
            onClick={() => setLang("ro")}
            className={`text-sm px-2 py-1 rounded ${
              lang === "ro" ? "bg-green-600 text-white" : "bg-gray-100"
            }`}
          >
            Roman
          </button>
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
          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border transition-all ${
              gender === "male"
                ? "bg-green-100 border-green-400 text-green-700 shadow-inner"
                : "bg-gray-50 border-gray-300 text-gray-600"
            }`}
            onClick={() => setGender("male")}
          >
            <img
              src="/images/avatar_male.png"
              alt="Male"
              className="w-8 h-8 rounded-full"
            />
            <span>{texts[lang].male}</span>
          </label>

          <label
            className={`flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer border transition-all ${
              gender === "female"
                ? "bg-pink-100 border-pink-400 text-pink-700 shadow-inner"
                : "bg-gray-50 border-gray-300 text-gray-600"
            }`}
            onClick={() => setGender("female")}
          >
            <img
              src="/images/avatar_female.png"
              alt="Female"
              className="w-8 h-8 rounded-full"
            />
            <span>{texts[lang].female}</span>
          </label>
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
