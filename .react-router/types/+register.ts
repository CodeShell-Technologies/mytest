import "react-router";

declare module "react-router" {
  interface Register {
    params: Params;
  }
}

type Params = {
  "/": {};
  "/login": {};
  "/": {};
  "/branch": {};
  "/branch/:id": {
    "id": string;
  };
  "/employee": {};
  "/employee/salary_slip/:id": {
    "id": string;
  };
  "/employee/addpage/:id": {
    "id": string;
  };
  "/employee/editpage/:id": {
    "id": string;
  };
  "/leave": {};
  "/time_sheet": {};
  "/reportAnaysis": {};
  "/attandance": {};
  "/project": {};
  "/project/:id": {
    "id": string;
  };
  "/projectaccount/:id": {
    "id": string;
  };
  "/milestone/:id": {
    "id": string;
  };
  "/milestonepayment/:id": {
    "id": string;
  };
  "/campaignview/:id": {
    "id": string;
  };
  "/task_view/:id": {
    "id": string;
  };
  "/project_tasklist": {};
  "/leads": {};
  "/leadscovert": {};
  "/client": {};
  "/client_add": {};
  "/client_view": {};
  "/meeting_view/:id": {
    "id": string;
  };
  "/meetings/:id": {
    "id": string;
  };
  "/campaign": {};
  "/account_profile": {};
  "/team": {};
  "/teamview/:id": {
    "id": string;
  };
  "/leadsview/:id": {
    "id": string;
  };
  "/account": {};
  "/report_analysis": {};
  "/notification": {};
  "/calendar": {};
  "/mom_report": {};
  "/active_log": {};
  "/employee_profile/:id": {
    "id": string;
  };
  "/member_view/:id": {
    "id": string;
  };
  "/employee_report": {};
  "/payreq_view/:id": {
    "id": string;
  };
  "/invoice_view/:id": {
    "id": string;
  };
  "/offer-letter-view/:id": {
    "id": string;
  };
  "/employee/:id/joining-letter": {
    "id": string;
  };
  "/View-certificate/:id/:resign_id": {
    "id": string;
    "resign_id": string;
  };
  "/invoice_create": {};
  "/settings": {};
  "/settings/access-permission/roles": {};
  "/settings/access-permission/user": {};
  "/settings/access-permission/systemsetting": {};
  "/settings/access-permission/departments": {};
  "/settings/access-permission/designations": {};
  "/settings/access-permission/teams": {};
  "/settings/invoice/tax": {};
  "/settings/invoice/payment-methods": {};
  "/*": {
    "*": string;
  };
};