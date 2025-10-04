"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import actGetLogin from "@/store/auth/login/actGetLogin";
import { toast } from "sonner";
import { resetError } from "@/store/auth/login/loginSlice";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    Loading,
    error: errorMessage,
    role,
  } = useAppSelector((state) => state.auth);

  console.log(errorMessage);
  const [showPassword, setShowPassword] = useState(false);
  const [hasDisplayedError, setHasDisplayedError] = useState(false);

  const isLoading = Loading === "pending";

  // ✅ إضافة useEffect للتوجيه بعد نجاح الـ login
  useEffect(() => {
    if (Loading === "succeeded" && role) {
      toast.success("Login successful!");
      console.log("Login successful, role:", role);

      // تأخير بسيط لضمان تحديث الـ cookies
      setTimeout(() => {
        if (role === "admin") {
          router.replace("/teachers");
        } else if (role === "user") {
          router.replace("/students");
        } else if (role === "super-admin") {
          router.replace("/super-admin");
        }
      }, 100);
    }
  }, [Loading, role, router]);

  useEffect(() => {
    if (errorMessage && !hasDisplayedError) {
      toast.error(errorMessage);
      setHasDisplayedError(true);

      const timer = setTimeout(() => {
        dispatch(resetError());
        setHasDisplayedError(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, hasDisplayedError, dispatch]);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  // 1. Define form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Submit handler
  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      dispatch(resetError());
      setHasDisplayedError(false);
      await dispatch(actGetLogin(values)).unwrap();
    },
    [dispatch]
  );

  return (
    <div className="w-full max-w-md mx-auto p-6 ">
      <div className="mb-10 text-white">
        <h2 className="font-bold text-5xl mb-4">Login</h2>
        <p className="text-[#ffffffad] text-[16px]">
          Enter your account details
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Email"
                      className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white"
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-400 mt-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 pr-8 bg-transparent text-white"
                      {...field}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </FormControl>
                <Link
                  href="/forget-password"
                  className="text-sm text-[#925FE2] float-right mt-2 hover:underline"
                >
                  Forgot Password?
                </Link>
                <FormMessage className="text-red-400 mt-1" />
              </FormItem>
            )}
          />
          <Button
            className="bg-[#925FE4] w-full cursor-pointer hover:bg-[#9C6FE2] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-center text-sm text-[#ffffffad]">
        Don't have an account?{" "}
        <Link href="/register" className="text-[#925FE2] hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
