import React, { useEffect, useState } from "react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [logs, setLogs] = useState([]); // تاریخچه لاگین
  const [showModal, setShowModal] = useState(false);
  const [modalUserName, setModalUserName] = useState("");

  // آمار هفتگی و ماهانه
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

  const BACKEND_URL = "https://solarsmart-backend-new.onrender.com";

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        // می‌تونی در آینده توکن هم به هدر اضافه کنی
        const [usersRes, weeklyRes, monthlyRes] = await Promise.all([
          fetch(`${BACKEND_URL}/api/users`, {
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
          }),
          fetch(`${BACKEND_URL}/api/stats/weekly-logins`, {
            signal: controller.signal,
          }),
          fetch(`${BACKEND_URL}/api/stats/monthly-logins`, {
            signal: controller.signal,
          }),
        ]);

        const usersData = await usersRes.json();
        const weeklyData = await weeklyRes.json();
        const monthlyData = await monthlyRes.json();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setWeeklyStats(Array.isArray(weeklyData) ? weeklyData : []);
        setMonthlyStats(Array.isArray(monthlyData) ? monthlyData : []);
      } catch (e) {
        console.error(e);
        setErr("Error loading data from server");
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
  const loadLogs = async (user) => {
    try {
      setModalUserName(user.name);
      const res = await fetch(`${BACKEND_URL}/api/users/${user.id}/logs`);
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
      setShowModal(true);
    } catch (e) {
      console.error(e);
      alert("Cannot load login history");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-700">
        ⏳ Loading users and stats…
      </div>
    );

  if (err)
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        {err}
      </div>
    );

  // تابع کمکی برای رسم bar ساده
  const renderBarRow = (label, value, max) => {
    const width = max > 0 ? (value / max) * 100 : 0;
    return (
      <div key={label} className="flex items-center mb-1 text-sm">
        <div className="w-24 text-gray-700">{label}</div>
        <div className="flex-1 bg-gray-100 rounded-full h-3 mx-2">
          <div
            className="h-3 rounded-full bg-green-500"
            style={{ width: `${width}%` }}
          />
        </div>
        <div className="w-8 text-right text-gray-700">{value}</div>
      </div>
    );
  };

  const maxWeekly =
    weeklyStats.length > 0
      ? Math.max(...weeklyStats.map((d) => d.count))
      : 0;

  const maxMonthly =
    monthlyStats.length > 0
      ? Math.max(...monthlyStats.map((d) => d.count))
      : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold text-green-700 mb-4 text-center">
        👥 Registered Users
      </h1>

      {/* جدول کاربران */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b bg-green-50 text-green-800">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Name</th>
              <th className="py-2 px-2">Email</th>
              <th className="py-2 px-2">Gender</th>
              <th className="py-2 px-2">Role</th>
              <th className="py-2 px-2">Last Login</th>
              <th className="py-2 px-2">Logins</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-2 px-2">{i + 1}</td>
                <td className="py-2 px-2">{u.name}</td>
                <td className="py-2 px-2">{u.email}</td>
                <td className="py-2 px-2 capitalize">{u.gender}</td>
                <td className="py-2 px-2 uppercase">{u.role || "USER"}</td>
                <td className="py-2 px-2">
                  {u.last_login
                    ? new Date(u.last_login).toLocaleString()
                    : "—"}
                </td>
                <td className="py-2 px-2">
                  <button
                    onClick={() => loadLogs(u)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                  >
                    View ({u.total_logins || 0})
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* هفتگی */}
        <div className="border rounded-xl p-4 bg-gradient-to-br from-green-50 to-white">
          <h2 className="font-semibold mb-3 text-green-700">
            📊 Weekly Logins (Last 7 Days)
          </h2>
          {weeklyStats.length === 0 ? (
            <p className="text-sm text-gray-500">
              No login data for the last week.
            </p>
          ) : (
            <div>
              {weeklyStats.map((d) =>
                renderBarRow(d.day, d.count, maxWeekly)
              )}
            </div>
          )}
        </div>

        {/* ماهانه */}
        <div className="border rounded-xl p-4 bg-gradient-to-br from-blue-50 to-white">
          <h2 className="font-semibold mb-3 text-blue-700">
            📈 Monthly Logins (Last 6 Months)
          </h2>
          {monthlyStats.length === 0 ? (
            <p className="text-sm text-gray-500">
              No login data for recent months.
            </p>
          ) : (
            <div>
              {monthlyStats.map((d) =>
                renderBarRow(d.month, d.count, maxMonthly)
              )}
            </div>
          )}
        </div>
      </div>

      {/* =================== MODAL =================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-bold mb-4 text-green-700 text-center">
              Login History – {modalUserName}
            </h2>

            {logs.length === 0 ? (
              <p className="text-sm text-gray-600 text-center">
                No login history found.
              </p>
            ) : (
              <ul className="list-disc ml-5 max-h-64 overflow-y-auto text-sm">
                {logs.map((log, idx) => (
                  <li key={idx} className="mb-1">
                    {new Date(log.login_time).toLocaleString()}{" "}
                    <span className="text-gray-500 text-xs">
                      ({log.role?.toUpperCase() || "USER"})
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
