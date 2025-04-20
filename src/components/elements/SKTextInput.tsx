'use client';

import React from 'react';
import { TAB_COLORS } from '@/components/constants/colors';

interface SKTextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    tabType: 'default' | 'income' | 'expense' | 'emi' | 'investment';
    className?: string;
}

export default function SKTextInput({
    label = '',
    tabType = 'default',
    className = '',
    ...props
}: SKTextInputProps) {
    const activeColor = TAB_COLORS[tabType]?.background || '#000';

    return (
        <div className="mb-4 w-full">
            {label && (
                <label className="block mb-1 text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none text-black text-base bg-white ${className}`}
                style={{
                    borderColor: activeColor,
                }}
                {...props}
            />
        </div>
    );
}
