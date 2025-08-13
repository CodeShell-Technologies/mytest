import axios from "axios";
import { Code } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BASE_URL } from "~/constants/api";

const useBranchStore = create(
  persist(
    (set) => ({
      branches: [],
      managerOptions: [],
      branchCodeOptions: [],
      roleOptions: [],
      isLoading: false,
      error: null,

      fetchBranches: async (token) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(`${BASE_URL}/branch/read`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const branches = response.data || [];
          const managerOptions = [
            ...new Set(branches.map((b) => b.manager_id)),
          ].map((id) => ({
            value: id,
            label: id,
          }));

          const branchCodeOptions = [
            ...new Set(branches.map((b) => b.branchcode)),
          ].map((code) => ({
            value: code,
            label: code,
          }));
          const roleOptions = [...new Set(branches.map((r) => r.role))].map(
            (role) => ({
              value: role,
              label: role,
            })
          );
          set({
            branches,
            managerOptions: [
              { value: "", label: "All Managers" },
              ...managerOptions,
            ],
            branchCodeOptions: [
              { value: "", label: "All Branch Codes" },
              ...branchCodeOptions,
            ],
            roleOptions: [{ value: "", label: "All Role" },...roleOptions],
            isLoading: false,
          });
          console.log("roleoptionzus",roleOptions)
        } catch (error) {
          set({ error, isLoading: false });
        }
      },
    }),
    {
      name: "Branch-storage",
    }
  )
);

export default useBranchStore;
