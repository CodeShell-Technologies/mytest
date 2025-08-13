import axios from "axios";
import {
  Banknote,
  Building,
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
import { useState } from "react";
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
import { useStaffFilter } from "~/routes/hooks/UseStaffFilter";
import {formatDate} from "../../../../src/utils/dateUtils"
const AddMilestone = ({ project,onSuccess, onCancel }) => {
  console.log("projectdataaaa>>>>>",project)
  const [loading, setLoading] = useState(false);
  const clientcodeOptions = useClientStore((state) => state.clientscodeOptions);
  const [error, setError] = useState(null);
  const allProjectcodeOptions = useProjectStore(
    (state) => state.allProjectcodeOptions
  );
   const permissions = useAuthStore((state) => state.permissions);
  const userRole = permissions[0].role;
  const branchCode = useBranchStore((state) => state.branchCodeOptions);
  const branchcodeForNor = useAuthStore((state) => state.branchcode);
    const {
      departmentOptions,
      selectedDepartment,
      staffOptions,
      isFetchingStaff,
      handleDepartmentChange,
    } = useStaffFilter(project.branchcode);
  const branchCodeOptions =
    userRole === "superadmin"
      ? branchCode
      : [{ value: branchcodeForNor, label: branchcodeForNor }];

  const employeeOption = useEmployeeStore(
    (state) => state.branchEmployeeOptions
  );
  const campaignCodeOption = useLeadsStore(
    (state) => state.campaigncodeOptions
  );

  const token = useAuthStore((state) => state.accessToken);
  const [formData, setFormData] = useState({
    branchcode: "",

    // project_code: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const milestoneData = {
      data: [
        {
          branchcode: project.branchcode,
          project_code: project.project_code,
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
          isrevised: formData.isrevised === "true",
          status: formData.status,
        },
      ],
    };
    console.log("formdataaa>>>", formData);
    try {
      const response = await axios.post(
        `${BASE_URL}/project/milestone/create`,
        milestoneData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        onSuccess();
      } else {
        setError(response.data.message || "Failed to create lead");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      toast.error(error || "Error creating lead");
    } finally {
      setLoading(false);
    }
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
              Milestone Code
            </p>
            <input
              name="milestone_code"
              value={formData.milestone_code}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter milestone code"
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <ClipboardList className="inline mr-1" size={14} /> Milestone
              Title
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

          {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
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
              {branchCodeOption?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div> */}

          {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Related Project
            </p>
            <select
              name="project_code"
              value={formData.project_code}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Project</option>
              {allProjectcodeOptions?.map((option) => (
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
          {/* <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Banknote className="inline mr-1" size={14} /> Milestone Base
              Amount
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
              <Percent className="inline mr-1" size={14} /> Addtional Amount
            </p>
            <input
              name="additional_amount"
              value={formData.additional_amount}
              onChange={handleChange}
              type="number"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter Addtional Amount"
            />
          </div> */}
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
               <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <User className="inline mr-1" size={14} /> Select Handler By
              </p>
              {isFetchingStaff ? (
                <div className="text-sm text-gray-500 mt-1">
                  Loading staff...
                </div>
              ) : (
                <select
                  name="handler_by"
                  value={formData.handler_by}
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
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                <User className="inline mr-1" size={14} /> Select Approved Staff Id
              </p>
              {isFetchingStaff ? (
                <div className="text-sm text-gray-500 mt-1">
                  Loading staff...
                </div>
              ) : (
                <select
                  name="approved_staff_id"
                  value={formData.approved_staff_id}
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
            <User className="inline mr-1" size={14} /> Approved Staff Id
          </p>
          <select
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
          </select>
        </div> */}
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
            value={formData.isrevised}
            onChange={handleChange}
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

      {/* Dependencies Section */}
      {/* <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <Hash className="inline mr-2" /> Dependencies
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Prerequisites
          </p>
          <textarea
            className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none min-h-[60px]"
            placeholder="What needs to be completed before this milestone can start?"
          />
        </div>
      </div> */}

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
          {loading ? <ButtonLoader /> : "Create Milestone"}
        </button>
      </div>
    </div>
  );
};

export default AddMilestone;
