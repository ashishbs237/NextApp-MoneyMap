'use client'
import React from 'react'

interface Option {
    label: string
    value: string | number
}

interface SKSelectProps {
    label: string
    value?: string | number
    onChange?: (value: string | number) => void
    options: Option[]
    disabled?: boolean
}

const SKSelect: React.FC<SKSelectProps> = ({ label, value, onChange, options, disabled }) => {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={disabled}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                <option value="" disabled>Select {label}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default SKSelect
