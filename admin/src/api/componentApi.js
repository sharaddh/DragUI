import api from "./axios";

export const getComponents =
async () => {

  const res =
    await api.get(
      "/components"
    );

  return res.data;
};

export const getComponent =
async (
 id
) => {

  const res =
    await api.get(
      `/components/${id}`
    );

  return res.data;
};

export const createComponent =
async (
 data
) => {

  const res =
    await api.post(
      "/components",
      data
    );

  return res.data;
};

export const updateComponent =
async (
 id,
 data
) => {

  const res =
    await api.put(
      `/components/${id}`,
      data
    );

  return res.data;
};
export const publishComponent =
async(id)=>{

 const res =
 await api.patch(
  `/components/${id}/publish`
 );

 return res.data;

};
export const archiveComponent =
async(id)=>{

 const res =
 await api.patch(
  `/components/${id}/archive`
 );

 return res.data;

};
export const deleteComponent =
async (
 id
) => {

  const res =
    await api.delete(
      `/components/${id}`
    );

  return res.data;
};
export const lockComponent =
async(id)=>{

 const res =
  await api.post(
   `/components/${id}/lock`
  );

 return res.data;

};

export const unlockComponent =
async(id)=>{

 const res =
  await api.post(
   `/components/${id}/unlock`
  );

 return res.data;

};