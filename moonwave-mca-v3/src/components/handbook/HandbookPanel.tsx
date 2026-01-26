// ============================================
// Handbook Modal Component
// 중앙 오버레이 모달 형태의 핸드북
// ============================================

import { IconButton } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';
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
}

const sections: HandbookSection[] = [
  { id: 'guide', title: '시작 가이드', shortTitle: '가이드', component: MCAUserGuide },
  { id: 'moonwave', title: 'Moonwave 철학', shortTitle: '철학', component: MoonwaveDefinition },
  { id: 'moonyou', title: 'Moonyou 정체성', shortTitle: '정체성', component: MoonyouDefinition },
  { id: 'zigzag', title: 'Zone 판정', shortTitle: 'Zone', component: ZigZagProtocol },
  { id: 'mip', title: '종목 선별', shortTitle: 'MIP', component: MIP },
  { id: 'mca', title: '분할 매수 (MCA)', shortTitle: 'MCA', component: MCAProtocol },
  { id: 'dca', title: '정액 매수 (DCA)', shortTitle: 'DCA', component: DCAProtocol },
];

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

  // Reset to first section when modal transitions from closed to open
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      queueMicrotask(() => {
        setActiveSectionId('guide');
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

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const ActiveComponent = activeSection.component;

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
                'bg-white dark:bg-zinc-950',
                'rounded-2xl shadow-2xl',
                'border border-zinc-200 dark:border-zinc-800',
                'overflow-hidden'
              )}
            >
              {/* Tab Bar - Sticky Header */}
              <div className="relative z-10 flex items-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex-shrink-0">
                {/* Scrollable Tabs */}
                <div ref={tabsRef} className="flex-1 overflow-x-auto scrollbar-hide">
                  <nav
                    className="flex gap-1 px-3 py-2 min-w-max"
                    role="tablist"
                    aria-label="핸드북 섹션"
                  >
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        data-section={section.id}
                        onClick={() => setActiveSectionId(section.id)}
                        role="tab"
                        aria-selected={activeSectionId === section.id}
                        aria-controls={`handbook-panel-${section.id}`}
                        className={clsx(
                          'relative px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap min-h-[44px] flex items-center',
                          activeSectionId === section.id
                            ? 'bg-white dark:bg-zinc-800 text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
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
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Effort Toggle */}
                <div className="flex-shrink-0 px-2 border-l border-zinc-200 dark:border-zinc-800">
                  <EffortToggle />
                </div>

                {/* Close Button */}
                <div className="flex-shrink-0 px-3 border-l border-zinc-200 dark:border-zinc-800">
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
                className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-white dark:bg-zinc-950"
              >
                <div className="prose dark:prose-invert max-w-3xl mx-auto pb-8">
                  <ActiveComponent />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
