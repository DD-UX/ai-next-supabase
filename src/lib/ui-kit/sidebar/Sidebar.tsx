'use client';

import { Dispatch, forwardRef, type PropsWithChildren, SetStateAction } from 'react';

import { SidebarProvider } from './SidebarContext';

type SidebarProps = PropsWithChildren<{
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
}>;

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ children, open, setOpen, animate }, _ref) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
