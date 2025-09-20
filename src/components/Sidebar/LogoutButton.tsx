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
      className=" pl-8 cursor-pointer text-md "
      onClick={() => {
        dispatch(logout());
      }}
    >
      LOGOUT
    </Link>
  );
}
