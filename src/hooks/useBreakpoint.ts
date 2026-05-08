import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function getBreakpoint(): Breakpoint {
  const w = window.innerWidth;
  if (w <= 768) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(getBreakpoint);

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 768px)');
    const mqTablet = window.matchMedia('(min-width: 769px) and (max-width: 1024px)');
    const handler = () => setBp(getBreakpoint());
    mqMobile.addEventListener('change', handler);
    mqTablet.addEventListener('change', handler);
    return () => {
      mqMobile.removeEventListener('change', handler);
      mqTablet.removeEventListener('change', handler);
    };
  }, []);

  return bp;
}

export function useIsMobile(): boolean {
  return useBreakpoint() === 'mobile';
}

export function useIsTablet(): boolean {
  return useBreakpoint() === 'tablet';
}

export function useIsDesktop(): boolean {
  return useBreakpoint() === 'desktop';
}
