"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/Header/page";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full ">
        <Header />
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
