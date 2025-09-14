import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Dropdown from "src/component/DrapDown";
import { Dot, Eye, FileDown, PenBox, User } from "lucide-react";
import * as XLSX from "xlsx";
import Modal from "src/component/Modal";
import CreateBranchForm from "../Branch/CreateBranchForm";
import UpdateAttendanceForm from "./UpdateAttendance";
import AttendanceReport from "./AttendnceReport";
import AttendanceLogList from "./AttendanceLogList";
import AttendanceSheet from "./AttendanceSheet";
import AttendanceReportSheet from "./AttendanceReportSheet";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
const Attandance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");
  const [activeTab, setActiveTab] = useState("employeeattandance");

  const accesstoken = useAuthStore((state) => state.accessToken);
  // const permission = useAuthStore((state) => state.permissions);
  const staff_id = useAuthStore((state) => state.staff_id);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  // const [showEditModal, setShowEditModal] = useState(false);
  // const role = useAuthStore((state) => state.role);

  const filterOptions = [
    { value: "client", label: "Client" },
    { value: "Project", label: "Project" },
    { value: "Leads", label: "Leads" },
    { value: "Employee", label: "Employee" },
  ];

  const statusOptions = [
    { value: "Pending", label: "Pending" },
    { value: "Paid", label: "Paid" },
    { value: "Un Paid", label: "Un-Paid" },
  ];

  const data = [
    {
      id: "SAL_12",
      date: "25-05-2025",
      name: "Bharathi",
      status: "Presend",
      checkin: "true",
      checkInTime: "09:04 AM",
      checkout: "true",
      checkouttime: "06:00 PM",
    },
    {
      id: "AC_12",
      date: "25-05-2025",
      name: "Karthick",
      status: "Absent",
      checkin: "false",
      checkInTime: "--",
      checkouttime: "--",
      checkout: "false",
    },
  ];


  const [hydrated, setHydrated] = useState(false);



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

const permission = useAuthStore((state) => state.permissions);
const userRole = permission?.[0]?.role || null;

const role = useAuthStore((state) => state.role);


  // const tabs = [
  //   { id: "employeeattandance", label: " Attendance Log" },
  //   { id: "createattendance", label: " Attendance Entry" },
  //   { id: "attendancereport", label: "Report" },
  //   // {id:"attendancesheet",label:"Attendance Report"}
  // ];

  const tabs =
  role === "superadmin" || role === "hr" || role === "admin"
    ? [
        { id: "employeeattandance", label: "Attendance Log" },
        { id: "createattendance", label: "Attendance Entry" },
        { id: "attendancereport", label: "Report" },
        {id:"attendancesheet",label:"Attendance Report"},
      ]
    : [
        { id: "employeeattandance", label: "Attendance Log" },
      ];



  const getData = () => {
    return data;
  };

  useEffect(() => {
    if (hydrated && token) {
    setSheetData(getData());
  }
  }, [hydrated,token]);


  const thead = () => [
    { data: "Employee ID" },
    { data: " Name" },
    { data: "Date" },
    { data: "Status " },
    { data: "Check-in " },
    { data: " Check-out" },
    { data: "Update" },
  ];

  const tbody = () => {
    if (!data) return [];
    return data.map((user) => ({
      id: user.id,
      data: [
        { data: user.id },
        { data: user.name },
        { data: user.date },
        {
          data: (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-light ${
                user.status === "Presend"
                  ? "bg-green-100 text-green-800 dark:bg-green-800/25 dark:text-green-400"
                  : user.status === "Absent"
                    ? "bg-red-100 text-red-800 dark:bg-red-800/25 dark:text-red-300"
                    : "bg-amber-200/25 dark:bg-yellow-500/25 dark:text-yellow-300 text-yellow-800"
              }`}
            >
              <Dot />
              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
            </div>
          ),
        },
        {
          data: (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${
                user.checkin === "true"
                  ? " text-green-800"
                  : user.checkin === "false"
                    ? " text-red-800"
                    : "bg-amber-500/25 text-yellow-800"
              }`}
            >
              {user.checkin === "true" ? "🟢" : "🔴"}
              {user.checkInTime}
            </div>
          ),
        },
        {
          data: (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-bold ${
                user.checkin === "true"
                  ? " text-green-800"
                  : user.checkin === "false"
                    ? " text-red-800"
                    : "bg-amber-500/25 text-yellow-800"
              }`}
            >
              {user.checkout === "true" ? "🟢" : "🔴"}
              {user.checkouttime}
            </div>
          ),
        },

        {
          data: (
            <button
              className="  px-4 py-2 dark:text-red-300 text-red-700 rounded-sm"
              onClick={() => setShowModal(true)}
            >
              <PenBox className="inline" size={15} /> Update
            </button>
          ),
        },
      ],
    }));
  };

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Almino");
    XLSX.writeFile(wb, "EmployeeList.xlsx");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="  dark:border-gray-700 mb-[60px] ">
        <nav className="flex justify-evenly -mb-px">
          {tabs.map((tab, index) => (
            <>
              {index > 0 && (
                <span className="bg-gray-300 dark:bg-red-700 w-[50px] h-[2px] mt-5 items-center"></span>
              )}
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={` font-medium text-sm ${
                  activeTab === tab.id
                    ? " text-gray-200 dark:bg-gray-800 dark:text-red-800 hover:border-gray-300 bg-red-700 w-[150px] h-[40px] rounded-sm "
                    : "border-transparent text-gray-700 hover:text-red-700 dark:bg-gray-600 dark:text-gray-100 hover:border-gray-300 bg-gray-200 w-[150px] h-[40px] rounded-sm "
                }`}
              >
                {tab.label}
              </button>
            </>
          ))}
        </nav>
      </div>
      <div className="p-4 flex-grow">
        {activeTab === "employeeattandance" && (
          <AttendanceLogList />
        )}
        {activeTab === "attendancesheet" && (
          <div>
            <AttendanceReportSheet/>
          </div>
        )}
       


        {activeTab === "createattendance" && (
          <div>
            <AttendanceSheet />
          </div>
        )}

        {activeTab === "attendancereport" && (
          <div>
            <AttendanceReport />
          </div>
        )}


      {/*  {role === "superadmin" && role === "hr" && role === "admin" && (
  <>
    {activeTab === "createattendance" && (
      <div>
        <AttendanceSheet />
      </div>
    )}

    {activeTab === "attendancereport" && (
      <div>
        <AttendanceReport />
      </div>
    )}
  </>
)}
*/}

        <Modal
          isVisible={showModal}
          className="w-full md:w-[800px]"
          onClose={() => setShowModal(false)}
          title="ATTENDANCE APPROVAL "
        >
          <UpdateAttendanceForm />
        </Modal>
      </div>
    </div>
  );
};

export default Attandance;
