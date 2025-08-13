
import { useEffect, useState } from "react";
import { useAuthStore } from "src/stores/authStore";
import axios from "axios";
import { BASE_URL } from "~/constants/api";
import Dropdown from "src/component/DrapDown";
import DynamicDoughnutChart from "src/component/graphComponents/DynamicDoughnutChart";
import KPIBarChart from "src/component/graphComponents/KpiChart";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import useBranchStore from "src/stores/useBranchStore";
import { toast } from "react-hot-toast";

const HrGraphs = () => {
  const token = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const userBranchCode = useAuthStore((state) => state.branchcode);
  const [branchCode, setBranchCode] = useState(
    userRole === "superadmin" ? "" : userBranchCode
  );
  const [attendanceData, setAttendanceData] = useState(null);
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { branchCodeOptions, fetchBranches } = useBranchStore();

  useEffect(() => {
    if (userRole === "superadmin") {
      fetchBranches(token);
    }
  }, [token, userRole]);

  useEffect(() => {
    if (branchCode) {
      fetchData();
    }
  }, [branchCode]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const attendanceResponse = await axios.get(
        `${BASE_URL}/report/attendancesummary/read?branchcode=${branchCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceData(attendanceResponse.data.data);

      const leaveResponse = await axios.get(
        `${BASE_URL}/users/leavereq/read?branchcode=${branchCode}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLeaveData(leaveResponse.data.data);
    } catch (err) {
      console.error("Error fetching data", err);
      setError("Failed to fetch data");
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceChartData = () => {
    if (!attendanceData) return null;

    const summary = attendanceData.attendance_summary;

    return {
      overallData: {
        title: "Attendance Status",
        labels: ["Present", "Absent", "On Leave", "Waiting"],
        values: [
          summary.present_count,
          summary.absent_count,
          summary.approved_leave_count,
          summary.waitingforlogin_count,
        ],
        colors: ["#10B981", "#EF4444", "#3B82F6", "#F59E0B"],
      },
      leaveTypeData: {
        title: "Leave Types",
        labels: ["Full Day", "Half Day", "Hourly"],
        values: [
          summary.approved_leave_count -
            (summary.half_day_leave_count + summary.hourly_leave_count),
          summary.half_day_leave_count,
          summary.hourly_leave_count,
        ],
        colors: ["#3B82F6", "#8B5CF6", "#EC4899"],
      },
      departmentData: {
        labels: attendanceData.department_counts.map((dept) => dept.department),
        datasets: [
          {
            label: "Present",
            data: attendanceData.department_counts.map(
              (dept) => dept.present_count
            ),
            backgroundColor: "#10B981",
          },
          {
            label: "Absent",
            data: attendanceData.department_counts.map(
              (dept) => dept.absent_count
            ),
            backgroundColor: "#EF4444",
          },
          {
            label: "On Leave",
            data: attendanceData.department_counts.map(
              (dept) => dept.approved_leave_count
            ),
            backgroundColor: "#3B82F6",
          },
          {
            label: "Waiting",
            data: attendanceData.department_counts.map(
              (dept) => dept.waitingforlogin_count
            ),
            backgroundColor: "#F59E0B",
          },
        ],
      },
    };
  };

  const getLeaveChartData = () => {
    if (!leaveData) return null;

    const leaveTypeCounts = leaveData.reduce((acc, leave) => {
      acc[leave.leave_type] = (acc[leave.leave_type] || 0) + 1;
      return acc;
    }, {});

    const leaveStatusCounts = leaveData.reduce((acc, leave) => {
      acc[leave.status] = (acc[leave.status] || 0) + 1;
      return acc;
    }, {});

    const topEmployees = leaveData
      .reduce((acc, leave) => {
        const existing = acc.find((item) => item.staff_id === leave.staff_id);
        if (existing) {
          existing.count += 1;
        } else {
          acc.push({
            name: leave.staff_name,
            count: 1,
            staff_id: leave.staff_id,
          });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      leaveTypeData: {
        title: "Leave Requests by Type",
        labels: Object.keys(leaveTypeCounts),
        values: Object.values(leaveTypeCounts),
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"],
      },
      leaveStatusData: {
        title: "Leave Requests by Status",
        labels: Object.keys(leaveStatusCounts),
        values: Object.values(leaveStatusCounts),
        colors: ["#10B981", "#F59E0B", "#EF4444", "#3B82F6"],
      },
      leaveByEmployee: {
        labels: topEmployees.map((emp) => emp.name),
        datasets: [
          {
            label: "Leave Requests",
            data: topEmployees.map((emp) => emp.count),
            backgroundColor: "#3B82F6",
          },
        ],
      },
    };
  };

  const attendanceChartData = getAttendanceChartData();
  const leaveChartData = getLeaveChartData();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)]">
          Branch Analytics Dashboard
        </h2>

        {userRole === "superadmin" && (
          <Dropdown
            options={branchCodeOptions}
            selectedValue={branchCode}
            onSelect={setBranchCode}
            placeholder="Select Branch"
            className="w-[250px]"
          />
        )}
      </div>

      {loading && <div className="text-center py-8">Loading data...</div>}
      {error && <div className="text-red-500 text-center py-8">{error}</div>}

      {attendanceData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Total Employees
                  </p>
                  <p className="text-2xl font-bold">
                    {attendanceData.total_employees}
                  </p>
                </div>
                <Users className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Present Today
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {attendanceData.attendance_summary.present_count}
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Absent Today
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {attendanceData.attendance_summary.absent_count}
                  </p>
                </div>
                <XCircle className="text-red-500" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">On Leave</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {attendanceData.attendance_summary.approved_leave_count}
                  </p>
                </div>
                <BookOpen className="text-blue-500" size={24} />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Waiting to Login
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {attendanceData.attendance_summary.waitingforlogin_count}
                  </p>
                </div>
                <AlertCircle className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {attendanceChartData?.overallData && (
              <div className=" dark:bg-gray-800 p-4">
                <DynamicDoughnutChart
                  data={attendanceChartData.overallData}
                  className="h-[400px] w-full"
                />
              </div>
            )}
            {attendanceChartData?.leaveTypeData && (
              <div className=" dark:bg-gray-800 p-4 ">
                <DynamicDoughnutChart
                  data={attendanceChartData.leaveTypeData}
                  className="h-[400px] w-full"
                />
              </div>
            )}
            {attendanceChartData?.departmentData && (
              <KPIBarChart
                data={attendanceChartData.departmentData}
                title="Department-wise Attendance"
                stacked={true}
              />
            )}
          </div>
        </>
      )}

      {leaveData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Total Leave Requests
                  </p>
                  <p className="text-2xl font-bold">{leaveData.length}</p>
                </div>
                <BookOpen className="text-blue-500" size={24} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Approved Leaves
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      leaveData.filter((leave) => leave.status === "approved")
                        .length
                    }
                  </p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Pending Leaves
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      leaveData.filter((leave) => leave.status === "pending")
                        .length
                    }
                  </p>
                </div>
                <Clock className="text-yellow-500" size={24} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {leaveChartData?.leaveTypeData && (
              <div className=" dark:bg-gray-800 p-4 ">
                <DynamicDoughnutChart
                  data={leaveChartData.leaveTypeData}
                  className="h-[400px] w-full"
                />
              </div>
            )}
            {leaveChartData?.leaveByEmployee && (
              <KPIBarChart
                data={leaveChartData.leaveByEmployee}
                title="Top Employees by Leave Requests"
              />
            )}
            {leaveChartData?.leaveStatusData && (
              <div className=" dark:bg-gray-800 p-4 ">
                <DynamicDoughnutChart
                  data={leaveChartData.leaveStatusData}
                  className="h-[400px] w-full"
                />
              </div>
            )}
          </div>
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold">Recent Leave Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Approved By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {leaveData.slice(0, 5).map((leave) => (
                    <tr key={leave.req_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {leave.staff_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {leave.staff_id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 capitalize">
                        {leave.leave_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {new Date(leave.start_date).toLocaleDateString()} -{" "}
                          {new Date(leave.end_date).toLocaleDateString()}
                        </div>
                        {leave.approved_dates && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Approved: {leave.approved_dates.join(", ")}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${
                            leave.status === "approved"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : leave.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {leave.approved_by_name || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && !attendanceData && (
        <div className="text-center py-10 text-gray-500">
          {branchCode
            ? "No data available for selected branch"
            : "Please select a branch to view analytics"}
        </div>
      )}
    </div>
  );
};

export default HrGraphs;
