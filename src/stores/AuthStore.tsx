import { create } from "zustand";
// import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      testvariable:null,
      refreshToken: null,
      isActive: false,
      isLoggedIn: false,
      permissions: null,
      role: null,
      branchcode: null,
      staff_id: null,
      setAuthData: (data: any) =>
        set({
          staff_id: data.staff_id,
          branchcode: data.branchcode,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isActive: data.isActive,
          permissions: data.permissions,
          isLoggedIn: true,
          role: data.role,
          testvariable:data.isActive,
        }),
      clearAuthData: () =>
        set({
          accessToken: null,
          refreshToken: null,
          isActive: false,
          permissions: null,
          isLoggedIn: false,
          role: null,
        }),
    }),
    { name: "auth-storage", storage: createJSONStorage(() => localStorage) }
  )
);
