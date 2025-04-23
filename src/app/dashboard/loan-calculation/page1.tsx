'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ReTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts"
import SKPieChart from "@/components/dashboard/SKPieChart"
import GroupedBarComparisonChart from "@/components/dashboard/GroupedBarComparisonChart"
import ComparisonTable from "@/components/dashboard/ComparisonTable"
import { compareLoanStrategies, LoanInput, LoanStrategyResult } from '@/utils/ui/loanCalculation';


export default function LoanCalculatorPage() {
    // ─── States ──────────────────────────────────────────────────────────
    const [targetPrice, setTargetPrice] = useState(5000000)
    const [downPayment, setDownPayment] = useState(1000000)
    const [interestRate, setInterestRate] = useState(8.5)
    const [tenure, setTenure] = useState(20)
    const [repaymentType, setRepaymentType] = useState<"emi" | "lump_sum">("emi")
    const [extraPayment, setExtraPayment] = useState(0)
    const [prepayAfter, setPrepayAfter] = useState(0)
    const [showInMonths, setShowInMonths] = useState(false)

    // ─── Computed Values ─────────────────────────────────────────────────
    const loanRequirement = targetPrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const originalMonths = tenure * 12

    // ─── Results States ──────────────────────────────────────────────────
    const [emi, setEmi] = useState(0)
    const [totalInterest, setTotalInterest] = useState(0)
    const [breakdown, setBreakdown] = useState<Array<{
        month: number
        remainingBalance: number
        principalPaid: number
        interestPaid: number
    }>>([])
    const [newMonths, setNewMonths] = useState(0)
    const [interestWithExtra, setInterestWithExtra] = useState(0);
    const [chartData, setChartData] = useState<any>({
        tactic1: [],
        tactic2: [],
        tactic3: [],
    });
    const [tactic2Data, setTactic2Data] = useState({ interest: 0, months: 0 });
    const [tactic3Data, setTactic3Data] = useState({ interest: 0, months: 0 });

    const [loanInput, setLoanInput] = useState<LoanInput>({
        loanAmount: 5000000,
        annualInterestRate: 8.5,
        tenureYears: 20,
        extraEMIsPerYear: 1,
        repaymentAmount: 100000,
        repaymentFrequencyMonths: 6,
    });
    const [results, setResults] = useState<LoanStrategyResult[]>([]);


    useEffect(() => {
        calculate();
    }, [])

    const calculate = () => {
        const data = compareLoanStrategies(loanInput);
        setResults(data);
    };

    // ─── Calculation ────────────────────────────────────────────────────
    const handleCalculate = () => {
        // 1. Calculate base EMI
        let calcEmi: number
        if (monthlyRate > 0) {
            calcEmi = (loanRequirement * monthlyRate * Math.pow(1 + monthlyRate, originalMonths)) /
                (Math.pow(1 + monthlyRate, originalMonths) - 1)
        } else {
            calcEmi = loanRequirement / originalMonths
        }

        // 2. Build amortization schedule (original)
        const orig: typeof breakdown = []
        let principalAcc = 0, interestAcc = 0
        for (let m = 1; m <= originalMonths; m++) {
            const interestM = (loanRequirement - principalAcc) * monthlyRate
            const principalM = calcEmi - interestM
            principalAcc += principalM
            interestAcc += interestM
            orig.push({
                month: m,
                remainingBalance: loanRequirement - principalAcc,
                principalPaid: principalAcc,
                interestPaid: interestAcc
            })
        }

        // 3. Strategy 1: Extra EMI
        const extra = extraPayment
        const sched: typeof breakdown = []
        let bal1 = loanRequirement, prinAcc1 = 0, intAcc1 = 0, m1 = 0
        while (bal1 > 0 && m1 < 1000) {
            m1++
            const interestM = bal1 * monthlyRate
            const pay = calcEmi + (m1 > prepayAfter ? extra : 0)
            const principalM = pay - interestM
            bal1 -= principalM
            prinAcc1 += principalM
            intAcc1 += interestM
            sched.push({
                month: m1,
                remainingBalance: Math.max(0, bal1),
                principalPaid: prinAcc1,
                interestPaid: intAcc1
            })
        }

        // 4. Strategy 2: Lump Sum every 12 months
        const lumpSum = 100000
        const lumpSumGap = 4
        let bal2 = loanRequirement, intAcc2 = 0, m2 = 0
        while (bal2 > 0 && m2 < 1000) {
            m2++
            const interestM = bal2 * monthlyRate
            let payment = calcEmi
            if (m2 % lumpSumGap === 0) payment += lumpSum
            const principalM = payment - interestM
            bal2 -= principalM
            intAcc2 += interestM
        }

        // 5. Strategy 3: Combined
        let bal3 = loanRequirement, intAcc3 = 0, m3 = 0
        while (bal3 > 0 && m3 < 1000) {
            m3++
            const interestM = bal3 * monthlyRate
            let payment = calcEmi
            if (m3 > prepayAfter) payment += extra
            if (m3 % lumpSumGap === 0) payment += lumpSum
            const principalM = payment - interestM
            bal3 -= principalM
            intAcc3 += interestM
        }

        // 6. Save Results
        setEmi(calcEmi)
        setTotalInterest(interestAcc)
        setBreakdown(orig)
        setNewMonths(m1)
        setInterestWithExtra(intAcc1)

        setTactic2Data({ interest: intAcc2, months: m2 })
        setTactic3Data({ interest: intAcc3, months: m3 })

        setChartData({
            tactic1: [
                { name: "Principal", value: loanRequirement },
                { name: "Interest", value: intAcc1 }
            ],
            tactic2: [
                { name: "Principal", value: loanRequirement },
                { name: "Interest", value: intAcc2 }
            ],
            tactic3: [
                { name: "Principal", value: loanRequirement },
                { name: "Interest", value: intAcc3 }
            ]
        })
    }


    return (
        <div className="h-[calc(100vh-64px)] space-y-6 overflow-y-auto p-1">

            <h1 className="text-2xl font-bold">Smart Loan Calculator</h1>

            <Card>
                <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label>🎯 Target Price</Label>
                            <Input
                                type="number"
                                value={targetPrice}
                                onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                                placeholder="e.g. 10,00,000"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>💰 Downpayment : ₹{downPayment}</Label>
                            <Slider
                                className="mt-4"
                                min={0}
                                max={targetPrice}
                                step={1000}
                                value={[downPayment]}
                                onValueChange={(value) => setDownPayment(value[0])}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>📉 Loan Amount (Auto)</Label>
                            <Input value={loanRequirement} readOnly />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>📈 Interest Rate (Annual %)</Label>
                            <Input
                                value={interestRate}
                                onChange={(e) => setInterestRate(+e.target.value)}
                                type="number"
                                placeholder="e.g. 9.5"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>📅 Loan Tenure (Years)</Label>
                            <Input
                                value={tenure}
                                onChange={(e) => setTenure(+e.target.value)}
                                type="number"
                                placeholder="e.g. 5"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>📦 Repayment Type</Label>
                            <Select onValueChange={setRepaymentType} value={repaymentType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="emi">EMI</SelectItem>
                                    <SelectItem value="lump_sum">Lump Sum</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>⚡ Extra Monthly Payment (Optional)</Label>
                            <Input
                                type="number"
                                value={extraPayment}
                                onChange={(e) => setExtraPayment(e.target.value)}
                                placeholder="e.g. 2000"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label>⏳ Start Prepayment After (Months)</Label>
                            <Input type="number" placeholder="e.g. 12" />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 pt-4">
                        <Switch checked={showInMonths} onCheckedChange={setShowInMonths} />
                        <Label>Show tenure breakdown by months?</Label>
                    </div>

                    <Button className="mt-6 w-full" onClick={handleCalculate}>
                        Calculate
                    </Button>
                </CardContent>
            </Card>

            {/* ─── Results ─────────────────────────────────────────────────────── */}
            {emi > 0 && (
                <Card>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2 items-center">
                            <span className="text-xl font-semibold">Results</span>
                            <span className="mt-1 text-sm text-gray-600">: Without interest saving tactics</span>
                        </div>

                        {/* Pie Chart: Principal vs Interest */}
                        <SKPieChart chartData={chartData.tactic1} totalInterest={totalInterest} />

                        {/* Amortization Line Chart */}
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={breakdown}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <ReTooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="remainingBalance"
                                        stroke="#8884d8"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="principalPaid"
                                        stroke="#82ca9d"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="interestPaid"
                                        stroke="#ff7300"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
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
                        data={[
                            { name: "Regular EMI", Principal: 4000000, Interest: 1800000, Tenure: 240 },
                            { name: "Tactic 1 (Extra EMI)", Principal: 4000000, Interest: 1200000, Tenure: 180 },
                            { name: "Tactic 2 (Lump Sum)", Principal: 4000000, Interest: 1000000, Tenure: 160 },
                            { name: "Combined Tactics", Principal: 4000000, Interest: 800000, Tenure: 140 },
                        ]}
                    />
                </Card>
            )}

            {tactic2Data.interest > 0 && (
                <Card>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2 items-center">
                            <span className="text-xl font-semibold">Results</span>
                            <span className="mt-1 text-sm text-gray-600">: With Lump Sum Payment</span>
                        </div>
                        <SKPieChart chartData={chartData.tactic2} totalInterest={tactic2Data.interest} />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">💰 Total Interest</p>
                                <p className="text-2xl font-bold">₹{tactic2Data.interest.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">⏱ Time Saved</p>
                                <p className="text-2xl font-bold">{originalMonths - tactic2Data.months} months</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {tactic3Data.interest > 0 && (
                <Card>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2 items-center">
                            <span className="text-xl font-semibold">Results</span>
                            <span className="mt-1 text-sm text-gray-600">: With Combined Strategy</span>
                        </div>
                        <SKPieChart chartData={chartData.tactic3} totalInterest={tactic3Data.interest} />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">💰 Total Interest</p>
                                <p className="text-2xl font-bold">₹{tactic3Data.interest.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">⏱ Time Saved</p>
                                <p className="text-2xl font-bold">{originalMonths - tactic3Data.months} months</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )
            }

            {results.map((res) => (
                <div key={res.strategy} className="mb-4 p-4 border rounded shadow">
                    <h2 className="font-bold capitalize">{res.strategy} Strategy</h2>
                    <p>Total Interest Paid: ₹{res.totalInterestPaid.toLocaleString()}</p>
                    <p>Total Amount Paid: ₹{res.totalAmountPaid.toLocaleString()}</p>
                    <p>Loan Duration: {res.loanDurationMonths} months</p>
                    {res.interestSavedComparedToRegular !== undefined && (
                        <p className="text-green-600">Interest Saved: ₹{res.interestSavedComparedToRegular.toLocaleString()}</p>
                    )}
                </div>
            ))}

            {results.map(res => (
                <details key={res.strategy}>
                    <summary className="cursor-pointer text-blue-600">{res.strategy} Amortization Table</summary>
                    <table className="w-full text-sm mt-2">
                        <thead>
                            <tr>
                                <th>Month</th><th>Opening</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Extra</th><th>Lump Sum</th><th>Closing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {res.amortization.map(row => (
                                <tr key={row.month}>
                                    <td>{row.month}</td>
                                    <td>₹{row.openingBalance.toFixed(0)}</td>
                                    <td>₹{row.emi.toFixed(0)}</td>
                                    <td>₹{row.principalComponent.toFixed(0)}</td>
                                    <td>₹{row.interestComponent.toFixed(0)}</td>
                                    <td>{row.extraEMI ? `₹${row.extraEMI.toFixed(0)}` : '-'}</td>
                                    <td>{row.lumpSum ? `₹${row.lumpSum.toFixed(0)}` : '-'}</td>
                                    <td>₹{row.closingBalance.toFixed(0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </details>
            ))}


        </div >
    )
}
