// src/components/Sidebar/LogoutButton.tsx
"use client";

import { useAppDispatch } from "@/app/hooks/hooks";
import { logout } from "@/store/auth/login/loginSlice";

import Link from "next/link";

export default function LogoutButton() {
  const dispatch = useAppDispatch();

  return (
    <Link
      href="/login"
      className="font-semibold flex gap-2 w-[70%] p-2 cursor-pointer rounded-lg mt-10 bg-[#9C6FE4] justify-center"
      onClick={() => {
        dispatch(logout());
      }}
    >
      LOGOUT
    </Link>
  );
}
