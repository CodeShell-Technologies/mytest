import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "~/constants/api";
const EditUserRoleForm = ({ user, token, onSuccess, onCancel }) => {
  const [role, setRole] = useState(user.position || "");
  const [roles, setRoles] = useState([]);

  // ✅ Fetch roles dynamically from the same API
  useEffect(() => {
    async function fetchRoles() {
      try {
        const res = await fetch(`${BASE_URL}/users/read`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result?.data) {
          // extract unique roles
          const uniqueRoles = [...new Set(result.data.map((u) => u.role))];
          setRoles(uniqueRoles);
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    }
    fetchRoles();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${BASE_URL}/users/edit`,
        {
          profile: {
            staff_id: user.staff_id, // ⚡ must come from API, make sure you mapped this
            role: role,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("User role updated successfully!");
      onSuccess();
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Failed to update role");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium">Staff ID</label>
        <input
          type="text"
          value={user.staff_id || ""}
          disabled
          className="w-full border rounded px-3 py-2 mt-1 bg-gray-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded px-3 py-2 mt-1"
          required
        >
          <option value="">Select Role</option>
          {roles.map((r, i) => (
            <option key={i} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update
        </button>
      </div>
    </form>
  );
};

export default EditUserRoleForm;
