"use client";

import { useAppDispatch } from "@/app/hooks/hooks";
import { logout } from "@/store/auth/login/loginSlice";
import Link from "next/link";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    // 1. تنظيف البيانات المحلية
    try {
      localStorage.removeItem("paidLessons");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    } catch (error) {
      console.log("Cleanup error:", error);
    }

    // 2. تحديث Redux state
    dispatch(logout());

    // 3. طلب API باستخدام Beacon (أسرع تقنية)
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/auth/logout");
    } else {
      // Fallback لـ fetch مع keepalive
      fetch("/api/auth/logout", {
        method: "POST",
        keepalive: true,
        credentials: "include",
      });
    }

    // 4. ✅ استخدام replace لمنع العودة للصفحة السابقة
    window.location.replace("/login");
  };

  return (
    <Link
      href="/login"
      onClick={handleLogout}
      className="w-full cursor-pointer "
    >
      LOGOUT
    </Link>
  );
}
