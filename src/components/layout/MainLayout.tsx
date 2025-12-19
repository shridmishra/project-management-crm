"use client";

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useSelector } from "react-redux";
import { Loader2Icon } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const loading = useSelector((state: any) => state.workspace?.loading || false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent SSR rendering of client-only components
    if (!mounted) {
        return (
            <div className='flex items-center justify-center h-screen bg-background'>
                <Loader2Icon className="size-7 text-primary animate-spin" />
            </div>
        );
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen bg-background'>
                <Loader2Icon className="size-7 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <SidebarProvider>
            <div className="flex w-full bg-background text-foreground h-screen overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <Navbar />
                    <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-auto">
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}
