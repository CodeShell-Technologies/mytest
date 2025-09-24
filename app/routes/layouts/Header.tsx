
import { ChevronsDown, ChevronsLeft } from "lucide-react";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { IoIosMailUnread } from "react-icons/io";
import { useSideBar } from "~/store/useSideBar";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "src/stores/authStore";
import { BASE_URL } from "~/constants/api";
// import { useAuthStore } from "src/stores/authStore";

import axios from "axios";
import { Bell } from "lucide-react";

export const Header = () => {
  const { isOpen, toggle } = useSideBar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const UserRole=useAuthStore((state=>state.role))
  const [count, setCount] = useState(0);
  const [leaves, setLeaves] = useState(0);

  const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  const token = useAuthStore((state: any) => state.accessToken);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
  const fetchCounts = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [projects, tasks, milestones, payments,followups] = await Promise.all([
        axios.get(
          `${BASE_URL}/project/overview/read?overdue=${today}`,
          { headers }
        ),
        axios.get(
          `${BASE_URL}/project/task/read?overdue=${today}`,
          { headers }
        ),
        axios.get(
          `${BASE_URL}/project/milestone/read?overdue=${today}`,
          { headers }
        ),

              axios.get(
          `${BASE_URL}/project/invoice/read?overdue=${today}`,
          { headers }
        ),

                            axios.get(
          `${BASE_URL}/campaign/followup/read?status=active`,
          { headers }
        ),

      ]);

// /campaign/followup/read
      console.log("Projects API:", projects.data);
      console.log("Tasks API:", tasks.data);
      console.log("Milestones API:", milestones.data);
            console.log("Payment API:", payments.data);
            console.log("Payment API:", followups.data);

      const projectCount =
        projects.data.totalDocuments ?? projects.data.total ?? 0;
      const taskCount =
        tasks.data.totalDocuments ?? tasks.data.total ?? 0;
      const milestoneCount =
        milestones.data.totalDocuments ?? milestones.data.total ?? 0;

        const paymentCount =
        payments.data.totalDocuments ?? payments.data.total ?? 0;

                const followupCount =
        followups.data.totalDocuments ?? followups.data.total ?? 0;

      const total = projectCount + taskCount + milestoneCount+paymentCount+followupCount;
      setCount(total);
    } catch (error) {
      console.error("Failed to fetch reminder counts", error);
    }
  };

  fetchCounts();
}, [today, token]);

 // let url = `${BASE_URL}/users/leavereq/read`;

//   useEffect(() => {
//   const fetchLeaves = async () => {
//     try {
//       const headersl = {
//         Authorization: `Bearer ${token}`,
//       };

//       const [leaves] = await Promise.all([
//         axios.get(
//           `${BASE_URL}/users/leavereq/read?status=pending`,
//           { headersl }
//         ),
        
//       ]);

//       console.log("Leaves API:", leaves.data);
//       // console.log("Tasks API:", tasks.data);
//       // console.log("Milestones API:", milestones.data);

//       const leaveCount =
//         leaves.data.totalDocuments ?? leaves.data.total ?? 0;
      

//       const totalleaves = leaveCount;
//       setLeaves(totalleaves);
//     } catch (error) {
//       console.error("Failed to fetch reminder counts", error);
//     }
//   };

//   fetchLeaves();
// }, [today, token]);



useEffect(() => {
  const fetchLeaves = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [leaves] = await Promise.all([
        axios.get(`${BASE_URL}/users/leavereq/read?status=pending`, { headers }),
      ]);

      console.log("Leaves API:", leaves.data);

      const leaveCount =
        leaves.data.totalDocuments ?? leaves.data.total ?? 0;

      setLeaves(leaveCount);
    } catch (error) {
      console.error("Failed to fetch reminder counts", error);
    }
  };

  fetchLeaves();
}, [today, token]);


useEffect(() => {
  const fetchCounts = async () => { /* ...same as above... */ };
  fetchCounts();
  const interval = setInterval(fetchCounts, 60000); // refresh every 60s
  return () => clearInterval(interval);
}, [today]);



  // const handleLogout = () => {
  // //   clearAuthData();
  // //   useAuthStore.persist.clearStorage(); // clear Zustand persist key
  // // useAuthStore.getState().clearAuthData(); // reset Zustand state
  // //   navigate("/login");
  //   const clearAuthData = useAuthStore.getState().clearAuthData;
  // clearAuthData(); // clears Zustand state and persisted storage

  // // Extra safety: clear tokens manually
  // localStorage.removeItem("auth-storage"); // Zustand persist key
  // localStorage.removeItem("accessToken");
  // localStorage.removeItem("refreshToken");
  // localStorage.removeItem("userId");
  // localStorage.removeItem("role");
  // localStorage.removeItem("brcode");

  // window.location.href = "/login"; // force reload to login page
  // };


// const handleLogout = async () => {
//   try {
//     const userId = useAuthStore.getState().userId;

//     // 1️⃣ Call backend to clear server session
//     await axios.post(`${BASE_URL}/logout`, { userId });

//     // 2️⃣ Clear frontend Zustand & storage
//     useAuthStore.getState().clearAuthData();
//     localStorage.removeItem("auth-storage");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     localStorage.removeItem("userId");
//     localStorage.removeItem("role");
//     localStorage.removeItem("brcode");

//     // 3️⃣ Navigate to login page
//     navigate("/login");
//   } catch (err) {
//     console.error("Logout failed", err);
//     // Fallback: force reload
//     window.location.href = "/login";
//   }
// };


const handleLogout = async () => {
  try {
    const userId = useAuthStore.getState().userId;

    // 🔹 Optional: call backend to mark session inactive
    axios.post(`${BASE_URL}/logout`, { userId }).catch(() => {
      console.warn("Backend logout failed, but clearing local session anyway.");
    });

    // 🔹 Clear Zustand (this will also clear persisted storage if you set it up properly)
    useAuthStore.getState().clearAuthData();

    // 🔹 If you want, only clear tokens (Zustand should handle the rest)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    // 🔹 Navigate to login
    navigate("/login");
  } catch (err) {
    console.error("Logout failed", err);
    window.location.href = "/login"; // fallback
  }
};


  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900 dark:shadow-slate-800">
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost flex h-10 flex-shrink-0 items-center gap-x-3 rounded-lg p-2 text-red-700 transition-colors hover:text-white hover:bg-red-700 dark:hover:text-slate-100 size-10"
          onClick={toggle}
        >
          <ChevronsLeft className={isOpen ? "rotate-180" : ""} />
        </button>
      </div>



      <div className="flex items-center gap-x-6">
              

 {(UserRole === "superadmin" || UserRole === "admin" || UserRole === "hr") && (
              <div
  onClick={() => navigate("/leave")}
  className="relative inline-flex items-center cursor-pointer text-gray-600 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500"
>
  <span className="font-medium">Leaves</span>
  {leaves > 0 && (
    <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
      {leaves}
    </span>
  )}
</div>
)}


        <div className="relative inline-block">
      <Bell  onClick={() => navigate("/notification")} className="text-gray-600 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500 cursor-pointer" size={28} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
          {count}
        </span>
      )}
    </div>
{/*
    <div className="relative inline-block">
      <Bell  onClick={() => navigate("/notification")} className="text-gray-600 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500 cursor-pointer" size={28} />
      {leaves > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
          {leaves}
        </span>
      )}
    </div>*/}



        <div className="relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
              <FaUser className="text-gray-500 dark:text-gray-300" />
            </div>
            <span className="text-sm font-light text-gray-700 dark:text-gray-300 hidden md:inline">
              {UserRole || "Admin"}<ChevronsDown className="inline ml-2" size={15}/>
            </span>
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 dark:bg-slate-800 dark:border dark:border-slate-700">
              <div className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-slate-700">
                Signed in as <span className="font-bold text-red-700 text-sm">{UserRole}</span>
              </div>
              
              <Link to="/account_profile"
                
                className="block px-4 py-2 text-sm text-gray-700 ml-4 hover:bg-gray-100 border-b border-gray-300 dark:text-gray-300 dark:hover:bg-slate-700 flex items-center gap-2"
                onClick={(e) => {
                  setIsDropdownOpen(false);
                }}
              >
                <FaUser className="text-gray-500 dark:text-gray-400" />
                Profile
              </Link>
              
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 ml-4 hover:bg-gray-100  border-b border-gray-300 dark:text-gray-300 dark:hover:bg-slate-700 flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  setIsDropdownOpen(false);
                  navigate("/settings");
                }}
              >
                <FaCog className="text-gray-500 dark:text-gray-400" />
                Settings
              </a>
              
              <div className="border-t border-gray-100 dark:border-slate-700"></div>
              
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2                                                                                                                                                                                                                                                                                                                                                                                                                                         ml-4 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-slate-700 flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};