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
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const BACKEND = "https://solarsmart-backend-new.onrender.com";

  useEffect(() => {
    fetch(`${BACKEND}/api/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  const loadLogs = async (userId) => {
    const res = await fetch(`${BACKEND}/api/users/${userId}/logs`);
    const data = await res.json();
    setLogs(data);
    setShowModal(true);
  };

  useEffect(() => {
    fetch(`${BACKEND}/api/stats/weekly`)
      .then((res) => res.json())
      .then((data) => setWeekly(data));
  }, []);

  useEffect(() => {
    fetch(`${BACKEND}/api/stats/monthly`)
      .then((res) => res.json())
      .then((data) => setMonthly(data));
  }, []);

  const weeklyLabels = weekly.map((x) => x.day);
  const weeklyValues = weekly.map((x) => x.count);

  const weeklyData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: "Weekly Logins",
        data: weeklyValues,
        borderColor: "green",
        backgroundColor: "rgba(0,150,0,0.3)",
      },
    ],
  };

  const monthlyLabels = monthly.map((x) => x.month);
  const monthlyValues = monthly.map((x) => x.count);

  const monthlyData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Logins",
        data: monthlyValues,
        backgroundColor: "rgba(0,100,255,0.5)",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-green-700 text-center mb-4">
          👥 Registered Users
        </h1>

        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 border-b">
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

      {/* WEEKLY */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-green-700 mb-4">📊 Weekly Logins</h2>
        <Line data={weeklyData} />
      </div>

      {/* MONTHLY */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold text-blue-700 mb-4">📈 Monthly Logins</h2>
        <Bar data={monthlyData} />
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Login History</h2>

            {logs.length === 0 ? (
              <p>No logs found</p>
            ) : (
              <ul className="list-disc ml-6">
                {logs.map((l, i) => (
                  <li key={i}>{new Date(l.login_time).toLocaleString()}</li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
