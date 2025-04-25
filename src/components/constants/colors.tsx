// constants/colors.ts

export const TAB_COLORS = {
    default: {
        background: '#F3F4F6', // Tailwind gray-100
        text: '#111827',       // Tailwind gray-900
        border: '#E5E7EB',     // Tailwind gray-200
        lightBg: '#FFFFFF',    // White
        lightText: '#6B7280',  // Tailwind gray-500
    },
    home: {
        background: '#00897B',
        text: '#E0F2F1',
        lightBg: '#E0F2F1',
    },
    income: {
        background: '#2E7D32',
        text: '#DFF6DD',
        lightBg: '#DFF6DD',
    },
    expense: {
        background: '#D32F2F',
        text: '#FDEDEC',
        lightBg: '#FDEDEC',
    },
    emi: {
        background: '#6A1B9A',
        text: '#D1C4E9',
        lightBg: '#D1C4E9',
    },
    investment: {
        background: '#1976D2',
        text: '#FFFFFF',
        lightBg: '#1976D250',
    },
    regular: {
        border: '#1976D2',
        bg: 'bg-[#E3F2FD]',
        text: 'text-[#0D47A1]',
    },
    extra: {
        border: '#2E7D32',
        bg: 'bg-[#E8F5E9]',
        text: 'text-[#1B5E20]',
    },
    lump: {
        border: '#F9A825',
        bg: 'bg-[#FFF8E1]',
        text: 'text-[#F57F17]',
    },
    combined: {
        border: '#6A1B9A',
        bg: 'bg-[#F3E5F5]',
        text: 'text-[#4A148C]',
    },
} as const;

export type TabType = keyof typeof TAB_COLORS;
