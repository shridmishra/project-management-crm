
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TaskLoading() {
    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-foreground max-w-6xl mx-auto py-8 px-6">
            {/* Left: Comments / Chatbox */}
            <div className="w-full lg:w-2/3">
                <Card className="flex flex-col lg:h-[80vh]">
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className={`max-w-[90%] p-4 rounded-xl border ${i % 2 === 0 ? "mr-auto" : "ml-auto"}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Skeleton className="h-6 w-6 rounded-full" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-full" />
                                        <Skeleton className="h-3 w-4/5" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Comment Input */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                            <Skeleton className="h-20 w-full rounded-md" />
                            <Skeleton className="h-10 w-16" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right: Task + Project Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                {/* Task Info */}
                <Card>
                    <CardContent className="p-5">
                        <div className="mb-4 space-y-3">
                            <Skeleton className="h-8 w-3/4" />
                            <div className="flex flex-wrap gap-3">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                        </div>

                        <div className="space-y-2 mb-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>

                        <Separator className="my-3" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-9 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-9 w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Attachments */}
                <Card>
                    <CardContent className="p-5 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                </Card>

                {/* Project Info */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-3 w-40" />
                        <div className="flex flex-wrap gap-4 mt-3">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
