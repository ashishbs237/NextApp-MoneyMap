

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
  amount?: string | 0;
  customLabel?: string | undefined;
  yearlyIncrement?: number | 0;
}

export interface IExpenseItem {
  _id?: string | number;
  label?: string;
  amount?: string | 0;
  customLabel?: string | undefined;
  tag?: string;
}

export interface IEmiItem {
  _id?: string | number;
  label?: string;
  amount?: string | 0;
  customLabel?: string | undefined;
  totalEmis?: number | undefined;
  deductionDate?: number | undefined;
  tag?: string;
}

export interface IInvestmentItem {
  _id?: string | number;
  label?: string;
  amount?: string | 0;
  customLabel?: string | undefined;
  tag?: string;
}

export type ActionType = "add" | "edit" | "delete" | "info" | "default" | null;
