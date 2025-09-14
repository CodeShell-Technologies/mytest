import { useEffect , useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBigLeft, DotIcon, Edit, Edit2, MailCheck, PhoneCall, PrinterCheck, PrinterCheckIcon } from 'lucide-react';

import { Link } from "react-router";
import axios from "axios";
import { BASE_URL, toastposition, toastStyle } from "~/constants/api";
// import CreateBranchForm from "../Branch/CreateBranchForm";
import toast, { Toaster } from "react-hot-toast";
// import EditBranchForm from "../Branch/EditFormData";
import { ButtonLoader } from "src/component/Loaders/ButtonLoader";
import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "../../src/stores/useBranchStore";


const AccountProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
    const accesstoken = useAuthStore((state) => state.accessToken);
  const [activeTab, setActiveTab] = useState('personal');

  const branchcode = useAuthStore((state) => state.branchcode);
  const staff_id = useAuthStore((state) => state.staff_id);
  console.log(staff_id);
       const [hydrated, setHydrated] = useState(false);

  // const employee = {
  //   id: "1",
  //   name: "Bharathi",
  //   email: "bharathi@gmail.com",
  //   position: "Team Lead",
  //   phone: "+91 98765 43210",
  //   address: "123 Main Street, Chennai, Tamil Nadu",
  //   department: "Development Team",
  //   staffId: "ASC 01",
  //   license: "----",
  //   dateOfJoining: "15-05-2018",
  //   bloodGroup: "A1-ve",
  //   fathersName: "Ganesan",
  //   dateOfBirth: "10-06-1990",
  //   alternateContact: "+91 98765 43211",
  //   profileImage: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D"
  // };



const [employee, setEmployee] = useState(null);


   // wait for Zustand persist to hydrate
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (useAuthStore.persist.hasHydrated()) {
        setHydrated(true);
      } else {
        const unsub = useAuthStore.persist.onHydrate(() => setHydrated(true));
        return () => unsub();
      }
    }
  }, []);


const token = accesstoken;

  useEffect(() => {
      if (hydrated && token) {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/profile`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ staff_id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch employee data");
        }

        const result = await response.json();

        // Map API data to your employee object structure
        const emp = {
          id: "1", // or result.data.basic.id if exists
          name: `${result.data.basic.firstname} ${result.data.basic.lastname}`,
          email: result.data.basic.email,
          position: result.data.basic.designation || "N/A",
          phone: result.data.basic.phonenumber || "N/A",
          address: result.data.basic.presentaddress || "N/A",
          department: result.data.basic.department || "N/A",
          staffId: result.data.basic.staff_id,
          license: "----",
          dateOfJoining: result.data.basic.dateofjoining
            ? new Date(result.data.basic.dateofjoining).toLocaleDateString("en-GB")
            : "N/A",
          bloodGroup: result.data.basic.bloodgroup || "N/A",
          fathersName: "N/A", // not in API
          dateOfBirth: result.data.basic.dob
            ? new Date(result.data.basic.dob).toLocaleDateString("en-GB")
            : "N/A",
          alternateContact: result.data.basic.alternumber || "N/A",
          profileImage:
            result.data.basic.profileurl ||
            "https://via.placeholder.com/150?text=No+Image",
        };

        setEmployee(emp);
      } catch (error) {
        console.error(error);
      }
    };

    fetchEmployeeData();
 } }, [hydrated,token]);

  if (!employee) {
    return <p>Loading...</p>;
  }



  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className=" min-h-screen">
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-700 dark:hover:text-red-700"
            >
              <ArrowBigLeft className="mr-2" size={20} />
              Back to Employees
            </button>
          
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-700 dark:bg-red-700/25 rounded-lg shadow overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/4 bg-red-700 dark:bg-red-700/15 p-6 flex items-center justify-center">
              <div className="relative">
                <img
                  className="h-48 w-48 rounded-full object-cover border-4 border-white dark:border-gray-600"
                  src={employee.profileImage}
                  alt={employee.name}
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                  <Edit className="text-white" size={16} />  {staff_id}
                </div>
              </div>
            </div>

            <div className="md:w-3/4 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-100 dark:text-gray-100">{employee.name}</h1>
                  <p className="text-lg text-gray-300 dark:text-gray-300">{employee.position} | since 2021</p>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-3 text-gray-100">
                  <button>
                  <MailCheck size={16} className='inline'/>  Message
                  </button>
                  <button>
                   <PhoneCall size={16} className='inline' /> Call
                  </button>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <div className=" flex">
                  <p className="text-sm text-gray-500  dark:text-gray-400">Staff ID :</p>
                  <p className="font-medium text-sm text-gray-300 dark:text-white"> {employee.staffId}</p>
                </div>
                <div className="flex">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Department :</p>
                  <p className="font-medium text-gray-300 dark:text-white">{employee.department}</p>
                </div>
                <div className=" flex">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Date of Joining :</p>
                  <p className="font-medium text-gray-300 dark:text-white">{employee.dateOfJoining}</p>
                </div>
                <div>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium  bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                   <DotIcon className='font-extrabold inline'/> Active
                    </span>
                </div>
              </div>
            </div>
          </div>

     
        </div>
     <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'personal' ? 'border-red-700 text-red-900 dark:text-red-900' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setActiveTab('professional')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'professional' ? 'border-red-700 text-red-900 dark:text-red-900' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}`}
              >
                Professional Details
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'documents' ? 'border-red-700 text-red-900 dark:text-red-900' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'}`}
              >
                Documents
              </button>
            </nav>
          </div>
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {activeTab === 'personal' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.dateOfBirth}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Father's Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.fathersName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Blood Group</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Alternate Contact</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.alternateContact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.address}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Staff ID</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.staffId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Department</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Position</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.position}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date of Joining</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.dateOfJoining}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">License</p>
                    <p className="font-medium text-gray-900 dark:text-white">{employee.license}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Documents</h2>
              <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;