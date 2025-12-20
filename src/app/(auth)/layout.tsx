export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-rose-950/30">
            {/* Subtle decorative elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/30 dark:bg-rose-500/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-200/20 dark:bg-fuchsia-500/5 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}
