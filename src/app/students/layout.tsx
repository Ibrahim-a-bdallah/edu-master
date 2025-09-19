"use client";

import Header from "@/components/Header/page";
import Sidebar from "@/components/Sidebar/page";

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
