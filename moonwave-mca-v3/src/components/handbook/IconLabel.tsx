// ============================================
// IconLabel Component
// Lucide 아이콘 + 라벨 조합
// ============================================

import { clsx } from 'clsx';
import { getIcon } from './iconMap';

interface IconLabelProps {
  icon: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
}

const sizeMap = {
  sm: { icon: 'w-4 h-4', text: 'text-sm', gap: 'gap-1.5' },
  md: { icon: 'w-5 h-5', text: 'text-base', gap: 'gap-2' },
  lg: { icon: 'w-6 h-6', text: 'text-lg', gap: 'gap-2.5' },
};

export function IconLabel({ icon, label, size = 'md', className, iconClassName }: IconLabelProps) {
  const IconComponent = getIcon(icon);
  const s = sizeMap[size];

  if (!IconComponent) {
    return <span className={className}>{label}</span>;
  }

  return (
    <span className={clsx('inline-flex items-center', s.gap, className)}>
      <IconComponent
        className={clsx(s.icon, 'text-primary-600 dark:text-primary-400', iconClassName)}
      />
      <span className={s.text}>{label}</span>
    </span>
  );
}
