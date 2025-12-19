import { SearchIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '@/features/theme/store/themeSlice'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from "@/components/ui/sidebar"
// Removed Clerk import

const Navbar = () => {

    const dispatch = useDispatch();
    const { theme } = useSelector((state: any) => state.theme);

    return (
        <div className="w-full bg-background border-b border-border px-6 xl:px-16 py-3 flex-shrink-0">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                {/* Left section */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    {/* Sidebar Trigger */}
                    <SidebarTrigger className="sm:hidden" />

                    {/* Search Input */}
                    <div className="relative flex-1 max-w-sm">
                        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search projects, tasks..."
                            className="pl-9 bg-background"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3">

                    {/* Theme Toggle */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => dispatch(toggleTheme())}
                        className="h-8 w-8 rounded-lg"
                    >
                        {
                            theme === "light"
                                ? (<MoonIcon className="h-4 w-4" />)
                                : (<SunIcon className="h-4 w-4" />)
                        }
                    </Button>

                    {/* User Avatar - Static for now */}
                    <Avatar className="cursor-pointer">
                        <AvatarImage src="" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}

export default Navbar
