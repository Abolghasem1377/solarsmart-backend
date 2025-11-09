import React, { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", gender: "", role: "user" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("Registering...");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to register");

      setMsg("✅ User registered successfully!");
      setForm({ name: "", email: "", gender: "", role: "user" });
    } catch (err) {
      console.error(err);
      setMsg("❌ Registration failed: " + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-green-700">Signup</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
      {msg && <p className="mt-4 text-sm text-gray-700">{msg}</p>}
    </div>
  );
}
