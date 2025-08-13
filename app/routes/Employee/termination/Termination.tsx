import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import DataTable from "src/component/DataTable";
import SearchInput from "src/component/SearchInput";
import { useAuthStore } from "src/stores/authStore";
import { Toaster, toast } from "react-hot-toast";
import { BASE_URL, toastposition } from "~/constants/api";
import AddTerminationForm from "./AddTerminationForm;";
import Modal from "src/component/Modal"; // Import the Modal component
import EditBranchForm from "~/routes/Branch/EditFormData";
import { Eye, SquarePen } from "lucide-react";
import EditTerminationForm from "./EditTerminationForm";
import { Link } from "react-router";

const Termination = () => {
  const token = useAuthStore((state) => state.accessToken);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTremination, setSelectedTremination] = useState(null);
  const fetchTerminations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user_resign_form/read`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(res?.data?.data)) {
        setData(res.data.data);
      } else {
        toast.error("Invalid data received");
      }
    } catch (err) {
      toast.error("Failed to fetch termination data");
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleEditBranch = (item) => {
    setSelectedTremination(item);
    setShowEditModal(true);
  };
  const handleEditSuccess = () => {
    setShowEditModal(false);
    toast.success("Branch updated successfully!");
    fetchTerminations();
  };

  useEffect(() => {
    if (token) fetchTerminations();
  }, [token]);

  const filteredData = data.filter((item) =>
    item.staff_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const thead = () => [
    { data: "ID" },
    { data: "Staff Name" },
    { data: "Designation" },
    { data: "Team" },
    { data: "Termination Type" },
    { data: "Last Working Day" },
    { data: "Relieving Date" },
    { data: "Status" },
    { data: "Action" },
  ];

  const tbody = () =>
    filteredData.map((item, index) => ({
      id: item.resign_id,
      data: [
        { data: index + 1 },
        { data: item.staff_name },
        { data: item.designation },
        { data: item.team_name },
        { data: item.termination_type },
        { data: moment(item.last_working_day).format("YYYY-MM-DD") },
        { data: moment(item.reliving_date).format("YYYY-MM-DD") },
        {
          data: (
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                item.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {item.status}
            </span>
          ),
        },
        {
          data: (
            <div className="flex justify-center gap-2">
              <Link to={`/View-certificate/${encodeURIComponent(item.staff_id)}/${encodeURIComponent(item.resign_id)}`}>
                <button
                  className="p-1 text-blue-700 rounded hover:text-gray-500 dark:hover:text-gray-300"
                  title="View"
                >
                  <Eye size={18} />
                </button>
              </Link>
              <button
                className="p-1 text-[var(--color-primary)] rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleEditBranch(item)}
                title="Edit"
              >
                <SquarePen size={18} />
              </button>
              {/* <button
                className="p-1 text-red-600 rounded hover:text-gray-500 dark:hover:text-gray-300"
                onClick={() => handleDeleteBranch(branch.id)}
                title="Delete"
              >
                <Trash2 size={18} />
              </button> */}
            </div>
          ),
          className: "action-cell",
        },
      ],
    }));

  const defaultTerminationData = {
    staff_id: "BRCH_01/03",
    staff_name: "Gokul Easwaran",
    branchcode: "BRCH_01",
    branch_name: "Head Office",
    department: "IT",
    designation: "Engineer",
    team_id: "BRCH_01/TEAM/01",
    team_name: "Development",
    team_lead_id: "BRCH_01/03",
    team_lead_name: "Ajay K",
    termination_type: "resignation",
    termination_reason: "Personal",
    last_working_day: "2025-08-01",
    reliving_date: "2025-08-03",
    exit_notes: "Great company. Leaving for further studies.",
    created_by: "HR_ADMIN",
  };

  return (
    <div className="p-4 relative">
      <Toaster position={toastposition} />
      <h1 className="text-xl font-semibold mb-4 text-red-700">
        Termination Records
      </h1>

      <div className="flex justify-between items-center mb-4">
        <SearchInput
          placeholder="Search by staff name..."
          value={searchTerm}
          onChange={(val) => setSearchTerm(val)}
        />
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-sm text-sm shadow"
        >
          + Create Termination
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
        <div className="overflow-x-auto mt-4">
          <DataTable thead={thead} tbody={tbody} />
        </div>
      )}

      {/* Modal for AddTerminationForm */}
      <Modal
        isVisible={showForm}
        onClose={() => setShowForm(false)}
        title="Create Termination"
        className="w-full max-w-3xl"
      >
        <AddTerminationForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            fetchTerminations();
          }}
          defaultData={defaultTerminationData}
        />
      </Modal>
      <Modal
        isVisible={showEditModal}
        className="w-full md:w-[800px]"
        onClose={() => setShowEditModal(false)}
        title="Edit Branch"
      >
        <EditTerminationForm
          termination={selectedTremination}
          onSuccess={handleEditSuccess}
          onCancel={() => setShowEditModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Termination;
