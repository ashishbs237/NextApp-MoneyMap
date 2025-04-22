import fetchWrapper from "@/utils/ui/fetchWrapper";

const emiUrl = "/api/emi";

// Emi Label APIs
export const getEmiList = () => {
  return fetchWrapper.get(emiUrl);
};

export const createEmi = (payload) => {
  return fetchWrapper.post(emiUrl, payload);
};

export const updateEmi = (id, payload: object) => {
  return fetchWrapper.put(`${emiUrl}/${id}`, payload);
};

export const deleteEmi = (id) => {
  return fetchWrapper.delete(`${emiUrl}/${id}`);
};
