'use client';
import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type ActiveState = { isActive: boolean };

interface NavLinkProps {
  href: string;
  /** Match only the exact path (otherwise nested paths are active too). */
  end?: boolean;
  className?: string | ((state: ActiveState) => string);
  children?: ReactNode | ((state: ActiveState) => ReactNode);
  onClick?: () => void;
}

/**
 * next/link with React Router's NavLink active-state API. Matching mirrors
 * React Router: exact match, or a nested path unless `end`; '/' is exact only.
 */
const NavLink = ({ href, end, className, children, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (!end && href !== '/' && pathname.startsWith(`${href}/`));
  const state = { isActive };

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
      className={typeof className === 'function' ? className(state) : className}
    >
      {typeof children === 'function' ? children(state) : children}
    </Link>
  );
};

export default NavLink;
