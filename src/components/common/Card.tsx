import React from 'react';
import { IndianRupee } from 'lucide-react'; // optional icon
import { TAB_COLORS } from '@/components/constants/colors';

type TotalIncomeCardProps = {
    amount: number;
    title: string;
    tabType?: 'default' | 'income' | 'expense' | 'emi' | 'investment';
};

const formatINR = (amount: number) =>
    amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

const Card: React.FC<TotalIncomeCardProps> = ({ amount, title, tabType = 'default' }) => {
    const theme = TAB_COLORS[tabType];

    return (
        <div
            className="bg-gray-100 p-4 rounded-lg shadow-inner"
            style={{ backgroundColor: theme.background, color: theme.text }}
        >
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-lg font-bold text-gray-800">{formatINR(amount)}</p>
            {/* 
            <div className="text-sm text-white text-opacity-80">
                Updated just now
            </div> */}
        </div>

    );
};

export default Card;
