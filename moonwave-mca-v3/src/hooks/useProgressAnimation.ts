// ============================================
// Progress Animation Hook
// Smooth eased animation for progress values
// ============================================

import { useEffect, useState } from 'react';

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useProgressAnimation(targetValue: number, duration = 800, enabled = true): number {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    if (!enabled || targetValue <= 0) {
      setCurrentValue(targetValue);
      return;
    }

    let startTime: number | null = null;
    let rafId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCurrentValue(easedProgress * targetValue);

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [targetValue, duration, enabled]);

  return currentValue;
}
