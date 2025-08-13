// routes/settings/SettingsLayout.tsx
import { useRef } from "react";
import { cn } from "src/utils/cn";
import { useSideBar } from "~/store/useSideBar";
import SettingsSidebar from "./SettingsSidebar";
import { Outlet } from "react-router";

export default function SettingsLayout() {
  const { isOpen } = useSideBar();
  const sidebarRef = useRef(null);

  return (
    <div className="flex h-full">
      <SettingsSidebar ref={sidebarRef} />
      
  
      <div className={cn(
        "flex-1 transition-[margin] duration-300",
        isOpen ? "md:ml-[70px]" : "md:ml-[50px]"
      )}>
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}