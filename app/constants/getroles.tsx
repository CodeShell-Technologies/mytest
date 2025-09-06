import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./api";

export const useRoleAccess = (role: string) => {
  const [roleAccess, setRoleAccess] = useState<any>(null); // null until loaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoleAccess = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/get-roleaccess/${role}`);
        setRoleAccess(res.data || {});
      } catch (err) {
        console.error("Failed to fetch role access", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleAccess();
  }, [role]);

  return { roleAccess, loading };
};
