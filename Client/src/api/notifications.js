import API from "./index";

export const getNotifications = () => API.get("/auth/notifications");
