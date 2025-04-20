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
            className="rounded-md p-4 shadow-lg flex flex-col justify-between gap-1 max-w-[200px]"
            style={{ backgroundColor: theme.background, color: theme.text }}
        >
            <div className="flex items-center gap-2">
                {/* <div className="p-2 bg-white/20 rounded-full">
                    <IndianRupee size={24} />
                </div> */}
                <h2 className="text-xl font-semibold">{title}</h2>
            </div>

            <div className="text-2xl font-bold tracking-wide">
                {formatINR(amount)}
            </div>
            {/* 
            <div className="text-sm text-white text-opacity-80">
                Updated just now
            </div> */}
        </div>
    );
};

export default Card;
