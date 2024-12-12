import {
  ChevronDownIcon,
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { User } from "@/types/user";
import { Avatar, AvatarFallback } from "../ui/avatar";

type SidebarAvatarMenuProps = {
  user: User;
  isMobile: boolean;
  signOut: () => void;
  isInSidebar: boolean;
};
function SidebarAvatarMenu({
  user,
  isMobile,
  signOut,
  isInSidebar,
}: SidebarAvatarMenuProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              tooltip={`${user?.first_name}'s account`}
              className="group data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8">
                <AvatarFallback>{`${user?.first_name[0] || ""}${user?.last_name[0] || ""}`}</AvatarFallback>
              </Avatar>
              <span>{user?.first_name}</span>
              {isInSidebar ? (
                <ChevronsUpDownIcon className="size-4 ml-auto" />
              ) : (
                <ChevronDownIcon className="size-4 ml-auto group-data-[state=open]:rotate-180 transition-all duration-300" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
            side={isMobile ? "bottom" : "right"}
          >
            <DropdownMenuItem disabled={true}>
              <SettingsIcon className="size-6"></SettingsIcon>
              <span className="line-through">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOutIcon className="size-6"></LogOutIcon>
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
export default SidebarAvatarMenu;
