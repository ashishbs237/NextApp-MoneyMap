'use client';

import React from 'react';

interface SKChipProps {
    label: string;
    selected?: boolean;
    onPress?: () => void;
}

export default function SKChip({
    label,
    selected = false,
    onPress = () => { },
}: SKChipProps) {
    return (
        <button
            type="button"
            onClick={onPress}
            className={`text-sm px-3 py-1 h-8 rounded-full border 
        transition-colors duration-200 
        mr-1 mb-1
        ${selected
                    ? 'bg-purple-200 border-purple-700 text-purple-700'
                    : 'bg-gray-100 border-gray-300 text-black'
                }`}
        >
            {label}
        </button>
    );
}
