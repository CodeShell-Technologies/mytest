import { type RouteConfig, index, route } from "@react-router/dev/routes";
import AuthProvider from "../src/component/AuthProvider";

export default [
  route("/login", "routes/Login.tsx"),
  {
    path: "/",
    file: "routes/Layout.tsx",
    children: [
      index("routes/home.tsx"),
      route("/branch", "routes/Branch/BranchList.tsx"),
      route("/branch/:id","routes/Branch/BranchViewPage.tsx"),
      route("/employee", "routes/Employee/Employee.tsx"),
      route("/employee/salary_slip", "routes/Employee/Salary/PaySlip.tsx"),
      route(
        "/employee/addpage/:id",
        "routes/Employee/AddNewEmployeeDetail.tsx"
      ),
      route("/employee/editpage/:id", 
        "routes/Employee/EditEmployeeForm.tsx"
),
      // route("/salary", "routes/Salary.tsx"),
      route("/leave", "routes/Leave/Leave.tsx"),
      route("/time_sheet","routes/Project/Timesheet/EmployeeTimeSheet.tsx"),
      route("/reportAnaysis", "routes/Report.tsx"),
      route("/attandance", "routes/Attendance/Attandance.tsx"),
      route("/project", "routes/Project/Project.tsx"),
      route("/project/:id", "routes/Project/ProjectOverview.tsx"),
      route("/milestone/:id","routes/Project/Task/MilestoneTaskList.tsx"),
      route("/campaignview/:id", "routes/Campaign/ViewCampaignDetails.tsx"),
      route("/task_view/:id", "routes/Project/Task/TaskViewPage.tsx"),
      route("/project_tasklist", "routes/Project/Task/ProjectTaskList.tsx"),
      route("/leads", "routes/Leads/Leads.tsx"),
      route("/client", "routes/Clients/Client.tsx"),
      route("/client_add", "routes/Clients/ClientAddForm.tsx"),
      route("/client_view", "routes/Clients/ClientPage.tsx"),
      route("/campaign", "routes/Campaign/Campaign.tsx"),
      route("/account_profile", "routes/AccountProfile.tsx"),
      route("/team", "routes/Team/TeamList.tsx"),
      route("/teamview/:id","routes/Team.tsx"),
      route("/leadsview/:id", "routes/Leads/LeadsPage.tsx"),
      route("/account", "routes/Accounts/AccountsProject.tsx"),
      route("/report_analysis", "routes/ReportAnalysis.tsx"),
      route("/notification", "routes/Notification.tsx"),
      route("/calendar", "routes/calendar/EventCalandar.tsx"),
      route("/mom_report", "routes/MomReport.tsx"),
      route("/active_log", "routes/ActiveLog.tsx"),
      route("/employee_profile/:id", "routes/Employee/EmployeeProfile.tsx"),
      route("/member_view/:id","routes/Project/Task/TaskMember/TaskMemberCheckInOutView.tsx"),
      route("/employee_report","routes/Employee/EmployeeReport.tsx"),
   route("/payreq_view/:id","routes/Accounts/PayRequestList.tsx"),
      route("/invoice_view/:id","routes/Accounts/Invoice/ViewInvoice.tsx"),
      route("/offer-letter-view/:id","routes/Employee/offerletters/ViewOfferLetter.tsx"),
      route("/employee/:id/joining-letter","routes/Employee/EmployeeJoiningLetter/ViewJoiningLetter.tsx"),
      route("/View-certificate/:id/:resign_id","routes/Employee/termination/ExperienceCertification.tsx"),
      
      {
        path: "/settings",
        file: "routes/settings/SettingsLayout.tsx",
        children: [
          index("routes/settings/Settings.tsx"),
          route("access-permission/roles", "routes/settings/AccessRole.tsx"),
          route(
            "access-permission/user",
            "routes/settings/UserRoles.tsx"
          ),
          route(
            "access-permission/systemsetting",
            "routes/settings/SystemSetting.tsx"
          ),

          route("access-permission/teams", "routes/settings/SettingTeam.tsx"),
          route("/settings/invoice/tax", "routes/settings/Tax.tsx"),
          route("invoice/payment-methods", "routes/settings/PaymentMethod.tsx"),
        ],
      },
      route("*", "routes/NotFound.tsx"),
    ],
  },
] satisfies RouteConfig;
// import { type RouteConfig, index, route } from "@react-router/dev/routes";
// import AuthProvider from "../src/component/AuthProvider";

// export default [
//   route("/login", "routes/Login.tsx"),
//   {
//     path: "/",
//     file: "routes/Layout.tsx",
//     children: [
//       index("routes/home.tsx"),
//       route("/branch", "routes/Branch/BranchList.tsx"),
//       route("/employee", "routes/Employee/Employee.tsx"),
//       route("/employee/salary_slip", "routes/Employee/Salary/PaySlip.tsx"),
//       route("/employee/addpage/:userId", "routes/Employee/AddNewEmployeePage.tsx"),
//       route("/leave", "routes/Leave/Leave.tsx"),
//       route("/report", "routes/Report.tsx"),
//       route("/attandance", "routes/Attendance/Attandance.tsx"),
//       route("/project", "routes/Project/Project.tsx"),
//       route("/project/:id/milestone", "routes/Project/ProjectOverview.tsx"), // Fixed missing colon in param
//       route("/campaignview", "routes/Campaign/ViewCampaignDetails.tsx"),
//       route("/task_view", "routes/Project/TaskViewPage.tsx"),
//       route("/leads", "routes/Leads/Leads.tsx"),
//       route("/client", "routes/Clients/Client.tsx"),
//       route("/client_add", "routes/Clients/ClientAddFoem.tsx"),
//       route("/client_view", "routes/Clients/ClientPage.tsx"),
//       route("/campaign", "routes/Campaign/Campaign.tsx"),
//       route("/account_profile", "routes/AccountProfile.tsx"),
//       route("/team", "routes/Team.tsx"),
//       route("/task", "routes/Tasks.tsx"),
//       route("/leadsview", "routes/Leads/LeadsPage.tsx"),
//       route("/accounts", "routes/Accounts/Accounts.tsx"),
//       route("/view_invoice", "routes/Accounts/Invoice/ViewInvoice.tsx"),
//       route("/report_analysis", "routes/ReportAnalysis.tsx"),
//       route("/notification", "routes/Notification.tsx"),
//       route("/calendar", "routes/Calendar.tsx"),
//       route("/mom_report", "routes/MomReport.tsx"),
//       route("/active_log", "routes/Employee/SampleDashboard.tsx"),
//       route("/employee_profile", "routes/Employee/EmployeeProfile.tsx"),
//       {
//         path: "/settings",
//         file: "routes/settings/SettingsLayout.tsx",
//         children: [
//           route("access-permission/roles", "routes/settings/AccessRole.tsx"),
//           route("access-permission/user-roles", "routes/settings/UserRoles.tsx"),
//           route("access-permission/teams", "routes/settings/SettingTeam.tsx"),
//           route("invoice/tax", "routes/settings/Tax.tsx"), // Removed leading slash
//           route("invoice/payment-methods", "routes/settings/PaymentMethod.tsx")
//         ],
//       },
//       route("*", "routes/NotFound.tsx") // Catch-all route
//     ],
//   }
// ] satisfies RouteConfig;
