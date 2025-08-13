import axios from "axios";
import {
  CalendarCheck,
  User,
  Phone,
  Mail,
  BookUser,
  Tag,
  BookOpenText,
  CalendarClock,
  Hash,
  IndianRupee,
  Map,
  Network,
  Briefcase,
  Tent,
  Building,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useClientStore from "src/stores/ClientStore";
import useLeadsStore from "src/stores/LeadsStore";
import useBranchStore from "src/stores/useBranchStore";
import useEmployeeStore from "src/stores/useEmployeeStore";
import { BASE_URL, toastposition } from "~/constants/api";
import { useStaffFilter } from "~/routes/hooks/UseStaffFilter";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const EditProjectForm = ({ project,onSuccess, onCancel }) => {
  console.log("projectdataaa",project)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useAuthStore((state) => state.accessToken);
  const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
  const campaignCodeOption = useLeadsStore(
    (state) => state.campaigncodeOptions
  );

  const [selectedDepartments, setSelectedDepartments] = useState('');



  const employeeOption = useEmployeeStore(
    (state) => state.branchEmployeeOptions
  );
  const { fetchClients, isStoreLoading } = useClientStore();

  const clientcodeOptions = useClientStore((state) => state.clientscodeOptions);
  console.log("clientcodefor project", clientcodeOptions);
  useEffect(() => {
    fetchClients(token);
  }, []);
  const [formData, setFormData] = useState({
    branchcode: "",
    campaign_code: "",
    client_code: "",
    title: "",
    priority: "",
    type: "",
    loc: "",
    budget: 0,
    overallcost: 0,
    start_date: "",
    end_date: "",
    handler_by: "",
    handler_to: "",
    notes: "",
    status: "draft",
  });
 useEffect(() => {
    if (project) {
      setFormData({
       branchcode:project .branchcode  || "",
          campaign_code: project.campaign_code || "",
          client_code: project.client_code || "",
          title: project.title || "",
          priority: project.priority || "",
          type: project.type || "",
          loc: project.loc || "",
          budget: project.budget || "",
          overallcost: project.overallcost || "",
          start_date: project.start_date || "",
          end_date: project.end_date || "",
          handler_by: project.handler_by || "",
          handler_to: project.handler_to || "",
          notes: project.notes || "",
          status: project.status || "",
      });
    }
  }, [project]);
   const {
      departmentOptions,
      selectedDepartment,

      staffOptions,
      isFetchingStaff,
      handleDepartmentChange,
    } = useStaffFilter(formData.branchcode);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

useEffect(() => {
  if (formData.handler_by) {
    const encodedId = encodeURIComponent(formData.handler_by); // Handles 02/01 as 02%2F01
    fetch(`http://localhost:3000/api/get-staff-department/${encodedId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.department) {
          setSelectedDepartments(data.department); // update only, no re-declare
        }
      });
  }
}, [formData.handler_by]);




  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const ProjectData = {
      data: 
        {
          branchcode: formData.branchcode,
          campaign_code: formData.campaign_code,
          project_code:project.project_code,
          client_code: formData.client_code,
          title: formData.title,
          priority: formData.priority,
          type: formData.type,
          loc: formData.loc,
          budget: formData.budget,
          overallcost: formData.overallcost,
          start_date: formData.start_date,
          end_date: formData.end_date,
          handler_by: formData.handler_by,
          handler_to: formData.handler_to,
          notes: formData.notes,
          status: formData.status,

        },
      
    };

    try {
      const response = await axios.put(
        `${BASE_URL}/project/overview/edit`,
        ProjectData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        toast.success("Project Updated successfully!");
        onSuccess();
      } else {
        setError(response.data.message || "Failed to update Project");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(error || "Error updating project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      <Toaster position={toastposition} />

      {/* Lead Basic Details Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookUser className="inline mr-2" /> Project Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lead Name */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Branch Code
            </p>
            <select
              name="branchcode"
              value={formData.branchcode}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
           
            >
              <option value="">Select Branch</option>
              {branchCodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tent className="inline mr-1" size={14} /> Camapign Code
            </p>
            <input
              name="campaign_code"
              value={formData.campaign_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
           readOnly
            />
              {/* <option value="">Select Camapign</option>
              {campaignCodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select> */}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Briefcase className="inline mr-1" size={14} /> Client Code
            </p>
            <input
              name="client_code"
              value={formData.client_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              readOnly
            />
              {/* <option value="">Select Client</option>
              {clientcodeOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select> */}
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Network className="inline mr-1" size={14} /> Project Name
            </p>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Project Name"
              required
            />
          </div>

          {/* Phone */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Map className="inline mr-1" size={14} /> Location
            </p>
            <input
              name="loc"
              value={formData.loc}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Location"
              required
            />
          </div>

          {/* Email */}

          {/* Lead Date */}






    <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> Start Date
            </p>
{/*            <input
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />*/}

             <DatePicker
  selected={formData.start_date ? new Date(formData.start_date) : null}
  onChange={(date) =>
    setFormData({ ...formData, start_date: date.toISOString().slice(0, 10) })
  }
  className="w-full bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none rounded-md px-2 py-1"
/>
          </div>





          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> End Date
            </p>
            {/*<input
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />*/}

           <DatePicker
  selected={formData.end_date ? new Date(formData.end_date) : null}
  onChange={(date) =>
    setFormData({ ...formData, end_date: date.toISOString().slice(0, 10) })
  }
  className="w-full bg-white dark:bg-gray-800 text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none rounded-md px-2 py-1"
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
                setFormData(prev => ({
                  ...prev,
                  handler_by: "",
                  handler_to: ""
                }));
              }}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">{selectedDepartments || 'N/A'}</option>
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
              <User className="inline mr-1" size={14} /> Handler By
            </p>
            {isFetchingStaff ? (
              <div className="text-sm text-gray-500 mt-1">Loading staff...</div>
            ) : (
              <select
                name="handler_by"
                value={formData.handler_by}
                onChange={handleChange}
                className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                required
                disabled={!selectedDepartment || staffOptions.length === 0}
              >
                <option value={formData.handler_by}>{formData.handler_by}</option>
                {staffOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {selectedDepartment && staffOptions.length === 0 && !isFetchingStaff && (
              <div className="text-xs text-gray-500 mt-1">No staff found in this department</div>
            )}
          </div>

          
          {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Handler By
            </p>
            <select
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
            </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Handler To
            </p>
            <select
              name="handler_to"
              value={formData.handler_to}
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
          </div> */}
          {/* Communication Type */}
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} />
              Priority
            </p>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
               <option value="">Select priority</option>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
              <option value="blocker">Blocker</option>
            </select>
          </div>

          {/* Project Type */}
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Payment Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <IndianRupee className="inline mr-1" size={14} /> Budget
            </p>
            <input
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Budget"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <IndianRupee className="inline mr-1" size={14} /> Overall cost
            </p>
            <input
              name="overallcost"
              value={formData.overallcost}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Overallcost"
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          Project & Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Project Type
            </p>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Status */}
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
                <option value="draft">Draft</option>
              <option value="planning">Planning</option>
              <option value="inprocess">In Progress</option>
              <option value="active">Active</option>
              <option value="lead_review">Lead Review</option>
              <option value="completed">Completed</option>
              <option value="revised">Revised</option>
              <option value="client_review">Client_review</option>
              <option value="drop">Drop</option>
            </select>
          </div>
        </div>
      </div>
      {/* Description Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookOpenText className="inline mr-2" /> Notes & Summary
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px]"
            placeholder="Enter lead summary and notes..."
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
          {loading ? <ButtonLoader /> : "Save Project"}
        </button>
      </div>
    </div>
  );
};

export default EditProjectForm;
