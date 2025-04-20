import { ToastContainer } from 'react-toastify';
import './globals.css';
import { DataProvider } from '@/context/authContext';

export const metadata = {
  title: 'MoneyMap',
  description: 'Track your money smartly – Income, Expense, EMIs & Investments',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-[var(--background)] text-[var(--foreground)] antialiased">
      <body className="bg-[var(--background)] text-[var(--foreground)]">

        <DataProvider>
          {/* Main Content */}
          <main className="flex-1 bg-[var(--background)] overflow-y-auto">
            <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick={true}
              rtl={false}
              pauseOnHover
              theme="light"
            />
            <section className="space-y-3">
              {children}
            </section>
          </main>
        </DataProvider>

      </body>
    </html>
  );
}
