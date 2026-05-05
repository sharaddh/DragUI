import axios from "axios";

const API = "http://localhost:5000/api";


// Create a component (send only props and template reference)
export const createComponent = (data, token) =>
  axios.post(`${API}/admin/components/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getComponents = () =>
  axios.get(`${API}/component/all`);