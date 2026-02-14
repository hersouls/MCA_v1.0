// ============================================
// Onboarding Tour Component
// ============================================

import { ConfirmDialog } from '@/components/ui/Dialog';
import { useUIStore } from '@/stores/uiStore';
import { STORAGE_KEYS } from '@/utils/constants';
import { TEXTS } from '@/utils/texts';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useEffect, useRef, useState } from 'react';
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
  const [showChoiceModal, setShowChoiceModal] = useState(false);

  // Show choice modal for first-time visitors (instead of auto-starting)
  useEffect(() => {
    const completed = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    const declined = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DECLINED);
    if (completed || declined) return;

    const timer = setTimeout(() => {
      setShowChoiceModal(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleStartTour = () => {
    setShowChoiceModal(false);
    startTour();
  };

  const handleDeclineTour = () => {
    setShowChoiceModal(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DECLINED, 'true');
  };

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

  return (
    <ConfirmDialog
      open={showChoiceModal}
      onClose={handleDeclineTour}
      onConfirm={handleStartTour}
      title={TEXTS.ONBOARDING.CHOICE_TITLE}
      description={TEXTS.ONBOARDING.CHOICE_DESC}
      confirmText={TEXTS.ONBOARDING.START_TOUR}
      cancelText={TEXTS.ONBOARDING.SKIP_TOUR}
      variant="primary"
    />
  );
}
