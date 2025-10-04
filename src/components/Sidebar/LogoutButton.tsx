"use client";

import { useAppDispatch } from "@/app/hooks/hooks";
import { logout } from "@/store/auth/login/loginSlice";
import { useCallback } from "react";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();

      try {
        // 1. طلب API للـ logout على السيرفر
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        // 2. تنظيف التخزين المحلي
        if (typeof window !== "undefined") {
          localStorage.clear();
          sessionStorage.clear();

          // تنظيف جميع الـ cookies
          const cookies = document.cookie.split(";");
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name =
              eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

            // حذف من جميع المسارات والنطاقات
            document.cookie =
              name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
            document.cookie =
              name +
              "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" +
              window.location.hostname;
          }
        }

        // 3. تحديث Redux state
        dispatch(logout());

        // 4. الانتقال لصفحة login مع إعادة تحميل كامل
        setTimeout(() => {
          // إعادة تحميل كاملة لضمان تنظيف الـ middleware
          window.location.replace(`/login?logout=${Date.now()}`);
        }, 150);
      } catch (error) {
        console.error("Logout failed:", error);
        // Fallback: الانتقال مباشرة لـ login
        window.location.href = "/login";
      }
    },
    [dispatch]
  );

  return (
    <button onClick={handleLogout} className="w-full cursor-pointer">
      LOGOUT
    </button>
  );
}
