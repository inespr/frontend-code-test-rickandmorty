import { useState, useEffect } from 'react';
import { useBreakpoint } from './useBreakpoint';

const COLS = { mobile: 2, tablet: 3, desktop: 4 };

const HEADER_H  = { mobile: 96,  tablet: 112, desktop: 112 };
const FOOTER_H  = 53;
const MAIN_PAD  = { mobile: 20,  tablet: 32,  desktop: 40  };
const SECTION_H = { mobile: 100, tablet: 110, desktop: 118 };
const CARD_H    = { mobile: 136, tablet: 150, desktop: 154 };
const GAP       = { mobile: 12,  tablet: 16,  desktop: 16  };

function calculate(bp: 'mobile' | 'tablet' | 'desktop'): number {
  const cols       = COLS[bp];
  const available  = window.innerHeight - HEADER_H[bp] - FOOTER_H - MAIN_PAD[bp] - SECTION_H[bp];
  const rowHeight  = CARD_H[bp] + GAP[bp];
  const rows       = Math.max(1, Math.floor(available / rowHeight));
  return rows * cols;
}

export function usePageSize(): number {
  const bp = useBreakpoint();
  const [size, setSize] = useState(() => calculate(bp));

  useEffect(() => {
    setSize(calculate(bp));
    const handler = () => setSize(calculate(bp));
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [bp]);

  return size;
}
