import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  // اگر لاگین نکرده → بره لاگین
  if (!user) return <Navigate to="/login" />;

  // اگر نقش او ادمین نبود → بره صفحه Home
  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
}
