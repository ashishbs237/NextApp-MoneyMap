'use client'

import React, { useCallback, useEffect, useState } from "react";
import { compareLoanStrategies, LoanStrategyResult, calculateSIPFutureValue } from "@/utils/ui/loanCalculation";
import InputData from "@/components/smart-finance/InputData";
import LoanStrategyComparison from "@/components/smart-finance/LoanStrategyComparison";
import SKButton from "@/components/elements/SKButton";

export default function LoanComparisonPage() {
    const [loanInput, setLoanInput] = useState();
    const [results, setResults] = useState<LoanStrategyResult[] | any>([]);
    const [sipProjection, setSIPProjection] = useState<number>(0);

    const calculate = (inputs) => {
        setLoanInput(inputs);
        const data = compareLoanStrategies(inputs);
        setResults(data);

        const regularStrategy = data.find((r) => r.strategy === "regular");
        if (regularStrategy) {
            const totalMonths = regularStrategy.loanDurationMonths;
            const monthlySIP = inputs?.repaymentAmount / inputs.repaymentFrequencyMonths;
            const futureValue = calculateSIPFutureValue({
                monthlyInvestment: monthlySIP,
                totalMonths,
                annualReturnPercent: 12,
            });
            setSIPProjection(Math.round(futureValue));
        }
    };


    return (
        <div className="h-[calc(100vh-64px)] space-y-4 overflow-y-auto px-1">

            <h1 className="text-2xl font-bold">Smart Loan Calculator</h1>

            {/* User Inputs */}
            <InputData onCalculate={calculate} />

            {/* Chart Data */}
            {results.length > 0 && (
                <LoanStrategyComparison loanInput={loanInput} results={results} sipProjection={sipProjection} />
            )}
        </div>
    );
}
