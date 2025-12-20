
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProfileLoading() {
    return (
        <div className="max-w-2xl mx-auto py-10 px-6 space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-72" />
            </div>

            <Card>
                <CardHeader className="space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Avatar Skeleton */}
                    <div className="flex flex-col items-center sm:flex-row gap-6 pb-2">
                        <Skeleton className="h-24 w-24 rounded-full" />
                        <div className="space-y-2 text-center sm:text-left">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-3 w-48" />
                            <Skeleton className="h-8 w-28 mt-2" />
                        </div>
                    </div>

                    <div className="grid gap-6">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-4 w-40" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-32 bg-destructive/10" />
                </CardContent>
            </Card>
        </div>
    )
}
