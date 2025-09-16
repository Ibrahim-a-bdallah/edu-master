"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "./hooks/hooks";

export default function Home() {
  const { userData } = useAppSelector((state) => state.authLoginSlice);
  console.log("User Data on Home Page:", userData);
  if (userData) {
    if (userData.role === "admin") {
      return redirect("/teachers");
    } else if (userData.role === "user") {
      return redirect("/students");
    }
  }
  return redirect("/login");
}
