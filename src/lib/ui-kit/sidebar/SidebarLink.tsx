'use client';

import { MouseEventHandler, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

import { useSidebar } from './SidebarContext';

type Links = {
  label: string;
  href: string;
  icon: ReactNode;
};

type SidebarLinkProps = {
  link: Links;
  className?: string;
  onClick?:  MouseEventHandler<HTMLAnchorElement>;
};

const SidebarLink = ({ link, className, ...props }: SidebarLinkProps) => {
  const { open, animate } = useSidebar();

  const commonProps = {
    className: cn(
      'flex items-center justify-start gap-2 group/sidebar py-2 text-neutral-700 dark:text-neutral-200',
      className,
    ),
    ...props,
  };

  const linkContent = (
    <>
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </>
  );

  if (props.onClick || link.href === '#') {
    return (
      <a {...commonProps} onClick={props.onClick} href={link.href}>
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={link.href} {...commonProps}>
      {linkContent}
    </Link>
  );
};

export default SidebarLink;
