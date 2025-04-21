// components/ui/card.tsx
import React from "react"

type CardProps = {
    children: React.ReactNode
    className?: string
}

export const SKCard = ({ children, className = "" }: CardProps) => {
    return (
        <div
            className={`w-full rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow ${className}`}
        >
            {children}
        </div>
    )
}
