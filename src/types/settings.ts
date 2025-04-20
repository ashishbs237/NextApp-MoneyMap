export interface IFinanceLabel {
  _id?: string;
  label?: string;
  note?: string;
}

export interface ISettigsApiResponse<T> {
  message?: string;
  data?: T
}