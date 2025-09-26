import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarCom from "@/components/Sidebar/page";
import { StudentSidebar } from "./StudentSidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <SidebarContent>
        <StudentSidebar />
      </SidebarContent>
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
}
