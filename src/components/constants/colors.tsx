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
} as const;

export type TabType = keyof typeof TAB_COLORS;
