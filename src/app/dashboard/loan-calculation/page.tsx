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


    // ─── Calculation ────────────────────────────────────────────────────
    const handleCalculate = () => {
        // 1. Calculate base EMI
        let calcEmi: number
        if (monthlyRate > 0) {
            calcEmi =
                (loanRequirement * monthlyRate * Math.pow(1 + monthlyRate, originalMonths)) /
                (Math.pow(1 + monthlyRate, originalMonths) - 1)
        } else {
            calcEmi = loanRequirement / originalMonths
        }

        // 2. Build amortization schedule (original)
        const orig: typeof breakdown = []
        let principalAcc = 0
        let interestAcc = 0
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

        // 3. Recalculate with extra payment
        const extra = extraPayment
        const sched: typeof breakdown = []
        let bal = loanRequirement
        let prinAcc2 = 0
        let intAcc2 = 0
        let m2 = 0
        while (bal > 0 && m2 < 1000) {
            m2++
            const interestM = bal * monthlyRate
            const pay = calcEmi + (m2 > prepayAfter ? extra : 0)
            const principalM = pay - interestM
            bal -= principalM
            prinAcc2 += principalM
            intAcc2 += interestM
            sched.push({
                month: m2,
                remainingBalance: Math.max(0, bal),
                principalPaid: prinAcc2,
                interestPaid: intAcc2
            })
        }

        // 4. Save results
        setEmi(calcEmi)
        setTotalInterest(interestAcc)
        setBreakdown(orig)
        setNewMonths(m2)
        setInterestWithExtra(intAcc2)



        setChartData({
            ...chartData, tactic1: [{ name: "Principal", value: loanRequirement },
            { name: "Interest", value: interestAcc }]
        })
    }

    // ─── Pie Chart Data ─────────────────────────────────────────────────
    const COLORS = ["#82ca9d", "#8884d8"]

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            {/* Pie Chart: Principal vs Interest */}
                            <div className="flex justify-center h-60">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData.tactic1}
                                            dataKey="value"
                                            nameKey="name"
                                            outerRadius={80}
                                            // cx="50%"
                                            // cy="50%"
                                            label
                                        >
                                            {chartData.tactic1.map((entry, idx) => (
                                                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ReTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Chart Amount: Principal vs Interest */}
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">💳 EMI</p>
                                    <p className="text-xl font-bold">₹{emi.toFixed(2)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">💰 Total Interest</p>
                                    <p className="text-xl font-bold">₹{totalInterest.toFixed(0)}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-600">⏱ Interest Saved</p>
                                    <p className="text-xl font-bold">{originalMonths - newMonths} months</p>
                                </div>
                            </div>
                        </div>

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
                </Card>
            )}
        </div>
    )
}
