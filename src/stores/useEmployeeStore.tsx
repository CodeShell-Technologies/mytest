import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BASE_URL } from "~/constants/api";
import Employee from "~/routes/Employee/Employee";

const useEmployeeStore = create(
  persist(
    (set) => ({
      employee: [],
      roleOptions: [],
      branchEmployee: [],
      branchEmployeeOptions: [],
      allEmployeecodeOptions: [],
      isLoading: false,
      error: null,
      fetchEmployee: async (token) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(
            `${BASE_URL}/users/read?limit=1000`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("roleoptionstore>>>>>>", response.data.result);
          const employee =response.data.data || response.data.result || [];

          const allEmployeecodeOptions = [
            ...new Set(
              employee.map((emp) =>
                JSON.stringify({
                  value: emp.staff_id,
                  label: `${emp.firstname} - ${emp.role}`,
                })
              )
            ),
          ].map((str) => JSON.parse(str));

          const roleOptions = [...new Set(employee.map((b) => b.role))].map(
            (role) => ({
              value: role,
              label: role,
            })
          );

          set({
            employee,
            roleOptions: [{ value: "", label: "All Roles" }, ...roleOptions],
            isLoading: false,
            allEmployeecodeOptions
          });
                    console.log("Processed options>>>>>>>>>>>>>>:", allEmployeecodeOptions); // Debug log

        } catch (error) {
          set({ error, isLoading: false });
        }
      },

      fetchBranchEmployee: async (token, branchcode) => {
        try {
          set({ isLoading: true });
          const response = await axios.get(
            `${BASE_URL}/users/read?branchcode=${branchcode}&limit=1000`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("API Response:", response.data); // Debug log

          // Check if data is in response.data.data or response.data.result
          const branchEmployee =
            response.data.data || response.data.result || [];
          console.log("Raw employee data:", branchEmployee); // Debug log

          // Create unique options using Set
          const branchEmployeeOptions = [
            ...new Set(
              branchEmployee.map((employee) =>
                JSON.stringify({
                  value: employee.staff_id,
                  label: `${employee.firstname} - ${employee.role}`,
                })
              )
            ),
          ].map((str) => JSON.parse(str));

          console.log("Processed options:", branchEmployeeOptions); // Debug log

          set({
            branchEmployee,
            branchEmployeeOptions,
            isLoading: false,
          });
        } catch (error) {
          console.error("Error fetching branch employees:", error);
          set({ error, isLoading: false });
        }
      },
    }),
    {
      name: "employee-storage",
    }
  )
);
export default useEmployeeStore;
