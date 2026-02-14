// ============================================
// Handbook Modal Component
// 중앙 오버레이 모달 형태의 핸드북
// ============================================

import { IconButton } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { TEXTS } from '@/utils/texts';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { clsx } from 'clsx';
import { ArrowUp, X } from 'lucide-react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { EffortToggle } from './EffortToggle';

import { DCAProtocol } from './content/DCAProtocol';
import { MCAProtocol } from './content/MCAProtocol';
import { MCAUserGuide } from './content/MCAUserGuide';
import { MIP } from './content/MIP';
// Content Components
import { MoonwaveDefinition } from './content/MoonwaveDefinition';
import { MoonyouDefinition } from './content/MoonyouDefinition';
import { ZigZagProtocol } from './content/ZigZagProtocol';

type SectionId = 'guide' | 'moonwave' | 'moonyou' | 'zigzag' | 'mip' | 'mca' | 'dca';

interface HandbookSection {
  id: SectionId;
  title: string;
  shortTitle: string;
  component: React.ComponentType;
  tier: 1 | 2 | 3;
  recommended?: boolean;
}

// Progressive disclosure: 3-tier hierarchy
const sections: HandbookSection[] = [
  // Tier 1: 시작하기
  { id: 'guide', title: '시작 가이드', shortTitle: '가이드', component: MCAUserGuide, tier: 1, recommended: true },
  { id: 'moonwave', title: 'Moonwave 철학', shortTitle: '철학', component: MoonwaveDefinition, tier: 1 },
  // Tier 2: 심화학습
  { id: 'moonyou', title: 'Moonyou 정체성', shortTitle: '정체성', component: MoonyouDefinition, tier: 2 },
  { id: 'zigzag', title: 'Zone 판정', shortTitle: 'Zone', component: ZigZagProtocol, tier: 2 },
  { id: 'mip', title: '종목 선별', shortTitle: 'MIP', component: MIP, tier: 2 },
  // Tier 3: 전략가이드
  { id: 'mca', title: '분할 매수 (MCA)', shortTitle: 'MCA', component: MCAProtocol, tier: 3 },
  { id: 'dca', title: '정액 매수 (DCA)', shortTitle: 'DCA', component: DCAProtocol, tier: 3 },
];

const tierLabels: Record<number, string> = {
  1: TEXTS.HANDBOOK.TIER_1,
  2: TEXTS.HANDBOOK.TIER_2,
  3: TEXTS.HANDBOOK.TIER_3,
};

export function HandbookPanel() {
  const isOpen = useUIStore((state) => state.isHandbookOpen);
  const closeHandbook = useUIStore((state) => state.closeHandbook);
  const handbookSection = useUIStore((state) => state.handbookSection);
  const setHandbookSection = useUIStore((state) => state.setHandbookSection);
  const handbookAnchor = useUIStore((state) => state.handbookAnchor);

  const [activeSectionId, setActiveSectionId] = useState<SectionId>('guide');
  const wasOpenRef = useRef(isOpen);
  const tabsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll affordance state (5-5)
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  // Back-to-top state (6-9)
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Check tab scroll affordance
  const updateScrollAffordance = useCallback(() => {
    const el = tabsRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
  }, []);

  // Monitor tab scroll
  useEffect(() => {
    const el = tabsRef.current;
    if (!el || !isOpen) return;
    updateScrollAffordance();
    el.addEventListener('scroll', updateScrollAffordance, { passive: true });
    window.addEventListener('resize', updateScrollAffordance);
    return () => {
      el.removeEventListener('scroll', updateScrollAffordance);
      window.removeEventListener('resize', updateScrollAffordance);
    };
  }, [isOpen, updateScrollAffordance]);

  // Monitor content scroll for back-to-top
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !isOpen) return;
    const handleScroll = () => {
      setShowBackToTop(el.scrollTop > 300);
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  // Reset to first section when modal transitions from closed to open
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      queueMicrotask(() => {
        setActiveSectionId('guide');
        setShowBackToTop(false);
      });
    }
  }, [isOpen]);

  // Handle external section navigation (from SectionLink in content)
  useEffect(() => {
    if (handbookSection && sections.some((s) => s.id === handbookSection)) {
      queueMicrotask(() => {
        setActiveSectionId(handbookSection as SectionId);
        // Clear section but keep anchor if present
        setHandbookSection('');
      });
    }
  }, [handbookSection, setHandbookSection]);

  // Handle Anchor Scrolling
  useEffect(() => {
    if (handbookAnchor && isOpen) {
      // Use microtask to wait for content render
      setTimeout(() => {
        const element = document.getElementById(handbookAnchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Highlight effect
          element.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2', 'rounded');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2', 'rounded');
          }, 2000);

          useUIStore.getState().setHandbookAnchor(null);
        }
      }, 100); // Slight delay for transition
    }
  }, [handbookAnchor, isOpen]);

  // Scroll active tab into view
  useEffect(() => {
    if (tabsRef.current && isOpen) {
      const activeTab = tabsRef.current.querySelector(`[data-section="${activeSectionId}"]`);
      activeTab?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSectionId, isOpen]);

  // Reset content scroll when section changes
  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionId]);

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const ActiveComponent = activeSection.component;

  // Group sections by tier for rendering
  let lastTier = 0;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={closeHandbook} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        {/* Modal Container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className={clsx(
                'w-[95vw] max-w-4xl',
                'max-h-[85vh] md:max-h-[85vh]',
                'flex flex-col',
                'bg-background',
                'rounded-2xl shadow-2xl',
                'border border-border',
                'overflow-hidden'
              )}
            >
              {/* Tab Bar - Sticky Header */}
              <div className="relative z-10 flex items-center border-b border-border bg-surface-hover flex-shrink-0">
                {/* Scroll affordance - left gradient */}
                {canScrollLeft && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface-hover to-transparent z-10 pointer-events-none"
                    aria-hidden="true"
                  />
                )}

                {/* Scrollable Tabs */}
                <div ref={tabsRef} className="flex-1 overflow-x-auto scrollbar-hide">
                  <nav
                    className="flex gap-1 px-3 py-2 min-w-max items-center"
                    role="tablist"
                    aria-label="핸드북 섹션"
                  >
                    {sections.map((section) => {
                      const showTierLabel = section.tier !== lastTier;
                      lastTier = section.tier;

                      return (
                        <Fragment key={section.id}>
                          {/* Tier separator label */}
                          {showTierLabel && (
                            <span
                              className={clsx(
                                'text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-1',
                                section.tier > 1 && 'ml-1 pl-2 border-l border-border'
                              )}
                              aria-hidden="true"
                            >
                              {tierLabels[section.tier]}
                            </span>
                          )}
                          <button
                            data-section={section.id}
                            onClick={() => setActiveSectionId(section.id)}
                            role="tab"
                            aria-selected={activeSectionId === section.id}
                            aria-controls={`handbook-panel-${section.id}`}
                            className={clsx(
                              'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap min-h-[44px] flex items-center gap-1.5',
                              activeSectionId === section.id
                                ? 'bg-card text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-border'
                                : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                            )}
                          >
                            {/* Touch target for mobile */}
                            <span
                              className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
                              aria-hidden="true"
                            />
                            {/* Use shortTitle on mobile */}
                            <span className="hidden md:inline">{section.title}</span>
                            <span className="md:hidden">{section.shortTitle}</span>
                            {/* Recommended badge */}
                            {section.recommended && (
                              <span className="hidden md:inline-flex text-[9px] font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 px-1.5 py-0.5 rounded-full">
                                {TEXTS.HANDBOOK.RECOMMENDED}
                              </span>
                            )}
                          </button>
                        </Fragment>
                      );
                    })}
                  </nav>
                </div>

                {/* Effort Toggle */}
                <div className="flex-shrink-0 px-2 border-l border-border">
                  <EffortToggle />
                </div>

                {/* Close Button */}
                <div className="flex-shrink-0 px-3 border-l border-border">
                  <IconButton
                    plain
                    color="secondary"
                    onClick={closeHandbook}
                    aria-label="핸드북 닫기"
                  >
                    <X className="w-5 h-5" />
                  </IconButton>
                </div>
              </div>

              {/* Content Area - Scrollable */}
              <div
                ref={contentRef}
                id={`handbook-panel-${activeSectionId}`}
                role="tabpanel"
                aria-labelledby={`handbook-tab-${activeSectionId}`}
                className="relative flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background"
              >
                <div className="prose dark:prose-invert max-w-3xl mx-auto pb-8">
                  <ActiveComponent />
                </div>

                {/* Back to Top floating button (6-9) */}
                {showBackToTop && (
                  <button
                    onClick={scrollToTop}
                    className="sticky bottom-4 float-right mr-2 p-2.5 rounded-full bg-card shadow-lg border border-border text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all animate-fade-in"
                    aria-label={TEXTS.HANDBOOK.BACK_TO_TOP}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
