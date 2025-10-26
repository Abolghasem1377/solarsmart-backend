import React from "react";
import { Navigate } from "react-router-dom";

/**
 * مسیر محافظت‌شده برای صفحاتی که فقط کاربران وارد شده باید ببینند
 */
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // اگر کاربر لاگین نکرده بود، منتقلش کن به صفحه ورود
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // در غیر این صورت، صفحه مورد نظر را نمایش بده
  return children;
}
