import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getToken, logout } from "../utils/auth";
import api from "../api/axios";

export default function ProtectedRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const token = getToken();
      if (!token) {
        setAllowed(false);
        return;
      }

      try {
        const res = await api.get("/user/me"); // backend endpoint
        setAllowed(true);
      } catch {
        logout();
        setAllowed(false);
      }
    };

    checkUser();
  }, []);

  if (allowed === null) return <p>Loading...</p>;
  return allowed ? children : <Navigate to="/login" />;
}
