// ============================================
// 404 Not Found Page
// ============================================

import { Button } from '@/components/ui/Button';
import { TEXTS } from '@/utils/texts';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Branded Illustration */}
        <div className="mb-8 relative">
          <div className="text-9xl font-bold text-primary-500/20 select-none" aria-hidden="true">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-primary-500/10 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-foreground mb-2">{TEXTS.NOT_FOUND.TITLE}</h1>
        <p className="text-muted-foreground mb-8">{TEXTS.NOT_FOUND.DESC}</p>

        {/* CTA */}
        <Button
          color="primary"
          leftIcon={<Home className="w-4 h-4" aria-hidden="true" />}
          onClick={() => navigate('/dashboard')}
        >
          {TEXTS.NOT_FOUND.GO_HOME}
        </Button>
      </div>
    </div>
  );
}
