'use client';
import { ReactNode } from 'react';
import { useHydrated } from '@/Hook/useHydrated';

/** Renders `children` only in the browser, after hydration. */
const ClientOnly = ({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) => (useHydrated() ? children : fallback);

export default ClientOnly;
