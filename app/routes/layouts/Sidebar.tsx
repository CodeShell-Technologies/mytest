

// // import { forwardRef } from "react";
// import { forwardRef, useEffect, useState } from "react";
// import { cn } from "../../../src/utils/cn";
// import { navbarLinks } from "~/constants";
// import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom"; 
// import alminologo from "../../../app/assets/Almino structural consultancy_Final.png";
// import { useSideBar } from "~/store/useSideBar";
// // import { useRoleAccess } from "~/constants/getroles";
// export const Sidebar = forwardRef<HTMLDivElement>((props, ref) => {
//   const { isOpen } = useSideBar();

//   return (
 
//     <aside
//       ref={ref}
//       className={cn(
//         "fixed z-[100] flex h-full w-[260px] flex-col overflow-x-hidden border-r",
//         "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
//         "transition-all duration-300",
//         isOpen ? "md:w-[70px] md:items-center" : "md:w-[240px]",
//         isOpen ? "max-md:-left-full" : "max-md:left-0"
//       )}
//     >
//       <div className="flex gap-x-3 p-3">
//         <img src={alminologo} alt="Logo" className="w-full h-auto" />
//       </div>
//       <div
//         className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x overflow-x-hidden  p-3"
//         style={{
//           scrollbarWidth: "none" /* Firefox */,
//           msOverflowStyle: "none" /* IE/Edge */,
//         }}
//       >
//         {navbarLinks.map((navbarLink) => (
//           <nav
//             key={`group-${navbarLink.title}`}
//             className={cn("sidebar-group", isOpen && "md:items-center")}
//           >
//             {!isOpen && (
//               <p className={cn("sidebar-group-title", isOpen && "md:w-[45px]")}>
//                 {navbarLink.title}
//               </p>
//             )}
//             {navbarLink.links.map((link) => (
//               <NavLink
//                 key={link.path}
//                 to={link.path}
//                 className={cn("sidebar-item", isOpen && "md:w-[45px]")}
//               >
//                 <link.icon size={18} className="flex-shrink-0" />
//                 {!isOpen && <p className="whitespace-nowrap">{link.label}</p>}
//               </NavLink>
//             ))}
//           </nav>
//         ))}
//       </div>
//     </aside>
//   );
// });


// Sidebar.displayName = "Sidebar";


// Sidebar.prototype = {
//   isOpen: PropTypes.bool,
// };

// Sidebar.defaultProps = {
//   isOpen: false,
// };




// import { forwardRef, useEffect, useState } from "react";
// import { cn } from "../../../src/utils/cn";
// import { navbarLinks } from "~/constants";
// import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom";
// import alminologo from "../../../app/assets/Almino structural consultancy_Final.png";
// import { useSideBar } from "~/store/useSideBar";
// import { useAuthStore } from "src/stores/authStore";


// import {
//   UserLock,
//   CalendarX2,
//   Contact,
//   CalendarCheck,
//   UsersRound,
//   CalendarClock,
//   Calculator,
//   FileClock,
// MessageCircleWarning,
// } from "lucide-react";
// export const Sidebar = forwardRef<HTMLDivElement>((props, ref) => {
//   const { isOpen } = useSideBar();
//   const [allowedLinks, setAllowedLinks] = useState<typeof navbarLinks>([]);
//   const UserRole=useAuthStore((state=>state.role));
//     const token = useAuthStore((state) => state.accessToken);
  
//  const extraLinks = [
//     {
//       title: "Employee Management",
//       links: [
//         { label: "Employee", icon: UserLock, path: "/employee" },
//         { label: "Leave", icon: CalendarX2, path: "/leave" },
//         { label: "Employee Report", icon: Contact, path: "/employee_report" },
//         { label: "Attandance", icon: CalendarCheck, path: "/attandance" },
//       ],
//     },
//     {
//       title: "Team Management",
//       links: [{ label: "Teams", icon: UsersRound, path: "/team" }],
//     },
//     {
//       title: "Time Sheet",
//       links: [{ label: "Time Sheet", icon: CalendarClock, path: "/time_sheet" }],
//     },
//     {
//       title: "Account Management",
//       links: [{ label: "Accounts", icon: Calculator, path: "/account" }],
//     },
//     {
//       title: "User Logs",
//       links: [{ label: "Active Logs", icon: FileClock, path: "/active_log" }],
//     },

// {
//         title: "Report Section",
//     links: [
//       {
//         label: "Report & Management",
//         icon: MessageCircleWarning,
//         path: "/reportAnaysis",
//       }
//     ]
// }
  
//   ];

//   useEffect(() => {
  
//       if (!token || !UserRole) return; // wait until hydrated

//     const fetchRoleAccess = async () => {
//       try {



       
//         const role = localStorage.getItem("userRole") || "tester"; // role saved after login

//         const res = await fetch(`http://localhost:3000/api/get-roleaccess/${UserRole}`);
//         if (!res.ok) throw new Error(`Failed to fetch role access: ${res.status}`);

//         const data = await res.json();
//         if (!data.status || !data.access) throw new Error("Invalid access data");

//         const accessData = data.access; // contains { role, project, task, ... }

//         // Match link.label to accessData key (lowercase & remove spaces)
//         const filteredLinks = navbarLinks
//           .map(group => ({
//             ...group,
//             links: group.links.filter(link => {
//               const key = link.label.toLowerCase().replace(/\s+/g, "");
//               return accessData[key] === true;
//             })
//           }))
//           .filter(group => group.links.length > 0);

//         setAllowedLinks(filteredLinks);
//       } catch (err) {
//         console.error("Error fetching role access:", err);
//         setAllowedLinks([]); // fallback to no links if error
//       }
//     };

//     fetchRoleAccess();
//   }, []);


//   const finalLinks =
//     UserRole === "superadmin" || UserRole === "admin"
//       ? [...allowedLinks, ...extraLinks]
//       : allowedLinks;

//   return (
//     <aside
//       ref={ref}
//       className={cn(
//         "fixed z-[100] flex h-full w-[260px] flex-col overflow-x-hidden border-r",
//         "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
//         "transition-all duration-300",
//         isOpen ? "md:w-[70px] md:items-center" : "md:w-[240px]",
//         isOpen ? "max-md:-left-full" : "max-md:left-0"
//       )}
//     >
//       <div className="flex gap-x-3 p-3">
//         <img src={alminologo} alt="Logo" className="w-full h-auto" />
//       </div>

//       <div
//         className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3"
//         style={{
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//         }}
//       >
//         {finalLinks.map((navbarLink) => (
//           <nav
//             key={`group-${navbarLink.title}`}
//             className={cn("sidebar-group", isOpen && "md:items-center")}
//           >
//             {!isOpen && (
//               <p className={cn("sidebar-group-title", isOpen && "md:w-[45px]")}>
//                 {navbarLink.title}
//               </p>
//             )}
//             {navbarLink.links.map((link) => (
//               <NavLink
//                 key={link.path}
//                 to={link.path}
//                 className={cn("sidebar-item", isOpen && "md:w-[45px]")}
//               >
//                 <link.icon size={18} className="flex-shrink-0" />
//                 {!isOpen && <p className="whitespace-nowrap">{link.label}</p>}
//               </NavLink>
//             ))}
//           </nav>
//         ))}
//       </div>
//     </aside>
//   );
// });

// Sidebar.displayName = "Sidebar";

// Sidebar.propTypes = {
//   isOpen: PropTypes.bool,
// };

// Sidebar.defaultProps = {
//   isOpen: false,
// };


//thats correct above









import { forwardRef, useEffect, useState } from "react";
import { cn } from "../../../src/utils/cn";
import { navbarLinks } from "~/constants";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import alminologo from "../../../app/assets/Almino structural consultancy_Final.png";
import { useSideBar } from "~/store/useSideBar";
import { useAuthStore } from "src/stores/authStore";
import { BASE_URL } from "~/constants/api";

import {
  UserLock,
  CalendarX2,
  Contact,
  CalendarCheck,
  UsersRound,
  CalendarClock,
  Calculator,
  FileClock,
  MessageCircleWarning,
  Home ,
  Split,
} from "lucide-react";

export const Sidebar = forwardRef<HTMLDivElement>((props, ref) => {
  const { isOpen } = useSideBar();
  const [allowedLinks, setAllowedLinks] = useState<typeof navbarLinks>([]);
  const [hydrated, setHydrated] = useState(false);



  const UserRole = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.accessToken);

  // ✅ wait until persist rehydrated
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useAuthStore.persist.onHydrate(() => setHydrated(true));
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (!hydrated || !token || !UserRole) return; // only run after hydration

    const fetchRoleAccess = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/get-roleaccess/${UserRole}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ safe to send after hydration
            },
          }
        );
        if (!res.ok) throw new Error(`Failed to fetch role access: ${res.status}`);

        const data = await res.json();
        if (!data.status || !data.access) throw new Error("Invalid access data");

        const accessData = data.access;

        const filteredLinks = navbarLinks
          .map((group) => ({
            ...group,
            links: group.links.filter((link) => {
              const key = link.label.toLowerCase().replace(/\s+/g, "");
              return accessData[key] === true;
            }),
          }))
          .filter((group) => group.links.length > 0);

        setAllowedLinks(filteredLinks);
      } catch (err) {
        console.error("Error fetching role access:", err);
        setAllowedLinks([]);
      }
    };

    fetchRoleAccess();
  }, [hydrated, token, UserRole]);

  if (!hydrated) {
    return <div></div>;
  }

  

const branchlinks = [{
        title: "Branch Management",
    links: [
      {
        label: "Branches",
        icon: Split,
        path: "/branch",
      },
    ],
    }];


const dashlinks = [{
      title: "Dashboard",
      links: [
      {
        label: "Dashboard",
  icon: Home ,
        path: "/",
      },
    ],
    }];

  const addlinks = [{
      title: "Attandance",
      links: [{ label: "Attandance", icon: CalendarCheck, path: "/attandance" },
              { label: "Leave", icon: CalendarX2, path: "/leave" }],
    }];


    

  const extraLinks = [
    {
      title: "Employee Management",
      links: [
        { label: "Employee", icon: UserLock, path: "/employee" },
        { label: "Leave", icon: CalendarX2, path: "/leave" },
        { label: "Employee Report", icon: Contact, path: "/employee_report" },
        { label: "Attandance", icon: CalendarCheck, path: "/attandance" },
      ],
    },
    // {
    //   title: "Team Management",
    //   links: [{ label: "Teams", icon: UsersRound, path: "/team" }],
    // },
    
    {
      title: "Time Sheet",
      links: [{ label: "Time Sheet", icon: CalendarClock, path: "/time_sheet" }],
    },
    // {
    //   title: "Account Management",
    //   links: [{ label: "Accounts", icon: Calculator, path: "/account" }],
    // },
    // {
    //   title: "User Logs",
    //   links: [{ label: "Active Logs", icon: FileClock, path: "/active_log" }],
    // },
    // {
    //   title: "Report Section",
    //   links: [
    //     {
    //       label: "Report & Management",
    //       icon: MessageCircleWarning,
    //       path: "/reportAnaysis",
    //     },
    //   ],
    // },
  ];

  const finalLinks =
    UserRole === "superadmin" || UserRole === "admin" || UserRole === "hr"
      ? [...allowedLinks, ...extraLinks]
      : [...allowedLinks,...addlinks];

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
        className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {finalLinks.map((navbarLink) => (
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

Sidebar.propTypes = {
  isOpen: PropTypes.bool,
};

Sidebar.defaultProps = {
  isOpen: false,
};

// import { forwardRef, useEffect, useState } from "react";
// import { cn } from "../../../src/utils/cn";
// import { navbarLinks } from "~/constants";
// import PropTypes from "prop-types";
// import { NavLink } from "react-router-dom";
// import alminologo from "../../../app/assets/Almino structural consultancy_Final.png";
// import { useSideBar } from "~/store/useSideBar";
// import axios from "axios";

// export const Sidebar = forwardRef<HTMLDivElement>((props, ref) => {
//   const { isOpen } = useSideBar();
//   const [allowedLinks, setAllowedLinks] = useState([]);

//   useEffect(() => {
//     const fetchRoleAccess = async () => {
//       try {
//         // Example: you store role when login
//         const role = localStorage.getItem("userRole") || "tester";

//         const res = await fetch(`http://localhost:3000/api/get-roleaccess/${role}`);
//         if (!res.ok) {
//           throw new Error("Failed to fetch role access");
//         }

//         const accessData = await res.json();

//         // Filter navbarLinks based on accessData keys
//         const filteredLinks = navbarLinks
//           .map(group => ({
//             ...group,
//             links: group.links.filter(link =>
//               accessData[link.label.toLowerCase().replace(/\s+/g, "_")]
//             )
//           }))
//           .filter(group => group.links.length > 0);

//         setAllowedLinks(filteredLinks);
//         console.log(filteredLinks);
//       } catch (error) {
//         console.error("Error fetching role access:", error);
//       }
//     };

//     fetchRoleAccess();
//   }, []);

//   return (
//     <aside
//       ref={ref}
//       className={cn(
//         "fixed z-[100] flex h-full w-[260px] flex-col overflow-x-hidden border-r",
//         "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
//         "transition-all duration-300",
//         isOpen ? "md:w-[70px] md:items-center" : "md:w-[240px]",
//         isOpen ? "max-md:-left-full" : "max-md:left-0"
//       )}
//     >
//       <div className="flex gap-x-3 p-3">
//         <img src={alminologo} alt="Logo" className="w-full h-auto" />
//       </div>

//       <div
//         className="flex w-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden p-3"
//         style={{
//           scrollbarWidth: "none",
//           msOverflowStyle: "none",
//         }}
//       >
//         {allowedLinks.map((navbarLink, idx) => (
//           <nav
//             key={`group-${idx}`}
//             className={cn("sidebar-group", isOpen && "md:items-center")}
//           >
//             {!isOpen && navbarLink.title && (
//               <p className={cn("sidebar-group-title", isOpen && "md:w-[45px]")}>
//                 {navbarLink.title}
//               </p>
//             )}
//             {navbarLink.links.map(link => (
//               <NavLink
//                 key={link.path}
//                 to={link.path}
//                 className={cn("sidebar-item", isOpen && "md:w-[45px]")}
//               >
//                 <link.icon size={18} className="flex-shrink-0" />
//                 {!isOpen && <p className="whitespace-nowrap">{link.label}</p>}
//               </NavLink>
//             ))}
//           </nav>
//         ))}
//       </div>
//     </aside>
//   );
// });

// Sidebar.displayName = "Sidebar";

// Sidebar.propTypes = {
//   isOpen: PropTypes.bool,
// };

// Sidebar.defaultProps = {
//   isOpen: false,
// };
