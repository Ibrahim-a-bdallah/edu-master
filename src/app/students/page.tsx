"use client";
import Link from "next/link";
import { useAppDispatch } from "../hooks/hooks";
import { logout } from "@/store/auth/login/loginSlice";

const Students = () => {
  const dispatch = useAppDispatch();

  return (
    <div>
      {" "}
      <Link
        href="/login"
        className="font-semibold"
        onClick={() => {
          dispatch(logout());
        }}
      >
        LOGOUT
      </Link>
    </div>
  );
};

export default Students;
