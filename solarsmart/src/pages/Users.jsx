import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // فرم
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // حالت ادیت
  const [editId, setEditId] = useState(null);

  // پیام وضعیت
  const [message, setMessage] = useState("");

  // گرفتن لیست کاربران
  const fetchUsers = () => {
    fetch("http://localhost:4000/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching users:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ثبت یا آپدیت کاربر
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage("⚠️ نام و ایمیل لازم است");
      return;
    }

    // اگر editId داریم یعنی در حالت ویرایش هستیم
    if (editId !== null) {
      fetch(`http://localhost:4000/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage("✅ کاربر ویرایش شد");
          setEditId(null);
          setName("");
          setEmail("");
          fetchUsers();
        })
        .catch((err) => {
          console.error("❌ Update error:", err);
          setMessage("❌ خطا در ویرایش");
        });
    } else {
      // حالت ایجاد کاربر جدید
      fetch("http://localhost:4000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      })
        .then((res) => res.json())
        .then((data) => {
          setMessage("✅ کاربر اضافه شد");
          setName("");
          setEmail("");
          fetchUsers();
        })
        .catch((err) => {
          console.error("❌ Insert error:", err);
          setMessage("❌ خطا در افزودن");
        });
    }
  };

  // حذف کاربر
  const handleDelete = (id) => {
    if (!window.confirm("واقعا حذف بشه؟")) return;
    fetch(`http://localhost:4000/api/users/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setMessage("🗑️ کاربر حذف شد");
        fetchUsers();
      })
      .catch((err) => {
        console.error("❌ Delete error:", err);
        setMessage("❌ خطا در حذف");
      });
  };

  // پر کردن فرم برای ویرایش
  const startEdit = (user) => {
    setEditId(user.id);
    setName(user.name);
    setEmail(user.email);
    setMessage("✏️ در حالت ویرایش هستید");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-gray-600">
        ⏳ در حال بارگذاری اطلاعات کاربران...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-sky-50 to-blue-100 flex flex-col items-center px-4 py-10 font-[Poppins]">
      <motion.div
        className="bg-white/90 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/40 w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
          👥 مدیریت کاربران
        </h2>

        {/* پیام وضعیت */}
        {message && (
          <div className="mb-4 text-center text-sm font-medium text-gray-700 bg-yellow-50 border border-yellow-200 rounded-xl py-2 px-4">
            {message}
          </div>
        )}

        {/* فرم افزودن / ویرایش */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-green-100 shadow-inner p-5 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-4"
        >
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">نام</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="مثلا Ali Reza"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">ایمیل</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
              placeholder="مثلا ali@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="sm:col-span-4 flex flex-col sm:flex-row gap-3 justify-end">
            <button
              type="submit"
              className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-6 py-2 shadow"
            >
              {editId !== null ? "✔️ ذخیره ویرایش" : "➕ افزودن کاربر"}
            </button>

            {editId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditId(null);
                  setName("");
                  setEmail("");
                  setMessage("لغو ویرایش");
                }}
                className="flex-1 sm:flex-none bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl px-6 py-2 shadow"
              >
                ❌ لغو
              </button>
            )}
          </div>
        </form>

        {/* جدول کاربران */}
        <div className="overflow-x-auto rounded-xl border border-green-100 shadow">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">نام</th>
                <th className="p-3">ایمیل</th>
                <th className="p-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b last:border-none hover:bg-green-50 transition"
                >
                  <td className="p-3">{u.id}</td>
                  <td className="p-3 font-semibold text-green-800">
                    {u.name}
                  </td>
                  <td className="p-3 text-gray-600">{u.email}</td>
                  <td className="p-3 text-center flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => startEdit(u)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-400/90 hover:bg-yellow-400 text-gray-800 shadow"
                    >
                      ✏️ ویرایش
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 text-white hover:bg-red-600 shadow"
                    >
                      🗑️ حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
