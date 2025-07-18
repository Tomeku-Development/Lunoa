'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useDashboardStore } from '@/lib/store';
import {
  Home,
  MapPin,
  Trophy,
  Target,
  Coins,
  Zap,
  Users,
  BarChart3,
  Bell,
  Settings,
  Menu,
  X,
  Wallet,
  LogOut,
  User
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Map', href: '/map', icon: MapPin },
  { name: 'Quests', href: '/quests', icon: Trophy },
  { name: 'Achievements', href: '/achievements', icon: Target },
  { name: 'Tokens', href: '/tokens', icon: Coins },
  { name: 'Vibes', href: '/vibes', icon: Zap },
  { name: 'Social', href: '/social', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

function SidebarContent() {
  const pathname = usePathname();
  const { user, sidebarOpen, setSidebarOpen } = useDashboardStore();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
          <span className="text-xl font-bold">Lunoa</span>
        </div>
      </div>

      {/* User Profile */}
      {user && (
        <div className="border-b p-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user.username || `User_${user.walletAddress.slice(-4)}`}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-lg font-semibold">{user.questsCompleted}</p>
              <p className="text-xs text-muted-foreground">Quests</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold">{user.tokensEarned}</p>
              <p className="text-xs text-muted-foreground">$LUNOA</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Wallet Connection */}
      <div className="border-t p-4">
        <Button variant="outline" className="w-full" size="sm">
          <Wallet className="mr-2 h-4 w-4" />
          Connected
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useDashboardStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default Sidebar;
