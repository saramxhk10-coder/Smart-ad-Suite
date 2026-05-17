// // src/auth/AdminRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "./AuthContext";

// export default function AdminRoute({ children }) {
//   const { user } = useAuth();
//   return user?.is_admin ? children : <Navigate to="/dashboard" />;
// }
