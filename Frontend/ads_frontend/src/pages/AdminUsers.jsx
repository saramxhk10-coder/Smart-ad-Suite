// // src/pages/AdminUsers.jsx
// import { useEffect, useState } from "react";
// import api from "../api/axios";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     api.get("/admin/users").then(res => setUsers(res.data));
//   }, []);

//   const del = async (email) => {
//     await api.delete(`/admin/user/${email}`);
//     setUsers(users.filter(u => u.email !== email));
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Users</h2>
//       {users.map(u => (
//         <div key={u.email} className="flex justify-between bg-white p-2 mb-2">
//           <span>{u.email}</span>
//           <button onClick={() => del(u.email)} className="text-red-500">
//             Delete
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// }



export default function AdminUsers() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-red-600">Admin Panel</h1>
      <p className="mt-2">Only admins can see this</p>
    </div>
  );
}
