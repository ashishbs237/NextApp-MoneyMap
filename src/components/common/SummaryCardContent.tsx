// components/SummaryCardContent.tsx
import React from "react"
import { TAB_COLORS, TabType } from "@/components/constants/colors"

type Props = {
    title: string
    value: number
    type?: TabType
    currencySymbol?: string
}

export default function SummaryCardContent({
    title,
    value = 0,
    type = "default",
    currencySymbol = "₹"
}: Props) {
    const colors = TAB_COLORS[type]

    return (
        <div
            className="flex flex-col items-start gap-1 w-full p-4 rounded-md"
            style={{
                backgroundColor: colors.background,
                color: colors.text
            }}
        >
            <p className="text-sm" style={{ color: colors.text, opacity: 0.8 }}>
                {title}
            </p>
            <p className="text-lg font-semibold">
                {currencySymbol} {value.toLocaleString()}
            </p>
        </div>
    )
}
