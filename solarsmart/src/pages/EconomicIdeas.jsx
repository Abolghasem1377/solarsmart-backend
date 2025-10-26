import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSolarPanel,
  FaSeedling,
  FaLaptopCode,
  FaIndustry,
  FaChartLine,
  FaLeaf,
} from "react-icons/fa";

export default function EconomicIdeas() {
  const [lang, setLang] = useState("en"); // 🇬🇧 زبان پیش‌فرض

  // 🌍 متون در سه زبان
  const texts = {
    en: {
      title: "💼 Economic Ideas for Romania 🇷🇴",
      desc: "Discover sustainable, profitable business ideas that you can start in Romania — focusing on green energy, innovation, and digital growth.",
      ideas: [
        {
          title: "🌞 Solar Services",
          desc: "Installation, maintenance, and cleaning of solar panels for residential and industrial clients.",
        },
        {
          title: "🌱 Green Agriculture",
          desc: "Organic crops, smart greenhouses, and solar-powered irrigation systems.",
        },
        {
          title: "💻 Eco Digital Services",
          desc: "Website creation, branding, and online education for eco companies.",
        },
        {
          title: "🏭 Sustainable Local Production",
          desc: "Small factories with low emissions, biodegradable products, and eco packaging.",
        },
        {
          title: "📈 Investments & Startups",
          desc: "Consulting for European funds, green startups, and sustainable projects.",
        },
        {
          title: "🍃 Green Energy for Communities",
          desc: "Solar charging stations for phones, e-bikes, and public spaces.",
        },
      ],
    },
    fa: {
      title: "💼 ایده‌های اقتصادی برای رومانی 🇷🇴",
      desc: "ایده‌های سودآور و پایدار برای شروع کسب‌وکار در رومانی — با تمرکز بر انرژی سبز، نوآوری و رشد دیجیتال.",
      ideas: [
        {
          title: "🌞 خدمات خورشیدی",
          desc: "نصب، نگهداری و تمیزکاری پنل‌های خورشیدی برای مشتریان خانگی و صنعتی.",
        },
        {
          title: "🌱 کشاورزی سبز",
          desc: "کشت ارگانیک، گلخانه‌های هوشمند و سیستم‌های آبیاری خورشیدی.",
        },
        {
          title: "💻 خدمات دیجیتال سبز",
          desc: "طراحی سایت، برندینگ و آموزش آنلاین برای شرکت‌های دوستدار محیط زیست.",
        },
        {
          title: "🏭 تولید پایدار محلی",
          desc: "کارخانه‌های کوچک با آلودگی کم، محصولات تجزیه‌پذیر و بسته‌بندی‌های سازگار با محیط زیست.",
        },
        {
          title: "📈 سرمایه‌گذاری و استارتاپ‌ها",
          desc: "مشاوره برای جذب بودجه‌های اروپایی و پروژه‌های پایدار.",
        },
        {
          title: "🍃 انرژی سبز برای جوامع",
          desc: "ایستگاه‌های شارژ خورشیدی برای تلفن، دوچرخه برقی و فضاهای عمومی.",
        },
      ],
    },
    ro: {
      title: "💼 Idei Economice pentru România 🇷🇴",
      desc: "Descoperă idei de afaceri durabile și profitabile pe care le poți începe în România — concentrându-te pe energie verde, inovație și creștere digitală.",
      ideas: [
        {
          title: "🌞 Servicii Solare",
          desc: "Instalare, întreținere și curățare a panourilor solare pentru clienți rezidențiali și industriali.",
        },
        {
          title: "🌱 Agricultură Verde",
          desc: "Culturi organice, sere inteligente și irigații alimentate cu energie solară.",
        },
        {
          title: "💻 Servicii Digitale Eco",
          desc: "Creare website-uri, branding și educație online pentru companii verzi.",
        },
        {
          title: "🏭 Producție Locală Sustenabilă",
          desc: "Fabrici mici cu emisii reduse, produse biodegradabile și ambalaje ecologice.",
        },
        {
          title: "📈 Investiții & Startups",
          desc: "Consultanță pentru fonduri europene, green startups și proiecte sustenabile.",
        },
        {
          title: "🍃 Energie Verde pentru Comunități",
          desc: "Stații de încărcare solară pentru telefoane, biciclete electrice și spații publice.",
        },
      ],
    },
  };

  const data = texts[lang];
  const icons = [
    <FaSolarPanel className="text-yellow-500 text-4xl" />,
    <FaSeedling className="text-green-600 text-4xl" />,
    <FaLaptopCode className="text-blue-500 text-4xl" />,
    <FaIndustry className="text-orange-500 text-4xl" />,
    <FaChartLine className="text-emerald-600 text-4xl" />,
    <FaLeaf className="text-lime-500 text-4xl" />,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-100 flex flex-col items-center py-16 px-6 font-[Poppins] relative">
      {/* 🌍 Language Switcher */}
      <div className="absolute top-6 right-8 flex space-x-2">
        <button
          onClick={() => setLang("en")}
          className={`px-3 py-1 rounded text-sm ${
            lang === "en" ? "bg-green-600 text-white" : "bg-gray-100"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLang("ro")}
          className={`px-3 py-1 rounded text-sm ${
            lang === "ro" ? "bg-green-600 text-white" : "bg-gray-100"
          }`}
        >
          RO
        </button>
        <button
          onClick={() => setLang("fa")}
          className={`px-3 py-1 rounded text-sm ${
            lang === "fa" ? "bg-green-600 text-white" : "bg-gray-100"
          }`}
        >
          فارسی
        </button>
      </div>

      {/* عنوان */}
      <motion.h1
        className="text-5xl font-bold text-green-700 mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {data.title}
      </motion.h1>

      {/* توضیح */}
      <motion.p
        className="text-gray-700 text-lg mb-12 max-w-2xl text-center leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {data.desc}
      </motion.p>

      {/* کارت‌ها */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {data.ideas.map((idea, index) => (
          <motion.div
            key={index}
            className="bg-white/70 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-green-200 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex justify-center mb-4">{icons[index]}</div>
            <h2 className="text-xl font-bold text-green-700 mb-3 text-center">
              {idea.title}
            </h2>
            <p className="text-gray-700 text-center">{idea.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
