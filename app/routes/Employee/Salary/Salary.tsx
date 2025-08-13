// import { useEffect, useState } from "react";
// import CommonTable from "src/component/CommonTable";
// import DataTable from "src/component/DataTable";
// import CustomPagination from "src/component/CustomPagination";
// import SearchInput from "src/component/SearchInput";
// import Modal from "src/component/Modal";
// import EmployeeForm from "../AddEmployeeForm";
// import Dropdown from "src/component/DrapDown";
// import { CgExport } from "react-icons/cg";
// import { FileDown } from "lucide-react";
// import * as XLSX from "xlsx";
// import { Link } from "react-router";
// import AddSalaryForm from "./AddSalary";

// const EmployeeSalary = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedFilter, setSelectedFilter] = useState("");
//   const [sheetData, setSheetData] = useState([]);
//   const [selectStatus, setSelectStatus] = useState("");
//   const filterOptions = [
//     { value: "client", label: "Client" },
//     { value: "Project", label: "Project" },
//     { value: "Leads", label: "Leads" },
//     { value: "Employee", label: "Employee" },
//   ];
//   const statusOptions = [
//     { value: "Pending", label: "Pending" },
//     { value: "Paid", label: "Paid" },
//     { value: "Un Paid", label: "Un-Paid" },
//   ];
//   const pageSize = 10;
//   const data = [
//     {
//       id: "1",
//       date: "25-05-2025",
//       name: "Bharathi",
//       branch: "bharathi@gmail.com",
//       position: "Team Lead",
//       category: "salary",
//       amount: "10000",
//     },
//     {
//       id: "2",
//       date: "25-05-2025",
//       name: "Bharathi",
//       branch: "bharathi@gmail.com",
//       position: "Team Lead",
//       category: "salary",
//       amount: "10000",
//     },
//   ];

//   const getData = () => {
//     return data;
//   };
//   useEffect(() => {
//     setSheetData(getData());
//   }, []);
//   // const { loading, error, data } = useQuery(GET_ALL_USERS, {
//   //   variables: {
//   //     page: currentPage,
//   //     limit: pageSize,
//   //     search: searchTerm,
//   //   },
//   // });

//   // const handleSearch = (value) => {
//   //   setSearchTerm(value);
//   //   setCurrentPage(1); // Reset to first page on new search
//   // };

//   const thead = () => [
//     { data: "id" },
//     { data: "Date" },
//     { data: "Employee Name" },
//     { data: "Branch" },
//     { data: "Designation" },
//     { data: "Category" },
//     { data: "Amount" },
//       { data: "Action" },
//   ];

//   const tbody = () => {
//     if (!data) return [];
//     console.log("homedata", data);

//     return data.map((user) => ({
//       id: user.id,
//       data: [
//         { data: user.id },
//         { data: user.date },
//         { data: user.name },

//         { data: user.branch },
//         { data: user.position },
//         { data: user.category },
//         { data: user.amount },
//         {
//           data: (
//             <Link to="/employee/salary_slip">
//               {" "}
//               <button
//                 className="bg-red-400/25 dark:bg-red-700/15 px-4 py-2 dark:text-red-200 text-red-700 rounded-sm"
//               >
//                 View
//               </button>
//             </Link>
//           ),
//         },
//       ],
//     }));
//   };
//   const handleOnExport = () => {
//     var wb = XLSX.utils.book_new(),
//       ws = XLSX.utils.json_to_sheet(sheetData);
//     XLSX.utils.book_append_sheet(wb, ws, "Almino");
//     XLSX.writeFile(wb, "EmployeeList.xlsx");
//   };
//   return (
//     <>
//       <div className="flex flex-col min-h-screen">
//         <div className="p-4 flex-grow">
//           <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
//             Salary List
//           </h2>
//           <div className="flex items-end justify-end">
//             <button
//               onClick={handleOnExport}
//               className="text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3  dark:bg-gray-800 dark:text-gray-300 py-2.5 text-center mr-5 mb-5 flex items-center"
//             >
//               <FileDown />
//               Export Excel
//             </button>
//             <button
//               onClick={() => setShowModal(true)}
//               className="text-white bg-red-700 focus:outline-non font-medium text-sm rounded-lg px-9 py-2.5 text-center mr-5 mb-5 flex items-center"
//             >
//               Add Salary
//             </button>
//           </div>

//           <div className="flex justify-between">
//             <Dropdown
//               options={filterOptions}
//               selectedValue={selectedFilter}
//               onSelect={setSelectedFilter}
//               placeholder="Filter By"
//               className="w-[200px]"
//             />
//             <Dropdown
//               options={statusOptions}
//               selectedValue={selectStatus}
//               onSelect={setSelectStatus}
//               placeholder="Payment Status"
//               className="w-[200px]"
//             />
//             <Dropdown
//               options={filterOptions}
//               selectedValue={selectedFilter}
//               onSelect={setSelectedFilter}
//               placeholder="Sort by"
//               className="w-[200px]"
//             />
//             <SearchInput
//               value={searchTerm}
//               onChange={setSearchTerm}
//               placeholder="Search users..."
//             />
//           </div>
            

//           <DataTable thead={thead} tbody={tbody} isSearch />
//         </div>
//         <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
//           {/* Pagination */}
//           <CustomPagination
//             total={100}
//             currentPage={currentPage}
//             defaultPageSize={10}
//             onChange={setCurrentPage}
//             paginationLabel="employees"
//             isScroll={true}
//           />
//         </div>
    
//       </div>
//       {/* Modal componet */}
//       <Modal
//         isVisible={showModal}
//         className="w-[200px]"
//         onClose={() => setShowModal(false)}
//         title="Add Salary Form"
//       >
//        <AddSalaryForm/>
//       </Modal>

//     </>
//   );
// };
// export default EmployeeSalary;
import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router";
import AddSalaryForm from "./AddSalary";
import SalaryRevisionTracker from "./SalaryRevision"; // New component we'll create
import SalaryList from "./SalaryList";

const EmployeeSalary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");
  const [activeTab, setActiveTab] = useState("salaryList"); // New state for tabs

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

  // Sample data
  const data = [
    {
      id: "1",
      date: "25-05-2025",
      name: "Bharathi",
      branch: "bharathi@gmail.com",
      position: "Team Lead",
      category: "salary",
      amount: "10000",
    },
    // More data...
  ];

  // Tab configuration
  const tabs = [
    { id: "salaryList", label: "Salary List" },
    { id: "revisionTracking", label: "Revision & Increment Tracking" },
  ];

  const getData = () => {
    return data;
  };

  useEffect(() => {
    setSheetData(getData());
  }, []);

  const thead = () => [
    { data: "id" },
    { data: "Date" },
    { data: "Employee Name" },
    { data: "Branch" },
    { data: "Designation" },
    { data: "Category" },
    { data: "Amount" },
    { data: "Action" },
  ];

  const tbody = () => {
    if (!data) return [];
    return data.map((user) => ({
      id: user.id,
      data: [
        { data: user.id },
        { data: user.date },
        { data: user.name },
        { data: user.branch },
        { data: user.position },
        { data: user.category },
        { data: user.amount },
        {
          data: (
            <Link to="/employee/salary_slip">
              <button className="bg-red-400/25 dark:bg-red-700/15 px-4 py-2 dark:text-red-200 text-red-700 rounded-sm">
                View
              </button>
            </Link>
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
    <>
      <div className="flex flex-col min-h-screen mt-[-30px]">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-red-500 text-red-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 flex-grow">
          {activeTab === "salaryList" ? (
            <SalaryList/>
          ) : (
            <SalaryRevisionTracker />
          )}
        </div>

      </div>

      <Modal
        isVisible={showModal}
        className="w-[200px]"
        onClose={() => setShowModal(false)}
        title="Add Salary Form"
      >
        <AddSalaryForm onCancel={()=>setShowModal(false)}/>
      </Modal>
    </>
  );
};

export default EmployeeSalary;