"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  BookCheck,
  Settings,
  UserPen,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/app/hooks/hooks";
import LogoutButton from "./Sidebar/LogoutButton";

export function StudentSidebar() {
  const { role } = useAppSelector((state) => state.auth);
  const linked =
    role === "admin"
      ? "/teachers"
      : role === "super-admin"
      ? "/super-admin"
      : "/students";

  const menuItems = [
    { href: linked, icon: LayoutDashboard, label: "Dashboard" },
    { href: `${linked}/lessons`, icon: BookOpen, label: "My Lessons" },
    { href: `${linked}/exams`, icon: BookCheck, label: "My Exams" },
  ];
  const pathname = usePathname();

  return (
    <div className="w-full bg-white border-r h-full flex flex-col">
      {/* Logo */}
      <div className="flex  items-center p-6 border-b">
        <div className=" w-[52] h-[52] opacity-100 rounded-xl ">
          <img src="/logo.png" alt="" className=" w-10 h-10 opacity-100  " />
        </div>
        <h1 className="opacity-100 font-semibold text-[25px] pr-1 ">
          EduPlatform
        </h1>
        {/* <p className="text-sm text-gray-600">Student Portal</p> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 cursor-pointer ",
                    isActive && "bg-blue-50 text-blue-700"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <Link href={`${linked}/profile`}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 cursor-pointer "
          >
            <UserPen className="h-4 w-4" />
            Profile
          </Button>
        </Link>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 cursor-pointer "
        >
          <LogOut className="h-4 w-4" />
          <LogoutButton />
        </Button>
      </div>
    </div>
  );
}
