import React from "react";
import DynamicLineGraph from "src/component/graphComponents/DynamicLineGraph";
import DynamicPieChart from "src/component/graphComponents/DynamicPieChart";
import LineGraph from "src/component/graphComponents/LineGraph";
import DynamicBarChart from "src/component/graphComponents/DynamicBarChart";
import DynamicDoughnutChart from "src/component/graphComponents/DynamicDoughnutChart";
import {
  Building2,
  Clock,
  Projector,
  Tags,
  User2Icon,
  UserCheck2,
} from "lucide-react";
import {
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaMoneyBill,
} from "react-icons/fa";
import PaymentProgressCard from "src/component/graphComponents/ProgressCard";
import ShadowLineGraph from "src/component/graphComponents/ShadowLineGraph";
import { DotsLoader } from "src/component/Loaders/PageLoader";
import DotSpinner from "src/component/Loaders/LegLoader";

const chartData = {
  title: "Monthly Sales",
  labels: ["January", "February", "March", "April"],
  datasets: [
    {
      label: "Sales",
      data: [150, 200, 180, 220],
      //    backgroundColor: 'rgba(34, 197, 94, 0.7)', // green
      //   borderColor: 'rgba(34, 197, 94, 1)',
    },
  ],
};

const SampleDashboard = () => {
  const theme = "light";

  const lineGraphData = {
    title: "Monthly Sales Data",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "Paid", data: [65, 59, 80, 81, 56, 55] },
      { label: "Un_Paid", data: [28, 48, 40, 19, 86, 27] },
      { label: "Pending", data: [45, 25, 60, 91, 76, 35] },
      { label: "OverDue", data: [35, 55, 30, 71, 66, 45] },
    ],
  };
  const shadowGraph = {
    title: "Employee Performance",
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      { label: "On-time", data: [65, 59, 80, 45, 89, 90] },
      { label: "Delay", data: [28, 48, 40, 32, 43, 24] },
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
  const dougntChartData = [
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
    <div className="p-6 dark:text-gray-100 text-gray-900">
      <h1 className="text-2xl text-red-700 font-bold mb-5">
        Analytics Dashboard
      </h1>
      <div className="md:flex text-gray-700 mb-5 justify-between gap-3">
        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-items-start justify-evenly rounded-lg shadow-lg ps-8 ">
          <div>
            <h1 className="text-bold font-bold text-xl text-gray-700 dark:text-gray-200">
              Todal Project
            </h1>
          </div>
          <div className="flex gap-6">
            <div className=" bg-indigo-500 dark:bg-indigo-600/25 w-[40px] h-[40px] rounded-full p-1">
              <Projector
                className="text-gray-50 text-center dark:text-gray-300"
                size={28}
              />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-xl mt-2">
              1,08,0020
            </p>
          </div>
          <div>
            <p className="font-light text-sm dark:text-gray-300">
              {" "}
              Leads Detail
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-items-start justify-evenly rounded-lg shadow-lg ps-8 ">
          <div>
            <h1 className="text-bold font-bold text-xl text-gray-700 dark:text-gray-200">
              Todal Branch
            </h1>
          </div>
          <div className="flex gap-6">
            <div className=" bg-green-400 w-[40px] h-[40px] dark:bg-green-400/55 rounded-full p-1">
              <Building2 className="text-gray-50 text-center" size={28} />
            </div>
            <p className="text-gray-500 font-xl mt-2 darktext-gray-400">
              1,08,0020
            </p>
          </div>
          <div>
            <p className="font-light text-sm dark:text-gray-300">
              {" "}
              Branch Detail
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-items-start justify-evenly rounded-lg shadow-lg ps-8 ">
          <div>
            <h1 className="text-bold font-bold text-xl text-gray-700 dark:text-gray-200">
              Todal Clients
            </h1>
          </div>
          <div className="flex gap-6">
            <div className=" bg-yellow-400 w-[40px] h-[40px] rounded-full p-1">
              <UserCheck2
                className="text-gray-50 text-center dark:text-gray-300"
                size={28}
              />
            </div>
            <p className="text-gray-500 font-xl mt-2 dark:text-gray-400">
              1,08,0020
            </p>
          </div>
          <div>
            <p className="font-light text-sm dark:text-gray-300">
              {" "}
              Leads Detail
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 w-[250px] h-[200px] flex flex-col justify-items-start justify-evenly rounded-lg shadow-lg ps-8 ">
          <div>
            <h1 className="text-bold font-bold text-xl text-gray-700 dark:text-gray-200">
              Todal OverDue
            </h1>
          </div>
          <div className="flex gap-6">
            <div className=" bg-red-400 w-[40px] h-[40px] rounded-full p-1">
              <FaMoneyBill
                className="text-gray-50 text-center dark:text-gray-300"
                size={28}
              />
            </div>
            <p className="text-gray-500 font-xl mt-2 dark:text-gray-400">
              1,08,0020
            </p>
          </div>
          <div>
            <p className="font-light text-sm dark:text-gray-300">
              {" "}
              Leads Detail
            </p>
          </div>
        </div>
      </div>

      <div className="flex mb-5 justify-between">
        <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
          <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
            24
          </p>
          <div className="flex gap-2">
            <Clock className="text-gray-500 dark:gray-400 mt-1" size={20} />
            <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
              Total Task
            </h1>
          </div>
        </div>
        <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
          <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
            24
          </p>
          <div className="flex gap-2">
            <Clock className="text-gray-500 dark:gray-400 mt-1" size={20} />
            <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
              Total Task
            </h1>
          </div>
        </div>
        <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
          <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
            24
          </p>
          <div className="flex gap-2">
            <Clock className="text-gray-500 dark:gray-400 mt-1" size={20} />
            <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
              Total Task
            </h1>
          </div>
        </div>
        <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
          <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
            24
          </p>
          <div className="flex gap-2">
            <Clock className="text-gray-500 dark:gray-400 mt-1" size={20} />
            <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
              Total Task
            </h1>
          </div>
        </div>
        <div className="flex flex-col bg-white w-[200px] h-[100px] shadow-2xl rounded-lg items-center justify-center dark:bg-gray-800">
          <p className="text-2xl font-extrabold text-red-700 dark:text-red-700/80">
            24
          </p>
          <div className="flex gap-2">
            <Clock className="text-gray-500 dark:gray-400 mt-1" size={20} />
            <h1 className="text-lg font-medium dark:text-gray-400 text-gray-500">
              Total Task
            </h1>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DynamicLineGraph
          data={lineGraphData}
          theme={theme}
          className="h-[350px]"
        />
        <div className="flex gap-3">
          {pieChartData.map((pieData, index) => (
            <DynamicPieChart
              key={index}
              data={pieData}
              theme={theme}
              className="h-[350px] w-[280px]"
            />
          ))}
          {dougntChartData.map((pieData, index) => (
            <DynamicDoughnutChart
              key={index}
              data={pieData}
              theme={theme}
              className="h-[350px] w-[280px]"
            />
          ))}
        </div>
        <DynamicBarChart data={chartData} theme={theme} className="h-[350px]" />
        <LineGraph data={lineGraphData} theme={theme} className="h-[350px]" />
        <PaymentProgressCard
          items={progressItems}
          className="dark:bg-gray-800 bg-white"
          title={"payment status"}
        />
        <ShadowLineGraph
          data={shadowGraph}
          theme={theme}
          className="h-[350px]"
        />
      </div>

      <div className="text-red-600 text-2xl font-bold">
        <DotsLoader />
        <div className="flex justify-center items-center mt-[20%]">
          <DotSpinner />
        </div>
      </div>
    </div>
  );
};

export default SampleDashboard;
