import { useState } from "react";
import { format, isSameDay, isBefore, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns";
import { CalendarIcon, Clock, User, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const typeColors = {
    BUG: "destructive",
    FEATURE: "default",
    TASK: "secondary",
    IMPROVEMENT: "outline",
    OTHER: "secondary",
};

const priorityBorders = {
    LOW: "border-l-zinc-300 dark:border-l-zinc-600",
    MEDIUM: "border-l-amber-300 dark:border-l-amber-500",
    HIGH: "border-l-orange-300 dark:border-l-orange-500",
};

const ProjectCalendar = ({ tasks }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const today = new Date();
    const getTasksForDate = (date) => tasks.filter((task) => isSameDay(task.due_date, date));

    const upcomingTasks = tasks
        .filter((task) => task.due_date && !isBefore(task.due_date, today) && task.status !== "DONE")
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);

    const overdueTasks = tasks.filter((task) => task.due_date && isBefore(task.due_date, today) && task.status !== "DONE");

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });


    const handleMonthChange = (direction) => {
        setCurrentMonth((prev) => (direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)));
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar View */}
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <CardTitle className="text-base font-medium flex gap-2 items-center">
                            <CalendarIcon className="h-5 w-5" /> Task Calendar
                        </CardTitle>
                        <div className="flex gap-2 items-center">
                            <Button variant="outline" size="icon" onClick={() => handleMonthChange("prev")}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="font-medium min-w-[120px] text-center">{format(currentMonth, "MMMM yyyy")}</span>
                            <Button variant="outline" size="icon" onClick={() => handleMonthChange("next")}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-7 text-xs text-muted-foreground mb-2 text-center font-medium">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="py-2">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {daysInMonth.map((day) => {
                                const dayTasks = getTasksForDate(day);
                                const isSelected = isSameDay(day, selectedDate);
                                const hasOverdue = dayTasks.some((t) => t.status !== "DONE" && isBefore(t.due_date, today));

                                return (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "h-14 rounded-md flex flex-col items-center justify-center text-sm transition-colors border",
                                            isSelected 
                                                ? "bg-primary text-primary-foreground border-primary" 
                                                : "bg-background hover:bg-accent hover:text-accent-foreground border-border",
                                            hasOverdue && !isSelected && "border-destructive/50 bg-destructive/10"
                                        )}
                                    >
                                        <span className="font-medium">{format(day, "d")}</span>
                                        {dayTasks.length > 0 && (
                                            <span className={cn(
                                                "text-[10px]",
                                                isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                                            )}>
                                                {dayTasks.length} tasks
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Tasks for Selected Day */}
                {getTasksForDate(selectedDate).length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Tasks for {format(selectedDate, "MMM d, yyyy")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {getTasksForDate(selectedDate).map((task) => (
                                    <div
                                        key={task.id}
                                        className={cn(
                                            "bg-muted/50 hover:bg-muted transition p-4 rounded border-l-4",
                                            priorityBorders[task.priority]
                                        )}
                                    >
                                        <div className="flex justify-between mb-2">
                                            <h4 className="font-medium">{task.title}</h4>
                                            <Badge variant={typeColors[task.type]}>
                                                {task.type}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span className="capitalize">{task.priority.toLowerCase()} priority</span>
                                            {task.assignee && (
                                                <span className="flex items-center gap-1">
                                                    <User className="w-3 h-3" />
                                                    {task.assignee.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
                {/* Upcoming Tasks */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4" /> Upcoming Tasks
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingTasks.length === 0 ? (
                            <p className="text-muted-foreground text-sm text-center">No upcoming tasks</p>
                        ) : (
                            <div className="space-y-2">
                                {upcomingTasks.map((task) => (
                                    <div
                                        key={task.id}
                                        className="bg-muted/50 hover:bg-muted p-3 rounded-lg transition"
                                    >
                                        <div className="flex justify-between items-start text-sm mb-1">
                                            <span className="font-medium">{task.title}</span>
                                            <Badge variant={typeColors[task.type]} className="text-[10px] px-1.5 py-0">
                                                {task.type}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{format(task.due_date, "MMM d")}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Overdue Tasks */}
                {overdueTasks.length > 0 && (
                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                                <Clock className="w-4 h-4" /> Overdue Tasks ({overdueTasks.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {overdueTasks.slice(0, 5).map((task) => (
                                    <div key={task.id} className="bg-destructive/10 hover:bg-destructive/20 p-3 rounded-lg transition" >
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="font-medium">{task.title}</span>
                                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                                {task.type}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-destructive">
                                            Due {format(task.due_date, "MMM d")}
                                        </p>
                                    </div>
                                ))}
                                {overdueTasks.length > 5 && (
                                    <p className="text-xs text-muted-foreground text-center">
                                        +{overdueTasks.length - 5} more
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ProjectCalendar;
