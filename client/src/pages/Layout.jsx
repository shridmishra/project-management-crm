import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loadTheme } from '../features/themeSlice'
import { Loader2Icon } from 'lucide-react'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const Layout = () => {
    const { loading } = useSelector((state) => state.workspace)
    const dispatch = useDispatch()

    // Initial load of theme
    useEffect(() => {
        dispatch(loadTheme())
    }, [])

    if (loading) return (
        <div className='flex items-center justify-center h-screen bg-background'>
            <Loader2Icon className="size-7 text-primary animate-spin" />
        </div>
    )

    return (
        <SidebarProvider>
            <div className="flex w-full bg-background text-foreground">
                <Sidebar />
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Navbar />
                    <div className="flex-1 h-full p-6 xl:p-10 xl:px-16 overflow-y-auto">
                        <Outlet />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default Layout
