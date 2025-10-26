import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaLinkedin, FaInstagram, FaEnvelope } from "react-icons/fa";

export default function Home() {
  const [time, setTime] = useState(new Date());
  const [lang, setLang] = useState("en");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = time.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const texts = {
    en: {
      title: "Welcome to SolarSmart ⚡️",
      description:
        "Experience the power of solar innovation — clean energy flowing like light itself.",
      button: "Explore More",
      contactTitle: "Contact Us",
      name: "Full Name",
      email: "Email Address",
      message: "Your Message",
      send: "Send Message",
      sending: "Sending...",
      sent: "✅ Message Sent Successfully!",
    },
    fa: {
      title: "به سولار اسمارت خوش آمدید ⚡️",
      description:
        "قدرت انرژی خورشیدی را حس کنید — جریان پاکی از نور و فناوری در حرکت است.",
      button: "بیشتر ببین",
      contactTitle: "ارتباط با ما",
      name: "نام و نام خانوادگی",
      email: "ایمیل",
      message: "پیام شما",
      send: "ارسال پیام",
      sending: "در حال ارسال...",
      sent: "✅ پیام با موفقیت ارسال شد!",
    },
    ro: {
      title: "Bun venit la SolarSmart ⚡️",
      description:
        "Experimentează puterea inovației solare — energie curată, la viteza luminii.",
      button: "Descoperă mai mult",
      contactTitle: "Contactează-ne",
      name: "Nume complet",
      email: "Adresă de email",
      message: "Mesajul tău",
      send: "Trimite mesaj",
      sending: "Se trimite...",
      sent: "✅ Mesaj trimis cu succes!",
    },
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }, 2000);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-[Poppins] bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/solar-bg.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* ⚡️ Background energy beams */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-[2px] w-[400px] bg-gradient-to-r from-yellow-300 via-orange-400 to-transparent opacity-70 rounded-full"
            style={{
              top: `${20 + i * 15}%`,
              left: "-400px",
              filter: "drop-shadow(0 0 6px rgba(255,200,0,0.8))",
            }}
            animate={{ x: ["-400px", "120%"] }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* 🕒 Time */}
      <motion.div
        className="absolute top-4 right-4 sm:right-8 z-20 bg-white/70 backdrop-blur-md px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg border border-white/40 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="text-xl sm:text-2xl font-bold text-green-700">
          {formattedTime}
        </p>
        <p className="text-xs sm:text-sm text-gray-800 mt-1">{formattedDate}</p>
      </motion.div>

      {/* 🌍 Language buttons (moved to left) */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex space-x-1 sm:space-x-3 z-[50]">
        {["en", "fa", "ro"].map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-2 sm:px-3 py-[2px] sm:py-1 rounded-md text-xs sm:text-sm font-semibold transition-all duration-300 ${
              lang === code
                ? "bg-green-600 text-white shadow-md scale-105"
                : "bg-white/80 text-green-700 hover:bg-green-100"
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 🌞 Hero Section */}
      <motion.div
        dir={lang === "fa" ? "rtl" : "ltr"}
        className={`relative z-10 text-center p-6 sm:p-10 bg-white/40 backdrop-blur-lg rounded-3xl shadow-2xl max-w-[90%] sm:max-w-3xl border border-white/40 mt-24 transition-all duration-500 ${
          lang === "fa" ? "font-[Vazirmatn]" : ""
        }`}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
      >
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-green-700 mb-4 sm:mb-6 drop-shadow-lg">
          {texts[lang].title}
        </h1>
        <p className="text-gray-700 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 leading-relaxed">
          {texts[lang].description}
        </p>
        <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: "0 0 40px rgba(16,185,129,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          {texts[lang].button}
        </motion.button>
      </motion.div>

      {/* 📬 Contact Section */}
      <motion.div
        dir={lang === "fa" ? "rtl" : "ltr"}
        className="relative z-20 mt-16 sm:mt-24 mb-10 w-full max-w-lg sm:max-w-2xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/40 p-6 sm:p-8 text-center"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-green-700 mb-6">
          {texts[lang].contactTitle}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 text-left"
        >
          <input
            type="text"
            name="name"
            placeholder={texts[lang].name}
            value={formData.name}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/90 transition-all duration-200"
          />
          <input
            type="email"
            name="email"
            placeholder={texts[lang].email}
            value={formData.email}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/90 transition-all duration-200"
          />
          <textarea
            rows="4"
            name="message"
            placeholder={texts[lang].message}
            value={formData.message}
            onChange={handleChange}
            className="px-4 py-3 rounded-xl border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white/90 transition-all duration-200 resize-none"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={status === "sending"}
            className={`w-full mt-3 py-3 text-base sm:text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 ${
              status === "sending"
                ? "bg-yellow-400 text-white"
                : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-2xl"
            }`}
            type="submit"
          >
            {status === "sending"
              ? texts[lang].sending
              : status === "success"
              ? texts[lang].sent
              : texts[lang].send}
          </motion.button>
        </form>
      </motion.div>

      {/* 🌐 Social Icons */}
      <motion.div
        className="flex space-x-6 mb-12 z-20"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {[FaLinkedin, FaInstagram, FaEnvelope].map((Icon, i) => (
          <motion.a
            key={i}
            href="#"
            whileHover={{ scale: 1.3 }}
            className="text-2xl sm:text-3xl text-green-700 hover:text-green-600 transition-colors"
          >
            <Icon />
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}
