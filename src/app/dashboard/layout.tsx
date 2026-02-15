'use client';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  FilePlus2,
  Lightbulb,
  FileText,
  LayoutDashboard,
  LogOut,
  Loader,
  Cpu,
} from 'lucide-react';
import { Logo } from '@/components/common/logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { AppProvider } from '@/lib/context';
import { useAuth, useUser } from '@/firebase';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AIAssistant } from '@/components/ai-assistant/AIAssistant';

const navItems = [
  { href: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
  { href: '/dashboard/data-entry', icon: <FilePlus2 />, label: 'Data Entry' },
  { href: '/dashboard/diagnostics', icon: <Cpu />, label: 'Diagnostics' },
  { href: '/dashboard/analysis', icon: <BarChart3 />, label: 'Analysis' },
  { href: '/dashboard/recommendations', icon: <Lightbulb />, label: 'Recommendations' },
  { href: '/dashboard/reports', icon: <FileText />, label: 'Reports' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-avatar-1');

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const handleSignOut = () => {
    auth.signOut();
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AppProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Link href="/">
              <Logo />
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href}>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{ children: item.label, side: 'right' }}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-9 w-9">
                {avatarImage && <AvatarImage src={user.photoURL || avatarImage.imageUrl} alt="User Avatar" data-ai-hint={avatarImage.imageHint} />}
                <AvatarFallback>{user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex-grow overflow-hidden group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium text-foreground truncate">{user.displayName || 'Factory Manager'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <SidebarMenuButton
                size="icon"
                variant="ghost"
                className="group-data-[collapsible=icon]:hidden"
                onClick={handleSignOut}
                tooltip={{children: "Log Out", side: 'right'}}
              >
                <LogOut />
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <main className="p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <AIAssistant />
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  );
}
