// ============================================
// Onboarding Tour Component
// ============================================

import { useUIStore } from '@/stores/uiStore';
import { STORAGE_KEYS } from '@/utils/constants';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useEffect, useRef } from 'react';
import { desktopSteps, mobileSteps } from './tourSteps';

function isDarkMode(): boolean {
  return document.documentElement.classList.contains('dark');
}

function isMobileViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches;
}

export function OnboardingTour() {
  const isTourActive = useUIStore((state) => state.isTourActive);
  const startTour = useUIStore((state) => state.startTour);
  const endTour = useUIStore((state) => state.endTour);
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  // Auto-start tour for first-time visitors
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    if (completed) return;

    // Wait for DOM to be fully rendered
    const timer = setTimeout(() => {
      startTour();
    }, 800);

    return () => clearTimeout(timer);
  }, [startTour]);

  // Run tour when isTourActive becomes true
  useEffect(() => {
    if (!isTourActive) return;

    const mobile = isMobileViewport();
    const dark = isDarkMode();
    const steps = mobile ? mobileSteps : desktopSteps;

    driverRef.current = driver({
      steps,
      showProgress: true,
      animate: true,
      smoothScroll: true,
      allowClose: true,
      overlayColor: dark ? '#000' : '#000',
      overlayOpacity: dark ? 0.7 : 0.5,
      stagePadding: 8,
      stageRadius: 12,
      popoverClass: dark ? 'mca-tour mca-tour-dark' : 'mca-tour mca-tour-light',
      nextBtnText: '다음',
      prevBtnText: '이전',
      doneBtnText: '완료',
      progressText: '{{current}} / {{total}}',
      allowKeyboardControl: true,
      onDestroyed: () => {
        localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
        endTour();
      },
    });

    driverRef.current.drive();

    return () => {
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }
    };
  }, [isTourActive, endTour]);

  return null;
}
