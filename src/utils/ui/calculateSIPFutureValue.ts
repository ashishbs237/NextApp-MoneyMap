export function calculateSIPFutureValue({
    monthlyInvestment,
    totalMonths,
    annualReturnPercent,
  }: {
    monthlyInvestment: number;
    totalMonths: number;
    annualReturnPercent: number;
  }) {
    const monthlyRate = annualReturnPercent / 12 / 100;
    return (
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
    );
  }
  