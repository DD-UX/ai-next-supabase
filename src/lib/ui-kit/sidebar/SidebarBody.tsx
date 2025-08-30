"use client";

import { type ComponentProps } from "react";
import { motion } from "framer-motion";

import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

const SidebarBody = (props: ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as ComponentProps<"div">)} />
    </>
  );
};

export default SidebarBody;
