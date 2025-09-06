import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "src/stores/authStore";
import { Building2, Projector, UserCheck2, Clock } from "lucide-react";
import { FaCheckCircle, FaClock, FaExclamationCircle, FaMoneyBill } from "react-icons/fa";
import { DotsLoader } from "src/component/Loaders/PageLoader";
import DotSpinner from "src/component/Loaders/LegLoader";
import useBranchStore from "src/stores/useBranchStore";
import Dropdown from "src/component/DrapDown";
import { BASE_URL } from "~/constants/api";
// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

interface ChartItem {
  label?: string;
  status?: string;
  count: number;
  percentage?: number;
}

interface ProjectStats {
  projects: { total: number };
  tasks: {
    total: number;
    completed: number;
    incomplete: number;
    pending: number;
    overdue: number;
  };
  charts: {
    pie: ChartItem[];
    bar: ChartItem[];
  };
}

const COLORS1 = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const COLORS2 = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

const NoData = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center text-gray-400 ${className}`}>
    No Data
  </div>
);

const SampleDashboard = () => {
  const [projectStats, setProjectStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);

  const token = useAuthStore((state) => state.accessToken);
  const userRole = useAuthStore((state) => state.role);
  const staff_id = useAuthStore((state) => state.staff_id);
  const userBranchCode = useAuthStore((state) => state.branchcode);

  // superadmin can change branch, other roles stick with auth branch
  const [branchCode, setBranchCode] = useState(
    userRole === "superadmin" ? "" : userBranchCode
  );

  const { branchCodeOptions, fetchBranches } = useBranchStore();

  useEffect(() => {
    if (userRole === "superadmin") {
      fetchBranches(token);
    }
  }, [token, userRole, fetchBranches]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        if (!staff_id) throw new Error("Staff ID not found");

        let teamId: string | undefined = undefined;

        if (userRole !== "superadmin") {
          const teamRes = await axios.get<{ team_id: string }>(
            `${BASE_URL}/getteamid`,
            { params: { staff_id } }
          );
          teamId = teamRes.data.team_id;
        }

        const effectiveBranchCode =
          userRole === "superadmin" ? branchCode : userBranchCode;

        const res = await axios.get<ProjectStats>(
          `${BASE_URL}/getdashboard`,
          {
            params: { userRole, branchCode: effectiveBranchCode, ...(teamId && { teamId }) },
          }
        );

        console.log("Dashboard API response:", res.data);

        setProjectStats({
          projects: res.data.projects || { total: 0 },
          tasks: res.data.tasks || {
            total: 0,
            completed: 0,
            incomplete: 0,
            pending: 0,
            overdue: 0,
          },
          charts: {
            pie: Array.isArray(res.data.charts?.pie) ? res.data.charts.pie : [],
            bar: Array.isArray(res.data.charts?.bar) ? res.data.charts.bar : [],
          },
        });
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
        setProjectStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userRole, branchCode, staff_id, userBranchCode]);

  if (loading) return <p>Loading...</p>;
  if (!projectStats) return <p>No data available</p>;

  const progressItems = [
    {
      type: "completed",
      value: projectStats.tasks.completed,
      icon: <FaCheckCircle className="text-green-500 mr-2" />,
      label: "Completed",
    },
    {
      type: "pending",
      value: projectStats.tasks.pending,
      icon: <FaClock className="text-yellow-500 mr-2" />,
      label: "Pending",
    },
    {
      type: "overdue",
      value: projectStats.tasks.overdue,
      icon: <FaExclamationCircle className="text-red-500 mr-2" />,
      label: "Overdue",
    },
  ];

  return (
    <div className="p-6 dark:text-gray-100 text-gray-900">
      <h1 className="text-2xl text-red-700 font-bold mb-5">Analytics Dashboard</h1>

      {userRole === "superadmin" && (
        <Dropdown
          options={branchCodeOptions}
          selectedValue={branchCode}
          onSelect={setBranchCode}
          placeholder="Select Branch"
          className="w-[250px] mb-5"
        />
      )}

      {/* Cards */}
      <div className="md:flex text-gray-700 mb-5 justify-between gap-3">
        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-evenly rounded-lg shadow-lg ps-8">
          <h1 className="font-bold text-xl">Total Projects</h1>
          <div className="flex gap-6">
            <div className="bg-indigo-500 w-[40px] h-[40px] rounded-full p-1">
              <Projector className="text-gray-50" size={28} />
            </div>
            <p className="text-gray-500 mt-2">{projectStats.projects.total}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-evenly rounded-lg shadow-lg ps-8">
          <h1 className="font-bold text-xl">Total Tasks</h1>
          <div className="flex gap-6">
            <div className="bg-green-400 w-[40px] h-[40px] rounded-full p-1">
              <Building2 className="text-gray-50" size={28} />
            </div>
            <p className="text-gray-500 mt-2">{projectStats.tasks.total}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-evenly rounded-lg shadow-lg ps-8">
          <h1 className="font-bold text-xl">Completed Tasks</h1>
          <div className="flex gap-6">
            <div className="bg-yellow-400 w-[40px] h-[40px] rounded-full p-1">
              <UserCheck2 className="text-gray-50" size={28} />
            </div>
            <p className="text-gray-500 mt-2">{projectStats.tasks.completed}</p>
          </div>
        </div>



          <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-evenly rounded-lg shadow-lg ps-8">
          <h1 className="font-bold text-xl">Tasks In Progress</h1>
          <div className="flex gap-6">
            <div className="bg-yellow-400 w-[40px] h-[40px] rounded-full p-1">
              <UserCheck2 className="text-gray-50" size={28} />
            </div>
            <p className="text-gray-500 mt-2">{projectStats.tasks.incomplete}</p>
          </div>
        </div>


        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-evenly rounded-lg shadow-lg ps-8">
          <h1 className="font-bold text-xl">Overdue Tasks</h1>
          <div className="flex gap-6">
            <div className="bg-red-400 w-[40px] h-[40px] rounded-full p-1">
              <FaMoneyBill className="text-gray-50" size={28} />
            </div>
            <p className="text-gray-500 mt-2">{projectStats.tasks.overdue}</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      {/*<div className="flex mb-5 justify-between">
        {progressItems.map((item) => (
          <div
            key={item.type}
            className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800"
          >
            <p className="text-2xl font-extrabold text-red-700">{item.value}</p>
            <div className="flex gap-2">
              <Clock className="text-gray-500 mt-1" size={20} />
              <h1 className="text-lg font-medium text-gray-500">{item.label}</h1>
            </div>
          </div>
        ))}
      </div>*/}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Tasks Progress</h2>
          {projectStats.charts.pie.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={projectStats.charts.pie} dataKey="count" nameKey="label" outerRadius={100}>
                  {projectStats.charts.pie.map((_, i) => (
                    <Cell key={i} fill={COLORS1[i % COLORS1.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoData className="h-[300px]" />
          )}
        </div>

        {/* Bar */}
        {/*<div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Bar Chart</h2>
          {projectStats.charts.bar.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectStats.charts.bar}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData className="h-[300px]" />
          )}
        </div>*/}

        {/* Doughnut */}
        <div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Status</h2>
          {projectStats.charts.pie.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={projectStats.charts.pie} dataKey="count" nameKey="label" innerRadius={60} outerRadius={100}>
                  {projectStats.charts.pie.map((_, i) => (
                    <Cell key={i} fill={COLORS2[i % COLORS2.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoData className="h-[300px]" />
          )}
        </div>

        {/* Line */}
        {/*<div className="p-4 bg-white rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Line Chart</h2>
          {projectStats.charts.bar.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectStats.charts.bar}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoData className="h-[300px]" />
          )}
        </div>*/}

        {/* Area */}
        {/*<div className="p-4 bg-white rounded-2xl shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Shadow Line Chart</h2>
          {projectStats.charts.bar.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={projectStats.charts.bar}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <NoData className="h-[300px]" />
          )}
        </div>
*/}      </div>

      {/* Loaders */}
      {/*<div className="text-red-600 text-2xl font-bold">
        <DotsLoader />
        <div className="flex justify-center items-center mt-[20%]">
          <DotSpinner />
        </div>
      </div>*/}
    </div>
  );
};

export default SampleDashboard;
