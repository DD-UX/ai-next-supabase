'use client';

import { type PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import Sidebar from '@/lib/ui-kit/sidebar/Sidebar';
import SidebarBody from '@/lib/ui-kit/sidebar/SidebarBody';
import SidebarLink from '@/lib/ui-kit/sidebar/SidebarLink';
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';
import Link from 'next/link';

type AppLayoutProps = PropsWithChildren<{}>;

const AppLayout = ({ children }: AppLayoutProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const links = [
    {
      label: 'Dashboard',
      href: '/app',
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: 'Profile',
      href: '#',
      icon: <User className="h-4 w-4" />,
    },
    {
      label: 'Settings',
      href: '#',
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const homeLink = {
    label: 'My App',
    href: '/app',
    icon: <Home className="h-6 w-6" />,
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-neutral-900">
      <Sidebar>
        <SidebarBody className="flex flex-col justify-between">
          <div className="flex flex-col gap-2">
            <div className="mb-8">
              <SidebarLink link={homeLink} className="text-xl font-bold" />
            </div>
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
          <div>
            <SidebarLink
              link={{
                label: 'Logout',
                href: '#', // href is required but we use onClick
                icon: <LogOut className="h-4 w-4" />,
              }}
              onClick={handleLogout}
              className="cursor-pointer"
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col flex-1">
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
