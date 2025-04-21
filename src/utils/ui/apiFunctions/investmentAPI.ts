import fetchWrapper from "@/utils/ui/fetchWrapper";

const investmentUrl = "/api/investment";

// Investment Label APIs
export const getInvestmentList = () => {
  return fetchWrapper.get(investmentUrl);
};

export const createInvestment = (payload) => {
  return fetchWrapper.post(investmentUrl, payload);
};

export const updateInvestment = (id, payload: object) => {
  return fetchWrapper.put(`${investmentUrl}/${id}`, payload);
};

export const deleteInvestment = (id) => {
  return fetchWrapper.delete(`${investmentUrl}/${id}`);
};
