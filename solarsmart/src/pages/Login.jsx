import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState("en");

  // 📡 آدرس سرور بک‌اند
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  // 🌍 ترجمه‌ها
  const texts = {
    en: {
      title: "🔐 Login to your account",
      email: "Email",
      password: "Password",
      login: "Login",
      noAccount: "Don’t have an account?",
      signup: "Sign up",
      success: "✅ Logged in successfully!",
      fail: "❌ Incorrect email or password.",
      serverError: "❌ Server connection error",
    },
    fa: {
      title: "🔐 ورود به حساب کاربری",
      email: "ایمیل",
      password: "رمز عبور",
      login: "ورود",
      noAccount: "حساب نداری؟",
      signup: "ثبت‌نام",
      success: "✅ ورود با موفقیت انجام شد!",
      fail: "❌ ایمیل یا رمز اشتباه است.",
      serverError: "❌ خطا در ارتباط با سرور",
    },
    ro: {
      title: "🔐 Vorood be hesab",
      email: "Email",
      password: "Ramz oboor",
      login: "Vorood",
      noAccount: "Hesab nadari?",
      signup: "Sabt nam",
      success: "✅ Vorood ba movafaghiat anjam shod!",
      fail: "❌ Email ya ramz eshtebah ast.",
      serverError: "❌ Khatâ dar ertebat bâ server",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          // ذخیره در localStorage
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));

          // 🔥 بروزرسانی وضعیت در App.js
          if (setUser) setUser(data.user);

          setMessage(texts[lang].success);

          // هدایت به داشبورد یا ماشین حساب
          setTimeout(() => navigate("/dashboard"), 1000);
        } else {
          setMessage(texts[lang].fail);
        }
      })
      .catch(() => setMessage(texts[lang].serverError));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-green-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md relative"
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
          <div className="mb-3 text-center text-sm text-gray-700">{message}</div>
        )}

        <input
          type="email"
          placeholder={texts[lang].email}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-green-400"
          required
        />

        <input
          type="password"
          placeholder={texts[lang].password}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-4 focus:ring-2 focus:ring-green-400"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white rounded-xl py-2 hover:bg-green-700 transition"
        >
          {texts[lang].login}
        </button>

        <p className="text-center text-sm mt-4">
          {texts[lang].noAccount}{" "}
          <span
            className="text-green-600 cursor-pointer font-medium"
            onClick={() => navigate("/signup")}
          >
            {texts[lang].signup}
          </span>
        </p>
      </form>
    </div>
  );
}
