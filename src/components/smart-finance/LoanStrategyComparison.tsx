import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import SKPieChart from '../dashboard/SKPieChart'
import { Card, CardContent } from '../ui/card'
import { BarChart, Tooltip, Bar, XAxis, YAxis, Legend, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import ComparisonTable from "@/components/dashboard/ComparisonTable";
import GroupedBarComparisonChart from '../dashboard/GroupedBarComparisonChart'


const LoanStrategyComparison = ({ loanInput, results, sipProjection }) => {

    const regularInterest = results.find(r => r.strategy === "regular")?.totalInterestPaid || 0;

    const chartData = results.map((res, ind) => ({
        strategy: res.strategy,
        interest: res.totalInterestPaid,
        total: res.totalAmountPaid,
        duration: res.loanDurationMonths,
        sip: ind === 2 ? sipProjection : 0,
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
        <>
            {/* Pie Chart: Principal vs Interest */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <SKPieChart chartData={results[0]} />
                <SKPieChart chartData={results[1]} />
                <SKPieChart chartData={results[2]} />
            </div>
            <h1 className="text-2xl font-bold">Loan Strategy Comparison</h1>

            <Tabs defaultValue="summary" className="mt-6">
                <TabsList>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="chart">Chart</TabsTrigger>
                    <TabsTrigger value="line">Line Chart</TabsTrigger>
                    <TabsTrigger value="amortization">Amortization</TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        {results.map((res) => (
                            <Card key={res.strategy} className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-4 py-2 rounded-t-2xl">
                                    <h2 className="font-semibold text-lg capitalize">{res.strategy} Strategy</h2>
                                </div>
                                <CardContent className="bg-white p-5 space-y-3">
                                    <div className="text-gray-700">
                                        <p><span className="font-medium text-gray-500">Interest Paid:</span> ₹{res.totalInterestPaid.toLocaleString()}</p>
                                        <p><span className="font-medium text-gray-500">Total Paid:</span> ₹{res.totalAmountPaid.toLocaleString()}</p>
                                        <p><span className="font-medium text-gray-500">Duration:</span> {res.loanDurationMonths} months</p>
                                    </div>

                                    {res.interestSavedComparedToRegular !== undefined && (
                                        <div className="pt-2 border-t border-dashed border-gray-200 space-y-1">
                                            <p className="text-green-600 font-semibold">Saved: ₹{res.interestSavedComparedToRegular.toLocaleString()}</p>
                                            <p className="text-blue-600 font-semibold">
                                                Saved: {((res.interestSavedComparedToRegular / regularInterest) * 100).toFixed(2)}%
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                        <Card className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-4 py-2 rounded-t-2xl">
                                <h2 className="font-semibold text-lg capitalize">SIP Alternative</h2>
                            </div>
                            <CardContent className="bg-white p-5 space-y-3">

                                <p className="text-blue-600 font-semibold">
                                    Monthly SIP: ₹{(loanInput.repaymentAmount / loanInput.repaymentFrequencyMonths).toLocaleString()}
                                </p>
                                <p className="text-green-600 font-semibold">Projected SIP Value (12% CAGR): ₹{sipProjection.toLocaleString()}</p>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="chart">
                    <ResponsiveContainer width="70%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barGap="3%" barCategoryGap="20%" barSize={"100"} >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="strategy" />
                            <YAxis />
                            <Tooltip formatter={(value: number, name: string) => [`₹${value.toLocaleString()}`, name]} />
                            <Legend />
                            <Bar dataKey="total" fill="#00a1e0" name="Total Paid" barSize="20" />
                            <Bar dataKey="interest" fill="#ff0000ca" name="Interest Paid" barSize="20" />
                            <Bar dataKey="saved" fill="#2caa61" name="Saved Compared to Regular" barSize="20" />
                            <Bar dataKey="sip" fill="#b700ff" name="Sip" barSize="20" />
                            {/* </Bar> */}
                            {/* <LabelList dataKey="savedPercent" position="end" formatter={(val: number) => `${val.toFixed(1)}%`} /> */}
                        </BarChart>
                    </ResponsiveContainer>
                </TabsContent>

                <TabsContent value="line">
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
                                        {res.amortization.map((row, index) => (
                                            <tr key={`${res.strategy}-${index}`}>
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
            <GroupedBarComparisonChart
                data={[
                    {
                        name: "Regular",
                        Principal: 4000000,
                        Interest: 2500000,
                        Tenure: 240,
                    },
                    {
                        name: "Tactic 1",
                        Principal: 4000000,
                        Interest: 1800000,
                        Tenure: 200,
                    },
                    {
                        name: "Tactic 2",
                        Principal: 4000000,
                        Interest: 2000000,
                        Tenure: 210,
                    },
                    {
                        name: "Combined",
                        Principal: 4000000,
                        Interest: 1600000,
                        Tenure: 180,
                    },
                ]}
            />
            <ComparisonTable
                data={results}
                principalAmt={loanInput.loanAmount}
            />
        </>
    )
}

export default LoanStrategyComparison