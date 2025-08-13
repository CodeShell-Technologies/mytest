import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import { BASE_URL } from "~/constants/api";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Hash,
  Calendar,
  Droplets,
  HeartPulse,
  Lock,
  Briefcase,
  CreditCard,
  File,
  UserCheck,
} from "lucide-react";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
const departmentDesignations = {
  architecture: [
    "principal",
    "senior-Architect",
    "architect",
    "junior-Architect",
    "architect-Trainee",
    "architect-Intern",
  ],
  visualization: [
    "principal",
    "senior-Visualization",
    "visualization",
    "junior-Visualization",
    "visualization-Trainee",
    "visualization-Intern",
  ],
  structural: [
    "principal",
    "senior-Structural",
    "structural",
    "junior-Structural",
    "structural-Trainee",
    "structural-Intern",
  ],
  drafting: [
    "principal",
    "senior-Drafting",
    "drafting",
    "junior-Drafting",
    "drafting-Trainee",
    "drafting-Intern",
  ],
  hr: [
    "principal",
    "senior-HR-Executive",
    "hr-Executive",
    "junior-HR-Executive",
    "hr-Executive-Trainee",
    "hr-Executive-Intern",
  ],
  sales: [
    "principal",
    "senior-Sales-Executive",
    "sales-Executive",
    "junior-Sales-Executive",
    "sales-Executive-Trainee",
    "sales-Executive-Intern",
  ],
  consulting: [
    "principal",
    "senior-Site-Engineer",
    "site-Engineer",
    "junior-Site-Engineer",
    "site-Engineer-Trainee",
    "site-Engineer-Intern",
  ],
};

const departmentOptions = [
  "architecture",
  "visualization",
  "structural",
  "drafting",
  "hr",
  "sales",
  "consulting",
];

function EmployeeForm({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [error, setError] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    bloodGroup: "",
    mobileNo: "",
    residenceContactNo: "",
    email: "",
    presentAddress: "",
    permanentAddress: "",
    photograph: null,
    branchcode: "",
    role: "",
    password: "",
    psn: "",
    department: "",
    pannumber: "",
    aadharnumber: "",
    designation: "",
  });

  const token = useAuthStore((state) => state.accessToken);
  const permissions = useAuthStore((state) => state.permissions);
  const userRole = permissions[0].role;
  const branchCode = useBranchStore((state) => state.branchCodeOptions);
  const branchcodeForNor = useAuthStore((state) => state.branchcode);
  const branchCodeOption =
    userRole === "superadmin"
      ? branchCode
      : [{ value: branchcodeForNor, label: branchcodeForNor }];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    // When department changes, update designation options
    if (name === "department") {
      setDesignationOptions(departmentDesignations[value] || []);
      // Reset designation when department changes
      setFormData((prev) => ({ ...prev, designation: "" }));
    }
  };

  const handleBranchChange = async (e) => {
    const selectedBranch = e.target.value;
    setFormData((prev) => ({ ...prev, branchcode: selectedBranch, role: "" }));

    if (selectedBranch) {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}/branch/dropdown?branchcode=${selectedBranch}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();

        // Map the roles for the dropdown
        const roles = data.result.map((item) => ({
          value: item.role,
          label: item.role,
        }));

        setRoleOptions(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoleOptions([]);
      } finally {
        setLoading(false);
      }
    } else {
      setRoleOptions([]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const employeeData = {
        branchcode: formData.branchcode,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dob: formData.dob,
        gender: formData.gender,
        marital: formData.maritalStatus,
        bloodgroup: formData.bloodGroup,
        phonenumber: formData.mobileNo,
        alternumber: formData.residenceContactNo,
        email: formData.email,
        presentaddress: formData.presentAddress,
        permanentaddress: formData.permanentAddress,
        photograph: formData.photograph,
        role: formData.role,
        password: formData.password,
        department: formData.department,
        pannumber: formData.pannumber,
        aadharnumber: formData.aadharnumber,
        designation: formData.designation,
      };

      const response = await axios.post(
        `${BASE_URL}/users/create`,
        { profile: [employeeData] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.status === 201) {
       
        onSuccess();
      }
    } catch (error) {
      console.log("Error in employee data create", error);
      setError(error.response?.data?.message || "An error occurred");
      toast.error(error.message || "Error in Add New Employee", {
        style: {
          border: "1px solid rgb(185 28 28)",
          padding: "14px",
          width: "900px",
          color: "rgb(185 28 28)",
        },
        iconTheme: {
          primary: "rgb(185 28 28)",
          secondary: "#FFFAEE",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      {/* Personal Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <User className="inline mr-2" /> Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> First Name<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Last Name
            </p>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Calendar className="inline mr-1" size={14} /> Date of Birth<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Gender <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <HeartPulse className="inline mr-1" size={14} /> Marital Status <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Droplets className="inline mr-1" size={14} /> Blood Group <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <Phone className="inline mr-2" /> Contact Information 
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Phone className="inline mr-1" size={14} /> Mobile Number<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              type="tel"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Phone className="inline mr-1" size={14} /> Residence Contact
            </p>
            <input
              type="tel"
              name="residenceContactNo"
              value={formData.residenceContactNo}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Mail className="inline mr-1" size={14} /> Email <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
            
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Lock className="inline mr-1" size={14} /> Password<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <File className="inline mr-1" size={14} /> Photograph
            </p>
            <input
              type="file"
              name="photograph"
              onChange={handleChange}
              className="w-full text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              accept="image/*"
            />
          </div>
        </div>
      </div>

      {/* Address Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <MapPin className="inline mr-2" /> Address Information 
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Present Address
            </p>
            <textarea
              name="presentAddress"
              value={formData.presentAddress}
              onChange={handleChange}
              rows={3}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Permanent Address
            </p>
            <textarea
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              rows={3}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Employment Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <Briefcase className="inline mr-2" /> Employment Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Branch Code <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <select
              name="branchcode"
              value={formData.branchcode}
              onChange={handleBranchChange} // Use the special handler for branch
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
              disabled={loading}
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
              <UserCheck className="inline mr-1" size={14} /> User Role <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
              disabled={!formData.branchcode || loading} // Disable if no branch selected or loading
            >
              <option value="">Select Role</option>
              {roleOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Briefcase className="inline mr-1" size={14} /> Department<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
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
              <Briefcase className="inline mr-1" size={14} /> Designation<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
              disabled={!formData.department}
            >
              <option value="">Select Designation</option>
              {designationOptions.map((designation) => (
                <option key={designation} value={designation}>
                  {designation}
                </option>
              ))}
            </select>
          </div>

      
        </div>
      </div>

      {/* Identification Information Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <CreditCard className="inline mr-2" /> Identification Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              PAN Number <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              type="text"
              name="pannumber"
              value={formData.pannumber}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Aadhar Number <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              type="text"
              name="aadharnumber"
              value={formData.aadharnumber}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              required
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
        >
          {loading ? <ButtonLoader /> : "Create Employee"}
        </button>
      </div>
    </div>
  );
}

export default EmployeeForm;
