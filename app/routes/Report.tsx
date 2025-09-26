
import { Eye, FileDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { CgArrowsExchange } from "react-icons/cg";
import { FaHandsHelping } from "react-icons/fa";
import DataTable from "src/component/DataTable";
import DynamicBarChart from "src/component/graphComponents/DynamicBarChart";
import * as XLSX from "xlsx";
import TimeSheetReport from "./Report&anaysis/timesheet/TimeSheet";
import ProjectOverviewReport from "./Report&anaysis/timesheet/ProjectOverviewReport";
import UserSummaryReport from "./Report&anaysis/timesheet/UserSummaryReport";
import TeamPaymentReport from "./Report&anaysis/TeamPaymentReport";
import CampaignReport from "./Report&anaysis/CampaignReport";

const Report = () => {
  const [activeTab, setActiveTab] = useState("leadAnalysis");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabs = [
    // { id: "leadAnalysis", label: "Lead Analysis" },
    { id: "projectwisereport", label: "Project Summary" },
    // { id: "paymentinsight", label: "Payment Summary" },
    { id: "employeereport", label: "Employee Summary" },
  ];

  const theme = "light";
  
  const chartData = {
    title: "Monthly Sales",
    labels: ["January", "February", "March", "April"],
    datasets: [
      {
        label: "Sales",
        data: [150, 200, 180, 220],
        backgroundColor: "rgba(34, 197, 94, 0.7)",
      },
    ],
  };

  const LeaveData = [
    {
      id: "1",
      campaignName: "Summar camp",
      totalLead: "45",
      clientcovert: "35",
      convertrate: 76,
      avgFollow: "26",
    },
    {
      id: "2",
      campaignName: "Event",
      totalLead: "140",
      clientcovert: "35",
      convertrate: 30,
      avgFollow: "26",
    },
  ];

  const thead = () => [
    { data: "id" },
    { data: "Campaign Name" },
    { data: "Total Leads" },
    { data: "Convert to Client" },
    { data: "Conversion Rate" },
    { data: "Avg.Followup" },
    { data: "View Details", className: "text-center" },
  ];

  const tbody = () => {
    return LeaveData.map((branch) => ({
      id: branch.id,
      data: [
        { data: branch.id },
        { data: branch.campaignName },
        { data: branch.totalLead },
        { data: branch.clientcovert },
        {
          data: (
            <div
              className={`px-3 py-1 rounded-full text-sm inline-flex items-center ${
                branch.convertrate >= 50 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  branch.convertrate >= 50 ? "bg-green-800" : "bg-red-700"
                }`}
              ></span>
              {branch.convertrate} %
            </div>
          ),
        },
        { data: branch.avgFollow },
        {
          data: (
            <div className="flex flex-wrap justify-between">
              <button
                className="p-1 text-blue-900 rounded hover:text-gray-500"
                onClick={() => setShowEditModal(true)}
                title="View"
              >
                <Eye size={18} />
              </button>
              <button
                className="p-1 text-red-600 rounded hover:text-gray-500"
                onClick={() => setShowDeleteModal(true)}
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

  const handleOnExport = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(LeaveData);
    XLSX.utils.book_append_sheet(wb, ws, "LeadData");
    XLSX.writeFile(wb, "LeadAnalysis.xlsx");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="dark:border-gray-700">        
        <nav className="flex justify-evenly -mb-px">
          {tabs.map((tab, index) => (
            <>
              {index > 0 && (
                <span className="bg-gray-300 w-[50px] h-[2px] mt-5 items-center"></span>
              )}
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-medium text-sm  ${
                  activeTab === tab.id
                    ? "text-gray-200 bg-red-700 w-[180px] h-[40px] rounded-sm"
                    : "border-transparent text-gray-700 hover:text-red-700 bg-gray-200 w-[180px] h-[40px] rounded-sm"
                }`}
              >
                {tab.label}
              </button>
            </>
          ))}
        </nav>
      </div>
    
      <div className="p-4 flex-grow">
      {/*  {activeTab === "leadAnalysis" && (
          <>
    
          <CampaignReport/>
</>
        )}*/}
        {activeTab =="EmployeeReport" &&(
          <TimeSheetReport/>
        )}{
          activeTab === "projectwisereport" &&(
            <ProjectOverviewReport/>
          )
        }
        {activeTab === 'employeereport' && (
          <UserSummaryReport/>
        )}
        {/*{activeTab === "paymentinsight" && (
          <TeamPaymentReport/>
        )}*/}
      </div>
    </div>
  );
};

export default Report;