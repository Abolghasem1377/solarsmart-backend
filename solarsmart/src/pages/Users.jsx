// =======================
//   Users.jsx – FINAL VERSION
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
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const BACKEND = "https://solarsmart-backend-new.onrender.com";

  // -----------------------------
  // Load All Users
  // -----------------------------
  useEffect(() => {
    fetch(`${BACKEND}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // -----------------------------
  // Load single user logs
  // -----------------------------
  const loadLogs = async (id) => {
    const res = await fetch(`${BACKEND}/api/users/${id}/logs`);
    const data = await res.json();
    setLogs(data);
    setShowModal(true);
  };

  // -----------------------------
  // Weekly stats
  // -----------------------------
  useEffect(() => {
    fetch(`${BACKEND}/api/stats/weekly-logins`)
      .then((res) => res.json())
      .then((data) => setWeekly(data));
  }, []);

  // -----------------------------
  // Monthly stats
  // -----------------------------
  useEffect(() => {
    fetch(`${BACKEND}/api/stats/monthly-logins`)
      .then((res) => res.json())
      .then((data) => setMonthly(data));
  }, []);

  // Weekly chart config
  const weeklyData = {
    labels: weekly.map((d) => d.day),
    datasets: [
      {
        label: "Logins",
        data: weekly.map((d) => d.count),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.3)",
      },
    ],
  };

  // Monthly chart config
  const monthlyData = {
    labels: monthly.map((d) => d.month),
    datasets: [
      {
        label: "Logins",
        data: monthly.map((d) => d.count),
        backgroundColor: "rgba(0,150,255,0.5)",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-4">
          👥 Registered Users
        </h1>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-50 text-green-700 border-b">
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Last Login</th>
              <th>History</th>
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
      </div>

      {/* WEEKLY CHART */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-green-700 mb-4">
          📊 Weekly Logins (Last 7 Days)
        </h2>
        <Line data={weeklyData} />
      </div>

      {/* MONTHLY CHART */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-blue-700 mb-4">
          📈 Monthly Logins (Last 6 Months)
        </h2>
        <Bar data={monthlyData} />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-xl">
            <h2 className="text-xl font-bold text-green-700 mb-4">Login History</h2>

            {logs.length === 0 ? (
              <p>No login history found.</p>
            ) : (
              <ul className="list-disc ml-4 max-h-72 overflow-y-auto">
                {logs.map((l, i) => (
                  <li key={i}>{new Date(l.login_time).toLocaleString()}</li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
