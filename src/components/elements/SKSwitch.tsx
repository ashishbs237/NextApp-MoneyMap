'use client'
import React from 'react'

interface SKSwitchProps {
    label: string
    checked?: boolean
    onChange?: (checked: boolean) => void
}

const SKSwitch: React.FC<SKSwitchProps> = ({ label, checked = false, onChange }) => {
    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <button
                type="button"
                onClick={() => onChange?.(!checked)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-green-500' : 'bg-gray-300'
                    }`}
            >
                <div
                    className={`h-4 w-4 rounded-full bg-white transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'
                        }`}
                />
            </button>
        </div>
    )
}

export default SKSwitch
