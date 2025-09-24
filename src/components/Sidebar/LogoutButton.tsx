"use client";

import { useAppDispatch } from "@/app/hooks/hooks";
import { logout } from "@/store/auth/login/loginSlice";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // منع الانتقال للرابط مباشرة

    if (isLoading) return;

    setIsLoading(true);

    try {
      // إرسال طلب logout للخادم
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        // تحديث حالة Redux
        dispatch(logout());

        // التوجيه لصفحة Login
        router.push("/login");
        router.refresh(); // تحديث الصفحة
      } else {
        console.error("Logout failed");
        // إذا فشل الطلب، نلغي الكوكيز من الجهة العميلة
        dispatch(logout());
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // في حالة خطأ، نلغي الكوكيز من الجهة العميلة
      dispatch(logout());
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link
      href="#"
      onClick={handleLogout}
      className="w-full cursor-pointer flex justify-center hover:bg-[#9C6FE4] py-2 rounded-md disabled:opacity-50 transition-colors duration-200"
    >
      {isLoading ? "LOGGING OUT..." : "LOGOUT"}
    </Link>
  );
}
