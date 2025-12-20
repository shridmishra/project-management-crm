
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function TeamLoading() {
    return (
        <div className="space-y-6 max-w-6xl mx-auto py-8 px-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-36" />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-7 w-12" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-xl" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search */}
            <div className="max-w-md">
                <Skeleton className="h-10 w-full" />
            </div>

            {/* Team Members List */}
            <div className="max-w-4xl w-full">
                {/* Desktop Table Header Skeleton */}
                <div className="hidden sm:block border rounded-md overflow-hidden">
                    <div className="bg-muted/50 p-4 grid grid-cols-12 gap-4 border-b">
                        <Skeleton className="h-4 col-span-5" />
                        <Skeleton className="h-4 col-span-5" />
                        <Skeleton className="h-4 col-span-2" />
                    </div>
                    {/* Table Rows */}
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="p-4 grid grid-cols-12 gap-4 border-b last:border-0 items-center">
                            <div className="col-span-5 flex items-center gap-3">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <div className="col-span-5">
                                <Skeleton className="h-4 w-48" />
                            </div>
                            <div className="col-span-2">
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Cards Skeleton */}
                <div className="sm:hidden space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                </div>
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
