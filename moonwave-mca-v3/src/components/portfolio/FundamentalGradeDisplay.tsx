import type { FundamentalGrade } from '@/types';
import { cn } from '@/utils/cn';
import { AlertTriangle, CheckCircle, Info, Sparkles, XCircle } from 'lucide-react';
import type React from 'react';

// ==========================================
// Grade Badge Component
// ==========================================

interface GradeBadgeProps {
  grade: FundamentalGrade;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function GradeBadge({ grade, size = 'md', className }: GradeBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-xl px-4 py-1',
  };

  const gradeStyles: Record<FundamentalGrade, string> = {
    S: 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30',
    A: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30',
    B: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:border-blue-500/30',
    C: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30',
    D: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/20 dark:text-gray-300 dark:border-gray-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border font-bold',
        sizeClasses[size],
        gradeStyles[grade],
        className
      )}
    >
      Grade {grade}
    </span>
  );
}

// ==========================================
// Action Guide Component
// ==========================================

interface ActionGuideProps {
  grade: FundamentalGrade;
  action: string;
  description: string;
}

export function ActionGuide({ grade, action, description }: ActionGuideProps) {
  const icons: Record<FundamentalGrade, React.ReactNode> = {
    S: <Sparkles className="h-5 w-5 text-indigo-500" />,
    A: <CheckCircle className="h-5 w-5 text-green-500" />,
    B: <Info className="h-5 w-5 text-blue-500" />,
    C: <XCircle className="h-5 w-5 text-red-500" />,
    D: <AlertTriangle className="h-5 w-5 text-gray-500" />,
  };

  const bgStyles: Record<FundamentalGrade, string> = {
    S: 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200',
    A: 'bg-green-50 dark:bg-green-950/20 border-green-200',
    B: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200',
    C: 'bg-red-50 dark:bg-red-950/20 border-red-200',
    D: 'bg-gray-50 dark:bg-gray-950/20 border-gray-200',
  };

  return (
    <div className={cn('flex items-start gap-4 p-4 rounded-xl border', bgStyles[grade])}>
      <div className="mt-1 flex-shrink-0">{icons[grade]}</div>
      <div className="space-y-1">
        <h4 className="font-bold flex items-center gap-2">
          {action}
          <GradeBadge grade={grade} size="sm" />
        </h4>
        <p className="text-sm text-foreground/80 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
