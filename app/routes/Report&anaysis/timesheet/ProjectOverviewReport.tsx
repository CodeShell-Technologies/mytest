import { useEffect, useState } from "react";
import DataTable from "src/component/DataTable";
import CustomPagination from "src/component/CustomPagination";
import Dropdown from "src/component/DrapDown";
import { CalendarFold, FileDown, SquareKanban, UserCheck } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import { BASE_URL, toastposition } from "~/constants/api";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "src/stores/useBranchStore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMediaQuery } from "~/routes/hooks/use-click-outside";
import ClientSummaryReport from "../ClientSummaryReport";
import BranchSummaryReport from "../BranchwiseReport";
import TeamProjectReport from "../TeamProjectReport;";

const ProjectOverviewReport = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [error, setError] = useState(null);
  const [selectedBranchCode, setSelectedBranchCode] = useState("");
  const [selectedProjectCode, setSelectedProjectCode] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [projectOptions, setProjectOptions] = useState([]);
  const token = useAuthStore((state) => state.accessToken);
    const [activeTab, setActiveTab] = useState("projectOoverviewreport"); // New state for tabs


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

  useEffect(() => {
    fetchBranches(token);
  }, [token]);
  const tabs = [
    { id: "projectOoverviewreport", label: "Project Report" },
    { id: "clientproject", label: "Client Project Report" },
    {id:"branchwiseproject" ,label:"Branchwise Project Report"},
     {id:"teamwiseproject" ,label:"Teamwise Project Report"}
  ];
  // Fetch project options when branch code changes
  useEffect(() => {
    const getProjectOptions = async () => {
      if (!selectedBranchCode) {
        setProjectOptions([]);
        return;
      }
      
      setLoading(true);
      try {
        const url = `${BASE_URL}/project/overview/dropdown?branchcode=${selectedBranchCode}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.data) {
          const options = response.data.data.map((project) => ({
            value: project.project_code,
            label: `${project.title} (${project.project_code})`,
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

    getProjectOptions();
  }, [selectedBranchCode, token]);

  // Fetch report data when project code changes
  const fetchReportData = async () => {
    if (!selectedProjectCode) {
      setReportData(null);
      return;
    }

    setLoading(true);
    try {
      let url = `${BASE_URL}/report/projectoverview/read?project_code=${encodeURIComponent(selectedProjectCode)}`;
      
      if (startDate) {
        const formattedStartDate = formatDate(startDate);
        url += `&start_date=${formattedStartDate}`;
      }
      if (endDate) {
        const formattedEndDate = formatDate(endDate);
        url += `&end_date=${formattedEndDate}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setReportData(response.data);
        // Calculate total items based on milestones and participants
        const totalItems = response.data.data?.milestones_summary?.reduce((acc, milestone) => {
          return acc + (milestone.taskparticipantsummary?.length || 0);
        }, 0) || 0;
        setTotalItem(totalItems);
      }
    } catch (error) {
      console.error("Error fetching project overview report", error);
      toast.error("Failed to fetch project overview report");
      setError("Failed to fetch report");
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
    setSelectedProjectCode("");
    setCurrentPage(1);
  };

  const handleProjectChange = (value) => {
    setSelectedProjectCode(value);
    setCurrentPage(1);
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

  const handleOnExport = () => {
    if (!reportData?.data) {
      toast.error("No data to export");
      return;
    }

    const wb = XLSX.utils.book_new();
    
    // Export project details
    const projectDetails = [{
      "Project Code": reportData.data.project_code,
      "Title": reportData.data.project_details?.title || "N/A",
      "Start Date": reportData.data.project_details?.start_date ? new Date(reportData.data.project_details.start_date).toLocaleDateString() : "N/A",
      "End Date": reportData.data.project_details?.end_date ? new Date(reportData.data.project_details.end_date).toLocaleDateString() : "N/A",
      "Status": reportData.data.project_details?.status || "N/A",
      "Total Task Duration (mins)": reportData.data.project_details?.total_task_duration || 0,
      "Overall Working Hours": reportData.data.project_details?.overall_working_hours || 0
    }];
    
    const wsProject = XLSX.utils.json_to_sheet(projectDetails);
    XLSX.utils.book_append_sheet(wb, wsProject, "Project Summary");
    
    // Export milestones data
    const milestonesData = reportData.data.milestones_summary?.flatMap(milestone => {
      return milestone.taskparticipantsummary?.map(participant => ({
        "Milestone Code": milestone.milestone_code,
        "Staff ID": participant.staff_id,
        "Staff Name": `${participant.firstname} ${participant.lastname}`,
        "Total Tasks": participant.total_tasks,
        "Draft Tasks": participant.total_draft,
        "In Progress": participant.total_inprogress,
        "Verified/Closed": participant.total_verified_closed,
        "Archived": participant.total_archived,
        "Dropped": participant.total_drop,
        "Total Duration (mins)": participant.total_duration_minutes
      }));
    }) || [];
    
    const wsMilestones = XLSX.utils.json_to_sheet(milestonesData);
    XLSX.utils.book_append_sheet(wb, wsMilestones, "Milestones Data");
    
    XLSX.writeFile(wb, "ProjectOverviewReport.xlsx");
  };

  // Table headers for milestones participants
  const milestonesThead = () => [
    { data: "Milestone Code" },
    { data: "Staff ID" },
    { data: "Staff Name" },
    { data: "Total Tasks" },
    { data: "Draft" },
    { data: "In Progress" },
    { data: "Verified/Closed" },
    { data: "Archived" },
    { data: "Dropped" },
    { data: "Duration (mins)" },
  ];

  // Table body for milestones participants
  const milestonesTbody = () => {
    if (!reportData?.data?.milestones_summary) return [];
    
    return reportData.data.milestones_summary.flatMap((milestone, mIndex) => {
      return milestone.taskparticipantsummary?.map((participant, pIndex) => ({
        id: `${milestone.milestone_code}-${participant.staff_id}-${pIndex}`,
        data: [
          { data: milestone.milestone_code },
          { data: participant.staff_id },
          { data: `${participant.firstname} ${participant.lastname}` },
          { data: participant.total_tasks },
          { data: participant.total_draft },
          { data: participant.total_inprogress },
          { data: participant.total_verified_closed },
          { data: participant.total_archived },
          { data: participant.total_drop },
          { data: participant.total_duration_minutes },
        ],
      }));
    });
  };

  // Format duration from minutes to hours and minutes
  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
          <div className="border-b border-gray-200 dark:border-gray-700 mb-7 mt-7 ml-8">
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
        {activeTab === "projectOoverviewreport" &&(
        <div className="p-4 flex-grow ml-2 ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-3">
              Project Overview Report
            </h2>
          </div>
          <Toaster position={toastposition} reverseOrder={false} />

          <div className="flex flex-col gap-4 mb-5 ml-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-40">
              <Dropdown
                options={branchCodeOptions}
                selectedValue={selectedBranchCode}
                onSelect={handleBranchCodeChange}
                placeholder="Select Branch"
                className="w-full"
                isLoading={isStoreLoading}
              />
              
              <Dropdown
                options={projectOptions}
                selectedValue={selectedProjectCode}
                onSelect={handleProjectChange}
                placeholder="Select Project"
                className="w-full"
                disabled={!selectedBranchCode}
                isLoading={loading}
              />
              
              <div className="w-full">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  placeholderText="Select date range"
                  className="w-full p-2 border rounded"
                  isClearable={true}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex gap-40">
                <Dropdown
                  options={pageSizeOptions}
                  selectedValue={pageSize}
                  onSelect={handlePageSizeChange}
                  placeholder="Items per page"
                  className="w-[285px]"
                />
                
                <button
                  onClick={handleOnExport}
                  className="flex items-center justify-center text-gray-400 bg-white focus:outline-non font-medium text-sm rounded-sm border border-dotted border-gray-400 hover:text-red-700/70 px-2.5 dark:bg-gray-800 dark:text-gray-300 py-2.5 w-[285px]"
                  disabled={!reportData?.data}
                >
                  <FileDown className="mr-1" />
                  {!isMobile && "Export Excel"}
                </button>
              </div>
              
              <button
                onClick={fetchReportData}
                className="flex items-center justify-center text-white bg-[var(--color-primary)] hover-effect dark:bg-red-800 focus:outline-non font-medium text-sm rounded-sm px-5 py-2.5 mr-[48px] "
                disabled={!selectedProjectCode || loading}
              >
                {loading ? "Loading..." : "Generate Report"}
              </button>
            </div>
          </div>

          {reportData && (
            <>
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg text-red-700 font-semibold mb-4">Project Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded shadow">
                    <p className="text-sm text-red-700 mb-1"><SquareKanban className="inline mr-2" size={16}/> Project Code</p>
                    <p className="font-medium text-lg">{reportData.data.project_code}</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded shadow">
                    <p className="text-sm text-red-700 mb-1"><SquareKanban className="inline mr-2" size={16}/> Title</p>
                    <p className="font-medium text-lg">{reportData.data.project_details?.title || "N/A"}</p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded shadow">
                    <p className="text-sm text-red-700 mb-1"><CalendarFold className="inline mr-2" size={16}/> Status</p>
                    <p className="font-medium text-lg capitalize">{reportData.data.project_details?.status || "N/A"}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded shadow">
                    <p className="text-sm text-red-700 mb-1"><CalendarFold className="inline mr-2" size={16}/> Start Date</p>
                    <p className="font-medium">
                      {reportData.data.project_details?.start_date ? 
                        new Date(reportData.data.project_details.start_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded shadow">
                    <p className="text-sm text-red-700 mb-1"><CalendarFold className="inline mr-2" size={16}/> End Date</p>
                    <p className="font-medium">
                      {reportData.data.project_details?.end_date ? 
                        new Date(reportData.data.project_details.end_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded shadow">
                    <p className="text-sm text-red-700 mb-1"><UserCheck className="inline mr-2" size={16}/> Total Duration</p>
                    <p className="font-medium">
                      {formatDuration(reportData.data.project_details?.total_task_duration)}
                    </p>
                  </div>
                  <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded shadow">
                    <p className="text-sm text-red-700 mb-1"><UserCheck className="inline mr-2" size={16}/> Working Hours</p>
                    <p className="font-medium">
                      {reportData.data.project_details?.overall_working_hours?.toFixed(2) || 0} hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Milestones Summary Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Milestones Summary</h3>
                {reportData.data.milestones_summary?.map((milestone, index) => (
                  <div key={index} className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-red-700">
                        Milestone: {milestone.milestone_code}
                      </h4>
                      <div className="text-sm">
                        <span className="font-medium">Total Tasks: </span>
                        {milestone.total_tasks} | 
                        <span className="ml-2 font-medium">Duration: </span>
                        {formatDuration(milestone.overall_task_duration)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white dark:bg-gray-700 p-3 rounded shadow text-center">
                        <p className="text-sm text-gray-500">Draft</p>
                        <p className="font-medium">{milestone.total_draft}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded shadow text-center">
                        <p className="text-sm text-gray-500">In Progress</p>
                        <p className="font-medium">{milestone.total_inprogress}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded shadow text-center">
                        <p className="text-sm text-gray-500">Verified/Closed</p>
                        <p className="font-medium">{milestone.total_verified_closed}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-3 rounded shadow text-center">
                        <p className="text-sm text-gray-500">Archived</p>
                        <p className="font-medium">{milestone.total_archived}</p>
                      </div>
                    </div>
                    
                    {milestone.taskparticipantsummary?.length > 0 && (
                      <>
                        <h5 className="font-medium mb-2">Participants:</h5>
                        <div className="overflow-x-auto">
                          <DataTable
                            thead={milestonesThead}
                            tbody={() => milestone.taskparticipantsummary.map((participant, pIndex) => ({
                              id: `${milestone.milestone_code}-${participant.staff_id}-${pIndex}`,
                              data: [
                                { data: milestone.milestone_code },
                                { data: participant.staff_id },
                                { data: `${participant.firstname} ${participant.lastname}` },
                                { data: participant.total_tasks },
                                { data: participant.total_draft },
                                { data: participant.total_inprogress },
                                { data: participant.total_verified_closed },
                                { data: participant.total_archived },
                                { data: participant.total_drop },
                                { data: participant.total_duration_minutes },
                              ],
                            }))}
                            responsive={true}
                            className="min-w-full"
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* All Participants Table */}
              {reportData.data.milestones_summary?.some(m => m.taskparticipantsummary?.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4">All Participants Summary</h3>
                  <div className="overflow-x-auto">
                    <DataTable
                      thead={milestonesThead}
                      tbody={milestonesTbody}
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
                      paginationLabel="participants"
                      isScroll={true}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {!loading && !reportData && (
            <div className="text-center py-10 text-gray-500">
              {selectedBranchCode 
                ? (!selectedProjectCode 
                    ? "Please select a Project to generate report"
                    : "Click 'Generate Report' to view data")
                : "Please select a Branch to view available projects"}
            </div>
          )}
        </div>
        )}
        {activeTab === "clientproject" && (
          <ClientSummaryReport/>
        )}
        {activeTab === "branchwiseproject" && (
          <BranchSummaryReport/>
        )}
        {activeTab === 'teamwiseproject' && (
          <TeamProjectReport/>
        )}
      </div>
    </>
  );
};

export default ProjectOverviewReport;