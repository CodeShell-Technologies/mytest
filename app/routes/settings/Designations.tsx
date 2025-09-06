import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "~/constants/api";
interface Designation {
  id: number;          // 👈 assuming API returns this
  branchcode: string;
  department: string;
  designation: string;
}

export default function Designations() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch designations
  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/getDesignations`);
      if (res.data?.status) {
        setDesignations(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching designations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete designation
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) return;

    try {
      await axios.delete(`${BASE_URL}/deleteDesignation/${id}`);
      setDesignations((prev) => prev.filter((des) => des.id !== id));
    } catch (err) {
      console.error("Error deleting designation:", err);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Designations</h2>

      {loading ? (
        <p>Loading...</p>
      ) : designations.length === 0 ? (
        <p>No designations found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Branch Code</th>
              <th className="border border-gray-300 px-4 py-2">Department</th>
              <th className="border border-gray-300 px-4 py-2">Designation</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {designations.map((des) => (
              <tr key={des.id}>
                <td className="border border-gray-300 px-4 py-2">{des.id}</td>
                <td className="border border-gray-300 px-4 py-2">{des.branchcode}</td>
                <td className="border border-gray-300 px-4 py-2">{des.department}</td>
                <td className="border border-gray-300 px-4 py-2">{des.designation}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(des.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
