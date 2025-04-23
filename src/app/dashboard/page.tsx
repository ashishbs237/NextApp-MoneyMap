'use client'

import { useEffect, useState } from 'react'
import { SKCard } from '@/components/common/SKCard'
import SummaryCardContent from '@/components/common/SummaryCardContent'
import { TAB_COLORS } from '@/components/constants/colors'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import { useToast } from '@/hooks/useToast'
import BlockingLoader from '@/components/common/BlockingLoader'
import { getIncomeList } from '@/utils/ui/apiFunctions/incomeAPI'
import { getInvestmentList } from '@/utils/ui/apiFunctions/investmentAPI'
import { getExpenseList } from '@/utils/ui/apiFunctions/expenseAPI'
import SKHeader from '@/components/common/Header'

export default function DashboardPage() {
    const { errorToast } = useToast();
    const [summary, setSummary] = useState<any>({ emi: 15000 });
    const [loadingCount, setLoadingCount] = useState(0);

    useEffect(() => {
        try {
            setLoadingCount((prev) => prev + 1);

            (async () => {
                const res = await getIncomeList();
                if (res) {
                    const sum = res.data.reduce((acc, curr) => acc + curr.amount, 0)
                    setSummary((prev) => ({ ...prev, income: sum || 0 }));
                }
            })();

            (async () => {
                const res = await getExpenseList();
                if (res) {
                    const sum = res.data.reduce((acc, curr) => acc + curr.amount, 0)
                    setSummary((prev) => ({ ...prev, expense: sum || 0 }));
                }
            })();

            (async () => {
                const res = await getInvestmentList();
                if (res) {
                    const sum = res.data.reduce((acc, curr) => acc + curr.amount, 0)
                    setSummary((prev) => ({ ...prev, investment: sum || 0 }));
                }
            })()
        } catch (err) {
            errorToast(err)
        } finally {
            setLoadingCount((prev) => prev - 1);
        }
    }, []);

    const inflow = summary.income
    const outflow = summary.expense + summary.emi + summary.investment
    const saving = inflow - outflow

    const pieChartData = [
        { name: 'Expense', value: summary.expense, colorKey: 'expense' },
        { name: 'EMI', value: summary.emi, colorKey: 'emi' },
        { name: 'Investment', value: summary.investment, colorKey: 'investment' },
        { name: 'Saving', value: saving, colorKey: 'home' }
    ]

    return (
        <div className="space-y-10 px-4 md:px-8 pb-10">
            <SKHeader text="Finance Dashboard" />

            {/* Summary Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Overview</h2>
                <p className="text-sm text-gray-500 mb-4">Your current financial breakdown</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="Income" value={summary.income} type="income" />
                    </SKCard>
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="Expense" value={summary.expense} type="expense" />
                    </SKCard>
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="EMIs" value={summary.emi} type="emi" />
                    </SKCard>
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="Investment" value={summary.investment} type="investment" />
                    </SKCard>
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="Saving" value={saving} type="home" />
                    </SKCard>
                </div>
            </section>

            {/* Chart Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Distribution</h2>
                <p className="text-sm text-gray-500 mb-4">How your money is being used</p>
                <div className="bg-white rounded-2xl shadow-md p-6 h-[26rem] border border-gray-100">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                                dataKey="value"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={TAB_COLORS[entry.colorKey as keyof typeof TAB_COLORS].background}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Inflow vs Outflow Section */}
            <section>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Cash Flow</h2>
                <p className="text-sm text-gray-500 mb-4">Understand your net balance</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="Inflow" value={inflow} type="income" />
                    </SKCard>
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="Outflow" value={outflow} type="expense" />
                    </SKCard>
                    <SKCard className="p-4 shadow-md border border-gray-100 rounded-2xl">
                        <SummaryCardContent title="Net Saving" value={saving} type="home" />
                    </SKCard>
                </div>
            </section>

            <BlockingLoader show={loadingCount > 0} />
        </div>
    )
}
