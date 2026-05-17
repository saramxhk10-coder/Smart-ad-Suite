// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:8000/",
// });

// // Convert object to FormData
// const toFormData = (data) => {
//   const formData = new FormData();
//   Object.keys(data).forEach(key => formData.append(key, data[key]));
//   return formData;
// };

// // Signup
// export const signup = (data) => {
//   return API.post("user/signup", toFormData(data));
// };

// // Login
// export const login = (data) => {
//   return API.post("user/login", toFormData(data));
// };


import axios from "axios";

const API = axios.create({
  baseURL: "https://sarim001-backend.hf.space/",
});

// Signup using FormData
export const signup = ({ email, password }) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  return API.post("/user/signup", formData);
};

// Login using FormData
export const login = ({ email, password }) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  return API.post("/user/login", formData);
};


export const forgotPassword = (email) => {
  return API.post("/user/forgot-password", { email });
};