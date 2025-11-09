import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const BACKEND_URL = "https://solarsmart-backend-new.onrender.com"; // ✅ لینک واقعی Render

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        // بررسی نقش کاربر از localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user || user.role !== "admin") {
          setErr("Access denied: admin only 🚫");
          setLoading(false);
          return;
        }

        // 📡 درخواست به Render
        const res = await fetch(`${BACKEND_URL}/api/users`, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError")
          setErr(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow text-center">
        ⏳ Loading users…
      </div>
    );

  if (err)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow text-red-600 text-center">
        Error: {err}
      </div>
    );

  if (!users.length)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow text-center">
        No users found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        👥 Registered Users
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-green-50 text-green-800">
              <th className="py-3 pr-4">#</th>
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Gender</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id || i} className="border-b hover:bg-green-50">
                <td className="py-2 pr-4">{i + 1}</td>
                <td className="py-2 pr-4">{u.name || "-"}</td>
                <td className="py-2 pr-4">{u.email || "-"}</td>
                <td className="py-2 pr-4 capitalize">{u.gender || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
