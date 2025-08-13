

import { forwardRef } from "react";
import { cn } from "../../../src/utils/cn";
import { navbarLinks } from "~/constants";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom"; 
import alminologo from "../../../app/assets/Almino structural consultancy_Final.png";
import { useSideBar } from "~/store/useSideBar";

export const Sidebar = forwardRef<HTMLDivElement>((props, ref) => {
  const { isOpen } = useSideBar();

  return (
 
    <aside
      ref={ref}
      className={cn(
        "fixed z-[100] flex h-full w-[260px] flex-col overflow-x-hidden border-r",
        "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
        "transition-all duration-300",
        isOpen ? "md:w-[70px] md:items-center" : "md:w-[240px]",
        isOpen ? "max-md:-left-full" : "max-md:left-0"
      )}
    >
      <div className="flex gap-x-3 p-3">
        <img src={alminologo} alt="Logo" className="w-full h-auto" />
      </div>
      <div
        className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x overflow-x-hidden  p-3"
        style={{
          scrollbarWidth: "none" /* Firefox */,
          msOverflowStyle: "none" /* IE/Edge */,
        }}
      >
        {navbarLinks.map((navbarLink) => (
          <nav
            key={`group-${navbarLink.title}`}
            className={cn("sidebar-group", isOpen && "md:items-center")}
          >
            {!isOpen && (
              <p className={cn("sidebar-group-title", isOpen && "md:w-[45px]")}>
                {navbarLink.title}
              </p>
            )}
            {navbarLink.links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={cn("sidebar-item", isOpen && "md:w-[45px]")}
              >
                <link.icon size={18} className="flex-shrink-0" />
                {!isOpen && <p className="whitespace-nowrap">{link.label}</p>}
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Sidebar.displayName = "Sidebar";

Sidebar.prototype = {
  isOpen: PropTypes.bool,
};

Sidebar.defaultProps = {
  isOpen: false,
};
