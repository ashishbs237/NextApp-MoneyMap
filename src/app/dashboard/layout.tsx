'use client'

import Link from "next/link";
import { useStore } from "@/context/authContext";
import { useRouter, usePathname } from "next/navigation";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center min-h-screen px-2 sm:px-8 py-3">
      <div className="w-full max-w-[1280px] flex overflow-hidden rounded-2xl shadow-lg border border-gray-200 bg-[var(--background)] transition-all">

        {/* Sidebar */}
        <aside className="w-64 bg-[var(--sidebar-bg)] text-white flex flex-col p-4 justify-between">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold tracking-wide">💰 MoneyMap</h1>
            <nav className="flex flex-col gap-3">
              <SidebarLink href="/dashboard" label="Dashboard" />
              <SidebarLink href="/dashboard/income" label="Income" />
              <SidebarLink href="/dashboard/expense" label="Expense" />
              <SidebarLink href="/dashboard/emi" label="EMI" />
              <SidebarLink href="/dashboard/investment" label="Investment" />
              <SidebarLink href="/dashboard/settings" label="Settings" />
            </nav>
          </div>

          {/* User Info Section */}
          <UserDetailSection />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-5 overflow-y-auto">
          <div className="space-y-3">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()

  const isActive = (() => {
    // exact match
    if (pathname === href) return true

    // match dynamic/nested routes but avoid matching "/dashboard" with "/dashboard/income"
    if (href !== '/dashboard' && pathname.startsWith(href)) return true

    return false
  })()

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg transition-colors duration-150 ${isActive
        ? "bg-[var(--sidebar-link-active)] font-semibold"
        : "hover:bg-[var(--sidebar-link-hover)]"
        }`}
    >
      {label}
    </Link>
  );
}

function UserDetailSection() {
  const { user, logout } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    logout()
    router.push("/login");
  };

  return (
    <div className="mt-6 border-t border-white/30 pt-4 text-sm">
      <div className="mb-2">
        <p className="font-semibold">{user?.name || ''}</p>
        <p className="text-white/70 text-xs">{user?.email || ''}</p>
      </div>
      <button
        onClick={handleLogout}
        className="mt-2 text-sm text-red-300 hover:text-red-500 transition cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
