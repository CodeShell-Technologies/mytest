import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "src/stores/authStore";
import toast from "react-hot-toast";
import { BASE_URL } from "~/constants/api";

const departmentOptions = [
  "architecture",
  "visualization",
  "structural",
  "drafting",
  "hr",
  "sales",
  "consulting",
];

export const useStaffFilter = (branchcode) => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [staffOptions, setStaffOptions] = useState([]);
  const [isFetchingStaff, setIsFetchingStaff] = useState(false);
  const token = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (selectedDepartment && branchcode) {
      fetchStaffOptions();
    }
  }, [selectedDepartment, branchcode]);

  const fetchStaffOptions = async () => {
    setIsFetchingStaff(true);
    try {
      let url = `${BASE_URL}/users/dropdown?department=${selectedDepartment}`;

      if (branchcode) {
        url += `&branchcode=${branchcode}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("responsefostaffidinleadd", response);
      if (response.data?.data) {
        const options = response.data.data.map((user) => ({
          value: user.staff_id,
          label: `${user.firstname} ${user.lastname} - ${user.designation}`,
        }));
        setStaffOptions(options);
      }
    } catch (err) {
      toast.error("Failed to fetch staff options");
      setStaffOptions([]);
    } finally {
      setIsFetchingStaff(false);
    }
  };

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
  };

  return {
    departmentOptions,
    selectedDepartment,
    staffOptions,
    isFetchingStaff,
    handleDepartmentChange,
  };
};
