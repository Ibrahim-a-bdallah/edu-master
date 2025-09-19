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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clearError, clearSuccess } from "@/store/auth/register/registerSlice";
import actSignUp from "@/store/auth/register/actGetRegister";

// تحقق من صحة البيانات باستخدام Zod
const formSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    phoneNumber: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(50, { message: "Password cannot exceed 50 characters" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
        }
      ),
    cpassword: z.string(),
    classLevel: z.string().min(1, { message: "Please select a class level" }),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords don't match",
    path: ["cpassword"],
  });

// قائمة المستويات الدراسية
const classLevels = [
  "Grade 1 Secondary",
  "Grade 2 Secondary",
  "Grade 3 Secondary",
  "Grade 4 Secondary",
  "Grade 5 Secondary",
];

const Register = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loading, userData, errorMessage, successMessage } = useAppSelector(
    (state) => state.authSignUp
  );
  const isLoading = loading === "pending";
  const isSuccess = loading === "succeeded";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // clearing error and success messages on component mount
  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);

  // redirecting to login page after successful registration
  useEffect(() => {
    if (isSuccess && successMessage) {
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  }, [isSuccess, successMessage, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      cpassword: "",
      classLevel: "",
    },
  });

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      try {
        await dispatch(actSignUp(values)).unwrap();
      } catch (error) {
        console.error("Registration failed:", error);
      }
    },
    [dispatch]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setShowConfirmPassword((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen flex  w-full max-w-md  items-center justify-center  p-4">
      <div className=" w-full   p-6">
        <div className="mb-8 text-white">
          <h2 className="font-bold text-3xl mb-2">Create Account</h2>
          <p className="text-[#ffffffad] text-sm">
            Join us and start your learning journey
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-300 text-sm">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-300 text-sm">
            {successMessage}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your phone number with country code"
                      className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="classLevel"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white w-full">
                        <SelectValue placeholder="Select your class level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white ">
                      {classLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
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
                        placeholder="Create a password"
                        className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        onClick={togglePasswordVisibility}
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
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="border-transparent rounded-none p-0 pb-2 border-b-2 border-b-[#333437] focus:border-none focus:outline-none focus-visible:ring-0 pl-0 bg-transparent text-white"
                        {...field}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        onClick={toggleConfirmPasswordVisibility}
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
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button
              className="bg-[#925FE4] w-full cursor-pointer hover:bg-[#9C6FE2] text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-6"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-[#ffffffad]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#925FE2] hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
