// app/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "../hooks/hooks";
import { resetPassword } from "@/store/auth/forgetpassword";
// import { resetPassword } from "@/store/auth/resetpassword";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    cpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // استرجاع البريد الإلكتروني من localStorage عند تحميل الصفحة
  useEffect(() => {
    const savedEmail = localStorage.getItem("resetEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    } else {
      // إذا لم يكن هناك بريد إلكتروني محفوظ، إعادة التوجيه إلى صفحة نسيان كلمة المرور
      router.push("/forgot-password");
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate OTP format (6 digits)
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(formData.otp)) {
      toast.error("Please enter a valid 6-digit verification code");
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.newPassword !== formData.cpassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Validate password strength (optional)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.newPassword)) {
      toast.error(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      );
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(resetPassword(formData)).unwrap();
      toast.success("Password reset successfully");

      // مسح البريد الإلكتروني من localStorage بعد النجاح
      localStorage.removeItem("resetEmail");

      router.push("/login");
    } catch (err: any) {
      console.log(err);
      toast.error(
        err.message || err || "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1C1D21] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter verification code and new password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled
                  className="pr-10 bg-gray-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                name="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={formData.otp}
                onChange={handleChange}
                required
                maxLength={6}
                pattern="\d{6}"
                title="Please enter a 6-digit code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Key className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-10 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpassword">Confirm Password</Label>
              <div className="relative">
                <Key className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="cpassword"
                  name="cpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={formData.cpassword}
                  onChange={handleChange}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-10 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="bg-[#925FE4] w-full cursor-pointer hover:bg-[#9C6FE2]"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
