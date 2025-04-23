'use client'

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip as ReTooltip, Legend, ResponsiveContainer
} from "recharts"
import SKPieChart from "@/components/dashboard/SKPieChart"
import GroupedBarComparisonChart from "@/components/dashboard/GroupedBarComparisonChart"
import ComparisonTable from "@/components/dashboard/ComparisonTable"

export default function LoanCalculatorPage() {
    const [targetPrice, setTargetPrice] = useState(5000000)
    const [downPayment, setDownPayment] = useState(1000000)
    const [interestRate, setInterestRate] = useState(8.5)
    const [tenure, setTenure] = useState(20)
    const [repaymentType, setRepaymentType] = useState<"emi" | "lump_sum">("emi")
    const [extraPayment, setExtraPayment] = useState(0)
    const [prepayAfter, setPrepayAfter] = useState(0)
    const [showInMonths, setShowInMonths] = useState(false)

    const loanRequirement = targetPrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const originalMonths = tenure * 12

    const [emi, setEmi] = useState(0)
    const [totalInterest, setTotalInterest] = useState(0)
    const [breakdown, setBreakdown] = useState([])
    const [newMonths, setNewMonths] = useState(0)
    const [interestWithExtra, setInterestWithExtra] = useState(0)
    const [chartData, setChartData] = useState({ tactic1: [], tactic2: [], tactic3: [] })
    const [tactic2Data, setTactic2Data] = useState({ interest: 0, months: 0 })
    const [tactic3Data, setTactic3Data] = useState({ interest: 0, months: 0 })

    const handleCalculate = () => {
        let calcEmi = monthlyRate > 0
            ? (loanRequirement * monthlyRate * Math.pow(1 + monthlyRate, originalMonths)) / (Math.pow(1 + monthlyRate, originalMonths) - 1)
            : loanRequirement / originalMonths

        const orig = []
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

        // Tactic 1: Extra EMI
        const sched1 = []
        let bal1 = loanRequirement, prinAcc1 = 0, intAcc1 = 0, m1 = 0
        while (bal1 > 0 && m1 < 1000) {
            m1++
            const interestM = bal1 * monthlyRate
            const pay = calcEmi + (m1 > prepayAfter ? +extraPayment : 0)
            const principalM = pay - interestM
            bal1 -= principalM
            prinAcc1 += principalM
            intAcc1 += interestM
            sched1.push({ month: m1, remainingBalance: bal1, principalPaid: prinAcc1, interestPaid: intAcc1 })
        }

        // Tactic 2: Lump Sum
        const lumpSum = 100000
        const gap = 4
        let bal2 = loanRequirement, intAcc2 = 0, m2 = 0
        while (bal2 > 0 && m2 < 1000) {
            m2++
            const interestM = bal2 * monthlyRate
            const payment = calcEmi + (m2 % gap === 0 ? lumpSum : 0)
            const principalM = payment - interestM
            bal2 -= principalM
            intAcc2 += interestM
        }

        // Tactic 3: Combined
        let bal3 = loanRequirement, intAcc3 = 0, m3 = 0
        while (bal3 > 0 && m3 < 1000) {
            m3++
            const interestM = bal3 * monthlyRate
            let payment = calcEmi
            if (m3 > prepayAfter) payment += +extraPayment
            if (m3 % gap === 0) payment += lumpSum
            const principalM = payment - interestM
            bal3 -= principalM
            intAcc3 += interestM
        }

        // Set All Data
        setEmi(calcEmi)
        setTotalInterest(interestAcc)
        setBreakdown(orig)
        setNewMonths(m1)
        setInterestWithExtra(intAcc1)
        setTactic2Data({ interest: intAcc2, months: m2 })
        setTactic3Data({ interest: intAcc3, months: m3 })

        setChartData({
            tactic1: [{ name: "Principal", value: loanRequirement }, { name: "Interest", value: intAcc1 }],
            tactic2: [{ name: "Principal", value: loanRequirement }, { name: "Interest", value: intAcc2 }],
            tactic3: [{ name: "Principal", value: loanRequirement }, { name: "Interest", value: intAcc3 }]
        })
    }

    const comparison = [
        { name: "Regular EMI", Principal: loanRequirement, Interest: totalInterest, Tenure: originalMonths },
        { name: "Tactic 1 (Extra EMI)", Principal: loanRequirement, Interest: interestWithExtra, Tenure: newMonths },
        { name: "Tactic 2 (Lump Sum)", Principal: loanRequirement, Interest: tactic2Data.interest, Tenure: tactic2Data.months },
        { name: "Combined Tactics", Principal: loanRequirement, Interest: tactic3Data.interest, Tenure: tactic3Data.months }
    ]

    return (
        <div className="h-[calc(100vh-64px)] p-2 space-y-6 overflow-y-auto">
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

            {emi > 0 && (
                <>
                    <Card>
                        <CardContent className="space-y-3">
                            <h2 className="text-xl font-semibold">Results: Regular Plan</h2>
                            <SKPieChart chartData={chartData.tactic1} totalInterest={totalInterest} />
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={breakdown}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <ReTooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="remainingBalance" stroke="#8884d8" />
                                        <Line type="monotone" dataKey="principalPaid" stroke="#82ca9d" />
                                        <Line type="monotone" dataKey="interestPaid" stroke="#ff7300" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <GroupedBarComparisonChart data={comparison} />
                    <ComparisonTable data={comparison} />
                </>
            )}
        </div>
    )
}
