// import { create } from "zustand";
// // import { create } from "zustand";
// import { createJSONStorage, persist } from "zustand/middleware";

// export const useAuthStore = create(
//   persist(
//     (set) => ({
//       accessToken: null,
//       testvariable:null,
//       refreshToken: null,
//       isActive: false,
//       isLoggedIn: false,
//       permissions: null,
//       role: null,
//       branchcode: null,
//       staff_id: null,
//       setAuthData: (data: any) =>
//         set({
//           staff_id: data.staff_id,
//           branchcode: data.branchcode,
//           accessToken: data.accessToken,
//           refreshToken: data.refreshToken,
//           isActive: data.isActive,
//           permissions: data.permissions,
//           isLoggedIn: true,
//           role: data.role,
//           testvariable:data.isActive,
//         }),
//       clearAuthData: () =>
//         set({
//           accessToken: null,
//           refreshToken: null,
//           isActive: false,
//           permissions: null,
//           isLoggedIn: false,
//           role: null,
//         }),
//     }),
//     { name: "auth-storage", storage: createJSONStorage(() => localStorage) }
//   )
// );

// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";

// interface AuthState {
//   accessToken: string | null;
//   refreshToken: string | null;
//   isActive: boolean;
//   isLoggedIn: boolean;
//   permissions: any;
//   role: string | null;
//   branchcode: string | null;
//   staff_id: string | null;
//   setAuthData: (data: any) => void;
//   clearAuthData: () => void;
// }

// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       accessToken: null,
//       refreshToken: null,
//       isActive: false,
//       isLoggedIn: false,
//       permissions: null,
//       role: null,
//       branchcode: null,
//       staff_id: null,

//       setAuthData: (data: any) =>
//         set({
//           staff_id: data.staff_id,
//           branchcode: data.branchcode,
//           accessToken: data.accessToken,
//           refreshToken: data.refreshToken,
//           isActive: data.isActive,
//           permissions: data.permissions,
//           isLoggedIn: true,
//           role: data.role,
//         }),

//       clearAuthData: () => {
//   localStorage.removeItem("auth-storage"); // remove Zustand persist key
//   set({
//     accessToken: null,
//     refreshToken: null,
//     isActive: false,
//     permissions: null,
//     isLoggedIn: false,
//     role: null,
//     branchcode: null,
//     staff_id: null,
//   });
// },

//     }),
//     {
//       name: "auth-storage", // key in localStorage
//       storage: createJSONStorage(() => localStorage),
//       // ensure hydration completes before usage
//       partialize: (state) => ({
//         accessToken: state.accessToken,
//         refreshToken: state.refreshToken,
//         isActive: state.isActive,
//         isLoggedIn: state.isLoggedIn,
//         role: state.role,
//         branchcode: state.branchcode,
//         staff_id: state.staff_id,
//       }),
//     }
//   )
// );


// export const useAuthStore = create<AuthState>()(
//   persist(
//     (set) => ({
//       accessToken: null,
//       refreshToken: null,
//       isActive: false,
//       isLoggedIn: false,
//       permissions: null,
//       role: null,
//       branchcode: null,
//       staff_id: null,

//       setAuthData: (data: any) =>
//         set({
//           staff_id: data.staff_id,
//           branchcode: data.branchcode,
//           accessToken: data.accessToken,
//           refreshToken: data.refreshToken,
//           isActive: data.isActive,
//           permissions: data.permissions,
//           isLoggedIn: true,
//           role: data.role,
//         }),

//       clearAuthData: () => {
//         localStorage.removeItem("auth-storage");
//         set({
//           accessToken: null,
//           refreshToken: null,
//           isActive: false,
//           permissions: null,
//           isLoggedIn: false,
//           role: null,
//           branchcode: null,
//           staff_id: null,
//         });
//       },
//     }),
//     {
//       name: "auth-storage",
//       storage: createJSONStorage(() => localStorage),
//       partialize: (state) => ({
//         accessToken: state.accessToken,
//         refreshToken: state.refreshToken,
//         isActive: state.isActive,
//         isLoggedIn: state.isLoggedIn,
//         role: state.role,
//         branchcode: state.branchcode,
//         staff_id: state.staff_id,
//       }),
//       onRehydrateStorage: () => (state) => {
//         console.log("✅ Hydrated auth state:", state);
//       },
//     }
//   )
// );




import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isActive: boolean;
  isLoggedIn: boolean;
  permissions: any;
  role: string | null;
  branchcode: string | null;
  staff_id: string | null;
  setAuthData: (data: any) => void;
  clearAuthData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      isActive: false,
      isLoggedIn: false,
      permissions: null,
      role: null,
      branchcode: null,
      staff_id: null,

      setAuthData: (data: any) =>
        set({
          accessToken: data.accessToken ?? null,
          refreshToken: data.refreshToken ?? null,
          isActive: data.isActive ?? false,
          isLoggedIn: true,
          permissions: data.permissions ?? null,
          role: data.role ?? null,
          branchcode: data.branchcode ?? null,
          staff_id: data.staff_id ?? null,
        }),

      clearAuthData: () => {
        localStorage.removeItem("auth-storage"); // clear persisted state
        set({
          accessToken: null,
          refreshToken: null,
          isActive: false,
          isLoggedIn: false,
          permissions: null,
          role: null,
          branchcode: null,
          staff_id: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isActive: state.isActive,
        isLoggedIn: state.isLoggedIn,
        permissions: state.permissions,
        role: state.role,
        branchcode: state.branchcode,
        staff_id: state.staff_id,
      }),
    }
  )
);

