const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<string[]>([]);
  const [departmentDesignations, setDepartmentDesignations] = useState<
    Record<string, string[]>
  >({});
  const [designationOptions, setDesignationOptions] = useState<string[]>([]);

  const [staffOptions, setStaffOptions] = useState<{ value: string; label: string }[]>([]);
  const [isFetchingStaff, setIsFetchingStaff] = useState(false);




  useEffect(() => {
    async function fetchData() {
      try {
        const [deptRes, desigRes] = await Promise.all([
          fetch("http://localhost:3000/api/getDepartments"),
          fetch("http://localhost:3000/api/getDesignations"),
        ]);

        const deptData = await deptRes.json();
        const desigData = await desigRes.json();

        // set full dept list
        setDepartments(deptData.data);

        // Department options (names only)
        const deptNames = deptData.data.map((d: Department) => d.name).filter(Boolean);
        setDepartmentOptions(deptNames);

        // Build mapping { departmentName: [designation1, designation2] }
        const deptDesigs: Record<string, string[]> = {};
        desigData.data.forEach((item: Designation) => {
          const dept = item.department;
          if (!deptDesigs[dept]) {
            deptDesigs[dept] = [];
          }
          deptDesigs[dept].push(item.designation);
        });
        setDepartmentDesignations(deptDesigs);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    }

    fetchData();
  }, []);

  // ✅ Update designation options when department changes
  useEffect(() => {
    if (formData.department) {
      setDesignationOptions(departmentDesignations[formData.department] || []);
    } else {
      setDesignationOptions([]);
    }
  }, [formData.department, departmentDesignations]);


  // 1️⃣ Fetch department based on staff_id
  useEffect(() => {
    if (!staff_id) return;

    const fetchDepartment = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/get-staff-department/${encodeURIComponent(staff_id)}`
        );
        const data = await res.json();

        if (data?.status && data.department) {
          setDepartment(data.department);
        } else {
          setDepartment(null);
        }
      } catch (err) {
        console.error("Error fetching department:", err);
        setDepartment(null);
      }
    };

    fetchDepartment();
  }, [staff_id]);

  // 2️⃣ Fetch staff of that department
  useEffect(() => {
    if (!department) {
      setStaffOptions([]);
      return;
    }

    const fetchStaff = async () => {
      setIsFetchingStaff(true);
      try {
        const res = await fetch(
          `http://localhost:3000/api/getStaff?department=${encodeURIComponent(department)}`
        );
        const data = await res.json();

        if (data?.status && Array.isArray(data.data)) {
          const options = data.data.map((staff: any) => ({
            value: staff.staff_id,
            label: `${staff.firstname} ${staff.lastname} (${staff.designation})`,
          }));
          setStaffOptions(options);
        } else {
          setStaffOptions([]);
        }
      } catch (err) {
        console.error("Error fetching staff:", err);
        setStaffOptions([]);
      } finally {
        setIsFetchingStaff(false);
      }
    };

    fetchStaff();
  }, [department]);





  <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <Briefcase className="inline mr-1" size={14} /> Department
          <span className="text-red-700 text-lg m-2">*</span>
        </p>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
          required
        >
          <option value="">Select Department</option>
          {departmentOptions.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Designation */}
      <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <Briefcase className="inline mr-1" size={14} /> Designation
          <span className="text-red-700 text-lg m-2">*</span>
        </p>
        <select
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
          required
          disabled={!formData.department}
        >
          <option value="">Select Designation</option>
          {designationOptions.map((designation) => (
            <option key={designation} value={designation}>
              {designation}
            </option>
          ))}
        </select>



            <div className="bg-gray-50 dark:bg-gray-700/70 p-4 rounded-lg border">
  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    <User className="inline mr-1" size={14} /> Assigned To <span className="text-red-700 text-lg m-2">*</span>
  </p>
  {isFetchingStaff ? (
    <div className="text-sm text-gray-500 mt-1">Loading staff...</div>
  ) : (
    <select
      name="assignee_id"
      value={formData.assignee_id}
      onChange={handleChange}
      className="w-full bg-transparent text-sm font-medium text-gray-900 dark:text-gray-100 mt-1 focus:outline-none"
      required
      disabled={!formData.department || staffOptions.length === 0}
    >
      <option value="">Select Staff</option>
      {staffOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )}
  {formData.department && staffOptions.length === 0 && !isFetchingStaff && (
    <div className="text-xs text-gray-500 mt-1">
      No staff found in this department
    </div>
  )}
</div>

