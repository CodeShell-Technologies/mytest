import axios from "axios";
import { LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import { BASE_URL, toastposition, toastStyle } from "~/constants/api";
import { Eye, EyeOff } from "lucide-react";
const EditEmployeeDetail = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const token = useAuthStore((state) => state.accessToken);
  const { id } = useParams();
  const staff_id = decodeURIComponent(id);
  const [isLoading, setIsLoading] = useState(false);
  const [personalData, setPersonalData] = useState({});
  const [masterLanguages, setMasterLanguages] = useState([]);
  const [masterSoftware, setMasterSoftware] = useState([]);
  const branchcode = useAuthStore((state) => state.branchcode);
   const [showPassword, setShowPassword] = useState(false);
  // State for all editable sections
  const [formData, setFormData] = useState({
    personal: {
      firstname: "",
      lastname: "",
      dob: "",
      gender: "",
      marital: "",
      bloodgroup: "",
      phonenumber: "",
      alternumber: "",
      email: "",
      permanentaddress: "",
      presentaddress: "",
      department: "",
      designation: "",
      pannumber: "",
      aadharnumber: "",
      profileurl: "",
      dateofjoining: "",
      relivingdate: "",
      status: "active",
      notes: "",

    },
    education: [],
    employment: [],
    references: [],
    emergencyContacts: [],
    software: [],
    languages: [],
  });

  const navigate = useNavigate();

  // Fetch all employee data
  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch personal data
      const personalRes = await axios.get(`${BASE_URL}/users/read?staff_id=${staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (personalRes.data?.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            ...personalRes.data.data[0],
            dob: personalRes.data.data[0].dob ? 
              new Date(personalRes.data.data[0].dob).toISOString().split('T')[0] : "",
            dateofjoining: personalRes.data.data[0].dateofjoining ? 
              new Date(personalRes.data.data[0].dateofjoining).toISOString().split('T')[0] : "",
            relivingdate: personalRes.data.data[0].relivingdate ? 
              new Date(personalRes.data.data[0].relivingdate).toISOString().split('T')[0] : "",
          }
        }));
      }

      // Fetch education
      const eduRes = await axios.get(`${BASE_URL}/users/education/read?staff_id=${staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (eduRes.data.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          education: eduRes.data.data.map((item, index) => ({
            id: item.id,
            sno: index + 1,
            degree: item.degree,
            institute: item.institute,
            yearOfPassing: item.passing,
            percentage: item.percentage,
            start_year: item.start_year,
            end_year: item.end_year,
          }))
        }));
      }

      // Fetch employment
      const empRes = await axios.get(`${BASE_URL}/users/experience/read?usersId=${staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (empRes.data.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          employment: empRes.data.data.map((item, index) => ({
            id: item.id,
            sno: index + 1,
            companyName: item.companyname,
            designation: item.designation,
            salary: item.lastsalary,
            periodFrom: item.start_year,
            periodTo: item.end_year,
            reasonForResign: item.reason,
          }))
        }));
      }

      // Fetch emergency contacts
      const emgRes = await axios.get(`${BASE_URL}/users/emergency/read?branchcode=${staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (emgRes.data.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          emergencyContacts: emgRes.data.data.map((item, index) => ({
            id: item.id,
            sno: index + 1,
            name: item.name,
            relation: item.relation,
            mobileNo: item.contactno,
            landlineNo: item.landline,
          }))
        }));
      }

      // Fetch references
      const refRes = await axios.get(`${BASE_URL}/users/reference/read?staff_id=${staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (refRes.data.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          references: refRes.data.data.map((item, index) => ({
            id: item.id,
            sno: index + 1,
            name: item.name,
            relation: item.relation,
            contactNo: item.contactno,
            address: item.address,
            referstaff_id: item.referstaff_id,
          }))
        }));
      }

      // Fetch master languages and software
      await fetchMasterData();

    } catch (error) {
      console.error("Error fetching employee data:", error);
      toast.error("Failed to fetch employee data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      // Fetch master languages
      const langRes = await axios.get(`${BASE_URL}/master/language/read?branchcode=${branchcode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMasterLanguages(langRes.data.data || []);

      // Fetch master software
      const softRes = await axios.get(`${BASE_URL}/master/software/read?branchcode=${branchcode}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMasterSoftware(softRes.data.data || []);

      // Fetch employee languages
      const empLangRes = await axios.get(`${BASE_URL}/users/language/read?staff_id=${staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (empLangRes.data.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          languages: empLangRes.data.data.map(item => ({
            id: item.id,
            language_id: item.language_id,
            language: item.name,
            read: item.can_read,
            speak: item.can_speak,
            write: item.can_write,
            fluency: item.proficiency,
            remark: item.remark || ""
          }))
        }));
      } else if (langRes.data.data?.length > 0) {
        // Initialize with master languages if no existing data
        setFormData(prev => ({
          ...prev,
          languages: langRes.data.data.map((lang, index) => ({
            sno: index + 1,
            language_id: lang.id,
            language: lang.name,
            read: false,
            speak: false,
            write: false,
            fluency: "",
            remark: ""
          }))
        }));
      }

      // Fetch employee software
      const empSoftRes = await axios.get(`${BASE_URL}/users/software/read?staff_id=${staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (empSoftRes.data.data?.length > 0) {
        setFormData(prev => ({
          ...prev,
          software: empSoftRes.data.data.map(item => ({
            id: item.id,
            software_id: item.software_id,
            softwareName: item.software_name,
            proficiency: item.proficiency,
            remark: item.remark || ""
          }))
        }));
      } else if (softRes.data.data?.length > 0) {
        // Initialize with master software if no existing data
        setFormData(prev => ({
          ...prev,
          software: softRes.data.data.map((soft, index) => ({
            sno: index + 1,
            software_id: soft.id,
            softwareName: soft.name,
            proficiency: "",
            remark: ""
          }))
        }));
      }

    } catch (error) {
      console.error("Error fetching master data:", error);
      toast.error("Failed to fetch master data");
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [staff_id, token]);

  // Tab navigation
  const nextTab = () => {
    const tabs = ["personal", "education", "other"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const prevTab = () => {
    const tabs = ["personal", "education", "other"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  // Handle form changes
  const handlePersonalChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

  const addNewEntry = (arrayName, template) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [
        ...prev[arrayName],
        {
          ...template,
          sno: prev[arrayName].length + 1,
        },
      ],
    }));
  };

  // API handlers
  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const payload = {
        profile: {
          ...formData.personal,
          staff_id,
          branchcode,
          role: formData.personal.role || "Employee" // Default role if not specified
        }
      };

      await axios.put(`${BASE_URL}/users/edit`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Personal details updated successfully");
      nextTab();
    } catch (error) {
      console.error("Error updating personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEducationSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Process existing education records
      const updatePromises = formData.education
        .filter(item => item.id) // Only items with IDs (existing records)
        .map(item => 
          axios.put(`${BASE_URL}/users/education/edit/${item.id}`, {
            userData: {
              staff_id,
              degree: item.degree,
              institute: item.institute,
              passing: item.yearOfPassing,
              percentage: item.percentage,
              start_year: item.start_year,
              end_year: item.end_year,
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

      await Promise.all(updatePromises);
      toast.success("Education details updated successfully");
      nextTab();
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to update education details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmploymentSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Process existing employment records
      const updatePromises = formData.employment
        .filter(item => item.id)
        .map(item => 
          axios.put(`${BASE_URL}/users/experience/edit/${item.id}`, {
            userData: {
              staff_id,
              companyname: item.companyName,
              designation: item.designation,
              lastsalary: item.salary,
              start_year: item.periodFrom,
              end_year: item.periodTo,
              reason: item.reasonForResign,
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

      await Promise.all(updatePromises);
      toast.success("Employment details updated successfully");
      nextTab();
    } catch (error) {
      console.error("Error updating employment:", error);
      toast.error("Failed to update employment details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguagesSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Process existing language records
      const updatePromises = formData.languages
        .filter(item => item.id)
        .map(item => 
          axios.put(`${BASE_URL}/users/language/edit/${item.id}`, {
            userData: {
              staff_id,
              language_id: item.language_id,
              can_read: item.read,
              can_speak: item.speak,
              can_write: item.write,
              proficiency: item.fluency,
              remark: item.remark || ""
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

      await Promise.all(updatePromises);
      toast.success("Language details updated successfully");
    } catch (error) {
      console.error("Error updating language details:", error);
      toast.error("Failed to update language details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoftwareSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Process existing software records
      const updatePromises = formData.software
        .filter(item => item.id)
        .map(item => 
          axios.put(`${BASE_URL}/users/software/edit/${item.id}`, {
            userData: {
              staff_id,
              software_id: item.software_id,
              proficiency: item.proficiency,
              remark: item.remark || ""
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

      await Promise.all(updatePromises);
      toast.success("Software proficiency updated successfully");
    } catch (error) {
      console.error("Error updating software proficiency:", error);
      toast.error("Failed to update software proficiency");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferencesSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Process existing reference records
      const updatePromises = formData.references
        .filter(item => item.id)
        .map(item => 
          axios.put(`${BASE_URL}/users/reference/edit/${item.id}`, {
            userData: {
              staff_id,
              referstaff_id: item.referstaff_id || staff_id,
              name: item.name,
              relation: item.relation,
              contactno: item.contactNo,
              address: item.address,
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

      await Promise.all(updatePromises);
      toast.success("References updated successfully");
    } catch (error) {
      console.error("Error updating references:", error);
      toast.error("Failed to update references");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Process existing emergency contact records
      const updatePromises = formData.emergencyContacts
        .filter(item => item.id)
        .map(item => 
          axios.put(`${BASE_URL}/users/emergency/edit/${item.id}`, {
            userData: {
              staff_id,
              name: item.name,
              relation: item.relation,
              contactno: item.mobileNo,
              landline: item.landlineNo,
            }
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );

      await Promise.all(updatePromises);
      toast.success("Emergency contacts updated successfully");
    } catch (error) {
      console.error("Error updating emergency contacts:", error);
      toast.error("Failed to update emergency contacts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      // Submit all "other" section data
      await Promise.all([
        handleReferencesSubmit(e),
        handleEmergencySubmit(e),
        handleSoftwareSubmit(e),
        handleLanguagesSubmit(e),
        handleEmploymentSubmit(e),

      ]);

      toast.success("All details updated successfully");
      navigate(-1); // Go back after successful submission
    } catch (error) {
      console.error("Error in final submission:", error);
      toast.error("Failed to update some details");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto bg-transparent dark:bg-gray-800 overflow-hidden">
        <div className="flex justify-between">
          <div className="p-4 text-red-700 mb-10">
            <h1 className="text-2xl font-bold">Edit Employee Information</h1>
          </div>
          <Toaster position={toastposition} reverseOrder={false} />
          <div>
            <button
              className="text-gray-500 bg-gray-200 px-3 py-1 rounded-lg mt-6"
              onClick={() => navigate(-1)}
            >
              <LogOut className="inline rotate-180 text-gray-500 mr-3" />
              Go Back
            </button>
          </div>
        </div>
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-10">
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === "personal" ? " dark:bg-gray-800 text-red-700 dark:text-red-400 border-b-2 border-red-700 dark:border-red-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Information
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === "education" ? " dark:bg-gray-800 text-red-700 dark:text-red-400 border-b-2 border-red-700 dark:border-red-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            onClick={() => setActiveTab("education")}
          >
            Education & Experience
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm ${activeTab === "other" ? " dark:bg-gray-800 text-red-700 dark:text-red-400 border-b-2 border-red-700 dark:border-red-400" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
            onClick={() => setActiveTab("other")}
          >
            Other Details
          </button>
        </div>

        {activeTab === "personal" && (
          <div className="space-y-8 bg-white rounded-2xl h-[750px] overflow-y-auto">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-500 dark:text-white">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.personal.firstname || ""}
                    onChange={(e) => handlePersonalChange("firstname", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.personal.lastname || ""}
                    onChange={(e) => handlePersonalChange("lastname", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.personal.dob || ""}
                    onChange={(e) => handlePersonalChange("dob", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.personal.gender || ""}
                    onChange={(e) => handlePersonalChange("gender", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={formData.personal.marital || ""}
                    onChange={(e) => handlePersonalChange("marital", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  >
                    <option value="">Select Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.personal.bloodgroup || ""}
                    onChange={(e) => handlePersonalChange("bloodgroup", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+ve">A+ve</option>
                    <option value="A-ve">A-ve</option>
                    <option value="B+ve">B+ve</option>
                    <option value="B-ve">B-ve</option>
                    <option value="AB+ve">AB+ve</option>
                    <option value="AB-ve">AB-ve</option>
                    <option value="O+ve">O+ve</option>
                    <option value="O-ve">O-ve</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Mobile No
                  </label>
                  <input
                    type="text"
                    value={formData.personal.phonenumber || ""}
                    onChange={(e) => handlePersonalChange("phonenumber", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Residence Contact no
                  </label>
                  <input
                    type="text"
                    value={formData.personal.alternumber || ""}
                    onChange={(e) => handlePersonalChange("alternumber", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email ID (Personal)
                  </label>
                  <input
                    type="email"
                    value={formData.personal.email || ""}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>


                         <div>
  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
    Password
  </label>
  <input
    type="password" // hide input
    placeholder="Enter new password to change"
    value={formData.personal.password || ""}
    onChange={(e) => handlePersonalChange("password", e.target.value)}
    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
  />
</div>
      

             {/*   <div className="relative max-w-[400px]">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Password
      </label>
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Enter new password to change"
        value={formData.personal.password || ""}
        onChange={(e) => handlePersonalChange("password", e.target.value)}
        className="w-full bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
*/}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.personal.department || ""}
                    onChange={(e) => handlePersonalChange("department", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.personal.designation || ""}
                    onChange={(e) => handlePersonalChange("designation", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pan Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.personal.pannumber || ""}
                    onChange={(e) => handlePersonalChange("pannumber", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adhar Card Number
                  </label>
                  <input
                    type="text"
                    value={formData.personal.aadharnumber || ""}
                    onChange={(e) => handlePersonalChange("aadharnumber", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date of Joining
                  </label>
                  <input
                    type="date"
                    value={formData.personal.dateofjoining || ""}
                    onChange={(e) => handlePersonalChange("dateofjoining", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reliving Date
                  </label>
                  <input
                    type="date"
                    value={formData.personal.relivingdate || ""}
                    onChange={(e) => handlePersonalChange("relivingdate", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.personal.status || "active"}
                    onChange={(e) => handlePersonalChange("status", e.target.value)}
                    className="max-w-[400px] w-[300px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                              <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Present Address
                  </label>
                  <textarea
                    value={formData.personal.presentaddress || ""}
                    onChange={(e) => handlePersonalChange("presentaddress", e.target.value)}
                    rows={3}
                    className="w-[1020px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Permanent Address
                  </label>
                  <textarea
                    value={formData.personal.permanentaddress || ""}
                    onChange={(e) => handlePersonalChange("permanentaddress", e.target.value)}
                    rows={3}
                    className="w-[1020px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={formData.personal.notes || ""}
                    onChange={(e) => handlePersonalChange("notes", e.target.value)}
                    rows={3}
                    className="w-[1020px] bg-white dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex m-10 justify-between">
              <button
                type="button"
                disabled
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handlePersonalSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save & Next"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "education" && (
          <div className="space-y-8">
            {/* Education Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                  Educational Qualification
                </h2>
                {/* <button
                  type="button"
                  onClick={() =>
                    addNewEntry("education", {
                      sno: formData.education.length + 1,
                      degree: "",
                      institute: "",
                      yearOfPassing: "",
                      percentage: "",
                      start_year: "",
                      end_year: "",
                    })
                  }
                  className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:ring-2 text-sm"
                >
                  + Add Education
                </button> */}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Degree/Diploma/Certificate
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Institute/University
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Year of Passing
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Start Year
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        End Year
                      </th>
                      {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.education.map((item, index) => (
                      <tr key={item.sno}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.sno}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.degree}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[200px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.institute}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "institute",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[200px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.yearOfPassing}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "yearOfPassing",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[200px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.percentage}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "percentage",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[200px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="date"
                            value={item.start_year}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "start_year",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[200px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="date"
                            value={item.end_year}
                            onChange={(e) =>
                              handleArrayChange(
                                "education",
                                index,
                                "end_year",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[200px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        {/* <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedEducation = formData.education.filter(
                                (_, i) => i !== index
                              );
                              const withUpdatedSno = updatedEducation.map(
                                (ref, idx) => ({
                                  ...ref,
                                  sno: idx + 1,
                                })
                              );
                              setFormData({
                                ...formData,
                                education: withUpdatedSno,
                              });
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
           
              </div>
                   <div className="flex justify-end p-6">
                               <button
                type="button"
                onClick={handleEducationSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? <ButtonLoader/>: "Update Education"}
              </button>
                </div>
            </div>

            {/* Employment Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                  Previous Employment Details
                </h2>
                {/* <button
                  type="button"
                  onClick={() =>
                    addNewEntry("employment", {
                      sno: formData.employment.length + 1,
                      companyName: "",
                      designation: "",
                      salary: "",
                      periodFrom: "",
                      periodTo: "",
                      reasonForResign: "",
                    })
                  }
                  className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:ring-2 text-sm"
                >
                  + Add Employment
                </button> */}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Designation
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Salary Last Drawn
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Period From
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Period To
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Reason for Resign
                      </th>
                      {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.employment.map((item, index) => (
                      <tr key={item.sno}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.sno}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.companyName}
                            onChange={(e) =>
                              handleArrayChange(
                                "employment",
                                index,
                                "companyName",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[150px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-1 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.designation}
                            onChange={(e) =>
                              handleArrayChange(
                                "employment",
                                index,
                                "designation",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[150px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-1 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.salary}
                            onChange={(e) =>
                              handleArrayChange(
                                "employment",
                                index,
                                "salary",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[150px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-1 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="date"
                            value={item.periodFrom}
                            onChange={(e) =>
                              handleArrayChange(
                                "employment",
                                index,
                                "periodFrom",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[150px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-1 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="date"
                            value={item.periodTo}
                            onChange={(e) =>
                              handleArrayChange(
                                "employment",
                                index,
                                "periodTo",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[150px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-1 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.reasonForResign}
                            onChange={(e) =>
                              handleArrayChange(
                                "employment",
                                index,
                                "reasonForResign",
                                e.target.value
                              )
                            }
                            className="max-w-[400px] w-[150px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-1 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        {/* <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              const updatedEmployment = formData.employment.filter(
                                (_, i) => i !== index
                              );
                              const withUpdatedSno = updatedEmployment.map(
                                (ref, idx) => ({
                                  ...ref,
                                  sno: idx + 1,
                                })
                              );
                              setFormData({
                                ...formData,
                                employment: withUpdatedSno,
                              });
                            }}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Remove
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                  {/* <div className="flex justify-end p-6">
                               <button
                type="button"
                onClick={handleEmploymentSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? <ButtonLoader/>: "Update Experience"}
              </button>
                </div> */}
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={prevTab}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleEmploymentSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save & Next"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "other" && (
          <div className="space-y-8">
            {/* Software Proficiency Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4 text-gray-500 dark:text-white">
                Software Proficiency
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Software
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Proficiency Level
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.software.map((item, index) => (
                      <tr key={item.sno}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {index+1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.softwareName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <select
                            value={item.proficiency}
                            onChange={(e) =>
                              handleArrayChange(
                                "software",
                                index,
                                "proficiency",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          >
                            <option value="">Select</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.remark}
                            onChange={(e) =>
                              handleArrayChange(
                                "software",
                                index,
                                "remark",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                  <div className="flex justify-end p-6">
                               <button
                type="button"
                onClick={handleSoftwareSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? <ButtonLoader/>: "Update Skills"}
              </button>
                </div>
            </div>

            {/* Languages Known Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
              <h2 className="text-xl font-semibold mb-4 text-gray-500 dark:text-white">
                Languages Known
              </h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Read
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Speak
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Write
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fluency
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.languages.map((item, index) => (
                      <tr key={item.sno}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {index+1}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.language}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={item.read}
                            onChange={(e) =>
                              handleArrayChange(
                                "languages",
                                index,
                                "read",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={item.speak}
                            onChange={(e) =>
                              handleArrayChange(
                                "languages",
                                index,
                                "speak",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <input
                            type="checkbox"
                            checked={item.write}
                            onChange={(e) =>
                              handleArrayChange(
                                "languages",
                                index,
                                "write",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          <select
                            value={item.fluency}
                            onChange={(e) =>
                              handleArrayChange(
                                "languages",
                                index,
                                "fluency",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          >
                            <option value="">Select</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Basic">Basic</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.remark}
                            onChange={(e) =>
                              handleArrayChange(
                                "languages",
                                index,
                                "remark",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                  <div className="flex justify-end p-6">
                               <button
                type="button"
                onClick={handleLanguagesSubmit}
                // disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? <ButtonLoader/>: "Update Language"}
              </button>
                </div>
            </div>

            {/* References Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                  References
                </h2>
                {/* <button
                  type="button"
                  onClick={() =>
                    addNewEntry("references", {
                      sno: formData.references.length + 1,
                      name: "",
                      relation: "",
                      contactNo: "",
                      address: "",
                      referstaff_id: "",
                    })
                  }
                  className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none f text-sm"
                >
                  + Add Reference
                </button> */}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Referrence ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Relation
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contact No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.references.map((item, index) => (
                      <tr key={item.sno}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.sno}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.referstaff_id}
                            onChange={(e) =>
                              handleArrayChange(
                                "references",
                                index,
                                "referstaff_id",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleArrayChange(
                                "references",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.relation}
                            onChange={(e) =>
                              handleArrayChange(
                                "references",
                                index,
                                "relation",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.contactNo}
                            onChange={(e) =>
                              handleArrayChange(
                                "references",
                                index,
                                "contactNo",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.address}
                            onChange={(e) =>
                              handleArrayChange(
                                "references",
                                index,
                                "address",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {
                              const updatedReferences = formData.references.filter(
                                (_, i) => i !== index
                              );
                              const withUpdateSno = updatedReferences.map(
                                (ref, idx) => ({
                                  ...ref,
                                  sno: idx + 1,
                                })
                              );
                              setFormData({
                                ...formData,
                                references: withUpdateSno,
                              });
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                  <div className="flex justify-end p-6">
                               <button
                type="button"
                onClick={handleReferencesSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? <ButtonLoader/>: "Update Referrence"}
              </button>
                </div>
            </div>

            {/* Emergency Contacts Section */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                  Emergency Contact Details
                </h2>
                {/* <button
                  type="button"
                  onClick={() =>
                    addNewEntry("emergencyContacts", {
                      sno: formData.emergencyContacts.length + 1,
                      name: "",
                      relation: "",
                      mobileNo: "",
                      landlineNo: "",
                    })
                  }
                  className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:ring-2 text-sm"
                >
                  + Add Emergency
                </button> */}
              </div>
                 <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Contact Person Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Relation
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Mobile No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Landline No
                      </th>
                      {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Action</th> */}
                        </tr>

                        </thead>
                             <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {formData.emergencyContacts.map((item, index) => (
                      <tr key={item.sno}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                          {item.sno}
                        </td>
                  
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleArrayChange(
                                "emergencyContacts",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td> 
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.relation}
                            onChange={(e) =>
                              handleArrayChange(
                                "emergencyContacts",
                                index,
                                "relation",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.mobileNo}
                            onChange={(e) =>
                              handleArrayChange(
                                "emergencyContacts",
                                index,
                                "mobileNo",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                       <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={item.landlineNo}
                            onChange={(e) =>
                              handleArrayChange(
                                "emergencyContacts",
                                index,
                                "landlineNo",
                                e.target.value
                              )
                            }
                            className="w-full bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                          />
                        </td>
                        {/* <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {
                              const updatedReferences = formData.emergencyContacts.filter(
                                (_, i) => i !== index
                              );
                              const withUpdateSno = updatedReferences.map(
                                (ref, idx) => ({
                                  ...ref,
                                  sno: idx + 1,
                                })
                              );
                              setFormData({
                                ...formData,
                                emergencyContacts: withUpdateSno,
                              });
                            }}
                          >
                            Remove
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                        </table>
                        </div>
</div>
           
                         <div className="flex justify-between">
              <button
                type="button"
                onClick={prevTab}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Submit All"}
              </button>
            </div>
                        </div>)}
            
                        </div>
                        </>
  )}
  export default EditEmployeeDetail;