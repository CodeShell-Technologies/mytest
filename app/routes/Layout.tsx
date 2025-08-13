// import { useRef, useState, useEffect } from "react";
// import { Header } from "./layouts/Header";
// import { Sidebar } from "./layouts/Sidebar";
// import { cn } from "../../src/utils/cn";
// import { Outlet,useLocation } from "react-router";
// import { useClickOutside, useMediaQuery } from "./hooks/use-click-outside";
// import { useSideBar } from "~/store/useSideBar";
// import SettingsSidebar from "./settings/SettingsSidebar";

// const Layout = () => {
//   const isDesktopDevice = useMediaQuery("(min-width:768px)");
//   const sidebarRef = useRef(null);
//   const overlayRef = useRef(null);
//   const { isOpen, close } = useSideBar();
// const location=useLocation()
//   useClickOutside([sidebarRef], () => {
//     if (!isDesktopDevice && isOpen) {
//       close();
//     }
//   });


//   return (
//     <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
//       {/* <div
//         className={cn(
//           "pointer-events-none fixed inset-0 -z-10 bg-black opacity-0 transition-opacity",
//           !isOpen && "max-md:pointer-events-auto max-md:opacity-30 max-md:z-50"
//         )}
//         onClick={() => !isDesktopDevice && isOpen && toggle()}
//       /> */}
//   <div
//         className={cn(
//           "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300",
//           isOpen && !isDesktopDevice 
//             ? "opacity-100 pointer-events-auto" 
//             : "opacity-0 pointer-events-none"
//         )}
//         onClick={() => !isDesktopDevice && close()}
//       />
//       <Sidebar ref={sidebarRef} />
//       <div
//         className={cn(
//           "transition-[margin] duration-300",
//           isOpen ? "md:ml-[70px]" : "md:ml-[240px]",
//         )}
//       >
//         <Header />
//         <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;
import { useRef, useEffect } from "react";
import { Header } from "./layouts/Header";
import { Sidebar } from "./layouts/Sidebar";
import { cn } from "../../src/utils/cn";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useClickOutside, useMediaQuery } from "./hooks/use-click-outside";
import { useSideBar } from "~/store/useSideBar";
import { useAuthStore } from "src/stores/authStore";


const Layout = () => {
  const isDesktopDevice = useMediaQuery("(min-width:768px)");
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  const { isOpen, close } = useSideBar();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get auth state
  // const { isLoggedIn, accessToken } = useAuthStore()
  const isLoggedIn=useAuthStore((state)=>state.isLoggedIn)
  const accessToken=useAuthStore((state)=>state.accessToken)
  // Authentication check
  useEffect(() => {
    if (!isLoggedIn && !accessToken) {
      navigate('/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [isLoggedIn, accessToken, navigate, location]);

  useClickOutside([sidebarRef], () => {
    if (!isDesktopDevice && isOpen) {
      close();

    }
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300",
          isOpen && !isDesktopDevice 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        )}
        onClick={() => !isDesktopDevice && close()}
      />
      
      <Sidebar ref={sidebarRef} />
      
      <div
        className={cn(
          "transition-[margin] duration-300",
          isOpen ? "md:ml-[70px]" : "md:ml-[240px]",
        )}
      >
        <Header />
        <div className="h-[calc(100vh-60px)] overflow-y-auto overflow-x-hidden p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;