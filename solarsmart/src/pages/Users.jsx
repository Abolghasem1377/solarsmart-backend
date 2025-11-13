import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [expandedUser, setExpandedUser] = useState(null); // 🔥 نمایش تاریخچه ورود کاربر
  const [loginLogs, setLoginLogs] = useState([]); // 🔥 ذخیره تاریخچه ورود

  const BACKEND_URL = "https://solarsmart-backend-new.onrender.com";

  useEffect(() => {
    const controller = new AbortController();

    const loadUsers = async () => {
      try {
        setLoading(true);
        setErr("");

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");

        if (!user || user.role !== "admin") {
          setErr("❌ Access denied: admin only");
          setLoading(false);
          return;
        }

        if (!token) {
          setErr("❌ No token found. Please login again.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${BACKEND_URL}/api/users`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("❌ Users load error:", e);
        if (e.name !== "AbortError") setErr(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
    return () => controller.abort();
  }, []);

  // ----------------------------------------------------
  //     🔥 گرفتن تاریخچه ورود یک کاربر
  // ----------------------------------------------------
  const loadLoginLogs = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BACKEND_URL}/api/loginlogs/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLoginLogs(data.logs || []);
      setExpandedUser(userId);
    } catch (e) {
      console.error("❌ Load login logs error:", e);
    }
  };

  // ----------------------------------------------------
  //                     UI SECTION
  // ----------------------------------------------------

  if (loading)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow text-center">
        ⏳ Loading users…
      </div>
    );

  if (err)
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow text-center text-red-600">
        {err}
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
              <th className="py-3 pr-4">Last Login</th>
              <th className="py-3 pr-4">Logins</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <>
                <tr key={u.id} className="border-b hover:bg-green-50">
                  <td className="py-2 pr-4">{i + 1}</td>
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4 capitalize">{u.gender}</td>

                  {/* آخرین ورود */}
                  <td className="py-2 pr-4">
                    {u.last_login
                      ? new Date(u.last_login).toLocaleString("ro-RO")
                      : "—"}
                  </td>

                  {/* دکمه تاریخچه ورود */}
                  <td className="py-2 pr-4">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      onClick={() =>
                        expandedUser === u.id
                          ? setExpandedUser(null)
                          : loadLoginLogs(u.id)
                      }
                    >
                      {expandedUser === u.id ? "Hide" : "View"}
                    </button>
                  </td>
                </tr>

                {/* 🔥 تاریخچه ورود در همان صفحه */}
                {expandedUser === u.id && (
                  <tr className="bg-green-50">
                    <td colSpan="6" className="p-4">
                      <h3 className="font-bold text-green-700 mb-2">
                        Login History:
                      </h3>

                      {loginLogs.length === 0 ? (
                        <p>No login logs found.</p>
                      ) : (
                        <ul className="list-disc pl-6">
                          {loginLogs.map((log, idx) => (
                            <li key={idx}>
                              {new Date(log.login_time).toLocaleString("ro-RO")}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
