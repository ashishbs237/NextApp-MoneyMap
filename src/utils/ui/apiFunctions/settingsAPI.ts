import fetchWrapper from "@/utils/ui/fetchWrapper";

const incomeSettingsUrl = "/api/settings/income";
const expenseSettingsUrl = "/api/settings/expense";
const emiSettingsUrl = "/api/settings/emi";
const investmentSettingsUrl = "/api/settings/investment";

// Income Label APIs
export const getIncomeLabels = () => {
  return fetchWrapper.get(incomeSettingsUrl);
};

export const createIncomeLabel = (payload) => {
  return fetchWrapper.post(incomeSettingsUrl, payload);
};

export const updateIncomeLabel = (id, payload: object) => {
  return fetchWrapper.put(`${incomeSettingsUrl}/${id}`, payload);
};

export const deleteIncomeLabel = (id) => {
  return fetchWrapper.delete(`${incomeSettingsUrl}/${id}`);
};

// Expense Label APIs
export const getExpenseLabels = () => {
  return fetchWrapper.get(expenseSettingsUrl);
};

export const createExpenseLabel = (payload) => {
  return fetchWrapper.post(expenseSettingsUrl, payload);
};

export const updateExpenseLabel = (id, payload: object) => {
  return fetchWrapper.put(`${expenseSettingsUrl}/${id}`, payload);
};

export const deleteExpenseLabel = (id) => {
  return fetchWrapper.delete(`${expenseSettingsUrl}/${id}`);
};

// EMI label APIs
export const getEMILabels = () => {
  return fetchWrapper.get(emiSettingsUrl);
};

export const createEMILabel = (payload) => {
  return fetchWrapper.post(emiSettingsUrl, payload);
};

export const updateEMILabel = (id, payload: object) => {
  return fetchWrapper.put(`${emiSettingsUrl}/${id}`, payload);
};

export const deleteEMILabel = (id) => {
  return fetchWrapper.delete(`${emiSettingsUrl}/${id}`);
};

// Investment label APIs
export const getInvestmentLabels = () => {
  return fetchWrapper.get(investmentSettingsUrl);
};

export const createInvestmentLabel = (payload) => {
  return fetchWrapper.post(investmentSettingsUrl, payload);
};

export const updateInvestmentLabel = (id, payload: object) => {
  return fetchWrapper.put(`${investmentSettingsUrl}/${id}`, payload);
};

export const deleteInvestmentLabel = (id) => {
  return fetchWrapper.delete(`${investmentSettingsUrl}/${id}`);
};
