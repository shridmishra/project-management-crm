
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLayout() {
    return (
        <div className="flex w-full h-screen bg-background overflow-hidden">
            {/* Sidebar Skeleton */}
            <div className="hidden lg:flex flex-col w-64 border-r bg-card h-full p-4 space-y-6">
                {/* Logo and Workspace Selector */}
                <div className="flex items-center gap-2 px-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-6 w-32" />
                </div>

                {/* Navigation Links */}
                <div className="space-y-2 flex-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-2 py-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}

                    <div className="mt-8 px-2 pb-2">
                        <Skeleton className="h-4 w-24 mb-4" />
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 py-2">
                                <Skeleton className="h-5 w-5" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Profile */}
                <div className="pt-4 border-t px-2 flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2 w-32" />
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Navbar Skeleton */}
                <div className="h-16 border-b flex items-center justify-between px-6 lg:px-10 bg-background">
                    <div className="flex items-center gap-4">
                        <Skeleton className="lg:hidden h-8 w-8 rounded-md" />
                        <div className="hidden md:flex flex-col gap-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-48" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-9 w-64 rounded-md hidden sm:block" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>

                {/* Page Content Skeleton */}
                <div className="flex-1 p-6 xl:p-10 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-96" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Skeleton key={i} className="h-32 rounded-xl" />
                            ))}
                        </div>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
                            <Skeleton className="h-96 rounded-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
