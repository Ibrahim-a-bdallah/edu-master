"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { hydrateUser } from "@/store/auth/login/loginSlice";

export default function HydrateUser() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateUser());
  }, [dispatch]);

  return null; 
}
