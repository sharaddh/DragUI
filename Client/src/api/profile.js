import API from "./index";

export const getProfile = () => API.get("/auth/profile");

export const updateProfile = (data) => API.put("/auth/profile", data);

export const changePassword = (data) => API.post("/auth/change-password", data);
