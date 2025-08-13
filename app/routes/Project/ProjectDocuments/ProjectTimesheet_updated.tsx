
// import { useEffect, useState } from "react";
// import DataTable from "src/component/DataTable";
// import CustomPagination from "src/component/CustomPagination";
// import Dropdown from "src/component/DrapDown";
// import { CalendarFold, FileDown, SquareKanban, UserCheck, SortAsc, SortDesc } from "lucide-react";
// import * as XLSX from "xlsx";
// import axios from "axios";
// import { BASE_URL, toastposition } from "~/constants/api";
// import toast, { Toaster } from "react-hot-toast";
// import { useAuthStore } from "src/stores/authStore";
// import useBranchStore from "src/stores/useBranchStore";
// import { useMediaQuery } from "~/routes/hooks/use-click-outside";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// const EmployeeTimeSheet = () => {
//   const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [totalItem, setTotalItem] = useState(0);
//   const [error, setError] = useState(null);
//   const [selectedBranchCode, setSelectedBranchCode] = useState("");
//   const [selectedStaffId, setSelectedStaffId] = useState("");
//   const [selectedProjectCode, setSelectedProjectCode] = useState("");
//   const [taskId, setTaskId] = useState("");
//   const [pageSize, setPageSize] = useState(10);
//   const [reportData, setReportData] = useState(null);
//   const [checkInOutData, setCheckInOutData] = useState(null);
//   const [startDate, setStartDate] = useState(null);
//   const [endDate, setEndDate] = useState(null);
//   const [staffOptions, setStaffOptions] = useState([]);
//   const [projectOptions, setProjectOptions] = useState([]);
//   const [activeTab, setActiveTab] = useState("checkinout");
//   const [sortOrder, setSortOrder] = useState("");
//   const token = useAuthStore((state) => state.accessToken);
// const permission=useAuthStore((state)=>state.permissions)
// const staff_id=useAuthStore((state)=>state.staff_id)
// const branchcode=useAuthStore((state)=>state.branchcode)
// const role=permission[0].role
// console.log('ermisssionnnff',permission,staff_id,role)

//   const {
//     branchCodeOptions,
//     fetchBranches,
//     isLoading: isStoreLoading,
//   } = useBranchStore();

//   const pageSizeOptions = [
//     { value: 10, label: "10 per page" },
//     { value: 20, label: "20 per page" },
//     { value: 50, label: "50 per page" },
//     { value: 100, label: "100 per page" },
//   ];

//   useEffect(() => {
//     fetchBranches(token);
//   }, [token]);

//   // Fetch staff options when branch code changes
//   useEffect(() => {
//     const getStaffOptions = async () => {
//       if (!selectedBranchCode) {
//         setStaffOptions([]);
//         return;
//       }
      
//       setLoading(true);
//       try {
//         const url = `${BASE_URL}/users/read?branchcode=${selectedBranchCode}`;
//         const response = await axios.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data && response.data.data) {
//           const options = response.data.data.map((staff) => ({
//             value: staff.staff_id,
//             label: `${staff.firstname} ${staff.lastname} (${staff.staff_id})`,
//           }));
//           setStaffOptions(options);
//         }
//       } catch (error) {
//         console.error("Error fetching staff list", error);
//         toast.error("Failed to fetch staff");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getStaffOptions();
//   }, [selectedBranchCode, token]);

//   // Fetch project options when branch code changes
//   useEffect(() => {
//     const getProjectOptions = async () => {
//       if (!selectedBranchCode) {
//         setProjectOptions([]);
//         return;
//       }
      
//       setLoading(true);
//       try {
//         const url = `${BASE_URL}/project/overview/dropdown?branchcode=${selectedBranchCode}`;
//         const response = await axios.get(url, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.data && response.data.data) {
//           const options = response.data.data.map((project) => ({
//             value: project.project_code,
//             label: project.title,
//           }));
//           setProjectOptions(options);
//         }
//       } catch (error) {
//         console.error("Error fetching project list", error);
//         toast.error("Failed to fetch projects");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getProjectOptions();
//   }, [selectedBranchCode, token]);

//   // Fetch report data when filters change
// //   const fetchReportData = async () => {
// //     if (!selectedStaffId || !selectedProjectCode) {
// //       setReportData(null);
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       let url = `${BASE_URL}/report/tasksummary/read?project_code=${encodeURIComponent(selectedProjectCode)}&staff_id=${encodeURIComponent(selectedStaffId)}`;
      
// //       if (startDate) {
// //         const formattedStartDate = formatDate(startDate);
// //         url += `&start_date=${formattedStartDate}`;
// //       }
// //       if (endDate) {
// //         const formattedEndDate = formatDate(endDate);
// //         url += `&end_date=${formattedEndDate}`;
// //       }

// //       const response = await axios.get(url, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });

// //       if (response.data) {
// //         setReportData(response.data);
// //         setTotalItem(response.data.data?.summary?.length || 0);
// //       }
// //     } catch (error) {
// //       console.error("Error fetching time sheet report", error);
// //       toast.error("Failed to fetch time sheet report");
// //       setError("Failed to fetch report");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

//   // Fetch check-in/check-out data
//   const fetchCheckInOutData = async () => {
//     if (!selectedStaffId) {
//       setCheckInOutData(null);
//       return;
//     }

//     setLoading(true);
//     try {
//       let url = `${BASE_URL}/project/task/checkinout/read?staff_id=${encodeURIComponent(selectedStaffId)}`;
      
//       if (taskId) {
//         url += `&task_id=${taskId}`;
//       }
//       if (startDate) {
//         const formattedStartDate = formatDate(startDate);
//         url += `&start_date=${formattedStartDate}`;
//       }
//       if (endDate) {
//         const formattedEndDate = formatDate(endDate);
//         url += `&end_date=${formattedEndDate}`;
//       }
//       if (sortOrder) {
//         url += `&dec=${sortOrder}`;
//       }

//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data) {
//         setCheckInOutData(response.data);
//         setTotalItem(response.data.data?.length || 0);
//       }
//     } catch (error) {
//       console.error("Error fetching check-in/out data", error);
//       toast.error("Failed to fetch check-in/out data");
//       setError("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return '';
//     const d = new Date(date);
//     const year = d.getFullYear().toString().slice(-2);
//     const month = (d.getMonth() + 1).toString().padStart(2, '0');
//     const day = d.getDate().toString().padStart(2, '0');
//     return `${year}-${month}-${day}`;
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleBranchCodeChange = (value) => {
//     setSelectedBranchCode(value);
//     setSelectedStaffId("");
//     setSelectedProjectCode("");
//     setTaskId("");
//     setCurrentPage(1);
//   };

//   const handleStaffChange = (value) => {
//     setSelectedStaffId(value);
//     setCurrentPage(1);
//   };

//   const handleProjectChange = (value) => {
//     setSelectedProjectCode(value);
//     setCurrentPage(1);
//   };

//   const handleTaskIdChange = (e) => {
//     setTaskId(e.target.value);
//   };

//   const handlePageSizeChange = (value) => {
//     setPageSize(value);
//     setCurrentPage(1);
//   };

//   const handleDateChange = (dates) => {
//     const [start, end] = dates;
//     setStartDate(start);
//     setEndDate(end);
//   };

//   const toggleSortOrder = () => {
//     setSortOrder(prev => prev === "desc" ? "" : "desc");
//   };

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setCurrentPage(1);
//   };

//   const handleOnExport = () => {
//     let dataToExport = [];
//     let fileName = "";

//     if (activeTab === "timesheetreport" && reportData?.data?.summary) {
//       dataToExport = reportData.data.summary;
//       fileName = "TimeSheetReport";
//     } else if (activeTab === "checkinout" && checkInOutData?.data) {
//       dataToExport = checkInOutData.data;
//       fileName = "CheckInOutReport";
//     }

//     if (dataToExport.length === 0) {
//       toast.error("No data to export");
//       return;
//     }

//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(dataToExport);
//     XLSX.utils.book_append_sheet(wb, ws, fileName);
//     XLSX.writeFile(wb, `${fileName}.xlsx`);
//   };

//   const generateReport = () => {
//          fetchCheckInOutData();

//   };

//   // Table configurations
// //   const timesheetThead = () => [
// //     { data: "Task ID" },
// //     { data: "Task Title" },
// //     { data: "Priority" },
// //     { data: "Status" },
// //     { data: "Subtask" },
// //     { data: "Rating" },
// //     { data: "Duration (mins)" },
// //     { data: "Delay By" },
// //     { data: "Delay Reason" },
// //     { data: "Last Check-in" },
// //     { data: "Last Check-out" },
// //   ];

// //   const timesheetTbody = () => {
// //     if (!reportData?.data?.summary) return [];
    
// //     return reportData.data.summary.map((item, index) => ({
// //       id: item.task_id || index,
// //       data: [
// //         { data: item.task_id },
// //         { data: item.task_title },
// //         { data: item.task_priority },
// //         { data: item.task_status },
// //         { data: item.subtask_title },
// //         { data: item.rating },
// //         { data: item.total_duration_minutes },
// //         { data: item.delay_by || "Task Ontime" },
// //         { data: item.delay_reason || "No Delay Reason" },
// //         { data: new Date(item.last_check_in).toLocaleString() },
// //         { data: new Date(item.last_check_out).toLocaleString() },
// //       ],
// //     }));
// //   };

//   const checkInOutThead = () => [
//     {data:"Id"},
//     { data: "Task ID" },
//     { data: "Project" },
//     { data: "Task" },
//     { data: "Subtask" },
//     { data: "Check-in" },
//     { data: "Check-out" },
//     { data: "Duration (mins)" },
//     { data: "Staff" },
//   ];

//   const checkInOutTbody = () => {
//     if (!checkInOutData?.data) return [];
    
//     return checkInOutData.data.map((item, index) => ({
//       id: item.id || index,
//       data: [
//         {data:index+1},
//         { data: item.task_id },
//         { data: item.project_title },
//         { data: item.task_title },
//         { data: item.subtask_title },
//         { data: new Date(item.check_in).toLocaleString() },
//         { data: item.check_out ? new Date(item.check_out).toLocaleString() : "Still checked in" },
//         { data: item.duration },
//         { data: item.staff_name },
//       ],
//     }));
//   };

//   return (
//     <>
//       <div className="flex flex-col min-h-screen">
//         <div className="p-4 flex-grow">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-5">
//               Employee Check In - Check Out
//             </h2>
//             {isMobile && (
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="p-2 bg-gray-200 rounded-md"
//               >
//                 {showFilters ? "Hide Filters" : "Show Filters"}
//               </button>
//             )}
//           </div>
//           <Toaster position={toastposition} reverseOrder={false} />

//           {/* Tabs */}
//           {/* <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
//             <nav className="flex -mb-px">
//               <button
//                 onClick={() => handleTabChange("timesheetreport")}
//                 className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "timesheetreport"
//                     ? "border-red-500 text-red-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Time Sheet Report
//               </button>
//               <button
//                 onClick={() => handleTabChange("checkinout")}
//                 className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === "checkinout"
//                     ? "border-red-500 text-red-600"
//                     : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//                 }`}
//               >
//                 Check-in/Check-out
//               </button>
//             </nav>
//           </div> */}

//           <div className="flex flex-col gap-4 mb-5">
//             <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-20">
//               <Dropdown
//                 options={branchCodeOptions}
//                 selectedValue={selectedBranchCode}
//                 onSelect={handleBranchCodeChange}
//                 placeholder="Select Branch"
//                 className="w-[245px]"
//                 isLoading={isStoreLoading}
//               />
              
//               <Dropdown
//                 options={staffOptions}
//                 selectedValue={selectedStaffId}
//                 onSelect={handleStaffChange}
//                 placeholder="Select Staff"
//                 className="w-[245px]"
//                 disabled={!selectedBranchCode}
//                 isLoading={loading}
//               />
        

             
//                 <div className="w-[245px]">
//                   <input
//                     type="number"
//                     value={taskId}
//                     onChange={handleTaskIdChange}
//                     placeholder="Enter Task ID (optional)"
//                     className="w-full p-2 border rounded"
//                   />
//                 </div>
            
//                  <Dropdown
//                   options={pageSizeOptions}
//                   selectedValue={pageSize}
//                   onSelect={handlePageSizeChange}
//                   placeholder="Items per page"
//                   className="w-[245px]"
//                 />
//               {/* <div className="w-full">
//                 <DatePicker
//                   selectsRange={true}
//                   startDate={startDate}
//                   endDate={endDate}
//                   onChange={handleDateChange}
//                   placeholderText="Select date range"
//                   className="w-full p-2 border rounded"
//                   isClearable={true}
//                 />
//               </div> */}
//             </div>

//             <div className="flex flex-wrap justify-between items-center gap-19">
//               <div className="flex gap-19">
             
                
               
//                   <button
//                     onClick={toggleSortOrder}
//                     className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect px-20 h-[40px] rounded-sm"
//                   >
//                     {sortOrder === "desc" ? <SortDesc className="mr-1" /> : <SortAsc className="mr-1" />}
//                     Sort {sortOrder === "desc" ? "Desc" : "Asc"}
//                   </button>
                
                
//                 <button
//                   onClick={handleOnExport}
//                   className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-2.5 dark:bg-gray-800 dark:text-gray-300 py-2.5 w-[245px]"
//                   disabled={
//                     (activeTab === "timesheetreport" && !reportData?.data?.summary) ||
//                     (activeTab === "checkinout" && !checkInOutData?.data)
//                   }
//                 >
//                   <FileDown className="mr-1" />
//                   {!isMobile && "Export Excel"}
//                 </button>
//               </div>
              
//               <button
//                 onClick={generateReport}
//                 className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
//                 disabled={
//                   (activeTab === "timesheetreport" && (!selectedStaffId || !selectedProjectCode)) ||
//                   (activeTab === "checkinout" && !selectedStaffId) ||
//                   loading
//                 }
//               >
//                 {loading ? "Loading..." : "Generate Report"}
//               </button>
//             </div>
//           </div>

//           {(reportData || checkInOutData) && (
//             <div className="mb-6 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
//               <h3 className="text-lg text-red-700 font-semibold mb-2">Report Summary</h3>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <p className="text-sm text-gray-500 mb-3"><SquareKanban className="inline" size={20}/> {activeTab === "timesheetreport" ? "Project Code" : "Staff ID"}</p>
//                   <p className="font-medium">
//                     {activeTab === "timesheetreport" ? reportData?.data?.project_code : selectedStaffId}
//                   </p>
//                 </div>
//                 {activeTab === "checkinout" && taskId && (
//                   <div>
//                     <p className="text-sm text-gray-500 mb-3"><SquareKanban className="inline" size={20}/> Task ID</p>
//                     <p className="font-medium">{taskId}</p>
//                   </div>
//                 )}
//                 <div>
//                   <p className="text-sm text-gray-500 mb-3"><CalendarFold className="inline" size={20}/> Date Range</p>
//                   <p className="font-medium">
//                  Total working Durations: -890
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {loading && <div className="text-center py-4">Loading...</div>}
//           {error && (
//             <div className="text-red-500 text-center py-4">{error}</div>
//           )}

//           {/* {activeTab === "timesheetreport" && reportData?.data?.summary && (
//             <>
//               <div className="overflow-x-auto">
//                 <DataTable
//                   thead={timesheetThead}
//                   tbody={timesheetTbody}
//                   responsive={true}
//                   className="min-w-full"
//                 />
//               </div>

//               <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
//                 <CustomPagination
//                   total={totalItem}
//                   currentPage={currentPage}
//                   defaultPageSize={pageSize}
//                   onChange={handlePageChange}
//                   paginationLabel="tasks"
//                   isScroll={true}
//                 />
//               </div>
//             </>
//           )} */}

//           {activeTab === "checkinout" && checkInOutData?.data && (
//             <>
//               <div className="overflow-x-auto">
//                 <DataTable
//                   thead={checkInOutThead}
//                   tbody={checkInOutTbody}
//                   responsive={true}
//                   className="min-w-full"
//                 />
//               </div>

//               <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
//                 <CustomPagination
//                   total={totalItem}
//                   currentPage={currentPage}
//                   defaultPageSize={pageSize}
//                   onChange={handlePageChange}
//                   paginationLabel="records"
//                   isScroll={true}
//                 />
//               </div>
//             </>
//           )}

//           {!loading && 
//             ((activeTab === "timesheetreport" && !reportData) || 
//              (activeTab === "checkinout" && !checkInOutData)) && (
//             <div className="text-center py-10 text-gray-500">
//               {selectedBranchCode 
//                 ? (activeTab === "timesheetreport" 
//                     ? (!selectedStaffId || !selectedProjectCode 
//                         ? "Please select both Staff and Project to generate report"
//                         : "Click 'Generate Report' to view data")
//                     : (!selectedStaffId
//                         ? "Please select Staff to view check-in/out data"
//                         : "Click 'Generate Report' to view data"))
//                 : "Please select a Branch to view available options"}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default EmployeeTimeSheet;
import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import Dropdown from "src/component/DrapDown";
import { CalendarFold, FileDown, SquareKanban, UserCheck, SortAsc, SortDesc, Hourglass } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import { useMediaQuery } from "~/routes/hooks/use-click-outside";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ProjectTimesheet = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [selectedProjectCode, setSelectedProjectCode] = useState("");
  const [taskId, setTaskId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [reportData, setReportData] = useState(null);
  const [checkInOutData, setCheckInOutData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [staffOptions, setStaffOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [activeTab, setActiveTab] = useState("checkinout");
  const [sortOrder, setSortOrder] = useState("");

  // Auth store data
  const token = useAuthStore((state) => state.accessToken);
  const permission = useAuthStore((state) => state.permissions);
  const staff_id = useAuthStore((state) => state.staff_id);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  const [totalDuration,setTotalDuration]=useState(0)
  const role = permission[0]?.role || 'employee'; // Default to employee if no role
console.log("roleeeeee",role,userBranchCode,staff_id)
  console.log('User role and details:', { role, staff_id, userBranchCode });

  const {
    branchCodeOptions,
    fetchBranches,
    isLoading: isStoreLoading,
  } = useBranchStore();

  const pageSizeOptions = [
    { value: 10, label: "10 per page" },
    { value: 20, label: "20 per page" },
    { value: 50, label: "50 per page" },
    { value: 100, label: "100 per page" },
  ];

  // Filter branch options based on user role
  const filteredBranchOptions = () => {
    if (role === 'superadmin') {
      return branchCodeOptions;
    } else if (role === 'team-lead') {
      return branchCodeOptions.filter(branch => branch.value === userBranchCode);
    }
    return []; // Employees don't need branch selection
  };

  useEffect(() => {
    if (role === 'superadmin' || role === 'team-lead') {
      fetchBranches(token);
    }
  }, [token, role]);

  // Set initial branch code for team-lead
  useEffect(() => {
    if (role === 'team-lead') {
      setSelectedBranchCode(userBranchCode);
    }
  }, [role, userBranchCode]);

  // Set staff ID for employee
  useEffect(() => {
    if (role !== 'team-lead' && role !== "superadmin") {
      setSelectedStaffId(staff_id);
    }
  }, [role, staff_id]);

  // Fetch staff options when branch code changes (for superadmin and team-lead)
  useEffect(() => {
    const getStaffOptions = async () => {
      if ((role === 'superadmin' && !selectedBranchCode) || 
          (role === 'team-lead' && !userBranchCode)) {
        setStaffOptions([]);
        return;
      }
      
      setLoading(true);
      try {
        const branchToUse = role === 'team-lead' ? userBranchCode : selectedBranchCode;
        const url = `${BASE_URL}/users/read?branchcode=${branchToUse}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const options = response.data.data.map((staff) => ({
            value: staff.staff_id,
            label: `${staff.firstname} ${staff.lastname} (${staff.staff_id})`,
          }));
          setStaffOptions(options);
        }
      } catch (error) {
        console.error("Error fetching staff list", error);
        toast.error("Failed to fetch staff");
      } finally {
        setLoading(false);
      }
    };

    if (role === 'superadmin' || role === 'team-lead') {
      getStaffOptions();
    }
  }, [selectedBranchCode, token, role, userBranchCode]);

  // Fetch project options when branch code changes
  useEffect(() => {
    const getProjectOptions = async () => {
      if ((role === 'superadmin' && !selectedBranchCode) || 
          (role === 'team-lead' && !userBranchCode)) {
        setProjectOptions([]);
        return;
      }
      
      setLoading(true);
      try {
        const branchToUse = role === 'team-lead' ? userBranchCode : selectedBranchCode;
        const url = `${BASE_URL}/project/overview/dropdown?branchcode=${branchToUse}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const options = response.data.data.map((project) => ({
            value: project.project_code,
            label: project.title,
          }));
          setProjectOptions(options);
        }
      } catch (error) {
        console.error("Error fetching project list", error);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    if (role === 'superadmin' || role === 'team-lead') {
      getProjectOptions();
    }
  }, [selectedBranchCode, token, role, userBranchCode]);

  // Fetch check-in/check-out data
  const fetchCheckInOutData = async () => {
    const staffIdToUse = role !== 'team-lead' && role !=='superadmin' ? staff_id : selectedStaffId;
    
    if (!staffIdToUse) {
      setCheckInOutData(null);
      return;
    }

    setLoading(true);
    try {
      let url = `${BASE_URL}/project/task/checkinout/read`;
      
      if (taskId) {
        url += `&task_id=${taskId}`;
      }
      if (startDate) {
        const formattedStartDate = formatDate(startDate);
        url += `&start_date=${formattedStartDate}`;
      }
      if (endDate) {
        const formattedEndDate = formatDate(endDate);
        url += `&end_date=${formattedEndDate}`;
      }
      if (sortOrder) {
        url += `&dec=${sortOrder}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setCheckInOutData(response.data);
        setTotalItem(response.data.data?.length || 0);
      }
    } catch (error) {
      console.error("Error fetching check-in/out data", error);
      toast.error("Failed to fetch check-in/out data");
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear().toString().slice(-2);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBranchCodeChange = (value) => {
    setSelectedBranchCode(value);
    setSelectedStaffId("");
    setSelectedProjectCode("");
    setTaskId("");
    setCurrentPage(1);
  };

  const handleStaffChange = (value) => {
    setSelectedStaffId(value);
    setCurrentPage(1);
  };

  const handleProjectChange = (value) => {
    setSelectedProjectCode(value);
    setCurrentPage(1);
  };

  const handleTaskIdChange = (e) => {
    setTaskId(e.target.value);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "desc" ? "" : "desc");
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleOnExport = () => {
    let dataToExport = [];
    let fileName = "";

    if (activeTab === "timesheetreport" && reportData?.data?.summary) {
      dataToExport = reportData.data.summary;
      fileName = "TimeSheetReport";
    } else if (activeTab === "checkinout" && checkInOutData?.data) {
      dataToExport = checkInOutData.data;
      fileName = "CheckInOutReport";
    }

    if (dataToExport.length === 0) {
      toast.error("No data to export");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(wb, ws, fileName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const generateReport = () => {
    fetchCheckInOutData();
    
  };
// useEffect(()=>{
//     if(role !== 'superadmin' && role !== 'team-lead'){
//     fetchCheckInOutData()

//     }
// },[])

  useEffect(() => {
    fetchCheckInOutData();
  }, []);

  const checkInOutThead = () => [
    {data:"Id"},
    { data: "Task ID" },
    { data: "Project" },
    { data: "Task" },
    { data: "Subtask" },
    { data: "Check-in" },
    { data: "Check-out" },
    { data: "Duration (mins)" },
    { data: "Staff" },
  ];

  const checkInOutTbody = () => {
    if (!checkInOutData?.data) return [];
    
    return checkInOutData.data.map((item, index) => ({
      id: item.id || index,
      data: [
        {data:index+1},
        { data: item.task_id },
        { data: item.project_title },
        { data: item.task_title },
        { data: item.subtask_title },
        { data: new Date(item.check_in).toLocaleString() },
        { data: item.check_out ? new Date(item.check_out).toLocaleString() : "Still checked in" },
        { data: item.duration },
        { data: item.staff_name },
      ],
    }));
  };
// const calculateTotalDuration = () => {
//   if (!checkInOutData?.data) return 0;
  
//   return checkInOutData.data.reduce((total, item) => {
//     // Ensure duration is a number (some APIs might return it as string)
//     const duration = typeof item.duration === 'string' 
//       ? parseFloat(item.duration) 
//       : item.duration;
      
//     return total + (duration || 0);
//   }, 0);
// };
const calculateTotalDuration=()=>{
    if(!checkInOutData) return 0;
    return checkInOutData.data.reduce((total,item)=>{
        const duration=typeof item.duration === 'string'
        ? parseFloat(item.duration)
        :item.duration;
        return total+(duration || 0)
    },0)
    
}

  useEffect(() => {
    if (checkInOutData?.data) {
      setTotalDuration(calculateTotalDuration());
    } else {
      setTotalDuration(0);
    }
  }, [checkInOutData]);
console.log("calculatetotallldura",calculateTotalDuration())
const formatDuration = (minutes: number) => {
  if (isNaN(minutes)) return "0 minutes";
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  }
};

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-5">
              Employee Check In - Check Out
            </h2>
          </div>
          <Toaster position={toastposition} reverseOrder={false} />

          <div className="flex flex-col gap-4 mb-5">
            <div className={`grid grid-cols-1${role !== "superadmin" && role !== "team-lead"?"md:grid-cols-2 lg:grid-cols-2 gap-3": " md:grid-cols-4 lg:grid-cols-4 gap-20" }  `}>
              {/* Branch dropdown - only for superadmin and team-lead */}
              {(role === 'superadmin' || role === 'team-lead') && (
                <Dropdown
                  options={filteredBranchOptions()}
                  selectedValue={selectedBranchCode}
                  onSelect={handleBranchCodeChange}
                  placeholder="Select Branch"
                  className="w-[245px]"
                  isLoading={isStoreLoading}
                  disabled={role === 'team-lead'} // Disabled for team-lead as we auto-set their branch
                />
              )}
              
              {/* Staff dropdown - only for superadmin and team-lead */}
              {(role === 'superadmin' || role === 'team-lead') && (
                <Dropdown
                  options={staffOptions}
                  selectedValue={selectedStaffId}
                  onSelect={handleStaffChange}
                  placeholder="Select Staff"
                  className="w-[245px]"
                  disabled={role === 'team-lead' ? !userBranchCode : !selectedBranchCode}
                  isLoading={loading}
                />
              )}

              {/* Task ID input - visible for all roles */}
              <div className="w-[245px]">
                <input
                  type="number"
                  value={taskId}
                  onChange={handleTaskIdChange}
                  placeholder="Enter Task ID (optional)"
                  className="w-full p-2 border rounded h-[40px]"
                />
              </div>
            
              <Dropdown
                options={pageSizeOptions}
                selectedValue={pageSize}
                onSelect={handlePageSizeChange}
                placeholder="Items per page"
                className="w-[245px]"
              />
            </div>

            <div className="flex flex-wrap justify-between items-center ">
              <div className={`flex  ${role !== "superadmin" && role !== "team-lead"? "gap-91":"gap-19" }`}>
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect px-18 h-[40px] rounded-sm"
                >
                  {sortOrder === "desc" ? <SortDesc className="mr-1" /> : <SortAsc className="mr-1" />}
                  Sort {sortOrder === "desc" ? "Desc" : "Asc"}
                </button>
                
                <button
                  onClick={handleOnExport}
                  className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-2 dark:bg-gray-800 dark:text-gray-300 py-2 w-[245px]"
                  disabled={!checkInOutData?.data}
                >
                  <FileDown className="mr-1" />
                  {!isMobile && "Export Excel"}
                </button>
              </div>
              
              <button
                onClick={generateReport}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5"
                disabled={
                  (role !== 'team-lead' && role !=="superadmin" ? false : !selectedStaffId) ||
                  loading
                }
              >
                {loading ? "Loading..." : "Generate Report"}
              </button>
            </div>
          </div>

          {checkInOutData && (
            <div className="mb-6 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg text-red-700 font-semibold mb-2">Report Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-3"><SquareKanban className="inline" size={20}/> Staff ID</p>
                  <p className="font-medium">
                    {role !== 'team-lead' && role !== 'superadmin' ? staff_id : selectedStaffId}
                  </p>
                </div>
                {taskId && (
                  <div>
                    <p className="text-sm text-gray-500 mb-3"><SquareKanban className="inline" size={20}/> Task ID</p>
                    <p className="font-medium">{taskId}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500 mb-3"><Hourglass  className="inline" size={20}/> Duration Range</p>
                  <p className="font-medium">
                    {formatDuration(totalDuration)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {loading && <div className="text-center py-4">Loading...</div>}
          {error && (
            <div className="text-red-500 text-center py-4">{error}</div>
          )}

          {checkInOutData?.data && (
            <>
              <div className="overflow-x-auto">
                <DataTable
                  thead={checkInOutThead}
                  tbody={checkInOutTbody}
                  responsive={true}
                  className="min-w-full"
                />
              </div>

              <div className="bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
                <CustomPagination
                  total={totalItem}
                  currentPage={currentPage}
                  defaultPageSize={pageSize}
                  onChange={handlePageChange}
                  paginationLabel="records"
                  isScroll={true}
                />
              </div>
            </>
          )}

          {!loading && !checkInOutData && (
            <div className="text-center py-10 text-gray-500">
              {role !== 'team-lead' && role !== "superadmin" 
                ? "Click 'Generate Report' to view your check-in/out data"
                : (role === 'team-lead' 
                    ? (!userBranchCode 
                        ? "Loading branch information..."
                        : (!selectedStaffId
                            ? "Please select Staff to view check-in/out data"
                            : "Click 'Generate Report' to view data"))
                    : (!selectedBranchCode
                        ? "Please select Branch to view available options"
                        : (!selectedStaffId
                            ? "Please select Staff to view check-in/out data"
                            : "Click 'Generate Report' to view data")))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProjectTimesheet;