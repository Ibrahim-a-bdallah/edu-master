import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SidebarCom from "@/components/Sidebar/page";

export function AppSidebar() {
  return (
    <Sidebar>
      {/* <SidebarHeader /> */}
      <SidebarContent>
        <SidebarCom />
      </SidebarContent>
      {/* <SidebarFooter /> */}
    </Sidebar>
  );
}
