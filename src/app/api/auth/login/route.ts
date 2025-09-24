// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

const backendApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await backendApi.post("/auth/login", body);
    const apiData = response.data;

    if (apiData.token) {
      const nextResponse = NextResponse.json(apiData);

      nextResponse.cookies.set("token", apiData.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      nextResponse.cookies.set("role", apiData.role || "user", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return nextResponse;
    }

    return NextResponse.json(apiData);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.response?.data?.message || "Login failed",
        success: false,
      },
      { status: error.response?.status || 400 }
    );
  }
}
