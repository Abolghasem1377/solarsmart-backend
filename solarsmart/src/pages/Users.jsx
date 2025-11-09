import React, { useEffect, useState, useMemo } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = useMemo(() => localStorage.getItem("token") || "", []);

  useEffect(() => {
    const controller = new AbortController();

    // تابع داخل useEffect تعریف شده → وابستگی گم‌شده نداریم
    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch("/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || res.statusText);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.users || [];
        setUsers(list);
      } catch (e) {
        if (e.name !== "AbortError") setErr(e.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [token]);

  if (loading) return <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">Loading users…</div>;
  if (err) return <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow text-red-600">Error: {err}</div>;
  if (!users.length) return <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow">No users found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-4">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-3 pr-4">#</th>
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Gender</th>
              <th className="py-3 pr-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id || u._id || i} className="border-b last:border-0">
                <td className="py-2 pr-4">{i + 1}</td>
                <td className="py-2 pr-4">{u.name || u.fullName || "-"}</td>
                <td className="py-2 pr-4">{u.email || "-"}</td>
                <td className="py-2 pr-4 capitalize">{u.gender || "-"}</td>
                <td className="py-2 pr-4 uppercase">{u.role || "USER"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
