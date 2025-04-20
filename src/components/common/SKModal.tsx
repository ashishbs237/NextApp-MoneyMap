'use client';

import React from 'react';
import { TAB_COLORS } from '@/components/constants/colors';

interface CommonModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    saveButtonText?: string;
    tabType?: string;
}

export default function CommonModal({
    visible,
    onClose,
    title,
    children,
    onSave,
    saveButtonText = 'Save',
    tabType = 'income',
}: CommonModalProps) {
    const tabColor = TAB_COLORS[tabType] || { background: '#000', text: '#fff' };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
            <div className="w-[85%] max-w-md bg-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        className="text-gray-500 hover:text-gray-800"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>
                <div>{children}</div>
                <div className="flex justify-between mt-6 gap-2">
                    {onSave && (
                        <button
                            onClick={onSave}
                            className="flex-1 px-4 py-2 rounded-md font-semibold"
                            style={{ backgroundColor: tabColor.background, color: tabColor.text }}
                        >
                            {saveButtonText}
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 rounded-md font-semibold border"
                        style={{ borderColor: tabColor.background, color: tabColor.background }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
