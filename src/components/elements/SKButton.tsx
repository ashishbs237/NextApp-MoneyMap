import React from 'react';
import { TAB_COLORS, TabType } from '@/components/constants/colors';

type SKButtonProps = {
    label: string;
    tabType: TabType;
    onClick?: () => void;
    className?: string;
    variant?: 'filled' | 'light';
};

const SKButton: React.FC<SKButtonProps> = ({
    label,
    tabType,
    onClick,
    className = '',
    variant = 'filled'
}) => {
    const theme = TAB_COLORS[tabType];

    const baseClasses = 'rounded-sm px-4 py-2 font-medium text-sm shadow-sm transition-all duration-200';

    const variantClasses =
        variant === 'filled'
            ? `bg-[${theme.background}] text-[${theme.text}] hover:opacity-90`
            : `bg-[${theme.lightBg}] text-[${theme.background}] border border-[${theme.background}] hover:opacity-90`;

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses} ${className} cursor-pointer transition-all`}
            style={{ backgroundColor: theme.background, borderColor: theme.background, color: theme.text }}
        >
            {label}
        </button>
    );
};

export default SKButton;
