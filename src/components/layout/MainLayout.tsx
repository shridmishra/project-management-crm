"use client";

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import { useSelector } from "react-redux";
import SkeletonLayout from "@/components/layout/SkeletonLayout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
    const loading = useSelector((state: any) => state.workspace?.loading || false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <SkeletonLayout />;
    }

    if (loading) {
        return <SkeletonLayout />;
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
