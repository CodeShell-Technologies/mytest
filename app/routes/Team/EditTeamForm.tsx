// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { BASE_URL, toastposition } from "~/constants/api";
// import toast, { Toaster } from "react-hot-toast";
// import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
// import { useAuthStore } from "src/stores/authStore";
// import useBranchStore from "src/stores/useBranchStore";
// import useEmployeeStore from "src/stores/useEmployeeStore";

// function EditTeamForm({ branch, onSuccess, onCancel }) {
//   const [formData, setFormData] = useState({
//     team_id: "",
//     team_name: "",
//     team_lead: "",
//     branchcode: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const token = useAuthStore((state) => state.accessToken);
//   const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
//   const employeeOption = useEmployeeStore(
//     (state) => state.branchEmployeeOptions
//   );
//   useEffect(() => {
//     if (branch) {
//       setFormData({
//         team_id: branch.team_id || "",
//         team_name: branch.team_name || "",
//         team_lead: branch.team_lead || "",
//         branchcode: branch.branchcode || "",
//       });
//     }
//   }, [branch]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     const teamData = {
//       userData: {
//         team_id: formData.team_id,
//         team_name: formData.team_name,
//         team_lead: formData.team_lead,
//         branchcode: formData.branchcode,
//       },
//     };
//     console.log("teamupdatedata", teamData);
//     try {
//       const response = await axios.put(`${BASE_URL}/teams/edit`, teamData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.status === 201) {
//         onSuccess();
//       } else {
//         setError(response.data.message || "Failed to update team");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//       toast.error(`${error}, Error in update team`, {
//         style: {
//           border: "1px solid  rgb(185 28 28)",
//           padding: "14px",
//           width: "900px",
//           color: " rgb(185 28 28)",
//         },
//         iconTheme: {
//           primary: " rgb(185 28 28)",
//           secondary: "#FFFAEE",
//         },
//       });
//       setError(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="text-medium dark:bg-gray-800 dark:text-gray-200">
//       {error && <div className="text-red-500 mb-4">{error}</div>}
//       <Toaster position={toastposition} />
//       <form onSubmit={handleSubmit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           <div className="flex flex-col py-2 text-left">
//             <label className="text-sm text-gray-700 dark:text-gray-300 mb-1">
//               Team Name
//             </label>

//             <input
//               name="team_name"
//               value={formData.team_name}
//               onChange={handleChange}
//               className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-3 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
//               type="text"
//               placeholder="Branch Name"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Team Lead
//             </label>
//             <select
//               name="team_lead"
//               value={formData.team_lead}
//               onChange={handleChange}
//               className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
//             >
//               {employeeOption?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//               Branch Code
//             </label>
//             <select
//               name="branchcode"
//               value={formData.branchcode}
//               onChange={handleChange}
//               className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
//             >
//               {branchCodeOption?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-hover-secondary)] text-gray-800 dark:text-gray-700  hover-effect rounded  dark:hover:bg-gray-500 transition"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-hover)] text-white rounded hover-effect transition"
//             disabled={loading}
//           >
//             {loading ? <ButtonLoader /> : "Update Branch"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default EditTeamForm;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import useEmployeeStore from "src/stores/useEmployeeStore";
import { Users, User, Hash, Building } from "lucide-react";
import { useStaffFilter } from "../hooks/UseStaffFilter";

function EditTeamForm({ branch, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    team_id: "",
    team_name: "",
    team_lead: "",
    branchcode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);
  const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
  const employeeOption = useEmployeeStore((state) => state.branchEmployeeOptions);
  const permissions = useAuthStore((state) => state.permissions);
  const userRole = permissions[0].role;
  const branchCode = useBranchStore((state) => state.branchCodeOptions);
  const branchcodeForNor = useAuthStore((state) => state.branchcode);
  const branchCodeOptions =
    userRole === "superadmin"
      ? branchCode
      : [{ value: branchcodeForNor, label: branchcodeForNor }];

  useEffect(() => {
    if (branch) {
      setFormData({
        team_id: branch.team_id || "",
        team_name: branch.team_name || "",
        team_lead: branch.team_lead || "",
        branchcode: branch.branchcode || "",
      });
    }
  }, [branch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const {
    departmentOptions,
    selectedDepartment,
    staffOptions,
    isFetchingStaff,
    handleDepartmentChange,
  } = useStaffFilter(formData.branchcode);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const teamData = {
      userData: {
        team_id: formData.team_id,
        team_name: formData.team_name,
        team_lead: formData.team_lead,
        branchcode: formData.branchcode,
      },
    };

    try {
      const response = await axios.put(`${BASE_URL}/teams/edit`, teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 201) {
        onSuccess();
      } else {
        setError(response.data.message || "Failed to update team");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(`${error}, Error in update team`, {
        style: {
          border: "1px solid  rgb(185 28 28)",
          padding: "14px",
          width: "900px",
          color: " rgb(185 28 28)",
        },
        iconTheme: {
          primary: " rgb(185 28 28)",
          secondary: "#FFFAEE",
        },
      });
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <Toaster position={toastposition} />
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
            Edit Team Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Hash className="inline mr-1" size={14} /> Branch Code
              </p>
              <select
                name="branchcode"
                value={formData.branchcode}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
              >
                <option value="">Select Branch</option>
                {branchCodeOptions?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Users className="inline mr-1" size={14} /> Team Name
              </p>
              <input
                name="team_name"
                value={formData.team_name}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                type="text"
                placeholder="Team Name"
                required
              />
            </div>
      <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Building className="inline mr-1" size={14} /> Department
              </p>
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  handleDepartmentChange(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    handler_by: "",
                    handler_to: "",
                  }));
                }}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
              >
                <option value="">Select Department</option>
                {departmentOptions.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Handler By */}
            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <User className="inline mr-1" size={14} /> Select Team Lead
              </p>
              {isFetchingStaff ? (
                <div className="text-sm text-gray-500 mt-1">
                  Loading staff...
                </div>
              ) : (
                <select
                  name="team_lead"
                  value={formData.team_lead}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                  required
                  disabled={!selectedDepartment || staffOptions.length === 0}
                >
                  <option value="">Select Staff</option>
                  {staffOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {selectedDepartment &&
                staffOptions.length === 0 &&
                !isFetchingStaff && (
                  <div className="text-xs text-gray-500 mt-1">
                    No staff found in this department
                  </div>
                )}
            </div>
            {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <User className="inline mr-1" size={14} /> Team Lead
              </p>
              <select
                name="team_lead"
                value={formData.team_lead}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
              >
                {employeeOption?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <Hash className="inline mr-1" size={14} /> Branch Code
              </p>
              <select
                name="branchcode"
                value={formData.branchcode}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
              >
                {branchCodeOption?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
            disabled={loading}
          >
            {loading ? <ButtonLoader /> : "Update Team"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTeamForm;