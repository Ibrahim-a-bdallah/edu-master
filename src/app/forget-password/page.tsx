// app/forgot-password/page.tsx
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
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "../hooks/hooks";
import { forgotPassword } from "@/store/auth/forgetpassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();

  // استخدام useEffect لعرض toast عند تغيير الخطأ
  useEffect(() => {
    if (error) {
      toast.error(error);
      // مسح الخطأ بعد عرضه لتجنب إعادة العرض
      setError("");
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Dispatch the forgot password action
      await dispatch(forgotPassword({ email })).unwrap();

      // حفظ البريد الإلكتروني في localStorage لنقله إلى صفحة إعادة التعيين
      localStorage.setItem("resetEmail", email);

      // الانتقال مباشرة إلى صفحة إعادة التعيين
      router.push("/reset-password");
      toast.success("Verification code sent to your email");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#1C1D21] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a verification code to
            reset your password
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
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pr-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="bg-[#925FE4] w-full cursor-pointer hover:bg-[#9C6FE2]"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
