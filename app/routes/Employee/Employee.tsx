import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import {
  AlertTriangle,
  Calendar,
  FileDown,
  Plus,
  PlusSquareIcon,
  UserX,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL, toastposition, toastStyle } from "~/constants/api";
import CreateBranchForm from "../Branch/CreateBranchForm";
import toast, { Toaster } from "react-hot-toast";
import EditBranchForm from "../Branch/EditFormData";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "../../../src/stores/useBranchStore";
import { CgExport } from "react-icons/cg";
import { Edit2, Eye, SquarePen, Trash2 } from "lucide-react";
import { useMediaQuery } from "../hooks/use-click-outside";
import EmployeeSalary from "./Salary/Salary";
import Documents from "./Documents/Documts";
import useEmployeeStore from "src/stores/useEmployeeStore";
import EmployeeForm from "./AddEmployeeForm";
import OfferLettersGenerative from "./offerletters/OfferLettersGenerative";
import Termination from "./termination/Termination";
import SalaryRevisionTracker from "./Salary/SalaryRevision";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Employee = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const accesstoken = useAuthStore((state) => state.accessToken);
  const [activeTab, setActiveTab] = useState("employee");
  const { fetchEmployee, fetchBranchEmployee, isStoreLoading } =
    useEmployeeStore();
  const roleOptions = useEmployeeStore((state) => state.roleOptions);
  const branchCodeOptions = useBranchStore((state) => state.branchCodeOptions);
  const [inActiveData, setInActiveData] = useState({
    type: "",
    status: "",
  });
  const statusOptions = [
    { value: "", label: "All Branches" },
    { value: "active", label: "Active Employees" },
    { value: "inactive", label: "Inactive Employees" },
  ];

         const [hydrated, setHydrated] = useState(false);


  const branchcode = useAuthStore((state) => state.branchcode);
  console.log("branchcodefor employee", branchcode);
  const pageSizeOptions = [
    { value: 20, label: "20 per page" },
    { value: 40, label: "30 per page" },
    { value: 50, label: "40 per page" },
    { value: 80, label: "50 per page" },
    { value: 100, label: "100 per page" },
    { value: 200, label: "100 per page" },
  ];
  const navigate = useNavigate();

      // wait for Zustand persist to hydrate
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (useAuthStore.persist.hasHydrated()) {
        setHydrated(true);
      } else {
        const unsub = useAuthStore.persist.onHydrate(() => setHydrated(true));
        return () => unsub();
      }
    }
  }, []);


const token = accesstoken;


  useEffect(() => {
    if (hydrated && token) {
    fetchEmployee(token);
    fetchBranchEmployee(token, branchcode);  
    }
    
  }, [token, branchcode,hydrated]);

  const getEmployee = async (
    page = currentPage,
    limit = pageSize,
    search = searchTerm,
    status = selectStatus,
    role = selectedRole,
    branchCode = selectedBranchCode,
    sort = sortOrder
  ) => {
    setLoading(true);
    try {
      console.log("Store state:", useBranchStore.getState());
      let url = `${BASE_URL}/users/read?page=${page}&limit=${limit}`;

      if (search) url += `&search=${search}`;
      if (status) url += `&status=${status}`;
      if (role) url += `&role=${role}`;
      if (branchCode) url += `&branchcode=${branchCode}`;
      if (sort) url += `&dec=${sort}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("userrr>>>>>>>>>", response?.data?.data);
      setSheetData(response?.data?.data);
      setTotalItem(response?.data?.totalDocuments);
      setData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching branch list", error);
      setError("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hydrated && token) {
    getEmployee();
  }
  }, [
    hydrated,
    token,
    currentPage,
    searchTerm,
    selectStatus,
    selectedRole,
    selectedBranchCode,
    sortOrder,
    pageSize,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    toast.success("Employee created successfully");
    getEmployee();
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // const handleEditBranch = (employee) => {
  //   try {

  //     setSelectedUser(employee);
  //   } catch (err) {
  //     console.error("Navigation error:", err);
  //     toast.error("Failed to navigate to edit page");
  //   }
  // };

  const handleDeleteEmployee = (id) => {
    console.log("stafffidd", id);
    setShowDeleteModal(true);
    setDeleteId(id);
  };

  const handleDeleteSubmit = async () => {
    console.log("deletedidinapi", deleteId);
    const deleteData = {
      staff_id: deleteId,
      type: inActiveData.type,
      status: inActiveData.status,
    };

    try {
      setLoading(true);
      const response = await axios.delete(`${BASE_URL}/users/delete`, {
        data: deleteData,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("deleteemployeeresponse", response);
      if (response?.status === 200) {
        setShowDeleteModal(false);
        toast.success("Access permission updated Successfully!", toastStyle);
        getEmployee();
        setLoading(false);
        setInActiveData({
          type: "",
          status: "",
        });
      }
    } catch (error) {
      console.error("Error deleting branch", error);
      toast.error("Failed to delete branch");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "desc" ? "" : "desc"));
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectStatus(value);
    setCurrentPage(1);
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    setCurrentPage(1);
  };

  const handleBranchCodeChange = (value) => {
    setSelectedBranchCode(value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInActiveData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNavigate = (id) => {
    console.log("editprofileidd", id);
    alert("navigateactive");
    navigate(`/employee/addpage/${encodeURIComponent(id)}`);
  };
  const handleEditNavigate = (id) => {
    console.log("editprofileidd", id);
    alert("navigateactive");
    navigate(`/employee/editpage/${encodeURIComponent(id)}`);
  };
  const handleView = (staff_id) => {
    navigate(`/employee_profile/${encodeURIComponent(staff_id)}`);
  };
  const thead = () => [
    { data: "Staff Id" },
    { data: "First Name" },
    { data: "Last Name" },
    { data: "Branch Code" },
    { data: "Role" },
    { data: "Email" },
    { data: "Status" },
    { data: "Actions", className: "text-center" },
  ];

  const tbody = () => {
    if (!data) return [];

    return data.map((employee) => ({
      id: employee.staff_id,
      data: [
        { data: employee.staff_id },
        { data: employee.firstname },
        { data: employee.lastname },
        { data: employee.branchcode },
        { data: employee.role },
        { data: employee.email },
        {
          data: (
            <div
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${employee.status === "active" ? "bg-green-100 text-green-800" : employee.status === "relive" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-800"}`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${employee.status === "active" ? "bg-green-800" : employee.status === "relive" ? "bg-yellow-600" : "bg-red-600"}`}
              ></span>
              {employee.status.charAt(0).toUpperCase() +
                employee.status.slice(1)}
            </div>
          ),
        },
        {
          data: (
            <div className="flex justify-center gap-2">
              <button
                className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                title="View"
                onClick={() => handleView(employee.staff_id)}
              >
                <Eye size={18} />
              </button>

              <button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleNavigate(employee.staff_id)}
                title="Add"
              >
                <PlusSquareIcon size={18} />
              </button>
              <button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleEditNavigate(employee.staff_id)}
                title="Update"
              >
                <SquarePen size={18} />
              </button>
              <button
                className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleDeleteEmployee(employee.staff_id)}
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ),
          className: "action-cell",
        },
      ],
    }));
  };

  // const handleEditSuccess = () => {
  //   setShowEditModal(false);
  //   toast.success("Branch updated successfully!");
  //   fetchBranches(token);
  //   getBranch();
  // };

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Branches");
    XLSX.writeFile(wb, "BranchList.xlsx");
  };

  const tabs = [
    { id: "employee", label: "Employee List" },
    { id: "salary", label: "Salary" },
    { id: "leave", label: "Request" },
    { id: "termination", label: "Termination" },
    { id: "interview", label: "Offer letters" },
  ];




// Export Employees (Userinfo) as PDF
const handleOnExportPDF = () => {
  const doc = new jsPDF("landscape");

  doc.setFontSize(14);
  doc.text("Employee List (Summary)", 14, 10);

  if (sheetData.length > 0) {
    // Pick only important columns for PDF summary
    const importantCols = [
      "staff_id",
      "firstname",
      "lastname",
      "role",
      "department",
      "designation",
      "phonenumber",
      "email",
      "dateofjoining",
      "status",
      "create_datetime",
      "last_update_datetime",
    ];

    const columns = importantCols.map((key) => ({
      header: key,
      dataKey: key,
    }));

    autoTable(doc, {
      columns,
      body: sheetData, // <-- your userinfo table data array
      startY: 20,
      styles: { fontSize: 8, cellPadding: 2, overflow: "linebreak" },
      headStyles: { fillColor: [22, 160, 133], fontSize: 9, halign: "center" },
      theme: "grid",
      tableWidth: "auto",
    });
  }

  doc.save("EmployeeList.pdf");
};

// Download Excel Template for Employees (Userinfo)
const handleDownloadTemplate = () => {
  const headers = [
    "staff_id",
    "branchcode",
    "role",
    "firstname",
    "lastname",
    "dob",
    "gender",
    "marital",
    "bloodgroup",
    "phonenumber",
    "alternumber",
    "email",
    "password",
    "permanentaddress",
    "presentaddress",
    "department",
    "designation",
    "pannumber",
    "aadharnumber",
    "profileurl",
    "dateofjoining",
    "relivingdate",
    "status",
    "notes",
    "create_datetime",
    "last_update_datetime",
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([headers]); // Only headers row
  XLSX.utils.book_append_sheet(wb, ws, "EmployeeTemplate");

  XLSX.writeFile(wb, "EmployeeTemplate.xlsx");
};





  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
   // Upload Excel handler
const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    const formData = new FormData();
    formData.append("file", file); // 👈 Must match multer.single("file")

    try {
      const res = await axios.post(`${BASE_URL}/staffimport`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // if using auth
        },
      });
      console.log("Upload success:", res.data);
      alert ("employee list imported successfully!")
      navigate("/employee");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };





  return (
    <div className="flex flex-col min-h-screen gap-15">
      <div className="  dark:border-gray-700 ">
        <nav className="flex justify-evenly -mb-px">
          {tabs.map((tab, index) => (
            <>
              {index > 0 && (
                <span className="bg-gray-300 dark:bg-red-700 w-[50px] h-[2px] mt-5 items-center"></span>
              )}
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={` font-medium text-sm  ${
                  activeTab === tab.id
                    ? " text-gray-200 dark:bg-gray-800 dark:text-red-800 hover:border-gray-300 bg-red-700 w-[120px] h-[40px] rounded-sm "
                    : "border-transparent text-gray-700 hover:text-red-700 dark:bg-gray-600 dark:text-gray-100 hover:border-gray-300 bg-gray-200 w-[120px] h-[40px] rounded-sm "
                }`}
              >
                {tab.label}
              </button>
            </>
          ))}
        </nav>
      </div>

      <div className="p-4 flex-grow">
        {activeTab === "employee" && (
          <>
            <div className="flex flex-col min-h-screen mt-[-30px]">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
                    Employee Management
                  </h2>
                  <Toaster position={toastposition} reverseOrder={false} />

                  {/* {isMobile && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-gray-200 rounded-md"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            )} */}
                </div>

                <div className={`flex items-end justify-end gap-4 mb-5`}>
                  <div className={`flex flex-row gap-4`}>
                    <Dropdown
                      options={pageSizeOptions}
                      selectedValue={pageSize}
                      onSelect={handlePageSizeChange}
                      placeholder="Items per page"
                      className="w-full md:w-[150px]"
                    />
                   

                              <button
                onClick={handleDownloadTemplate }
                className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
              >
                <FileDown className="mr-1" />
                {!isMobile && "Download Template"}
              </button>





<div className="flex flex-col items-start">  {/* 👈 changed to items-start */}
    <label className="flex items-center justify-center text-gray-400 bg-white font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-green-700/70 px-3 py-2.5 cursor-pointer">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="hidden"
      />
      <CgExport className="mr-1" />
      Upload Excel
    </label>


  </div>

    {/* ✅ left-aligned filename */}
    {file && (
      <span
        className="text-xs text-green-500 mt-1 max-w-[140px] truncate"
        title={file.name}
      >
        {file.name}
      </span>
    )}
  {/* Upload button */}


  <button
    onClick={handleUpload}
    className="flex items-center justify-center text-gray-400 bg-white font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-green-700/70 px-3 py-2.5"
  >
    Upload
  </button>




                    <button
                      onClick={handleOnExport}
                      className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
                    >
                      <FileDown className="mr-1" />
                      Export Excel
                    </button>{" "}


<button
                onClick={handleOnExportPDF}
                className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-2.5"
              >
                <FileDown className="mr-1" />
                {!isMobile && "Export PDF"}
              </button>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
                    >
                      + New Employee
                    </button>
                  </div>
                </div>

                <div
                  className={`${isMobile && !showFilters ? "hidden" : "block"} mb-4`}
                >
                  <div
                    className={`${isMobile ? "grid grid-cols-1 gap-3" : "flex flex-wrap justify-between items-center gap-3"}`}
                  >
                    <Dropdown
                      options={statusOptions}
                      selectedValue={selectStatus}
                      onSelect={handleStatusChange}
                      placeholder="Branch Status"
                      className="w-full md:w-[200px]"
                    />

                    <Dropdown
                      options={branchCodeOptions}
                      selectedValue={selectedBranchCode}
                      onSelect={handleBranchCodeChange}
                      placeholder="Branch Code"
                      className="w-full md:w-[200px]"
                      isLoading={isStoreLoading}
                    />

                    <Dropdown
                      options={roleOptions}
                      selectedValue={selectedRole}
                      onSelect={handleRoleChange}
                      placeholder="Manager"
                      className="w-full md:w-[200px]"
                      isLoading={isStoreLoading}
                    />

                    <button
                      onClick={toggleSortOrder}
                      className={`${isMobile ? "w-full" : "w-[200px]"} h-[40px] text-white bg-[var(--color-primary)] hover-effect px-2 py-1 rounded-sm`}
                    >
                      Sort {sortOrder === "desc" ? "↑" : "↓"}
                    </button>

                    <div
                      className={`${isMobile ? "w-full" : "w-[200px] mt-3"}`}
                    >
                      <SearchInput
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search branches..."
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {loading && <div className="text-center py-4">Loading...</div>}
                {error && (
                  <div className="text-red-500 text-center py-4">{error}</div>
                )}

                <div className="overflow-x-auto">
                  <DataTable
                    thead={thead}
                    tbody={tbody}
                    responsive={true}
                    className="min-w-full"
                    enableFilters={true}
  enableSorting={true}
  onRowDoubleClick={(row) => handleView(row.id)}

                  />
                </div>
              </div>

              <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
                <CustomPagination
                  total={totalItem}
                  currentPage={currentPage}
                  defaultPageSize={pageSize}
                  onChange={handlePageChange}
                  paginationLabel="Employees"
                  isScroll={true}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === "salary" && (
          <div>
            <EmployeeSalary />
          </div>
        )}

        {activeTab === "leave" && (
          <div>
            {/*<Documents />*/}
            <SalaryRevisionTracker />
          </div>
        )}

        {activeTab === "interview" && (
          <div>
            <OfferLettersGenerative />
          </div>
        )}
        {activeTab === "termination" && (
          <div>
            <Termination />
          </div>
        )}
      </div>
      <Modal
        isVisible={showDeleteModal}
        className="w-full md:w-[600px]"
        onClose={() => setShowDeleteModal(false)}
        title="Delete Branch"
closeOnOutsideClick={false}

      >
        {/* <div className="flex flex-col gap-6 ">
          <p className="text-gray-500 text-lg font-bold text-center">
            Are you sure you want to Inactive this Employee?
          </p>
          <div className="flex justify-around">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Type
              </label>
              <select
                name="type"
                value={inActiveData.type}
                onChange={handleChange}
                className="max-w-[400px] w-[230px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                required
              >
                <option value="">Select</option>
                <option value="temp">Temporary</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={inActiveData.status}
                onChange={handleChange}
                className="max-w-[400px] w-[230px] bg-blue-200/25 dark:bg-gray-700 text-sm px-2 py-2 border border-gray-400 dark:border-gray-600 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-600 focus:border-gray-400 dark:focus:border-gray-500 rounded"
                required
              >
                <option value="">Select</option>
                <option value="inactive">inactive</option>
                <option value="relive">relive</option>
                <option value="pending">pending</option>
                <option value="abscond">abscond</option>
                <option value="resigned">resigned</option>
                <option value="terminated">terminated</option>
              </select>
            </div>
          </div>
          <div className="flex mt-5  flex-wrap justify-center gap-5">
            <button
              type="button"
              className="px-4 py-2 bg-[var(--color-secondary)] hover:bg-[var(--color-hover-secondary)] text-gray-800 hover-effect dark:text-gray-700 rounded dark:hover:bg-gray-500 transition"
              disabled={loading}
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-hover)] hover-effect transition"
              disabled={loading}
              onClick={handleDeleteSubmit}
            >
              {loading ? <ButtonLoader /> : "Confirm"}
            </button>
          </div>
        </div> */}
        <div className="flex flex-col gap-6 dark:bg-gray-800 bg-white p-6 rounded-lg">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <AlertTriangle className="inline mr-2" /> Inactive Employee
            </h3>

            <p className="text-gray-500 text-sm font-medium text-center">
              Are you sure you want to inactivate this employee?
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <Calendar className="inline mr-1" size={14} /> Type
                </p>
                <select
                  name="type"
                  value={inActiveData.type}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="temp">Temporary</option>
                  <option value="permanent">Permanent</option>
                </select>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <UserX className="inline mr-1" size={14} /> Status
                </p>
                <select
                  name="status"
                  value={inActiveData.status}
                  onChange={handleChange}
                  className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="inactive">Inactive</option>
                  <option value="relive">Relive</option>
                  <option value="pending">Pending</option>
                  <option value="abscond">Abscond</option>
                  <option value="resigned">Resigned</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              className="px-5 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md transition-colors duration-200 font-medium text-sm"
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-5 py-2 bg-red-700 hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-md transition-colors duration-200 font-medium text-sm shadow-sm"
              onClick={handleDeleteSubmit}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isVisible={showCreateModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowCreateModal(false)}
        title="Create New Employee"
closeOnOutsideClick={false}
        
      >
        <EmployeeForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Employee;
