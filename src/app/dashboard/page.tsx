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

export default function DashboardPage() {
    const { successToast, errorToast } = useToast();
    const [summary, setSummary] = useState<any>({ emi: 15000 });
    const [loadingCount, setLoadingCount] = useState(0);

    useEffect(() => {
        try {
            setLoadingCount((prev) => prev + 1);

            // Getting Income List
            (async () => {
                const res = await getIncomeList();
                if (res) {
                    const sum = res.data.reduce((acc, curr) => {
                        acc += curr.amount;
                        return acc
                    }, 0)
                    sum && setSummary((prev) => ({ ...prev, income: sum }));
                }
            })();

            // Getting Expense List
            (async () => {
                const res = await getExpenseList();
                if (res) {
                    const sum = res.data.reduce((acc, curr) => {
                        acc += curr.amount;
                        return acc
                    }, 0)
                    sum && setSummary((prev) => ({ ...prev, expense: sum }));
                }
            })();

            // Getting Investment List
            (async () => {
                const res = await getInvestmentList();
                if (res) {
                    const sum = res.data.reduce((acc, curr) => {
                        acc += curr.amount;
                        return acc
                    }, 0)
                    sum && setSummary((prev) => ({ ...prev, investment: sum }));
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
        <div className="space-y-6">
            {/* Section 1: Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <SKCard>
                    <SummaryCardContent title="Total Income" value={summary.income} type="income" />
                </SKCard>
                <SKCard>
                    <SummaryCardContent title="Total Expense" value={summary.expense} type="expense" />
                </SKCard>
                <SKCard>
                    <SummaryCardContent title="Total EMIs" value={summary.emi} type="emi" />
                </SKCard>
                <SKCard>
                    <SummaryCardContent title="Total Investment" value={summary.investment} type="investment" />
                </SKCard>
                <SKCard>
                    <SummaryCardContent title="Total Saving" value={saving} type="home" />
                </SKCard>
            </div>

            {/* Section 2: Pie Chart */}
            <div className="w-full h-80 bg-white rounded-xl shadow p-4">
                <h2 className="text-lg font-semibold mb-2">Distribution Overview</h2>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
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
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Section 3: Inflow vs Outflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <SKCard>
                    <SummaryCardContent title="Total Inflow" value={inflow} type="income" />
                </SKCard>
                <SKCard>
                    <SummaryCardContent title="Total Outflow" value={outflow} type="expense" />
                </SKCard>
                <SKCard>
                    <SummaryCardContent title="Net Saving" value={saving} type="home" />
                </SKCard>
            </div>
            <BlockingLoader show={loadingCount > 0} />
        </div>
    )
}
