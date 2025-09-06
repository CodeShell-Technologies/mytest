import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "~/constants/api";

interface Department {
  id: number;
  branchcode: string;
  name: string;
}

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch departments
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/getDepartments`);
      if (res.data?.status) {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete department
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      await axios.delete(`${BASE_URL}/deleteDepartment/${id}`);
      setDepartments((prev) => prev.filter((dep) => dep.id !== id));
    } catch (err) {
      console.error("Error deleting department:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Departments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : departments.length === 0 ? (
        <p>No departments found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Branch Code</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dep) => (
              <tr key={dep.id}>
                <td className="border border-gray-300 px-4 py-2">{dep.id}</td>
                <td className="border border-gray-300 px-4 py-2">{dep.branchcode}</td>
                <td className="border border-gray-300 px-4 py-2">{dep.name}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <button
                    onClick={() => handleDelete(dep.id)}
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
