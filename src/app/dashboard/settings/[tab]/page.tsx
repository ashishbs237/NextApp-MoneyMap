'use client'

import { useParams } from 'next/navigation'
import IncomeTab from '../tabs/Income'
import ExpenseTab from '../tabs/Expense'
import EMIsTab from '../tabs/EMI'
import InvestmentTab from '../tabs/Investment'

export default function SettingsTabPage() {
    const { tab } = useParams()

    switch (tab) {
        case 'income':
            return <IncomeTab />
        case 'expense':
            return <ExpenseTab />
        case 'emi':
            return <EMIsTab />
        case 'investment':
            return <InvestmentTab />
        default:
            return <div className="text-red-500">Invalid settings tab.</div>
    }
}
