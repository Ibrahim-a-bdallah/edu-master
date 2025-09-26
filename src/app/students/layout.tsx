// "use client";

import { StudentSidebar } from "@/components/StudentSidebar";

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
        {/* <Header /> */}
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
// import { StudentSidebar } from "./components/StudentSidebar";

// export default function StudentLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex h-screen">
//       <AppSidebar />
//       <main className="flex-1 overflow-auto">{children}</main>
//     </div>
//   );
// }
