'use client';

import React from 'react';
import { TAB_COLORS } from '@/components/constants/colors';

interface SKPickerProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  label?: string;
  tabType: string;
}

export default function SKPicker({
  value,
  onChange,
  options = [],
  label = 'Select',
  tabType,
}: SKPickerProps) {
  const themeColor = TAB_COLORS[tabType]?.background || '#000';

  return (
    <div
      className="mb-3 w-full rounded-md border"
      style={{ borderColor: themeColor }}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-[50px] bg-white text-black px-3 py-2 text-sm rounded-md outline-none"
        style={{ color: value ? '#000' : '#888' }}
      >
        <option value="" disabled>
          {label}
        </option>
        {options.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
