import axios from "axios";
import { error } from "console";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, useParams } from "react-router";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import { BASE_URL } from "~/constants/api";

const AddNewEmployeePage=()=>{
  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.accessToken);
  const branchCodeOption = useBranchStore((state) => state.branchCodeOptions);
  const [personalData, setPersonalData] = useState({});
  const [loading, setLoading] = useState(true);
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
    branchcode: "select Branch",
    role: "",
    password: "",
    psn: "",
    department: "",
    pannumber: "",
    aadharnumber: "",

    software: [
      { sno: 1, softwareName: "AutoCAD", proficiency: "" },
      { sno: 2, softwareName: "STAAD Pro", proficiency: "" },
      { sno: 3, softwareName: "ETABS", proficiency: "" },
      { sno: 4, softwareName: "Revit", proficiency: "" },
      { sno: 5, softwareName: "MS Office", proficiency: "" },
    ],

    education: [
      { sno: 1, degree: "", institute: "", yearOfPassing: "", percentage: "" ,certificate:'degreecertificate'},
    ],

    employment: [
      {
        sno: 1,
        companyName: "",
        designation: "",
        salary: "",
        periodFrom: "",
        periodTo: "",
        reasonForResign: "",
      },
    ],

    languages: [
      {
        sno: 1,
        language: "Tamil",
        read: false,
        speak: false,
        write: false,
        fluency: "",
      },
      {
        sno: 2,
        language: "English",
        read: false,
        speak: false,
        write: false,
        fluency: "",
      },
      {
        sno: 3,
        language: "Hindi",
        read: false,
        speak: false,
        write: false,
        fluency: "",
      },
    ],

    references: [
      { sno: 1, name: "", relation: "", contactNo: "", address: "",psn:'' },
    ],

    emergencyContacts: [
      { sno: 1, name: "", relation: "", mobileNo: "", landlineNo: "" },
    ],
  });

  // handle functions

    const addNewEntry = (arrayName, template) => {
    setFormData((prev) => ({
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
  const handleArrayChange = (arrayName, index, field, value) => {
    const updatedArray = [...formData[arrayName]];
    updatedArray[index][field] = value;
    setFormData({ ...formData, [arrayName]: updatedArray });
  };

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

  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleSubmit=()=>{
    alert("handlesubmitclick")
  }
  return(
    <>
     <>
      <div className="max-w-6xl mx-auto bg-transparent dark:bg-gray-800 overflow-hidden">
        <div className="flex justify-between">
          {" "}
          <div className="p-4 text-red-700 mb-10">
            <h1 className="text-2xl font-bold">Employee Information Form</h1>
          </div>
          <Toaster position="top-center" reverseOrder={false} />
          <div>
            <button
              className="text-gray-500 bg-gray-200 px-3 py-1 rounded-lg mt-6"
              onClick={handleGoBack}
            >
              <LogOut className="inline rotate-180 text-gray-500 mr-3" />
              Go Back
            </button>
          </div>
        </div>
        {/* <div className="flex border-b border-gray-200 dark:border-gray-700 mb-10">
          
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
        </div> */}

        {/* <form onSubmit={handleSubmit} className="p-6"> */}
           {/* {activeTab === "personal" && (
                  <>
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
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
                    >
                      <option value="">Select</option>
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
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    >
                      <option value="">Select</option>
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
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    >
                      <option value="">Select</option>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mobile No
                    </label>
                    <input
                      type="tel"
                      name="mobileNo"
                      value={formData.mobileNo}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Residence Contact no
                    </label>
                    <input
                      type="tel"
                      name="residenceContactNo"
                      value={formData.residenceContactNo}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email ID (Personal)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Recent Photograph
                    </label>
                    <input
                      type="file"
                      name="photograph"
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Branch Code
                    </label>
                    <select
                      name="branchcode"
                      value={formData.branchcode}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    >
                      {branchCodeOption?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      PSN CODE
                    </label>
                    <input
                      type="text"
                      name="psn"
                      value={formData.psn}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="text"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pan Card Number
                    </label>
                    <input
                      type="text"
                      name="pannumber"
                      value={formData.pannumber}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adhar Card Number
                    </label>
                    <input
                      type="text"
                      name="aadharnumber"
                      value={formData.aadharnumber}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="max-w-[400px] w-[300px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Present Address
                    </label>
                    <textarea
                      name="presentAddress"
                      value={formData.presentAddress}
                      onChange={handleChange}
                      rows={3}
                      className=" w-[1020px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Permanent Address
                    </label>
                    <textarea
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      rows={3}
                      className="w-[1020px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                      required
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
                  onClick={nextTab}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Next
                </button>
              </div>
            </div>
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
                      value={personalData.firstname || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={personalData.lastname || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      value={
                        personalData.dob
                          ? new Date(personalData.dob)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender
                    </label>
                    <input
                      type="text"
                      value={personalData.gender || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Marital Status
                    </label>
                    <input
                      type="text"
                      value={personalData.marital || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Blood Group
                    </label>
                    <input
                      type="text"
                      value={personalData.bloodgroup || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mobile No
                    </label>
                    <input
                      type="text"
                      value={personalData.phonenumber || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Residence Contact no
                    </label>
                    <input
                      type="text"
                      value={personalData.alternumber || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email ID (Personal)
                    </label>
                    <input
                      type="text"
                      value={personalData.email || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Branch Code
                    </label>
                    <input
                      type="text"
                      value={personalData.branchcode || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={personalData.role || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      PSN CODE
                    </label>
                    <input
                      type="text"
                      value={personalData.psn || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pan Card Number
                    </label>
                    <input
                      type="text"
                      value={personalData.pannumber || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Adhar Card Number
                    </label>
                    <input
                      type="text"
                      value={personalData.aadharnumber || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={personalData.department || ""}
                      disabled
                      className="max-w-[400px] w-[300px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Present Address
                    </label>
                    <textarea
                      value={personalData.presentaddress || ""}
                      disabled
                      rows={3}
                      className="w-[1020px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Permanent Address
                    </label>
                    <textarea
                      value={personalData.permanentaddress || ""}
                      disabled
                      rows={3}
                      className="w-[1020px] bg-gray-100 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 rounded cursor-not-allowed"
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
                  onClick={nextTab}
                  className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Next
                </button>
              </div>
            </div>
      
          
            </>
          )}  */}

          {/* Education & Experience Tab */}
          {/* {activeTab === "education" && (
            <div className="space-y-8">
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                    Educational Qualification
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      addNewEntry("education", {
                        sno: formData.references.length + 1,
                        degree: "",
                        institute: "",
                        yearOfPassing: "",
                        percentage: "",
                      })
                    }
                    className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:ring-2  text-sm"
                  >
                    + Add Education
                  </button>
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
                            <button
                              type="button"
                              onClick={() => {
                                const updatedEducation =
                                  formData.education.filter(
                                    (_, i) => i !== index
                                  );
                                // Update sno for remaining items
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                    Previous Employment Details
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      addNewEntry("employment", {
                        sno: formData.references.length + 1,
                        companyName: "",
                        designation: "",
                        salary: "",
                        periodFrom: "",
                        periodTo: "",
                        reasonForResign: "",
                      })
                    }
                    className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:ring-2  text-sm"
                  >
                    + Add Employment
                  </button>
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
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedEmployment =
                                  formData.employment.filter(
                                    (_, i) => i !== index
                                  );
                                // Update sno for remaining items
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
                          </td>
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
                  onClick={nextTab}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Next
                </button>
              </div>
            </div>
          )} */}

          {/* {activeTab === "other" && (
            <div className="space-y-8">
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
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.software.map((item, index) => (
                        <tr key={item.sno}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.sno}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {formData.languages.map((item, index) => (
                        <tr key={item.sno}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {item.sno}
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                    References
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      addNewEntry("references", {
                        sno: formData.references.length + 1,
                        name: "",
                        relation: "",
                        contactNo: "",
                        address: "",
                      })
                    }
                    className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none f text-sm"
                  >
                    + Add Reference
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          S.No
                        </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Psn
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
                              value={item.psn}
                              onChange={(e) =>
                                handleArrayChange(
                                  "references",
                                  index,
                                  "psn",
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
                                const updatedReferences =
                                  formData.references.filter(
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
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
                    Emergency Contact Details
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      addNewEntry("emergencyContacts", {
                        sno: formData.references.length + 1,
                        name: "",
                        relation: "",
                        mobileNo: "",
                        landlineNo: "",
                      })
                    }
                    className="px-3 py-1.5 bg-red-600 text-white rounded-sm hover:bg-red-700 focus:outline-none focus:ring-2  text-sm"
                  >
                    + Add Emergency
                  </button>
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
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => {
                                const updatedEmergerncyContact =
                                  formData.emergencyContacts.filter(
                                    (_, i) => i !== index
                                  );
                                // Update sno for remaining items
                                const withUpdatedSno =
                                  updatedEmergerncyContact.map(
                                    (emergency, idx) => ({
                                      ...emergency,
                                      sno: idx + 1,
                                    })
                                  );
                                setFormData({
                                  ...formData,
                                  emergencyContacts: withUpdatedSno,
                                });
                              }}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                              Remove
                            </button>
                          </td>
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
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Submit
                </button>
              </div>
            </div>
          )} */}
        {/* </form> */}
      </div>
    </>
    </>
  )
}
export default AddNewEmployeePage;