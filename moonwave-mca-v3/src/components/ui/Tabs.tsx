// ============================================
// Tabs Component (Catalyst-style with Headless UI)
// ============================================

import { createContext, useContext, type ReactNode } from 'react';
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';
import { clsx } from 'clsx';

// Context for tab variant
type TabVariant = 'underline' | 'pills' | 'bordered';

const TabContext = createContext<{ variant: TabVariant }>({ variant: 'underline' });

// Tabs Root
interface TabsProps {
  children: ReactNode;
  variant?: TabVariant;
  defaultIndex?: number;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function Tabs({
  children,
  variant = 'underline',
  defaultIndex = 0,
  selectedIndex,
  onChange,
  className,
}: TabsProps) {
  return (
    <TabContext.Provider value={{ variant }}>
      <TabGroup
        defaultIndex={defaultIndex}
        selectedIndex={selectedIndex}
        onChange={onChange}
        className={className}
      >
        {children}
      </TabGroup>
    </TabContext.Provider>
  );
}

// Tab List
interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className }: TabListProps) {
  const { variant } = useContext(TabContext);

  return (
    <TabList
      className={clsx(
        'flex',
        variant === 'underline' && 'border-b border-zinc-200 dark:border-zinc-800 gap-6',
        variant === 'pills' && 'bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1 gap-1',
        variant === 'bordered' && 'border border-zinc-200 dark:border-zinc-800 rounded-lg p-1 gap-1',
        className
      )}
    >
      {children}
    </TabList>
  );
}

// Tab Item
interface TabItemProps {
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}

export function TabItem({ children, disabled = false, className }: TabItemProps) {
  const { variant } = useContext(TabContext);

  return (
    <Tab
      disabled={disabled}
      className={({ selected }) =>
        clsx(
          'text-sm font-medium transition-all duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50',
          disabled && 'opacity-50 cursor-not-allowed',

          // Underline variant
          variant === 'underline' && [
            'pb-3 border-b-2 -mb-px',
            selected
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600',
          ],

          // Pills variant
          variant === 'pills' && [
            'px-3 py-1.5 rounded-md',
            selected
              ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300',
          ],

          // Bordered variant
          variant === 'bordered' && [
            'px-3 py-1.5 rounded-md',
            selected
              ? 'bg-primary-500 text-white'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700',
          ],

          className
        )
      }
    >
      {children}
    </Tab>
  );
}

// Tab Panels Container
interface TabPanelsContainerProps {
  children: ReactNode;
  className?: string;
}

export function TabPanelsContainer({ children, className }: TabPanelsContainerProps) {
  return <TabPanels className={clsx('mt-4', className)}>{children}</TabPanels>;
}

// Tab Panel
interface TabPanelProps {
  children: ReactNode;
  className?: string;
}

export function TabContent({ children, className }: TabPanelProps) {
  return (
    <TabPanel
      className={clsx(
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 rounded-lg',
        className
      )}
    >
      {children}
    </TabPanel>
  );
}

// Simple Tabs Component (All-in-one)
interface SimpleTabsProps {
  tabs: Array<{
    label: string;
    content: ReactNode;
    disabled?: boolean;
  }>;
  variant?: TabVariant;
  defaultIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function SimpleTabs({
  tabs,
  variant = 'underline',
  defaultIndex = 0,
  onChange,
  className,
}: SimpleTabsProps) {
  return (
    <Tabs
      variant={variant}
      defaultIndex={defaultIndex}
      onChange={onChange}
      className={className}
    >
      <TabsList>
        {tabs.map((tab, index) => (
          <TabItem key={index} disabled={tab.disabled}>
            {tab.label}
          </TabItem>
        ))}
      </TabsList>
      <TabPanelsContainer>
        {tabs.map((tab, index) => (
          <TabContent key={index}>{tab.content}</TabContent>
        ))}
      </TabPanelsContainer>
    </Tabs>
  );
}
