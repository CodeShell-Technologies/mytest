import {
  AlertCircle,
  ArrowRightToLine,
  Banknote,
  BanknoteArrowUp,
  BookCheck,
  ChartBar,
  ChartBarIncreasing,
  Clock,
  ClockFading,
  ContactRound,
  HandCoins,
  Plus,
  UserRoundCheck,
  Users,
  UserX,
  UserX2,
} from "lucide-react";
import { Bell, Check, X } from "lucide-react";
import { useMediaQuery } from "./hooks/use-click-outside";
import { Link } from "react-router";
import DynamicDoughnutChart from "src/component/graphComponents/DynamicDoughnutChart";
import KPIBarChart from "src/component/graphComponents/KpiChart";
import NotificationPanel from "src/component/Notification";
import { FaAward, FaFileInvoice, FaHandsHelping, FaProjectDiagram, FaUser, FaUserPlus, FaUsers, FaUserSlash, FaUserTie, FaUserTimes } from "react-icons/fa";
import { useState } from "react";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { AiFillMoneyCollect } from "react-icons/ai";
import DynamicLineGraph from "src/component/graphComponents/DynamicLineGraph";
import DynamicPieChart from "src/component/graphComponents/DynamicPieChart";
import PaymentProgressCard from "src/component/graphComponents/ProgressCard";
import HrGraphs from "./HommeGraphsPages/HrGraphs";
import AccountantDashboard from "./HommeGraphsPages/AccountantDashboard";
const Dashboard = () => {
  const theme = "light";
  const dougntChartData = [
    {
      title: "Present & Absenties",
      labels: ["Presenties", "Causal Leave", "Sick Leave", "pending req"],
      values: [65, 5, 10, 20],
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
    },
  ];
  const kpiData = [
    {
      name: "Sales Team",
      Q1: 78,
      Q2: 85,
    },
    {
      name: "Design Team",
      Q1: 45,
      Q2: 88,
    },
    {
      name: "HR Team",
      Q1: 90,
      Q2: 84,
    },
  ];

  //notification
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      date: "15 Jun",
      status: "🟢",
      message: "Payroll processed for June (₹8.42L)",
      isNew: true,
      read: false,
    },
    {
      id: 2,
      date: "15 Jun",
      status: "📄",
      message: "Payroll processed for June (₹8.42L)",
      isNew: false,
      read: true,
    },
    {
      id: 3,
      date: "15 Jun",
      status: "🟠",
      message: "Payroll processed for June (₹8.42L)",
      isNew: true,
      read: false,
    },
    // ... other notifications
  ]);

  const handleDismiss = (id) => {
    console.log("Notification dismissed:", id);
  };

  const handleMarkAsRead = (id) => {
    console.log("Notification marked as read:", id);
  };

  const handleMarkAllAsRead = () => {
    console.log("All notifications marked as read");
  };

  const lineGraphData = {
    title: "Monthly Sales Data",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "Total Revenue", data: [65, 59, 80, 81, 56, 55] },
      { label: "Un_Paid", data: [28, 48, 40, 19, 86, 27] },
      { label: "Payment Pending", data: [45, 25, 60, 91, 76, 35] },
      { label: "OverDue", data: [35, 55, 30, 71, 66, 45] },
    ],
  };

  const pieChartData = [
    {
      title: "Project Status",
      labels: ["Completed", "Pending", "In Progress", "OverDue"],
      values: [35, 25, 20, 20],
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
    },
  ];
  const accountDougntChartData = [
    {
      title: "Income & Expense",
      labels: ["Income", "Expense"],
      values: [65, 35],
      colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"],
    },
  ];
  const progressItems = [
    {
      type: "paid",
      value: 350,
      color: "bg-green-500",
      icon: <FaCheckCircle className="text-green-500 mr-2" />,
      label: "Paid",
    },
    {
      type: "pending",
      value: 450,
      color: "bg-yellow-500",
      icon: <FaClock className="text-yellow-500 mr-2" />,
      label: "Pending",
    },
    {
      type: "overdue",
      value: 200,
      color: "bg-red-500",
      icon: <FaExclamationCircle className="text-red-500 mr-2" />,
      label: "Overdue",
    },
  ];
  return (
    <>
      {/* <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-8">
            Employee Management
          </h2>
          <div className="flex gap-3 justify-between mb-8">
            <Link to="/employee/addpage">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                New Employee <Plus className="inline" size={15} />
              </button>
            </Link>
            <Link to="/employee">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                New Payroll <HandCoins className="inline" size={15} />
              </button>
            </Link>
            <Link to="/leave">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                Approve Leave <UserRoundCheck className="inline" size={15} />
              </button>
            </Link>
            <Link to="/attandance">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                Attandance <ContactRound className="inline" size={15} />
              </button>
            </Link>
          </div>
        </div>

        <div className="flex mb-5 justify-between">
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <Users className="dark:gray-400 mt-1 text-blue-700" size={20} />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Total Employees
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <UserX2 className="text-red-500 dark:gray-400 mt-1" size={20} />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Employees Off
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <ClockFading
                className="text-yellow-500 dark:gray-400 mt-1"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Pending approvals
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <BookCheck
                className="text-green-500 dark:gray-400 mt-1"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Total Leave Req
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <ArrowRightToLine
                className="text-rose-500 dark:gray-400 mt-1"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Total Clock In
              </h1>
            </div>
          </div>
        </div>
        <div className="p-4">
          <KPIBarChart kpiData={kpiData} />
        </div>
        <div className="flex flex-col md:flex-row gap-6 p-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            {dougntChartData.map((pieData, index) => (
              <DynamicDoughnutChart
                key={index}
                data={pieData}
                theme={theme}
                className="h-[480px] w-full"
              />
            ))}
            <NotificationPanel
              initialNotifications={notifications}
              enableLiveUpdates={true}
              onDismiss={handleDismiss}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />
          </div>
        </div>
      </div> */}

      {/* <div>
        <div className="flex justify-between items-center mb-4 mt-20">
          <h2 className="text-xl font-semibold text-[var(--color-primary)] dark:text-[var(--color-primary)] mb-8">
            Accounts Management
          </h2>
          <div className="flex gap-3 justify-between mb-12">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                New Employee <Plus className="inline" size={15} />
              </button>
            <Link to="/employee">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                New Payroll <HandCoins className="inline" size={15} />
              </button>
            </Link>
            <Link to="/leave">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                Approve Leave <UserRoundCheck className="inline" size={15} />
              </button>
            </Link>
            <Link to="/attandance">
              <button className="w-[120px] text-xs h-[40px] text-white bg-[var(--color-primary)] dark:bg-red-800 hover-effect px-2 py-1 rounded-sm">
                Attandance <ContactRound className="inline" size={15} />
              </button>
            </Link>
          </div>
        </div>

        <div className="flex mb-15 justify-between">
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <FaMoneyBillWave
                className="dark:gray-400 mt-1 text-blue-700"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Total Revenue
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <AiFillMoneyCollect
                className="text-red-500 dark:gray-400 mt-1"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Total Expenses
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <BanknoteArrowUp
                className="text-yellow-500 dark:gray-400 mt-1"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Net Profit
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <Banknote
                className="text-green-500 dark:gray-400 mt-1"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Outstanding
              </h1>
            </div>
          </div>
          <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
            <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
              24
            </p>
            <div className="flex gap-2">
              <AlertCircle
                className="text-rose-500 dark:gray-400 mt-1"
                size={20}
              />
              <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
                Overdue
              </h1>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          <DynamicLineGraph
            data={lineGraphData}
            theme={theme}
            className="h-[350px] w-[100%]"
          />
          <div className="grid grid-cols-2 w-[100%] ">
            {accountDougntChartData.map((pieData, index) => (
              <DynamicDoughnutChart
                key={index}
                data={pieData}
                theme={theme}
                className="h-[350px] w-[280px]"
              />
            ))}
            <PaymentProgressCard
              items={progressItems}
              className="dark:bg-gray-800 bg-white"
              title={"payment status"}
            />
          </div>
        </div>
        <div className="mt-10 flex gap-4 justify-between">
          <NotificationPanel
            initialNotifications={notifications}
            enableLiveUpdates={true}
            onDismiss={handleDismiss}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
          <div className="w-[100%] flex flex-col gap-5">
            <div className="flex w-[100%] justify-evenly ">
              <div className="bg-white dark:bg-gray-800 rounded-tr-4xl rounded-bl-4xl  shadow-lg overflow-hidden w-[280px] h-[100%] max-w-md">
                <div className="bg-red-800 dark:bg-red-800 px-5 py-2">
                  <h2 className="text-xl font-bold text-white">
                    Accounts Overview
                  </h2>
                </div>

                <div className="p-1">
                  <div className="flex flex-col mb-2 p-3 bg-red-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-1">
                      <FaMoneyBillWave
                        className="text-red-700  dark:text-red-800"
                        size={20}
                      />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Total Revenue
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-red-700 dark:text-red-800">
                      $24,580
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FaFileInvoice
                          className="text-green-600 dark:text-green-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Total Invoices
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        120
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaClock
                          className="text-amber-600 dark:text-amber-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Pending Payments
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        85
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-tr-4xl rounded-bl-4xl  shadow-lg overflow-hidden w-[280px] h-[100%] max-w-md">
                <div className="bg-red-800 dark:bg-red-800 px-5 py-2">
                  <h2 className="text-xl font-bold text-white">
                    Employee Overview
                  </h2>
                </div>

                <div className="p-1">
                  <div className="flex flex-col mb-2 p-3 bg-red-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-1">
                      <FaUsers
                        className="text-red-700  dark:text-red-800"
                        size={20}
                      />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Total Employees
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-red-700 dark:text-red-800">
                      $24,580
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FaUserPlus
                          className="text-green-600 dark:text-green-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          New Hires
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        120
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUserTimes
                          className="text-amber-600 dark:text-amber-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Today Absent
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        85
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-[100%] justify-evenly">
              <div className="bg-white dark:bg-gray-800 rounded-tr-4xl rounded-bl-4xl  shadow-lg overflow-hidden w-[280px] h-[100%] max-w-md">
                <div className="bg-red-800 dark:bg-red-800 px-5 py-2">
                  <h2 className="text-xl font-bold text-white">
                    Project Overview
                  </h2>
                </div>

                <div className="p-1">
                  <div className="flex flex-col mb-2 p-3 bg-red-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-1">
                      <FaProjectDiagram
                        className="text-red-700  dark:text-red-800"
                        size={20}
                      />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Total Projects
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-red-700 dark:text-red-800">
                      580
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FaAward
                          className="text-green-600 dark:text-green-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Complete Projects
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        120
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <ChartBarIncreasing
                          className="text-amber-600 dark:text-amber-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Pending Projects
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        85
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-tr-4xl rounded-bl-4xl  shadow-lg overflow-hidden w-[280px] h-[100%] max-w-md">
                <div className="bg-red-800 dark:bg-red-800 px-5 py-2">
                  <h2 className="text-xl font-bold text-white">
                    Client Overview
                  </h2>
                </div>

                <div className="p-1">
                  <div className="flex flex-col mb-2 p-3 bg-red-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-1">
                      <FaHandsHelping
                        className="text-red-700  dark:text-red-800"
                        size={20}
                      />
                      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        Client
                      </h3>
                    </div>
                    <p className="text-xl font-bold text-red-700 dark:text-red-800">
                      $24,580
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <FaUserTie
                          className="text-green-600 dark:text-green-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          New Client
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        120
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FaUserSlash
                          className="text-amber-600 dark:text-amber-400"
                          size={16}
                        />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          Inactive Client
                        </span>
                      </div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        85
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <HrGraphs/>
      <AccountantDashboard/>
    </>
  );
};
export default Dashboard;
