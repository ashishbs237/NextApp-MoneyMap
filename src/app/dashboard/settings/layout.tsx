'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = ['Income', 'Expense', 'EMI', 'Investment']

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-2 text-[var(--foreground)]">Settings</h1>

      {/* Tabs Navigation */}
      <div className="flex space-x-4 border-b border-gray-300 mb-1">
        {tabs.map((tab) => {
          const path = `/dashboard/settings/${tab.toLowerCase()}`
          const isActive = pathname === path

          return (
            <Link
              key={tab}
              href={path}
              className={`px-6 py-2 font-medium border-b-2 transition-all ${isActive
                ? 'border-[var(--accent)] text-[var(--accent)]'
                : 'border-transparent text-gray-500 hover:text-[var(--accent)]'
                }`}
            >
              {tab}
            </Link>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-[var(--background)] rounded-xl shadow-sm p-3 border border-gray-200 transition-all">
        {children}
      </div>
    </div>
  )
}
