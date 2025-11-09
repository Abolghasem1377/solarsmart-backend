import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiMenu, HiX } from "react-icons/hi";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./pages/AdminRoute";

// 📄 صفحات پروژه
import Home from "./pages/Home";
import Calculator from "./pages/Calculator";
import About from "./pages/About";
import EconomicIdeas from "./pages/EconomicIdeas";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const avatar =
    user?.gender === "female"
      ? "/images/avatar_female.png"
      : "/images/avatar_male.png";

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 text-gray-800 font-sans relative overflow-hidden">

        {/* 🌞 Navbar */}
        <nav className="flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 bg-white shadow-md backdrop-blur-sm border-b border-green-100 relative z-20">

          {/* 🖼️ Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
            <motion.img
              src="/images/logo.png"
              alt="SolarSmart Logo"
              className="w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-green-300 shadow-md group-hover:shadow-green-400 object-cover transition-all duration-300"
              whileHover={{ scale: 1.1, rotate: 2 }}
            />
            <span className="text-xl sm:text-2xl font-bold text-green-700 hidden sm:inline">
              SolarSmart
            </span>
          </div>

          {/* 🔗 Desktop Menu */}
          <ul className="hidden md:flex space-x-6 text-lg font-medium">
            <li><Link to="/" className="hover:text-green-600">Home</Link></li>
            <li><Link to="/calculator" className="hover:text-green-600">Calculator</Link></li>
            <li><Link to="/ideas" className="hover:text-green-600">Ideas</Link></li>

            {/* ✅ فقط Admin می‌بیند */}
            {user?.role === "admin" && (
              <li><Link to="/dashboard" className="hover:text-green-600">Dashboard</Link></li>
            )}

            <li><Link to="/about" className="hover:text-green-600">About</Link></li>
          </ul>

          {/* 👤 User Box */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <img
                    src={avatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full border border-green-300 shadow-sm"
                  />
                  <div className="flex flex-col text-sm">
                    <span className="font-semibold text-green-700">{user.name}</span>
                    <span className="text-gray-500">
                      {user.gender === "female" ? "👩‍🦰" : "👨‍🦱"} {user.gender}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white text-sm px-4 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-green-700 hover:text-green-800 font-medium">Login</Link>
                <Link to="/signup" className="text-green-700 hover:text-green-800 font-medium">Signup</Link>
              </>
            )}
          </div>

          {/* 🍔 Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-3xl text-green-700 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </nav>

        {/* 📱 Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-lg border-t border-green-100 flex flex-col text-center text-lg font-medium py-4 space-y-4 absolute w-full z-[9999]"
            >
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/calculator" onClick={() => setIsMenuOpen(false)}>Calculator</Link>
              <Link to="/ideas" onClick={() => setIsMenuOpen(false)}>Ideas</Link>

              {user?.role === "admin" && (
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              )}

              <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>

              {user ? (
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-6 py-2 rounded-xl mx-auto w-1/2"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Signup</Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🧩 Pages */}
        <main className="p-4 sm:p-8">
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/calculator"
              element={
                <ProtectedRoute>
                  <Calculator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />

            <Route path="/ideas" element={<EconomicIdeas />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
          </Routes>
        </main>

        {/* 🌿 Footer */}
        <footer className="text-center py-6 text-gray-600 bg-white/60 backdrop-blur-md border-t border-green-100 text-sm sm:text-base">
          © 2025 SolarSmart | Built with 🌿 React + TailwindCSS + Framer Motion
        </footer>
      </div>
    </Router>
  );
}
