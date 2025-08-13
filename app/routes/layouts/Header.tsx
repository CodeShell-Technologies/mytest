
import { ChevronsDown, ChevronsLeft } from "lucide-react";
import { FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
import { IoIosMailUnread } from "react-icons/io";
import { useSideBar } from "~/store/useSideBar";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "src/stores/authStore";

export const Header = () => {
  const { isOpen, toggle } = useSideBar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const clearAuthData = useAuthStore((state) => state.clearAuthData);
  const UserRole=useAuthStore((state=>state.role))
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

  const handleLogout = () => {
    clearAuthData();
    navigate("/login");
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
        <IoIosMailUnread 
          className="text-gray-500 hover:text-red-700 dark:text-gray-400 dark:hover:text-red-500 cursor-pointer" 
          size={25} 
        />

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