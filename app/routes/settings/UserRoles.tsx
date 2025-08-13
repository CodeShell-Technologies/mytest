
import  { useEffect, useState } from 'react';
import DataTable from 'src/component/DataTable';
import CustomPagination from 'src/component/CustomPagination';
import SearchInput from 'src/component/SearchInput';
// import Dropdown from 'src/component/DrapDown';
import axios from "axios";

import { Edit2, Eye, SquarePen, Trash2 } from "lucide-react";
import Modal from "src/component/Modal";
import Dropdown from "src/component/DrapDown";

import { useAuthStore } from "src/stores/authStore";
import useBranchStore from "../../../src/stores/useBranchStore";


import { BASE_URL, toastposition, toastStyle } from "~/constants/api";
// import CreateBranchForm from "../Branch/CreateBranchForm";
import toast, { Toaster } from "react-hot-toast";
import AddNewTaskForm from "./EditRoles";

const UserRoles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [sheetData,setSheetData]=useState([])
    const [selectStatus, setSelectStatus] = useState("");
const [data, setData] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState("");
const [showEditModal, setShowEditModal] = useState(false);
 const token = useAuthStore((state) => state.accessToken);
const userBranchCode = useAuthStore((state) => state.branchcode);
// const data=[
//   {id:"1",
//     name:"Bharathi",
//     email:"bharathi@gmail.com",
//     position:"Team Lead"
//   },
//   {id:"2",
//     name:"Bharathi",
//     email:"bharathi@gmail.com",
//     position:"Team Lead"
//   }
// ]


useEffect(() => {
    if (!token) return; // prevent request if token is missing

    fetch("http://localhost:3000/api/users/read", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Pass token here
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.data) {
          const mappedData = response.data.map((item, index) => ({
            id: (index + 1).toString(),
            name: `${item.firstname} ${item.lastname}`,
            email: item.email,
            position: item.role,
          }));
          setData(mappedData);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, [token]); // re-fetch if token changes

  // Update sheetData whenever data changes
  useEffect(() => {
    setSheetData(data);
  }, [data]);

const getData=()=>{
  return data
}

const handleEditBranch = (branch) => {
    console.log("branchhhhtaskk", branch);
    setSelectedBranch(branch);
    setShowEditModal(true);
  };



const handleDeleteBranch = (milestone) => {
    setShowDeleteModal(true);
    setDeleteData(milestone);
  };


  // const { loading, error, data } = useQuery(GET_ALL_USERS, {
  //   variables: {
  //     page: currentPage,
  //     limit: pageSize,
  //     search: searchTerm,
  //   },
  // });

  // const handleSearch = (value) => {
  //   setSearchTerm(value);
  //   setCurrentPage(1); // Reset to first page on new search
  // };

  const thead = () => [
    { data: "Id" },
    { data: "Name" },
    { data: "Email" },
    { data: "Role" },
    { data: "Actions" },
  
  ];

  const tbody = () => {

    if (!data) return [];
    return data.map((user) => ({
      id: user.id,
      data: [
        { data: user.id },
        { data: user.name },
        { data: user.email },
        { data: user.position },
        
        {
          data: (
            <div className="flex  justify-center gap-2">
              
              <button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleEditBranch(data)}
                title="Edit"
              >
                <SquarePen size={18} />
              </button>
              <button
                className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleDeleteBranch(data)}
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

<Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setshowEditModal(false)}
        title="Edit Role File Form"
      >
        <AddNewTaskForm
          onSuccess={handleEditBranch}
          onCancel={() => setshowEditModal(false)}
        />
      </Modal>



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
  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 flex-grow">
      <h2 className="text-xl font-semibold mb-4 text-red-700 dark:text-red-700">
User List </h2>

      {/* <CommonTable
        thead={thead}
        tbody={tbody}
        isSearch
        className="mb-4"
        actionIcons={['Eye', 'Edit', 'Trash2']}

      /> */}
    
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
      <DataTable
      thead={thead}
      tbody={tbody}
      isSearch
      actionIcons={['Eye', 'Edit', 'Trash2']}
      />
      </div>
        <div className="sticky bottom-0 border-t border-gray-200 dark:border-gray-700 p-4">
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
 
  );
};

export default UserRoles;