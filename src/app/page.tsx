"use client";

import { redirect } from "next/navigation";
import { useAppSelector } from "./hooks/hooks";

export default function Home() {
  const { userData } = useAppSelector((state) => state.auth);

  if (userData) {
    if (userData.data.role === "admin") {
      return redirect("/teachers");
    } else if (userData.data.role === "user") {
      return redirect("/students");
    }
  }
  return redirect("/login");
}
