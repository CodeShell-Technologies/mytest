import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import "../src/axios-setup";
import { Routes, Route } from "react-router-dom"
import "./app.css";

import Login from "./routes/Login";
import Dashboard from "./routes/home"
import ProtectedRoute from "./ProtectedRoute";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
  
        {children}
      
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;

// return (
//     <ProtectedRoute>
//       <Outlet />
//     </ProtectedRoute>
//   );


// return (
//     <Routes>
//       {/* Public login route */}
//       <Route path="/login" element={<Login />} />


//       {/* Protected routes → Outlet will render your nested pages */}
//       <Route element={<ProtectedRoute />}>
//         <Route path="/*" element={<Outlet />} />
//       </Route>
//     </Routes>
//   );

}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}


// // src/root.tsx
// import React from "react";
// import { Outlet, Routes, Route, Navigate } from "react-router-dom";
// import {
//   isRouteErrorResponse,
//   Links,
//   Meta,
//   ScrollRestoration,
//   Scripts,
// } from "react-router";
// import type { Route as RouteType } from "./+types/root";
// import "./app.css";

// import ProtectedRoute from "../src/component/ProtectedRoute";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile"; // example protected page

// // Preload fonts
// export const links: RouteType.LinksFunction = () => [
//   { rel: "preconnect", href: "https://fonts.googleapis.com" },
//   {
//     rel: "preconnect",
//     href: "https://fonts.gstatic.com",
//     crossOrigin: "anonymous",
//   },
//   {
//     rel: "stylesheet",
//     href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
//   },
// ];

// // HTML Layout
// export function Layout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         {children}
//         <ScrollRestoration />
//         <Scripts />
//       </body>
//     </html>
//   );
// }

// // App root component
// export default function App() {
//   return <Outlet />;
// }

// // Error boundary
// export function ErrorBoundary({ error }: RouteType.ErrorBoundaryProps) {
//   let message = "Oops!";
//   let details = "An unexpected error occurred.";
//   let stack: string | undefined;

//   if (isRouteErrorResponse(error)) {
//     message = error.status === 404 ? "404" : "Error";
//     details =
//       error.status === 404
//         ? "The requested page could not be found."
//         : error.statusText || details;
//   } else if (import.meta.env.DEV && error && error instanceof Error) {
//     details = error.message;
//     stack = error.stack;
//   }

//   return (
//     <main className="pt-16 p-4 container mx-auto">
//       <h1>{message}</h1>
//       <p>{details}</p>
//       {stack && (
//         <pre className="w-full p-4 overflow-x-auto">
//           <code>{stack}</code>
//         </pre>
//       )}
//     </main>
//   );
// }

// // Routes definition
// export function AppRoutes() {
//   return (
//     <Routes>
//       {/* Public route */}
//       <Route path="/login" element={<Login />} />

//       {/* Protected routes */}
//       <Route
//         path="/*"
//         element={
//           <ProtectedRoute>
//             <App />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Dashboard />} />
//         <Route path="profile" element={<Profile />} />
//         {/* Add more protected routes here */}
//       </Route>

//       {/* Redirect unknown paths */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }
