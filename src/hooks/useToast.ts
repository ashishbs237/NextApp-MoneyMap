import { toast } from "react-toastify";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Something went wrong";
}

export const useToast = () => {
  const successToast = (message: string) => toast.success(message);

  const errorToast = (err: unknown) => {
    toast.error(getErrorMessage(err));
  };

  return { successToast, errorToast };
};
