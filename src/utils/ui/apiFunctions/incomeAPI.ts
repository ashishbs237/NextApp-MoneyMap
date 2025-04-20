import fetchWrapper from "@/utils/ui/fetchWrapper";

const incomeUrl = "/api/income";

// Income Label APIs
export const getIncomeList = () => {
  return fetchWrapper.get(incomeUrl);
};

export const createIncome = (payload) => {
  return fetchWrapper.post(incomeUrl, payload);
};

export const updateIncome = (id, payload: object) => {
  return fetchWrapper.put(`${incomeUrl}/${id}`, payload);
};

export const deleteIncome = (id) => {
  return fetchWrapper.delete(`${incomeUrl}/${id}`);
};
