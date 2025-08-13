import { CalendarCheck2, CalendarClock, Eye, LogOut } from "lucide-react";
import userProfiles from "../../../public/user.avif";
import PaymentProgressCard from "src/component/graphComponents/ProgressCard";
import { useNavigate } from "react-router";
import Modal from "src/component/Modal";
import AddSalaryForm from "../Employee/Salary/AddSalary";
import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import SearchInput from "src/component/SearchInput";
import Dropdown from "src/component/DrapDown";
import { Dot, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Link } from "react-router";
import MomViewPage from "./MomViewPage";
const ClientMom = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [sheetData, setSheetData] = useState([]);
  const [selectStatus, setSelectStatus] = useState("");
  const [activeTab, setActiveTab] = useState("salaryList");

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
      id: "ASC_12",
      date: "Agenda_1",
      name: "ABC 1",
      branch: "TL",
      priority: "Employee",
      progress: "TRACK-1",
      lastdate: "25-05-2025",
    },
    {
      id: "ASC_13",
      date: "Agenda_2",
      name: "ABC 2",
      branch: "TL",
      priority: "Employee",
      progress: "TRACK-2",
      lastdate: "25-05-2025",
    },
  ];

  const getData = () => {
    return data;
  };

  useEffect(() => {
    setSheetData(getData());
  }, []);

  const thead = () => [
    { data: "MeetId" },
    { data: "Agenda" },
    { data: "Consultant" },
    { data: "OrgBy" },
    { data: "Attendees" },
    { data: "Summary" },
    { data: "Last Meet" },
    { data: "view" },
  ];

  const tbody = () => {
    if (!data) return [];
    return data.map((user) => ({
      id: user.id,
      data: [
        { data: user.id },
        { data: user.name },
        { data: user.date },
        { data: user.branch },
        { data: user.priority },
        {
          data: user.progress,
        },
        { data: user.lastdate },
        {
          data: (
              <button className="bg-blue-400/25 text-xs dark:bg-blue-700/15 px-2 py-1 dark:text-blue-200 text-blue-700 rounded-2xl" onClick={()=>setShowModal(true)}>
                <Eye/>
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
  const Project = {
    status: "completed",
    progress: 70,
  };
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1); 
  };

  return (
    <>
     <div className="text-red-600 text-2xl font-bold mt-5">Client MOM</div>
      <div className="flex justify-between">
        {" "}
       
     <div className="w-full mt-5">
          <div className="flex flex-col">
            <div className="p-4 flex-grow">
              <div className="flex items-end justify-end">
                <button
                  onClick={handleOnExport}
                  className="text-gray-400 bg-white focus:outline-non font-medium text-xs rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-3 dark:bg-gray-800 dark:text-gray-300 py-1 text-center mr-5 mb-5 flex items-center"
                >
                  <FileDown />
                  Export Excel
                </button>
            
              </div>

              <div className="flex justify-between">
                <Dropdown
                  options={filterOptions}
                  selectedValue={selectedFilter}
                  onSelect={setSelectedFilter}
                  placeholder="Filter By"
                  className="w-[200px]"
                />
                <Dropdown
                  options={statusOptions}
                  selectedValue={selectStatus}
                  onSelect={setSelectStatus}
                  placeholder="Payment Status"
                  className="w-[200px]"
                />
                <Dropdown
                  options={filterOptions}
                  selectedValue={selectedFilter}
                  onSelect={setSelectedFilter}
                  placeholder="Sort by"
                  className="w-[200px]"
                />
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search users..."
                />
              </div>

              <DataTable thead={thead} tbody={tbody}  maxHeight="500px"/>
              <div className=" bottom-0 border-t border-gray-200 dark:border-gray-700 p-4 mt-10">
                <CustomPagination
                  total={100}
                  currentPage={currentPage}
                  defaultPageSize={10}
                  onChange={setCurrentPage}
                  paginationLabel="employees"
                  isScroll={true}
                />
              </div>
            </div>
          </div>
        </div>
     
      </div>
      
      <Modal
        isVisible={showModal}
        className="w-[200px]"
        onClose={() => setShowModal(false)}
      
      >
        <MomViewPage />
      </Modal>
    
   </>
  );
};
export default ClientMom;
