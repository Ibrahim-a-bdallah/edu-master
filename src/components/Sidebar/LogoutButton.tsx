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
      className="  cursor-pointer flex justify-center hover:bg-[#9C6FE4] py-2 rounded-md "
      onClick={() => {
        dispatch(logout());
      }}
    >
      LOGOUT
    </Link>
  );
}
