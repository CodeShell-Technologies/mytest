import {
  House,
  Users,
  Settings,
  UserLock,
  CalendarCheck,
  CalendarX2,
  Contact,
  BellRing,
  MessageCircleWarning,
  CalendarClock,
  FileClock,
  SquareKanban,
  UserSearch,
  Briefcase,
  HouseWifi,
  UserPen,
  Calculator,
  UsersRound,
  CalendarSync,
  Split,
  FileUser ,
  CircleCheckBig,
  MailCheck 
} from "lucide-react";

export const navbarLinks = [
  {
    links: [
      {
        label: "Dashboard",
        icon: House,
        path: "/",
      },
    ],
  },
  {
    title: "Branch Management",
    links: [
      {
        label: "Branches",
        icon: Split,
        path: "/branch",
      },
    ],
  },
  {
    title: "User Management",
    links: [
      {
        label: "Employee",
        icon: UserLock,
        path: "/employee",
      },
      {
        label: "Leave",
        icon: CalendarX2,
        path: "/leave",
      },
      {
        label: "Employee Report",
        icon: Contact,
        path: "/employee_report",
      },
      {
        label: "Attandance",
        icon: CalendarCheck,
        path: "/attandance",
      },
   
    ],
  },
    {
    title: "Sales Management",
    links: [
          {
        label: "Campaign",
        icon: HouseWifi,
        path: "/campaign",
      },
      {
        label: "Leads",
        icon: UserSearch,
        path: "/leads",
      },
      {
        label: "Client",
        icon: Briefcase,
        path: "/client",
      },
  
    ],
  },
    {
    title: "Team Management",
    links: [
      {
        label: "Teams",
        icon: UsersRound,
        path: "/team",
      },
    ],
  },
  {
    title: "Project Management",
    links: [
      {
        label: "Project",
        icon: SquareKanban,
        path: "/project",
      },
          {
        label: "Task",
        icon: CircleCheckBig,
        path: "/project_tasklist",
      },
             {
        label: "Time Sheet",
        icon: CalendarClock,
        path: "/time_sheet",
      },
    ],
  },

  {
    title: "Account Profile",
    links: [
      {
        label: "Profile",
        icon: UserPen,
        path: "/account_profile",
      },
    ],
  },

  {
    title: "Account Management",
    links: [
      {
        label: "Accounts",
        icon: Calculator,
        path: "/account",
      },
    ],
  },
  {
    title: "Report Section",
    links: [
      {
        label: "Report & Management",
        icon: MessageCircleWarning,
        path: "/reportAnaysis",
      },
    ],
  },
  {
    title: "Notification",
    links: [
      {
        label: "reminder",
        icon: BellRing,
        path: "/notification",
      },
      {
        label: "Calendar",
        icon: CalendarSync,
        path: "/calendar",
      },
      {
        label: "MOM Report",
        icon: MailCheck ,
        path: "/mom_report",
      },
    ],
  },
  {
    title: "User Logs",
    links: [
      {
        label: "Active Logs",
        icon: FileClock,
        path: "/active_log",
      },
    ],
  },
  {
    title: "Settings",
    links: [
      {
        label: "Settings",
        icon: Settings,
        path: "/settings",
      },
    ],
  },
];
