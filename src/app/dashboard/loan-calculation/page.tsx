'use client'
import React, { useState } from "react";
import { compareLoanStrategies, LoanInput, LoanStrategyResult } from "@/utils/ui/loanCalculation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

function LoanSummaryCard({ res }: { res: LoanStrategyResult }) {
    return (
        <Card key={res.strategy}>
            <CardContent className="p-4 space-y-2">
                <h2 className="font-bold capitalize">{res.strategy} Strategy</h2>
                <p>Interest Paid: ₹{res.totalInterestPaid.toLocaleString()}</p>
                <p>Total Paid: ₹{res.totalAmountPaid.toLocaleString()}</p>
                <p>Duration: {res.loanDurationMonths} months</p>
                {res.interestSavedComparedToRegular !== undefined && (
                    <p className="text-green-600">Saved: ₹{res.interestSavedComparedToRegular.toLocaleString()}</p>
                )}
            </CardContent>
        </Card>
    );
}



export default function LoanComparisonPage() {
    const [loanInput, setLoanInput] = useState<LoanInput>({
        loanAmount: 5000000,
        annualInterestRate: 8.5,
        tenureYears: 20,
        extraEMIsPerYear: 1,
        repaymentAmount: 100000,
        repaymentFrequencyMonths: 6,
    });

    const [results, setResults] = useState<LoanStrategyResult[]>([]);

    const handleChange = (key: keyof LoanInput, value: string) => {
        setLoanInput({ ...loanInput, [key]: Number(value) });
    };

    const calculate = () => {
        const data = compareLoanStrategies(loanInput);
        setResults(data);
    };

    const chartData = results.map((res) => ({
        strategy: res.strategy,
        interest: res.totalInterestPaid,
        total: res.totalAmountPaid,
        duration: res.loanDurationMonths,
        saved: res.interestSavedComparedToRegular || 0,
    }));

    const normalizedLineChartData = (() => {
        const maxMonths = Math.max(...results.map(r => r.amortization.length));

        return Array.from({ length: maxMonths }, (_, i) => {
            const month = i + 1;
            const row: any = { month };

            results.forEach((res) => {
                row[res.strategy] = res.amortization[i]
                    ? res.amortization[i].closingBalance
                    : null;
            });

            return row;
        });
    })();

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Loan Strategy Comparison</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input type="number" value={loanInput.loanAmount} onChange={(e) => handleChange("loanAmount", e.target.value)} placeholder="Loan Amount (₹)" />
                <Input type="number" value={loanInput.annualInterestRate} onChange={(e) => handleChange("annualInterestRate", e.target.value)} placeholder="Interest Rate (%)" />
                <Input type="number" value={loanInput.tenureYears} onChange={(e) => handleChange("tenureYears", e.target.value)} placeholder="Tenure (years)" />
                <Input type="number" value={loanInput.extraEMIsPerYear || 0} onChange={(e) => handleChange("extraEMIsPerYear", e.target.value)} placeholder="Extra EMIs/Year" />
                <Input type="number" value={loanInput.repaymentAmount || 0} onChange={(e) => handleChange("repaymentAmount", e.target.value)} placeholder="Lump Sum Amount (₹)" />
                <Input type="number" value={loanInput.repaymentFrequencyMonths || 0} onChange={(e) => handleChange("repaymentFrequencyMonths", e.target.value)} placeholder="Lump Sum Every (months)" />
            </div>
            <Button onClick={calculate}>Compare Strategies</Button>

            {results.length > 0 && (
                <Tabs defaultValue="summary" className="mt-6">
                    <TabsList>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="chart">Chart</TabsTrigger>
                        <TabsTrigger value="linechart">Line Chart</TabsTrigger>
                        <TabsTrigger value="amortization">Amortization</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {results.map((res) => (
                                <LoanSummaryCard key={res.strategy} res={res} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="chart">
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <XAxis dataKey="strategy" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="interest" fill="#8884d8" name="Interest Paid" />
                                <Bar dataKey="total" fill="#82ca9d" name="Total Paid" />
                                <Bar dataKey="saved" fill="#f87171" name="Saved Compared to Regular" />
                            </BarChart>
                        </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="linechart">
                        <h2 className="text-xl font-semibold mb-2">Loan Balance Over Time</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart data={normalizedLineChartData}>
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `₹${Math.round(value).toLocaleString()}`} />
                                    <Legend />
                                    {results.map((res, idx) => (
                                        <Line
                                            key={res.strategy}
                                            type="monotone"
                                            dataKey={res.strategy}
                                            name={res.strategy}
                                            stroke={["#8884d8", "#82ca9d", "#f87171", "#facc15"][idx % 4]}
                                            dot={false}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="amortization">
                        {results.map((res) => (
                            <details key={res.strategy} className="mb-4">
                                <summary className="font-semibold cursor-pointer text-blue-600 capitalize">
                                    {res.strategy} Amortization Table
                                </summary>
                                <div className="overflow-x-auto mt-2">
                                    <table className="min-w-full text-sm border">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="p-2 border">Month</th>
                                                <th className="p-2 border">Opening</th>
                                                <th className="p-2 border">EMI</th>
                                                <th className="p-2 border">Principal</th>
                                                <th className="p-2 border">Interest</th>
                                                <th className="p-2 border">Extra</th>
                                                <th className="p-2 border">Lump Sum</th>
                                                <th className="p-2 border">Closing</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {res.amortization.map((row) => (
                                                <tr key={row.month}>
                                                    <td className="p-2 border">{row.month}</td>
                                                    <td className="p-2 border">₹{Math.round(row.openingBalance)}</td>
                                                    <td className="p-2 border">₹{Math.round(row.emi)}</td>
                                                    <td className="p-2 border">₹{Math.round(row.principalComponent)}</td>
                                                    <td className="p-2 border">₹{Math.round(row.interestComponent)}</td>
                                                    <td className="p-2 border">{row.extraEMI ? `₹${Math.round(row.extraEMI)}` : '-'}</td>
                                                    <td className="p-2 border">{row.lumpSum ? `₹${Math.round(row.lumpSum)}` : '-'}</td>
                                                    <td className="p-2 border">₹{Math.round(row.closingBalance)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </details>
                        ))}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}
