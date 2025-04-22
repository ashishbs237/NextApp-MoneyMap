const keyObj = {
  income: ["label", "amount"],
  expense: ["label", "amount"],
  emi: ["label", "amount", "totalEmis", "deductionDate"],
  investment: ["label", "amount"],
};

type KeyType = "income" | "expense" | "emi" | "investment";

export function validateRequest<T extends object>(
  key: KeyType,
  body: Partial<T>
): { success: true; data: T } | { success: false; error: string } {
  const missing = keyObj[key].filter((key) => !body?.[key]);

  if (missing.length > 0) {
    return {
      success: false,
      error: `${missing.join(", ")} ${
        missing.length === 1 ? "is" : "are"
      } required`,
    };
  }

  return { success: true, data: body as T };
}
