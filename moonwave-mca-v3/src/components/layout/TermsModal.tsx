// ============================================
// Terms of Service Modal Component (Moonwave MVC View)
// ============================================

import { Dialog, DialogBody, DialogHeader } from '@/components/ui/Dialog';
import { useTermsController } from '@/hooks/useTermsController';

export function TermsModal() {
  const { isOpen, closeModal, terms, privacy } = useTermsController();

  return (
    <Dialog open={isOpen} onClose={closeModal} size="lg">
      <DialogHeader title="서비스 이용약관" onClose={closeModal} />
      <DialogBody>
        <div className="prose prose-sm dark:prose-invert max-w-none max-h-[70vh] overflow-y-auto pr-2">
          {/* 서비스 이용약관 */}
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0">
            Moonwave MCA 서비스 이용약관
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">시행일: 2026년 1월 23일</p>

          <div className="space-y-6 mt-6">
            {terms.map((section, index) => (
              <div key={index}>
                <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  {section.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {section.content.map((text, i) => (
                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 list-none">
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 개인정보처리방침 */}
          <hr className="my-8 border-zinc-200 dark:border-zinc-700" />

          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Moonwave MCA 개인정보처리방침
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">시행일: 2026년 1월 23일</p>
          <div className="space-y-6 mt-6">
            {privacy.map((section, index) => (
              <div key={index}>
                <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                  {section.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {section.content.map((text, i) => (
                    <li key={i} className="text-sm text-zinc-600 dark:text-zinc-400 list-none">
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
}
