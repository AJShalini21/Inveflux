import { Outlet, Link, useLocation } from 'react-router';
import {
  Search,
  Bell,
  User,
  BarChart3,
  Package,
  DollarSign,
  Truck,
  Upload,
  Settings,
  Menu,
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';

export function MainLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Operational', icon: BarChart3 },
    { path: '/inventory', label: 'Inventory', icon: Package },
    { path: '/financial', label: 'Financial', icon: DollarSign },
    { path: '/vendor', label: 'Vendor', icon: Truck },
    { path: '/data-upload', label: 'Data Upload', icon: Upload },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const Logo = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full" style={{ background: 'var(--gradient-accent)' }}></div>
      <span
        className="text-xl font-semibold tracking-tight"
        style={{
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        Inveflux
      </span>
    </div>
  );

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex ${mobile ? 'flex-col gap-2' : 'items-center gap-1'}`}>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-[var(--bg-primary)] to-[var(--bg-secondary)] text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar - Three-Part Design */}
      <nav className="sticky top-0 z-50 px-4 pt-4">
        <div className="flex items-center justify-between gap-4">
          {/* 1. Logo and Name - Transparent Background */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4 sm:gap-8">
              {/* Mobile Menu Trigger */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/20"
                    >
                      <Menu className="w-5 h-5 text-white" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] sm:w-[350px]">
                    <SheetHeader className="border-b pb-4 mb-4">
                      <SheetTitle>
                        <Logo />
                      </SheetTitle>
                    </SheetHeader>
                    <NavLinks mobile />
                  </SheetContent>
                </Sheet>
              </div>
              <Logo />
            </div>
          </div>

          {/* 2. Navigation Items - Centered with White Background */}
          <div className="hidden md:flex flex-none justify-center">
            <div className="bg-gray-300 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 px-1 py-1 flex items-center">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-6 py-2 rounded-xl transition-all h-full ${
                      isActive(item.path)
                        ? 'bg-white/90 text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Actions - Transparent Background, No Search Bar */}
          <div className="flex-1 flex items-center justify-end gap-2">
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-xl h-9 w-9 bg-white/90 border border-white/20"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:inline-flex rounded-xl h-9 w-9 bg-white/90 border border-white/20"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-xl h-9 px-1 sm:px-2 backdrop-blur-md "
                  >
                    <Avatar className="w-7 h-7">
                      <AvatarFallback
                        className="text-sm"
                        style={{ background: 'var(--gradient-accent)', color: 'white' }}
                      >
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="sm:hidden">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
}
