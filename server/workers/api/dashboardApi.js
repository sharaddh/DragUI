import api from "./axios";

export const getDashboardStats =
async () => {

  const res =
    await api.get(
      "/admin/dashboard"
    );

  return res.data;
};