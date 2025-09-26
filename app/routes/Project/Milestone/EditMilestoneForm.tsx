// import axios from "axios";
// import {
//   Banknote,
//   CalendarCheck,
//   ClipboardList,
//   Flag,
//   Hash,
//   ListChecks,
//   Percent,
//   Tag,
//   Target,
//   User,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { AiFillProject } from "react-icons/ai";
// import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
// import { useAuthStore } from "src/stores/authStore";
// import useClientStore from "src/stores/ClientStore";
// import useLeadsStore from "src/stores/LeadsStore";
// import useProjectStore from "src/stores/ProjectStore";
// import useBranchStore from "src/stores/useBranchStore";
// import useEmployeeStore from "src/stores/useEmployeeStore";
// import { BASE_URL } from "~/constants/api";

// const EditMilestoneForm = ({milestone,onSuccess, onCancel }) => {
//   const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
//   const [loading, setLoading] = useState(false);
//   const clientcodeOptions = useClientStore((state) => state.clientscodeOptions);
//   const [error, setError] = useState(null);
//   const allProjectcodeOptions = useProjectStore(
//     (state) => state.allProjectcodeOptions
//   );
//   const employeeOption = useEmployeeStore(
//     (state) => state.branchEmployeeOptions
//   );
//   const campaignCodeOption = useLeadsStore(
//     (state) => state.campaigncodeOptions
//   );

//   const token = useAuthStore((state) => state.accessToken);
//   const [formData, setFormData] = useState({
//     branchcode: "",
//     campaign_code: "",
//     client_code: "",
//     project_code: "",
//     milestone_code: "",
//     miles_title: "",
//     milestone_type: "",
//     start_date: "",
//     end_date: "",
//     base_amount: 0,
//     additional_amount: 0,
//     revision_reason: "",
//     handler_to: "",
//     approved_staff_id: "",
//     isrevised: false,
//     status: "draft",
//   });

//   useEffect(()=>{
//     if(milestone){
//         setFormData({
//              branchcode: milestone.branchcode,
//     campaign_code: milestone.campaign_code,
//     client_code:milestone.client_code,
//     project_code: milestone.project_code,
//     milestone_code: milestone.milestone_code,
//     miles_title: milestone.miles_title,
//     milestone_type: milestone.milestone_type,
//     start_date: milestone.start_date,
//     end_date: milestone.end_date,
//     base_amount:Number(milestone.base_amount),
//     additional_amount:Number(milestone.additional_amount),
//     revision_reason:milestone.revision_reason ,
//     handler_to: milestone.handler_to,
//     approved_staff_id:milestone.approved_staff_id ,
//    isrevised: milestone.isrevised === "true",
//     status: milestone.status,
//         })
//     }
//   },[milestone])
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

//     const milestoneData = {
//       data: {
//             branchcode: formData.branchcode || '',
//     client_code:formData.client_code || '',
//     project_code: formData.project_code || '',
//     milestone_code: formData.milestone_code || '',
//     miles_title: formData.miles_title || '',
//     milestone_type: formData.milestone_type || '',
//     start_date: formData.start_date || '',
//     end_date: formData.end_date || '',
//     base_amount:Number(formData.base_amount) || '',
//     additional_amount:Number(formData.additional_amount) || '',
//     revision_reason:formData.revision_reason  || '',
//     handler_to: formData.handler_to || '',
//     approved_staff_id:formData.approved_staff_id || '' ,
//    isrevised: formData.isrevised ,
//     status: formData.status,
//       },
//     };
//     console.log("formdataaa>>>", formData);
//     try {
//       const response = await axios.put(
//         `${BASE_URL}/project/milestone/edit`,
//         milestoneData,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (response.status === 201) {
//         toast.success("Milestone Updated successfully!");
//         onSuccess();
//       } else {
//         setError(response.data.message || "Failed to update milestone");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "An error occurred");
//       toast.error(error || "Error updating milestone");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
//       {/* Milestone Basic Details Section */}
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
//           <Flag className="inline mr-2" /> Milestone Information
//         </h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <ClipboardList className="inline mr-1" size={14} /> Milestone Code
//               Milestone Code
//             </p>
//             <input
//               name="milestone_code"
//               value={formData.milestone_code}
//               onChange={handleChange}
//               type="text"
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               placeholder="Enter milestone code"
//               readOnly
//             />
//           </div>
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <ClipboardList className="inline mr-1" size={14} /> Milestone
//               Title
//             </p>
//             <input
//               name="miles_title"
//               value={formData.miles_title}
//               onChange={handleChange}
//               type="text"
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               placeholder="Enter milestone name"
//             />
//           </div>
// {/* 
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <Hash className="inline mr-1" size={14} /> Branch Code
//             </p>
//             <select
//               name="branchcode"
//               value={formData.branchcode}
//               onChange={handleChange}
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              
//             >
//               <option value="">Select Branch</option>
//               {branchCodeOption?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <Hash className="inline mr-1" size={14} /> Campaign Code
//             </p>
//             <select
//               name="campaign_code"
//               value={formData.campaign_code}
//               onChange={handleChange}
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               required
//             >
//               <option value="">Select Branch</option>
//               {campaignCodeOption?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div> */}

//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <Hash className="inline mr-1" size={14} /> Related Project
//             </p>
//             <select
//               name="project_code"
//               value={formData.project_code}
//               onChange={handleChange}
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               required
//             >
//               <option value="">Select Project</option>
//               {allProjectcodeOptions?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <Hash className="inline mr-1" size={14} /> Select Client
//             </p>
//             <select
//               name="client_code"
//               value={formData.client_code}
//               onChange={handleChange}
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               required
//             >
//               <option value="">Select Client</option>
//               {clientcodeOptions?.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <Tag className="inline mr-1" size={14} /> Milestone Type
//             </p>
//             <select
//               name="milestone_type"
//               value={formData.milestone_type}
//               onChange={handleChange}
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               required
//             >
//               <option value="">Select type</option>
//               <option value="initial">Initial</option>
//               <option value="revision">Revision</option>
//               <option value="feature_add">Feature Add</option>
//               <option value="bug_fix">Changes Fix</option>
//               <option value="feature_remove">Feature Remove</option>
//             </select>
//           </div>
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <CalendarCheck className="inline mr-1" size={14} /> Start Date
//             </p>
//             <input
//               name="start_date"
//               value={formData.start_date}
//               onChange={handleChange}
//               type="date"
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//             />
//           </div>
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <CalendarCheck className="inline mr-1" size={14} /> Due Date
//             </p>
//             <input
//               name="end_date"
//               value={formData.end_date}
//               onChange={handleChange}
//               type="date"
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//             />
//           </div>
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <Banknote className="inline mr-1" size={14} /> Milestone Base
//               Amount
//             </p>
//             <input
//               name="base_amount"
//               value={formData.base_amount}
//               onChange={handleChange}
//               type="number"
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               placeholder="Enter amount"
//             />
//           </div>
//           <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//               <Percent className="inline mr-1" size={14} /> Addtional Amount
//             </p>
//             <input
//               name="additional_amount"
//               value={formData.additional_amount}
//               onChange={handleChange}
//               type="number"
//               className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//               placeholder="Enter Addtional Amount"
//             />
//           </div>
//         </div>
//         <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//             <User className="inline mr-1" size={14} /> Assigned To
//           </p>
//           <select
//             name="handler_to"
//             value={formData.handler_to}
//             onChange={handleChange}
//             className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//             required
//           >
//             {employeeOption?.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//             <User className="inline mr-1" size={14} /> Assigned To
//           </p>
//           <select
//             name="approved_staff_id"
//             value={formData.approved_staff_id}
//             onChange={handleChange}
//             className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//             required
//           >
//             {employeeOption?.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//             <Tag className="inline mr-1" size={14} /> Status
//           </p>
//           <select
//             name="status"
//             value={formData.status}
//             onChange={handleChange}
//             className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//             required
//           >
//             <option value="active">Active</option>
//             <option value="drop">Drop</option>
//             <option value="draft">Draft</option>
//             <option value="paused">Paused</option>
//             <option value="completed">Completed</option>
//             <option value="archived">Archived</option>
//           </select>
//         </div>
//         <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
//             <Tag className="inline mr-1" size={14} /> Revised Status
//           </p>
//           <select
//             name="isrevised"
//             value={formData.isrevised}
//             onChange={handleChange}
//             className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
//             required
//           >
//             <option value="true">Is Revised</option>
//             <option value="false">Not Revised</option>
//           </select>
//         </div>
//       </div>
//       <div className="space-y-4">
//         <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
//           <ListChecks className="inline mr-2" /> Reason
//         </h3>
//         <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
//             <Target className="inline mr-1" size={14} /> Revision Reason
//           </p>
//           <textarea
//             name="revision_reason"
//             value={formData.revision_reason}
//             onChange={handleChange}
//             className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px]"
//             placeholder="List the key deliverables for this milestone..."
//           />
//         </div>
//       </div>

//       {/* Dependencies Section */}
//       {/* <div className="space-y-4">
//         <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
//           <Hash className="inline mr-2" /> Dependencies
//         </h3>
//         <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
//           <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
//             Prerequisites
//           </p>
//           <textarea
//             className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[60px]"
//             placeholder="What needs to be completed before this milestone can start?"
//           />
//         </div>
//       </div> */}

//       <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//         <button
//           type="button"
//           className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
//           onClick={onCancel}
//         >
//           Cancel
//         </button>
//         <button
//           type="submit"
//           onClick={handleSubmit}
//           className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
//         >
//           {loading ? <ButtonLoader /> : "Create Milestone"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default EditMilestoneForm;
import axios from "axios";
import {
  Banknote,
  CalendarCheck,
  ClipboardList,
  Flag,
  Hash,
  ListChecks,
  Percent,
  Tag,
  Target,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillProject } from "react-icons/ai";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useClientStore from "src/stores/ClientStore";
import useLeadsStore from "src/stores/LeadsStore";
import useProjectStore from "src/stores/ProjectStore";
import useBranchStore from "src/stores/useBranchStore";
import useEmployeeStore from "src/stores/useEmployeeStore";
import { BASE_URL } from "~/constants/api";
import {formatDate} from "../../../../src/utils/dateUtils"

import AsyncSelect from "react-select/async";

const EditMilestoneForm = ({project,milestone, onSuccess, onCancel }) => {
  console.log("projecttttdataaa",project)
  const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
  const [loading, setLoading] = useState(false);
  const clientcodeOptions = useClientStore((state) => state.clientscodeOptions);
  const [error, setError] = useState(null);
  
  const staff_ids = useAuthStore((state) => state.staff_id);
  const [department, setDepartment] = useState<string | null>(null);
  const [staffOptions, setStaffOptions] = useState<any[]>([]);
  const [isFetchingStaff, setIsFetchingStaff] = useState(false);
  const [employeeOptions, setEmployeeOptions] = useState<{ value: string; label: string }[]>([]);


  const allProjectcodeOptions = useProjectStore(
    (state) => state.allProjectcodeOptions
  );
  const employeeOption = useEmployeeStore(
    (state) => state.branchEmployeeOptions
  );
  const campaignCodeOption = useLeadsStore(
    (state) => state.campaigncodeOptions
  );

  const token = useAuthStore((state) => state.accessToken);
  const [formData, setFormData] = useState({
    branchcode: "",

    project_code: "",
    milestone_code: "",
    miles_title: "",
    milestone_type: "",
    start_date: "",
    end_date: "",
    base_amount: 0,
    additional_amount: 0,
    revision_reason: "",
    handler_by: "",
    approved_staff_id: "",
    isrevised: false,
    status: "draft",
  });

  useEffect(() => {
    if(milestone) {
      // Format dates for the input fields (YYYY-MM-DD)
      const formattedStartDate = milestone.start_date ? milestone.start_date.split('T')[0] : '';
      const formattedEndDate = milestone.end_date ? milestone.end_date.split('T')[0] : '';
      
      setFormData({
        branchcode: milestone.branchcode || '',
        project_code: milestone.project_code || '',
        milestone_code: milestone.milestone_code || '',
        miles_title: milestone.miles_title || '',
        milestone_type: milestone.milestone_type || '',
        start_date: formattedStartDate,
        end_date: formattedEndDate,
        base_amount: Number(milestone.base_amount) || 0,
        additional_amount: Number(milestone.additional_amount) || 0,
        revision_reason: milestone.revision_reason || '',
        handler_by: milestone.handler_by || '',
        approved_staff_id: milestone.approved_staff_id || '',
        isrevised: milestone.isrevised === true || milestone.isrevised === "true",
        status: milestone.status || 'draft',
      });
    }
  }, [milestone]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const milestoneData = {
      data: {
        branchcode: formData.branchcode,
        project_code: formData.project_code,
        milestone_code: formData.milestone_code,
        miles_title: formData.miles_title,
        milestone_type: formData.milestone_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        base_amount: Number(formData.base_amount),
        additional_amount: Number(formData.additional_amount),
        revision_reason: formData.revision_reason,
        handler_by: formData.handler_by,
        approved_staff_id: formData.approved_staff_id,
        isrevised: formData.isrevised,
        status: formData.status,
      },
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/project/milestone/edit`,
        milestoneData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        onSuccess();
      } else {
      	alert ("Failed to update. Please verfify the milestone & project status! if it fine please check whether you have enough permission to edit.");
        setError(response.data.message || "Failed to update milestone");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
            	alert ("Failed to update. Please verfify the milestone & project status! if it fine please check whether you have enough permission to edit.");
      toast.error(error || "Error updating milestone");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (!formData.branchcode) {
      setEmployeeOptions([]);
      return;
    }

    async function fetchEmployees() {
      try {
        const res = await fetch(
          `${BASE_URL}/getStaffbranch?branchcode=${encodeURIComponent(formData.branchcode)}`
        );
        const data = await res.json();

        if (data?.status && Array.isArray(data.data)) {
          const options = data.data.map((emp: Employee) => ({
            value: emp.staff_id,
            label: `${emp.firstname} ${emp.lastname} (${emp.designation})`,
          }));
          setEmployeeOptions(options);
        } else {
          setEmployeeOptions([]);
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setEmployeeOptions([]);
      }
    }

    fetchEmployees();
  }, [formData.branchcode]); // 🔑 re-fetch whenever branch changes


const loadStaffs = (inputValue: string, callback: (options: Option[]) => void) => {
    const filtered = employeeOptions.filter((c) =>
      c.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };






  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      {/* Milestone Basic Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <Flag className="inline mr-2" /> Milestone Information
        </h3>
         <h2 className="text-md font-medium text-red-700 dark:text-gray-300 mt-2 text-center ">
              <span className="text-gray-600 mr-4"> Project Duration: </span>{formatDate(project.start_date)} - {formatDate(project.end_date)}
                </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Milestone Code
            </p>
            <input
              name="milestone_code"
              value={formData.milestone_code}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter milestone code"
              readOnly
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Milestone Title
            </p>
            <input
              name="miles_title"
              value={formData.miles_title}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter milestone name"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Related Project
            </p>
            <input
              name="project_code"
              value={formData.project_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              readOnly
            />
              {/* <option value="">Select Project</option>
              {allProjectcodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))} */}
            
          </div>
          {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Select Client
            </p>
            <select
              name="client_code"
              value={formData.client_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Client</option>
              {clientcodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div> */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Milestone Type
            </p>
            <select
              name="milestone_type"
              value={formData.milestone_type}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
                <option value="">Select type</option>
              <option value="initial">Initial</option>
              <option value="revision-minor">Minor Revision</option>
                <option value="revision-major">Major Revision</option>
              <option value="feature_add">Feature Add</option>
              <option value="bug_fix">Changes Fix</option>
            </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> Start Date
            </p>
            <input
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> Due Date
            </p>
            <input
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Banknote className="inline mr-1" size={14} /> Milestone Base Amount
            </p>
            <input
              name="base_amount"
              value={formData.base_amount}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter amount"
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Percent className="inline mr-1" size={14} /> Additional Amount
            </p>
            <input
              name="additional_amount"
              value={formData.additional_amount}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Additional Amount"
            />
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <User className="inline mr-1" size={14} /> Assigned To
          </p>
{/*          <select
            name="handler_by"
            value={formData.handler_by}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            required
          >
            {employeeOption?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>*/}

{/*          	<select
      name="handler_by"
      value={formData.handler_by }
      onChange={handleChange}
      className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
      required
    >
      <option value={formData.handler_by } >
        {formData.handler_by }
      </option>
      {employeeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>*/}


          <AsyncSelect
          cacheOptions
          defaultOptions={employeeOptions}
          name="handler_by"
          loadOptions={loadStaffs}
          onChange={(selected: Option | null) =>
            setFormData({ ...formData, handler_by: selected ? selected.value : "" })
          }
          value={employeeOptions.find((opt) => opt.value === formData.handler_by) || null}
          isDisabled={employeeOptions.length === 0}
          placeholder="Select or search handler by"
        />


        </div>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <User className="inline mr-1" size={14} /> Select Approved Staff
          </p>
          {/*<select
            name="approved_staff_id"
            value={formData.approved_staff_id}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            required
          >
            {employeeOption?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>*/}


{/*          	<select
      name="approved_staff_id"
      value={formData.approved_staff_id }
      onChange={handleChange}
      className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
      required
    >
      <option value={formData.approved_staff_id }>
        {formData.approved_staff_id }
      </option>
      {employeeOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
*/}


             <AsyncSelect
          cacheOptions
          defaultOptions={employeeOptions}
          name="approved_staff_id"
          loadOptions={loadStaffs}
          onChange={(selected: Option | null) =>
            setFormData({ ...formData, approved_staff_id: selected ? selected.value : "" })
          }
          value={employeeOptions.find((opt) => opt.value === formData.approved_staff_id) || null}
          isDisabled={employeeOptions.length === 0}
          placeholder="Select or search client"
        />
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <Tag className="inline mr-1" size={14} /> Status
          </p>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            required
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="inprocess">In Progress</option>
            <option value="verified">Verified</option>
            <option value="archived">Archived</option>
            <option value="drop">Drop</option>
          </select>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <Tag className="inline mr-1" size={14} /> Revised Status
          </p>
          <select
            name="isrevised"
            value={formData.isrevised ? "true" : "false"}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              isrevised: e.target.value === "true"
            }))}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            required
          >
            <option value="true">Is Revised</option>
            <option value="false">Not Revised</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <ListChecks className="inline mr-2" /> Reason
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            <Target className="inline mr-1" size={14} /> Revision Reason
          </p>
          <textarea
            name="revision_reason"
            value={formData.revision_reason}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px]"
            placeholder="List the key deliverables for this milestone..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
        >
          {loading ? <ButtonLoader /> : "Update Milestone"}
        </button>
      </div>
    </div>
  );
};

export default EditMilestoneForm;