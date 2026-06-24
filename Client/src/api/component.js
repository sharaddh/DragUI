import API from "./index";

export const getComponents = () =>
  API.get("/components/public");

export const getComponent = (id) =>
  API.get(`/components/${id}`);