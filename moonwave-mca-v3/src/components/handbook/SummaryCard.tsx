// ============================================
// SummaryCard Component
// Low 레벨 전용 요약 카드
// ============================================

import { useUIStore } from '@/stores/uiStore';
import { clsx } from 'clsx';
import { ArrowRight, CheckCircle } from 'lucide-react';
import type { SectionId } from './constants/handbookContent';
import { type LucideIcon, getIcon } from './iconMap';

interface SummaryCardProps {
  /** 카드 제목 */
  title: string;
  /** 핵심 정의 (1-2문장) */
  definition: string;
  /** 핵심 포인트 목록 (3-5개 권장) */
  keyPoints: string[];
  /** 액션 아이템 (선택) */
  actionItems?: string[];
  /** Lucide 아이콘 이름 */
  icon?: string;
  /** 카드 변형 */
  variant?: 'default' | 'action' | 'warning';
  /** "자세히 보기" 링크 대상 섹션 */
  navigateTo?: SectionId;
}

const variantStyles = {
  default: {
    border: 'border-l-primary-500',
    bg: 'bg-primary-50/50 dark:bg-primary-900/10',
    iconBg: 'bg-primary-100 dark:bg-primary-900/30',
    iconColor: 'text-primary-600 dark:text-primary-400',
  },
  action: {
    border: 'border-l-success-500',
    bg: 'bg-success-50/50 dark:bg-success-900/10',
    iconBg: 'bg-success-100 dark:bg-success-900/30',
    iconColor: 'text-success-600 dark:text-success-400',
  },
  warning: {
    border: 'border-l-warning-500',
    bg: 'bg-warning-50/50 dark:bg-warning-900/10',
    iconBg: 'bg-warning-100 dark:bg-warning-900/30',
    iconColor: 'text-warning-600 dark:text-warning-400',
  },
};

export function SummaryCard({
  title,
  definition,
  keyPoints,
  actionItems,
  icon,
  variant = 'default',
  navigateTo,
}: SummaryCardProps) {
  const setHandbookSection = useUIStore((state) => state.setHandbookSection);
  const setEffortLevel = useUIStore((state) => state.setHandbookEffortLevel);

  const styles = variantStyles[variant];

  // Dynamic icon lookup
  const IconComponent: LucideIcon | null = icon ? getIcon(icon) : null;

  const handleNavigate = () => {
    if (navigateTo) {
      setEffortLevel('medium');
      setHandbookSection(navigateTo);
    }
  };

  return (
    <div className={clsx('rounded-lg border-l-4 p-4 mb-6', styles.border, styles.bg)}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        {IconComponent && (
          <div
            className={clsx(
              'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
              styles.iconBg
            )}
          >
            <IconComponent className={clsx('w-5 h-5', styles.iconColor)} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{definition}</p>
        </div>
      </div>

      {/* Key Points */}
      <div className="space-y-1.5 mb-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          핵심 포인트
        </h4>
        <ul className="space-y-1">
          {keyPoints.map((point, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-muted-foreground mt-1.5" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Items */}
      {actionItems && actionItems.length > 0 && (
        <div className="space-y-1.5 mb-3 pt-3 border-t border-border">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            실행 체크리스트
          </h4>
          <ul className="space-y-1">
            {actionItems.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle className="flex-shrink-0 w-4 h-4 text-success-500 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Navigate Link */}
      {navigateTo && (
        <button
          onClick={handleNavigate}
          className={clsx(
            'inline-flex items-center gap-1 text-sm font-medium mt-2',
            'text-primary-600 dark:text-primary-400',
            'hover:text-primary-700 dark:hover:text-primary-300',
            'transition-colors'
          )}
        >
          자세히 보기
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
