import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [logs, setLogs] = useState([]);      // ⬅️ NEW: login history
  const [showModal, setShowModal] = useState(false);

  const BACKEND_URL = "https://solarsmart-backend-new.onrender.com";

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        const res = await fetch(`${BACKEND_URL}/api/users`, {
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
        });

        const data = await res.json();
        setUsers(data);
      } catch (e) {
        setErr("Error loading users");
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, []);

  // ================
  //   LOAD LOGS
  // ================
  const loadLogs = async (userId) => {
    const res = await fetch(`${BACKEND_URL}/api/users/${userId}/logs`);
    const data = await res.json();

    setLogs(data);      // ذخیره لاگ‌ها
    setShowModal(true); // نمایش مودال
  };

  if (loading) return <div className="p-6 text-center">Loading…</div>;
  if (err) return <div className="p-6 text-center text-red-500">{err}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        👥 Registered Users
      </h1>

      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b bg-green-50 text-green-800">
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Last Login</th>
            <th>Logins</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, i) => (
            <tr key={u.id} className="border-b">
              <td>{i + 1}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.gender}</td>
              <td>{u.last_login ? new Date(u.last_login).toLocaleString() : "—"}</td>

              <td>
                <button
                  onClick={() => loadLogs(u.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* =================== MODAL =================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h2 className="text-xl font-bold mb-4 text-green-700">Login History</h2>

            {logs.length === 0 ? (
              <p>No login history found.</p>
            ) : (
              <ul className="list-disc ml-4">
                {logs.map((log, idx) => (
                  <li key={idx} className="mb-1">
                    {new Date(log.login_time).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white px-4 py-1 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
