type LoanInput = {
  loanAmount: number;
  annualInterestRate: number;
  tenureYears: number;
  extraEMIsPerYear?: number;
  repaymentAmount?: number;
  repaymentFrequencyMonths?: number;
};

type AmortizationEntry = {
  month: number;
  year: number;
  openingBalance: number;
  emi: number;
  principalComponent: number;
  interestComponent: number;
  closingBalance: number;
  extraEMI?: number;
  lumpSum?: number;
};

type LoanStrategyResult = {
  strategy: string;
  amortization: AmortizationEntry[];
  totalInterestPaid: number;
  totalAmountPaid: number;
  loanDurationMonths: number;
  interestSavedComparedToRegular?: number;
};

function calculateEMI(P: number, annualRate: number, tenureMonths: number): number {
  const R = annualRate / 12 / 100;
  return P * R * Math.pow(1 + R, tenureMonths) / (Math.pow(1 + R, tenureMonths) - 1);
}

function generateAmortizationSchedule(input: LoanInput, strategy: 'regular' | 'extra' | 'lump' | 'combined'): LoanStrategyResult {
  const {
    loanAmount,
    annualInterestRate,
    tenureYears,
    extraEMIsPerYear = 0,
    repaymentAmount = 0,
    repaymentFrequencyMonths = 0,
  } = input;

  const monthlyRate = annualInterestRate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  const baseEMI = calculateEMI(loanAmount, annualInterestRate, tenureMonths);

  let balance = loanAmount;
  let month = 1;
  let year = 1;
  const amortization: AmortizationEntry[] = [];
  let totalInterest = 0;
  let totalPayment = 0;

  while (balance > 0.1) {
    const interest = balance * monthlyRate;
    let principal = baseEMI - interest;
    let closingBalance = balance - principal;

    let extraEMI = 0;
    let lumpSum = 0;

    if ((strategy === 'extra' || strategy === 'combined') && extraEMIsPerYear > 0 && month % 12 === 0) {
      extraEMI = extraEMIsPerYear * baseEMI;
      closingBalance -= extraEMI;
    }

    if ((strategy === 'lump' || strategy === 'combined') && repaymentAmount > 0 && repaymentFrequencyMonths > 0 && month % repaymentFrequencyMonths === 0) {
      lumpSum = repaymentAmount;
      closingBalance -= lumpSum;
    }

    if (closingBalance < 0) {
      principal += closingBalance;
      closingBalance = 0;
    }

    amortization.push({
      month,
      year,
      openingBalance: balance,
      emi: baseEMI,
      principalComponent: principal,
      interestComponent: interest,
      closingBalance,
      extraEMI: extraEMI > 0 ? extraEMI : undefined,
      lumpSum: lumpSum > 0 ? lumpSum : undefined,
    });

    totalInterest += interest;
    totalPayment += baseEMI + extraEMI + lumpSum;
    balance = closingBalance;
    month++;
    if ((month - 1) % 12 === 0) year++;
  }

  return {
    strategy,
    amortization,
    totalInterestPaid: Math.round(totalInterest),
    totalAmountPaid: Math.round(totalPayment),
    loanDurationMonths: month - 1,
  };
}

function compareLoanStrategies(input: LoanInput): LoanStrategyResult[] {
  const regular = generateAmortizationSchedule(input, 'regular');
  const extra = generateAmortizationSchedule(input, 'extra');
  const lump = generateAmortizationSchedule(input, 'lump');
  const combined = generateAmortizationSchedule(input, 'combined');

  const baseInterest = regular.totalInterestPaid;

  return [
    regular,
    {
      ...extra,
      interestSavedComparedToRegular: baseInterest - extra.totalInterestPaid,
    },
    {
      ...lump,
      interestSavedComparedToRegular: baseInterest - lump.totalInterestPaid,
    },
    {
      ...combined,
      interestSavedComparedToRegular: baseInterest - combined.totalInterestPaid,
    },
  ];
}

function calculateSIPFutureValue({
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


export { calculateEMI, generateAmortizationSchedule, compareLoanStrategies ,calculateSIPFutureValue };
export type { LoanInput, AmortizationEntry, LoanStrategyResult };
