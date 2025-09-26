
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
  Building,
} from "lucide-react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useLeadsStore from "src/stores/LeadsStore";
import useBranchStore from "src/stores/useBranchStore";
import useEmployeeStore from "src/stores/useEmployeeStore";
import { BASE_URL, toastposition } from "~/constants/api";
import { useStaffFilter } from "../../routes/hooks/UseStaffFilter";

import AsyncSelect from "react-select/async";


const AddNewLeadForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [isFetchingCampaigns, setIsFetchingCampaigns] = useState(false);


  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [departmentDesignations, setDepartmentDesignations] = useState<
    Record<string, string[]>
  >({});
  const [designationOptions, setDesignationOptions] = useState<string[]>([]);




  const token = useAuthStore((state) => state.accessToken);
  const permissions = useAuthStore((state) => state.permissions);
  const userRole = permissions[0].role;
  const branchCode = useBranchStore((state) => state.branchCodeOptions);
  const branchcodeForNor = useAuthStore((state) => state.branchcode);

  const [staffOptions, setStaffOptions] = useState<{ value: string; label: string }[]>([]);
  const [isFetchingStaff, setIsFetchingStaff] = useState(false);


  const branchCodeOption =
    userRole === "superadmin"
      ? branchCode
      : [{ value: branchcodeForNor, label: branchcodeForNor }];
  const employeeOption = useEmployeeStore(
    (state) => state.branchEmployeeOptions
  );
  const [formData, setFormData] = useState({
    branchcode: userRole === "superadmin" ? "" : branchcodeForNor,
    campaign_code: "",
    lead_date: new Date().toISOString().split("T")[0],
    lead_name: "",
    phone: "",
    email: "",
    assignee_id: "",
    comm_type: "",
    proj_type: "",
    status: "active",
    summary: "",
  });
  const {
    // departmentOptions,
    selectedDepartment,
    // staffOptions,
    // isFetchingStaff,
    handleDepartmentChange,
  } = useStaffFilter( formData.branchcode);
  useEffect(() => {
    if (formData.branchcode) {
      fetchCampaignOptions(formData.branchcode);
    } else {
      setCampaignOptions([]);
    }
  }, [formData.branchcode]);

  const fetchCampaignOptions = async (branchcode) => {
    setIsFetchingCampaigns(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/campaign/overview/dropdown?branchcode=${branchcode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data && response.data.data) {
        const options = response.data.data.map((campaign) => ({
          value: campaign.campaign_code, 
          label: campaign.campaignname, 
        }));
        setCampaignOptions(options);
      } else {
        setCampaignOptions([]);
      }
    } catch (err) {
      toast.error("Failed to fetch campaign options", {
        style: {
          border: "1px solid rgb(185 28 28)",
          padding: "14px",
          color: "rgb(185 28 28)",
        },
        iconTheme: {
          primary: "rgb(185 28 28)",
          secondary: "#FFFAEE",
        },
      });
      setCampaignOptions([]);
    } finally {
      setIsFetchingCampaigns(false);
    }
  };

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

    // const leadData = {
    //   data: [formData],
    // };

     const leadData = {
    data: [
      {
        ...formData,
        comm_type:
          formData.comm_type === "other" ? formData.customType : formData.comm_type,
          proj_type:
            formData.proj_type === "other" ? formData.customTypep : formData.proj_type,
      },
    ],
  };

    try {
      const response = await axios.post(
        `${BASE_URL}/campaign/leads/create`,
        leadData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        onSuccess();
      } else {
        alert ("Failed to create lead. Please retry after verify the given lead details!");
        setError(response.data.message || "Failed to create lead");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      alert ("Failed to create lead. Please retry after verify the given lead details!");
      toast.error(error || "Error creating lead");
    } finally {
      setLoading(false);
    }
  };

  //       useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [deptRes, desigRes] = await Promise.all([
  //         fetch("http://localhost:3000/api/getDepartments?branch_code="),
  //         fetch("http://localhost:3000/api/getDesignations"),
  //       ]);

  //       const deptData = await deptRes.json();
  //       const desigData = await desigRes.json();

  //       // set full dept list
  //       setDepartments(deptData.data);

  //       // Department options (names only)
  //       const deptNames = deptData.data.map((d: Department) => d.name).filter(Boolean);
  //       setDepartmentOptions(deptNames);

  //       // Build mapping { departmentName: [designation1, designation2] }
  //       const deptDesigs: Record<string, string[]> = {};
  //       desigData.data.forEach((item: Designation) => {
  //         const dept = item.department;
  //         if (!deptDesigs[dept]) {
  //           deptDesigs[dept] = [];
  //         }
  //         deptDesigs[dept].push(item.designation);
  //       });
  //       setDepartmentDesignations(deptDesigs);
  //     } catch (err) {
  //       console.error("Error fetching data", err);
  //     }
  //   }

  //   fetchData();
  // }, [formData.branchcode]);

useEffect(() => {
  async function fetchData() {
    try {
      if (!formData.branchcode) return; // ✅ prevent empty requests

      const [deptRes, desigRes] = await Promise.all([
        fetch(
          `${BASE_URL}/getDepartments?branch_code=${encodeURIComponent(
            formData.branchcode
          )}`
        ),
        fetch(`${BASE_URL}/getDesignations`),
      ]);

      const deptData = await deptRes.json();
      const desigData = await desigRes.json();

      // set full dept list
      setDepartments(deptData.data);

      // ✅ Department options converted to {value, label}
      const deptNames = deptData.data
        .map((d: Department) => d.name)
        .filter(Boolean)
        .map((name: string) => ({ value: name, label: name }));

      setDepartmentOptions(deptNames);

      // Build mapping { departmentName: [{value, label}, {value, label}] }
      const deptDesigs: Record<string, { value: string; label: string }[]> = {};
      desigData.data.forEach((item: Designation) => {
        const dept = item.department;
        if (!deptDesigs[dept]) {
          deptDesigs[dept] = [];
        }
        deptDesigs[dept].push({
          value: item.designation,
          label: item.designation,
        });
      });
      setDepartmentDesignations(deptDesigs);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  }

  fetchData();
}, [formData.branchcode]);


  // ✅ Update designation options when department changes
  useEffect(() => {
    if (formData.department) {
      setDesignationOptions(departmentDesignations[formData.department] || []);
    } else {
      setDesignationOptions([]);
    }
  }, [formData.department, departmentDesignations]);


useEffect(() => {
  async function fetchStaff() {
    if (!formData.department) {
      setStaffOptions([]);
      return;
    }

    setIsFetchingStaff(true);
    try {
      const res = await fetch(`${BASE_URL}/getStaff?department=${encodeURIComponent(formData.department)}`);
      const data = await res.json();

      if (data?.status && Array.isArray(data.data)) {
        const options = data.data.map((staff: any) => ({
          value: staff.staff_id,  // unique id (e.g. "BRCODE_01/02")
          label: `${staff.firstname} ${staff.lastname} (${staff.staff_id})`, // display name
        }));
        setStaffOptions(options);
      } else {
        setStaffOptions([]);
      }
    } catch (err) {
      console.error("Error fetching staff:", err);
      setStaffOptions([]);
    } finally {
      setIsFetchingStaff(false);
    }
  }

  fetchStaff();
}, [formData.department]);

        const [types, setTypes] = useState<string[]>([]);
                const [commtypes, setCommtypes] = useState<string[]>([]);

//  useEffect(() => {
//   const fetchTypes = async () => {
//     try {
//       const res = await fetch(`${BASE_URL}/project/overview/dropdown/type`, {
//         headers: {
//           Authorization: `Bearer ${token}`, // optional if API requires auth
//         },
//       });
//       const json = await res.json();

//       if (json?.data) {
//         // Extract unique types
//         const extracted = Array.from(
//           new Set(json.data.map((item: any) => item.type))
//         );
//         setTypes(extracted);
//       } else {
//         setTypes([]);
//       }
//     } catch (error) {
//       console.error("Failed to load property types:", error);
//     }
//   };

//   fetchTypes();
// }, [token]);



useEffect(() => {
  const fetchCommTypes = async () => {
    try {
      const res = await fetch(`${BASE_URL}/getcommtype`, {
        headers: {
          Authorization: `Bearer ${token}`, // only if required
        },
      });
      const json = await res.json();

      if (json?.comm_types) {
        // directly set since backend already returns unique list
        setCommtypes(json.comm_types);
        setTypes(json.proj_types);
      } else {
        setCommtypes([]);
        setTypes([]);
      }
    } catch (error) {
      console.error("Failed to load comm types:", error);
    }
  };

  fetchCommTypes();
}, [token]);














        const loadBranches = (inputValue: string, callback: (options: Option[]) => void) => {
    const filtered = branchCodeOption.filter((c) =>
      c.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };

        const loadCamps = (inputValue: string, callback: (options: Option[]) => void) => {
  const filtered = campaignOptions.filter((c) =>
    c.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  callback(filtered);
};

      const loadDeps = (inputValue: string, callback: (options: Option[]) => void) => {
  const filtered = departmentOptions.filter((c) =>
    c.label.toLowerCase().includes(inputValue.toLowerCase())
  );
  callback(filtered);
};


     const loadStaffs = (inputValue: string, callback: (options: Option[]) => void) => {
    const filtered = staffOptions.filter((c) =>
      c.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  };








  return (
    <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
      <Toaster position={toastposition} />
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookUser className="inline mr-2" /> Lead Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Branch Code <span className="text-red-700 text-lg m-2">*</span>
            </p>
            {/*<select
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
            </select>*/}


<AsyncSelect
  cacheOptions
  defaultOptions={branchCodeOption}
  name="branchcode"
  loadOptions={loadBranches}
  value={
    branchCodeOption.find((opt) => opt.value === formData.branchcode) || null
  }
  onChange={(selected: Option | null) => {
    setFormData((prev) => ({
      ...prev,
      branchcode: selected ? selected.value : "",
    }));
  }}
  placeholder="Select or search branch"
/>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Hash className="inline mr-1" size={14} /> Campaign Code 
            </p>
            {isFetchingCampaigns ? (
              <div className="text-sm text-gray-500 mt-1">
                Loading campaigns...
              </div>
            ) : (
              // <select
              //   name="campaign_code"
              //   value={formData.campaign_code}
              //   onChange={handleChange}
              //   className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              //   required
              //   disabled={!formData.branchcode || campaignOptions.length === 0}
              // >
              //   <option value="">Select Campaign</option>
              //   {campaignOptions.map((option) => (
              //     <option key={option.value} value={option.value}>
              //       {option.label}
              //     </option>
              //   ))}
              // </select>


                     <AsyncSelect
  cacheOptions
  defaultOptions={campaignOptions} // must be [{ value, label }]
  name="campaign_code"
  loadOptions={loadCamps}
  onChange={(selected: Option | null) => {
    setFormData((prev) => ({
      ...prev,
      campaign_code: selected ? selected.value : "",
    }));
  }}
  value={
    campaignOptions.find((opt) => opt.value === formData.campaign_code) || null
  }
  placeholder="Select or search campaigns"
/>



            )}
            {formData.branchcode &&
              campaignOptions.length === 0 &&
              !isFetchingCampaigns && (
                <div className="text-xs text-gray-500 mt-1">
                  No campaigns found for this branch
                </div>
              )}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Lead Name<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              name="lead_name"
              value={formData.lead_name}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter lead name"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Phone className="inline mr-1" size={14} /> Phone <span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="text"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Mail className="inline mr-1" size={14} /> Email<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              placeholder="Enter email"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <CalendarCheck className="inline mr-1" size={14} /> Lead Date<span className="text-red-700 text-lg m-2">*</span>
            </p>
            <input
              name="lead_date"
              value={formData.lead_date}
              onChange={handleChange}
              type="date"
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              
            />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Building className="inline mr-1" size={14} /> Department <span className="text-red-700 text-lg m-2">*</span>
            </p>
            {/*<select
              value={selectedDepartment}
              onChange={(e) => {
                handleDepartmentChange(e.target.value);
                setFormData((prev) => ({ ...prev, assignee_id: "" }));
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
            </select>*/}

{/*               <select
          name="department"
          value={selectedDepartment}
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
        </select>*/}

                 <AsyncSelect
  cacheOptions
  defaultOptions={departmentOptions}
  name="department"
  loadOptions={(inputValue, callback) => {
    const filtered = departmentOptions.filter((c) =>
      c.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    callback(filtered);
  }}
  onChange={(selected: Option | null) => {
    setFormData((prev) => ({
      ...prev,
      department: selected ? selected.value : "",
    }));
  }}
  value={
    departmentOptions.find((opt) => opt.value === formData.department) || null
  }
  placeholder="Select or search department"
/>




          </div>

          {/*<div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <User className="inline mr-1" size={14} /> Assigned To <span className="text-red-700 text-lg m-2">*</span>
            </p>
            {isFetchingStaff ? (
              <div className="text-sm text-gray-500 mt-1">Loading staff...</div>
            ) : (
              <select
                name="assignee_id"
                value={formData.assignee_id}
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
          </div>*/}



            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border">
  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    <User className="inline mr-1" size={14} /> Assigned To <span className="text-red-700 text-lg m-2">*</span>
  </p>
  {isFetchingStaff ? (
    <div className="text-sm text-gray-500 mt-1">Loading staff...</div>
  ) : (
    // <select
    //   name="assignee_id"
    //   value={formData.assignee_id}
    //   onChange={handleChange}
    //   className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
    //   required
    //   disabled={!formData.department || staffOptions.length === 0}
    // >
    //   <option value="">Select Staff</option>
    //   {staffOptions.map((option) => (
    //     <option key={option.value} value={option.value}>
    //       {option.label}
    //     </option>
    //   ))}
    // </select>

      <AsyncSelect
          cacheOptions
          defaultOptions={staffOptions}
          name="assignee_id"
          loadOptions={loadStaffs}
          onChange={(selected: Option | null) =>
            setFormData({ ...formData, assignee_id: selected ? selected.value : "" })
          }
          value={staffOptions.find((opt) => opt.value === formData.assignee_id) || null}
          isDisabled={!formData.department || staffOptions.length === 0}
          placeholder="Select or search staff"
        />



  )}
  {formData.department && staffOptions.length === 0 && !isFetchingStaff && (
    <div className="text-xs text-gray-500 mt-1">
      No staff found in this department
    </div>
  )}
</div>




          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Communication Type 
            </p>
{/*            <select
              name="comm_type"
              value={formData.comm_type}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
            
            >
              <option value="">Select type</option>
              <option value="email">Email</option>
              <option value="call">Phone Call</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="in-person">In-Person</option>
            </select>*/}


                          <select
    name="comm_type"
    value={formData.comm_type}
    onChange={(e) => {
      const value = e.target.value;
      if (value === "other") {
        setFormData((prev) => ({ ...prev, comm_type: "other", customType: "" }));
      } else {
        setFormData((prev) => ({ ...prev, comm_type: value, customType: "" }));
      }
    }}
    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
    required
  >
    <option value="">Select type</option>
    {commtypes.map((t) => (
      <option key={t} value={t}>
        {t}
      </option>
    ))}
    <option value="other">Other</option>
  </select>

  {/* Show custom input if "Other" selected */}
  {formData.comm_type === "other" && (
    <input
      type="text"
      name="customType"
      value={formData.customType || ""}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, customType: e.target.value }))
      }
      className="mt-2 w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none border-b border-gray-300 dark:border-gray-600"
      placeholder="Enter new type"
      required
    />
  )}


          </div>

          <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Tag className="inline mr-1" size={14} /> Project Type
            </p>
    {/*        <select
              name="proj_type"
              value={formData.proj_type}
              onChange={handleChange}
              className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
              
            >
              <option value="">Select type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land</option>
            </select>*/}


               <select
    name="proj_type"
    value={formData.proj_type}
    onChange={(e) => {
      const value = e.target.value;
      if (value === "other") {
        setFormData((prev) => ({ ...prev, proj_type: "other", customTypep: "" }));
      } else {
        setFormData((prev) => ({ ...prev, proj_type: value, customTypep: "" }));
      }
    }}
    className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
    required
  >
    <option value="">Select type</option>
    {types.map((t) => (
      <option key={t} value={t}>
        {t}
      </option>
    ))}
    <option value="other">Other</option>
  </select>

  {/* Show custom input if "Other" selected */}
  {formData.proj_type === "other" && (
    <input
      type="text"
      name="customTypep"
      value={formData.customTypep || ""}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, customTypep: e.target.value }))
      }
      className="mt-2 w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 focus:outline-none border-b border-gray-300 dark:border-gray-600"
      placeholder="Enter new type"
      required
    />
  )}

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
            
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
          <BookOpenText className="inline mr-2" /> Notes & Summary
        </h3>
        <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
          <textarea
            name="summary"
            value={formData.summary}
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
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-800 dark:hover:bg-red-900 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
          disabled={loading}
        >
          {loading ? <ButtonLoader /> : "Create Lead"}
        </button>
      </div>
    </div>
  );
};

export default AddNewLeadForm;
