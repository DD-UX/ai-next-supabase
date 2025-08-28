"use client";

import { forwardRef, type PropsWithChildren } from "react";
import { SidebarProvider } from "./SidebarContext";

type SidebarProps = PropsWithChildren<{
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}>;

const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, open, setOpen, animate }, ref) => {
    return (
      <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
        {children}
      </SidebarProvider>
    );
  }
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
