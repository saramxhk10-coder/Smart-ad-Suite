import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken, logout } from "../utils/auth";
import api from "../api/axios";

export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

useEffect(() => {
  const checkAdmin = async () => {
    const token = getToken();
    if (!token) {
      setAllowed(false);
      return;
    }

    try {
      const res = await api.get("/user/me");
      setAllowed(res.data.is_admin);
    } catch (err) {
      logout();
      setAllowed(false);
    }
  };

  checkAdmin();
}, []);

  if (allowed === null) return <p>Loading...</p>;
  return allowed ? children : <Navigate to="/dashboard" />;
}
