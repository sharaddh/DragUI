import API from "./index";

export const getNotifications = () => API.get("/auth/notifications");

export const markAllRead = () => API.patch("/auth/notifications/mark-all-read");
