import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { StudentSidebar } from "./StudentSidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <StudentSidebar />
      </SidebarContent>
    </Sidebar>
  );
}
