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
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { redirect } from "next/navigation";

// Validation schema
const formSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username cannot exceed 20 characters" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Registration values:", values);
      setIsSuccess(true);

      // Redirect after successful registration
      setTimeout(() => {
        redirect("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // if (isSuccess) {
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center p-4">
  //       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
  //         <div className="text-center py-10">
  //           <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
  //             <Check className="h-10 w-10 text-white" />
  //           </div>
  //           <h2 className="text-3xl font-bold text-white mb-4">
  //             Registration Successful!
  //           </h2>
  //           <p className="text-white mb-8">
  //             Your account has been created successfully.
  //           </p>
  //           <Button
  //             className="bg-[#925FE4] hover:bg-[#9C6FE2] text-white font-medium py-2 px-6 rounded-md transition-colors duration-200"
  //             onClick={() => router.push("/login")}
  //           >
  //             Continue to Login
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screenflex items-center justify-center p-4">
      <div className="  rounded-2xl p-8 max-w-md w-full  ">
        <div className="mb-8 text-white text-center">
          <h2 className="font-bold text-4xl mb-2">Create Account</h2>
          <p className="text-white">Join us and start your journey</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Full Name"
                        className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white placeholder:text-white"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Email Address"
                        type="email"
                        className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white placeholder:text-white"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Username"
                        className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white placeholder:text-white"
                        {...field}
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 mt-1" />
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
                        className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white placeholder:text-white pr-8"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white placeholder:text-white pr-8"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-white"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 mt-1" />
                </FormItem>
              )}
            />

            <div className="pt-4">
              <Button
                className="bg-[#925FE4] w-full cursor-pointer hover:bg-[#9C6FE2] text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </div>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-white">
          Already have an account?{" "}
          <Link href="/login" className="text-[#925FE2] hover:underline">
            Sign in
          </Link>
        </div>

        <div className="mt-8 text-xs text-white text-center">
          <p>
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
