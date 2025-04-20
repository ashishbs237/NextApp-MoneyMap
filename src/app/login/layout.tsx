// app/login/layout.tsx (same for /signup/layout.tsx)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="bg-gray-100 text-black">
                <main className="min-h-screen flex items-center justify-center">
                    {children}
                </main>
            </body>
        </html>
    );
}
