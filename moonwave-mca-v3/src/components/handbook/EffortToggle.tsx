// ============================================
// EffortToggle Component
// 3단계 정보 깊이 조절 토글
// ============================================

import { useUIStore } from '@/stores/uiStore';
import { RadioGroup } from '@headlessui/react';
import { clsx } from 'clsx';
import { Book, GraduationCap, Zap } from 'lucide-react';
import { EFFORT_LEVEL_LIST, type EffortLevel } from './constants/handbookContent';

const LEVEL_ICONS: Record<EffortLevel, React.ComponentType<{ className?: string }>> = {
  low: Zap,
  medium: Book,
  high: GraduationCap,
};

interface EffortToggleProps {
  className?: string;
}

export function EffortToggle({ className }: EffortToggleProps) {
  const effortLevel = useUIStore((state) => state.handbookEffortLevel);
  const setEffortLevel = useUIStore((state) => state.setHandbookEffortLevel);

  return (
    <RadioGroup
      value={effortLevel}
      onChange={setEffortLevel}
      className={clsx('flex items-center', className)}
    >
      <RadioGroup.Label className="sr-only">정보 깊이 선택</RadioGroup.Label>
      <div className="flex rounded-lg bg-surface-hover p-0.5">
        {EFFORT_LEVEL_LIST.map((level) => {
          const Icon = LEVEL_ICONS[level.id];
          return (
            <RadioGroup.Option
              key={level.id}
              value={level.id}
              className={({ checked }) =>
                clsx(
                  'relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-150',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
                  checked
                    ? 'bg-card text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ checked }) => (
                <>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span
                    className={clsx(
                      'text-xs font-medium hidden md:inline',
                      checked ? 'text-primary-600 dark:text-primary-400' : ''
                    )}
                  >
                    {level.koreanName}
                  </span>
                </>
              )}
            </RadioGroup.Option>
          );
        })}
      </div>
    </RadioGroup>
  );
}
