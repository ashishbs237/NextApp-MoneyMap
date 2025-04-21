import fetchWrapper from "@/utils/ui/fetchWrapper";

const expenseUrl = "/api/expense";

// Expense Label APIs
export const getExpenseList = () => {
  return fetchWrapper.get(expenseUrl);
};

export const createExpense = (payload) => {
  return fetchWrapper.post(expenseUrl, payload);
};

export const updateExpense = (id, payload: object) => {
  return fetchWrapper.put(`${expenseUrl}/${id}`, payload);
};

export const deleteExpense = (id) => {
  return fetchWrapper.delete(`${expenseUrl}/${id}`);
};
