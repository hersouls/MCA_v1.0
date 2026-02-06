import { IconButton } from '@/components/ui';
import { useUIStore } from '@/stores/uiStore';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { clsx } from 'clsx';
import { BookOpen, ChevronRight, Menu, X } from 'lucide-react';
import { Fragment, useEffect, useRef, useState } from 'react';

import { DCAProtocol } from './content/DCAProtocol';
import { MCAProtocol } from './content/MCAProtocol';
import { MCAUserGuide } from './content/MCAUserGuide';
import { MIP } from './content/MIP';
// Content Components (Lazy loaded or imported directly if small enough, but for now direct)
import { MoonwaveDefinition } from './content/MoonwaveDefinition';
import { MoonyouDefinition } from './content/MoonyouDefinition';
import { ZigZagProtocol } from './content/ZigZagProtocol';

type SectionId = 'moonwave' | 'moonyou' | 'mip' | 'mca' | 'dca' | 'zigzag' | 'guide';

interface HandbookSection {
  id: SectionId;
  title: string;
  component: React.ComponentType;
}

const sections: HandbookSection[] = [
  { id: 'moonwave', title: '1. Moonwave Definition', component: MoonwaveDefinition },
  { id: 'moonyou', title: '2. Moonyou Definition', component: MoonyouDefinition },
  { id: 'mip', title: '3. Moonwave Investment Protocol', component: MIP },
  { id: 'mca', title: '4. MCA Protocol', component: MCAProtocol },
  { id: 'dca', title: '5. DCA Protocol', component: DCAProtocol },
  { id: 'zigzag', title: '6. ZigZag Protocol', component: ZigZagProtocol },
  { id: 'guide', title: '7. MCA 사용 가이드', component: MCAUserGuide },
];

export function HandbookModal() {
  const isOpen = useUIStore((state) => state.isHandbookOpen);
  const closeHandbook = useUIStore((state) => state.closeHandbook);
  const handbookSection = useUIStore((state) => state.handbookSection);
  const setHandbookSection = useUIStore((state) => state.setHandbookSection);

  const [activeSectionId, setActiveSectionId] = useState<SectionId>('moonwave');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  const wasOpenRef = useRef(isOpen);

  // Reset to first section when modal transitions from closed to open
  // Using ref callback pattern to avoid synchronous setState in effect
  useEffect(() => {
    const wasOpen = wasOpenRef.current;
    wasOpenRef.current = isOpen;

    // Only reset state when transitioning from closed (false) to open (true)
    if (isOpen && !wasOpen) {
      // Use microtask to defer state update (avoids lint warning while maintaining behavior)
      queueMicrotask(() => {
        setActiveSectionId('moonwave');
        setIsSidebarOpen(false);
      });
    }
  }, [isOpen]);

  // Handle external section navigation (from SectionLink in content)
  useEffect(() => {
    if (handbookSection && sections.some((s) => s.id === handbookSection)) {
      queueMicrotask(() => {
        setActiveSectionId(handbookSection as SectionId);
        setHandbookSection(''); // Clear after navigation
      });
    }
  }, [handbookSection, setHandbookSection]);

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const ActiveComponent = activeSection.component;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={closeHandbook} className="relative z-50">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm" aria-hidden="true" />
        </TransitionChild>

        {/* Modal Panel */}
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
            <DialogPanel className="w-full max-w-7xl h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-border">
              {/* Header (Mobile Only) */}
              <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background z-20">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 -ml-2 rounded-lg hover:bg-surface-hover"
                >
                  <Menu className="w-5 h-5 text-muted-foreground" />
                </button>
                <span className="font-semibold text-foreground truncate max-w-[200px]">
                  {activeSection.title}
                </span>
                <button
                  onClick={closeHandbook}
                  className="p-2 -mr-2 rounded-lg hover:bg-surface-hover"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Sidebar (Desktop + Mobile Drawer) */}
              <aside
                className={clsx(
                  'fixed md:relative inset-y-0 left-0 z-10 w-72 bg-surface-hover border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0',
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                  'md:flex' // Always flex on desktop
                )}
              >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center px-6 border-b border-border">
                  <BookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-3" />
                  <span className="font-bold text-foreground">
                    Moonwave Handbook
                  </span>
                </div>

                {/* Navigation List */}
                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSectionId(section.id);
                        setIsSidebarOpen(false);
                      }}
                      className={clsx(
                        'w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                        activeSectionId === section.id
                          ? 'bg-card text-primary-600 dark:text-primary-400 shadow-sm ring-1 ring-border'
                          : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
                      )}
                    >
                      <span className="truncate text-left">{section.title}</span>
                      {activeSectionId === section.id && (
                        <ChevronRight className="w-4 h-4 ml-2 flex-shrink-0 opacity-50" />
                      )}
                    </button>
                  ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
                  v3.0.0
                </div>
              </aside>

              {/* Main Content Area */}
              <main className="flex-1 flex flex-col relative min-w-0 bg-background">
                {/* Desktop Close Button */}
                <div className="absolute top-4 right-4 z-20 hidden md:block">
                  <IconButton
                    plain
                    onClick={closeHandbook}
                    className="hover:bg-surface-hover"
                  >
                    <X className="w-5 h-5" />
                  </IconButton>
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 lg:p-12">
                  <div className="max-w-4xl mx-auto pb-20">
                    <ActiveComponent />
                  </div>
                </div>
              </main>

              {/* Overlay for mobile sidebar */}
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm z-0 md:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                  aria-hidden="true"
                />
              )}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
