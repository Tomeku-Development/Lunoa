'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDashboardStore } from '@/lib/store';
import { Bell, Search, Wallet, LogOut, Settings, User } from 'lucide-react';
import { useEffect } from 'react';
import { WalletConnection } from '@/components/wallet/wallet-connection';

export function DashboardHeader() {
  const { 
    user, 
    unreadCount, 
    tokenBalance, 
    fetchNotifications,
    logout 
  } = useDashboardStore();

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const handleLogout = () => {
    logout();
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:px-8">
      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search quests, users, or locations..."
            className="h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Right side - Wallet, Notifications, User Menu */}
      <div className="flex items-center gap-4">
        {/* Wallet Connection */}
        <div className="hidden md:block">
          <WalletConnection compact showBalance />
        </div>

        {/* Token Balance */}
        {tokenBalance && (
          <div className="hidden md:flex items-center gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Balance:</span>
              <span className="font-medium ml-1">{tokenBalance?.toLocaleString() || '0'} $LUNOA</span>
            </div>
          </div>
        )}

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Menu */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.username || `User_${user.walletAddress.slice(-4)}`}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.walletAddress.slice(0, 10)}...{user.walletAddress.slice(-6)}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* User Stats Quick View */}
              <div className="px-2 py-1.5">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-sm font-semibold">{user.reputation}</p>
                    <p className="text-xs text-muted-foreground">Rep</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.questsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Quests</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{user.vibesCreated}</p>
                    <p className="text-xs text-muted-foreground">Vibes</p>
                  </div>
                </div>
              </div>
              
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;
