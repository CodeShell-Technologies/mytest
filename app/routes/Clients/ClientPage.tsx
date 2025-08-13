import { MailCheck, SquareChartGanttIcon } from "lucide-react";
import React, { useState } from "react";
import { AiFillProject, AiFillPushpin } from "react-icons/ai";
import {
  FaAddressCard,
  FaExclamationCircle,
  FaMailBulk,
  FaMailchimp,
  FaProjectDiagram,
} from "react-icons/fa";
import PaymentProgressCard from "src/component/graphComponents/ProgressCard";
import Project from "../Project/Project";
import Modal from "src/component/Modal";
import AddSalaryForm from "../Employee/Salary/AddSalary";
import ClientMom from "./ClientMOM";
import ClientFeedbacks from "./ClientFeedback";

function Clients() {
  const [activeTab, setActiveTab] = useState("clientProfile");

  const progressItems = [
    {
      type: "overdue",
      value: 200,
      color: "bg-red-500",
      icon: <FaExclamationCircle className="text-red-500 mr-2" />,
      label: "Overdue",
    },
  ];
  const tabs = [
    { id: "clientProfile", label: "Client Info" },
    { id: "paymentinfo", label: "All Payment Details" },
    { id: "mom", label: "Meeting Records" },
    { id: "feedback", label: " Feedback" },
    { id: "invoice", label: "Client Invoice" },
  ];

  return (
    <>
      <div className="text-red-700 text-2xl font-bold mb-5">
        View Client Page
      </div>
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
        {activeTab === "clientProfile" && (
          <div>
            <div className="bg-white h-[100%]  py-10  px-10 w-full text-gray-600 rounded-xl mt-10">
              <div className="flex justify-between">
                <div className="flex flex-col justify-between align-middle">
                  <p className="text-red-700 font-medium text-xl">
                    <AiFillProject className="inline mr-3" size={25} />
                    Project Type
                  </p>
                  <div className="mt-3 flex flex-col gap-2 h-[100px] w-[200px] bg-blue-100/45 py-6 rounded-lg items-center">
                    <p> Residential</p>
                    <p>Commerical</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between align-middle">
                  <p className="text-red-700 font-medium text-xl">
                    <FaAddressCard className="inline mr-3" size={25} />
                    Site Address
                  </p>
                  <div className="mt-3 flex flex-col gap-2 h-[100px] w-[200px] bg-blue-100/45 py-6  rounded-lg items-center">
                    <p> Plot No. 12, Anna Nagar</p>
                    <p>Tamil Nadu, 600040</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between align-middle">
                  <p className="text-red-700 font-medium text-xl">
                    <FaMailBulk className="inline mr-3" size={25} />
                    Project Requirements
                  </p>
                  <div className="mt-3 flex flex-col gap-2 h-[100px] w-[200px] bg-blue-100/45 py-6  rounded-lg items-center">
                    <p> 3D Elevation,</p>
                    <p>Vastu Compliant Design</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between align-middle">
                  <p className="text-red-700 font-medium text-xl">
                    <FaProjectDiagram className="inline mr-3" size={25} />
                    Preferred Software
                  </p>
                  <div className="mt-3 flex flex-col gap-2 h-[100px] w-[200px] bg-blue-100/45 py-6  rounded-lg items-center">
                    <p> AutoCAD</p>
                    <p>SketchUp, Revit</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex align-middle mt-8 ml-4">
                  <p className="text-red-700 font-medium text-xl">
                    <AiFillPushpin className="inline mr-3" size={25} />
                    Scope of Work
                  </p>
                  <div className="flex rounded-lg items-center justify-evenly w-[900px] gap-8">
                    <div>
                      <input type="checkbox" className="w-4 h-4 mr-3" />
                      <label>Structural Design</label>
                    </div>
                    <div>
                      <input type="checkbox" className="w-4 h-4 mr-3" />
                      <label>Supervision</label>
                    </div>
                    <div>
                      <input type="checkbox" className="w-4 h-4 mr-3" />
                      <label>Consultation</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <Project />
            </div>
          </div>
        )}
        {activeTab === "paymentinfo" && (
          <div>
            <div className="flex justify-evenly w-[100%] mt-15">
              <div className="flex flex-col gap-5 justify-evenly w-[20%] h-[200px] bg-white rounded-3xl shadow-2xl p-8 dark:bg-gray-800">
                <h1 className="font-medium text-xl text-red-700">₹ 3,00,000</h1>
                <div className="w-[40px] h-[40px] bg-red-300 dark:bg-red-700/25  rounded-sm flex items-center justify-center">
                  <SquareChartGanttIcon
                    className="text-white dark:text-red-300"
                    size={25}
                  />
                </div>

                <p className="dark:text-gray-400">Total Project Amount</p>
              </div>
              <div className="flex flex-col gap-5 justify-evenly w-[20%] h-[200px] bg-white rounded-3xl shadow-2xl p-8 dark:bg-gray-800">
                <h1 className="font-medium text-xl text-red-700">₹ 3,00,000</h1>
                <div className="w-[40px] h-[40px] bg-red-300 dark:bg-red-700/25  rounded-sm flex items-center justify-center">
                  <SquareChartGanttIcon
                    className="text-white dark:text-red-300"
                    size={25}
                  />
                </div>

                <p className="dark:text-gray-400">Total Project Amount</p>
              </div>
              <div className="flex flex-col gap-5 justify-evenly w-[20%] h-[200px] bg-white rounded-3xl shadow-2xl p-8 dark:bg-gray-800">
                <h1 className="font-medium text-xl text-red-700">₹ 3,00,000</h1>
                <div className="w-[40px] h-[40px] bg-red-300 dark:bg-red-700/25  rounded-sm flex items-center justify-center">
                  <SquareChartGanttIcon
                    className="text-white dark:text-red-300"
                    size={25}
                  />
                </div>

                <p className="dark:text-gray-400">Total Project Amount</p>
              </div>
              <div className="flex flex-col gap-5 justify-evenly w-[20%] h-[200px] bg-white rounded-3xl shadow-2xl p-8 dark:bg-gray-800">
                <h1 className="font-medium text-xl text-red-700">₹ 3,00,000</h1>
                <div className="w-[40px] h-[40px] bg-red-300 dark:bg-red-700/25  rounded-sm flex items-center justify-center">
                  <SquareChartGanttIcon
                    className="text-white dark:text-red-300"
                    size={25}
                  />
                </div>

                <p className="dark:text-gray-400">Total Project Amount</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-8 mt-20">
              <div className="flex flex-col  bg-red-200 dark:bg-red-700/25  text-red-800 w-[70%] h-[200px] rounded-lg border-2 border-red-700 shadow-xl">
                <div className="flex justify-between p-5">
                  <h1 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                    Pyament History
                  </h1>

                  <div className="flex gap-5">
                    <p className="font-extrabold text-sm">40%</p>
                    <div className="w-[280px] rounded-full h-2.5 dark:bg-dark-600 bg-gray-200">
                      <div
                        className={`bg-red-700 h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `40%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="items-center flex justify-end mr-[30px]">
                  <table className="text-gray-700 dark:text-gray-400">
                    <thead className="">
                      <tr>
                        <th className="px-8 py-1 text-left">Month</th>
                        <th className="px-8 py-1 text-left">Paid Amount</th>
                        <th className="px-8 py-1 text-left"> Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className=" border-b-1 border-gray-500">
                        <td className="px-8 py-1 text-left">Apr 23</td>
                        <td className="px-8 py-1 text-left">1,80,000</td>
                        <td className="px-8 py-1 text-left">Paid</td>
                      </tr>

                      <tr className=" border-b-1 border-gray-500">
                        <td className="px-8 py-1 text-left">Apr 23</td>
                        <td className="px-8 py-1 text-left">1,80,000</td>
                        <td className="px-8 py-1 text-left">Paid</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col  bg-red-100/50 dark:bg-red-700/25 text-red-800 w-[70%] h-[200px] rounded-lg border-none shadow-xl">
                <div className="flex justify-between p-5">
                  <h1 className="text-xl font-bold text-gray-600 dark:text-gray-400">
                    Pyament History
                  </h1>

                  <div className="flex gap-5">
                    <p className="font-extrabold text-sm">70%</p>
                    <div className="w-[280px] rounded-full h-2.5 dark:bg-dark-600 bg-gray-200">
                      <div
                        className={`bg-red-700 h-2.5 rounded-full transition-all duration-500`}
                        style={{ width: `70%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="items-center flex justify-end mr-[30px]">
                  <table className="text-gray-700 dark:text-gray-400">
                    <thead className="">
                      <tr>
                        <th className="px-8 py-1 text-left">Month</th>
                        <th className="px-8 py-1 text-left">Paid Amount</th>
                        <th className="px-8 py-1 text-left"> Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className=" border-b-1 border-gray-500">
                        <td className="px-8 py-1 text-left">Apr 23</td>
                        <td className="px-8 py-1 text-left">1,80,000</td>
                        <td className="px-8 py-1 text-left">Paid</td>
                      </tr>

                      <tr className=" border-b-1 border-gray-500">
                        <td className="px-8 py-1 text-left">Apr 23</td>
                        <td className="px-8 py-1 text-left">1,80,000</td>
                        <td className="px-8 py-1 text-left">Paid</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>{" "}
          </div>
        )}
        {activeTab === "mom" && <ClientMom />}
        {activeTab === "feedback" && (
          <div>
           <ClientFeedbacks/>
          </div>
        )}
      </div>
    </>
  );
}

export default Clients;
