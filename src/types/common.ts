

export interface IConfirmatinDialogAction<T> {
  data?: T;
  command?: "default" | "edit" | "delete" | "info";
}

// export interface IIncomeItem{
//   command?: "default" | "add" | "delete";
//   data?: {
//     _id? : number,
//     label?: string;
//     amount?: string;
//     customLabel?: string;
//   };
// }

export interface IIncomeItem {
  _id?: string | number;
  label?: string;
  amount?: string;
  customLabel?: string | undefined;
  yearlyIncrement?: number;
}

export type ActionType = "add" | "edit" | "delete" | "info" | "default" | null;
