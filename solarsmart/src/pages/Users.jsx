// =======================
//     USERS.jsx – FINAL
// =======================

import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

export default function Users() {
  const BACKEND = "https://solarsmart-backend-new.onrender.com";

  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [error, setError] = useState("");

  // ============================
  // Load all users
  // ============================
  useEffect(() => {
    fetch(`${BACKEND}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to load users"));
  }, []);

  // ============================
  // Load login logs
  // ============================
  const loadLogs = async (userId) => {
    const res = await fetch(`${BACKEND}/api/users/${userId}/logs`);
    const data = await res.json();
    setLogs(data);
    setShowModal(true);
  };

  // ============================
  // WEEKLY STATS
  // ============================
  useEffect(() => {
    fetch(`${BACKEND}/api/stats/weekly-logins`)
      .then((res) => res.json())
      .then((data) => setWeekly(data))
      .catch(() => setWeekly([]));
  }, []);

  // ============================
  // MONTHLY STATS
  // ============================
  useEffect(() => {
    fetch(`${BACKEND}/api/stats/monthly-logins`)
      .then((res) => res.json())
      .then((data) => setMonthly(data))
      .catch(() => setMonthly([]));
  }, []);

  // ------------------------------
  // Weekly chart data
  // ------------------------------
  const weeklyData = {
    labels: weekly.map((x) => x.day),
    datasets: [
      {
        label: "Weekly Logins",
        data: weekly.map((x) => x.count),
        borderColor: "green",
        backgroundColor: "rgba(0,150,0,0.3)",
      },
    ],
  };

  // ------------------------------
  // Monthly chart data
  // ------------------------------
  const monthlyData = {
    labels: monthly.map((x) => x.month),
    datasets: [
      {
        label: "Monthly Logins",
        data: monthly.map((x) => x.count),
        backgroundColor: "rgba(0,100,255,0.5)",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* ERROR DISPLAY */}
      {error && (
        <div className="bg-red-200 text-red-800 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}

      {/* ================= USERS TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-4">
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
              <th>Logs</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} className="border-b">
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.gender}</td>
                <td>
                  {u.last_login
                    ? new Date(u.last_login).toLocaleString()
                    : "—"}
                </td>

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
      </div>

      {/* ================= WEEKLY CHART ================= */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-green-700 mb-4">
          📊 Weekly Logins (Last 7 Days)
        </h2>

        {weekly.length === 0 ? (
          <p className="text-gray-500">No weekly data available</p>
        ) : (
          <Line data={weeklyData} />
        )}
      </div>

      {/* ================= MONTHLY CHART ================= */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          📈 Monthly Logins (Last 6 Months)
        </h2>

        {monthly.length === 0 ? (
          <p className="text-gray-500">No monthly data available</p>
        ) : (
          <Bar data={monthlyData} />
        )}
      </div>

      {/* ===================== MODAL ==================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">

            <h2 className="text-xl font-bold text-green-700 mb-3">
              Login History
            </h2>

            {logs.length === 0 ? (
              <p>No login history found</p>
            ) : (
              <ul className="list-disc ml-5 max-h-72 overflow-y-auto">
                {logs.map((l, idx) => (
                  <li key={idx}>
                    {new Date(l.login_time).toLocaleString()}
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-500 text-white w-full py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
