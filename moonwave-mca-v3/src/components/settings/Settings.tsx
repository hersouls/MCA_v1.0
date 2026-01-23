// ============================================
// Settings Page Component
// ============================================

import { useState } from 'react';
import { Sun, Moon, Monitor, Database, Download, Upload, Trash2 } from 'lucide-react';

import { PageContainer, PageHeader, Section } from '@/components/layout';
import { Card, Button, NumericInput, ConfirmDialog } from '@/components/ui';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/utils/format';
import type { ThemeMode } from '@/types';

export function Settings() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();
  const settings = useSettingsStore((state) => state.settings);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setInitialCash = useSettingsStore((state) => state.setInitialCash);

  const portfolios = usePortfolioStore((state) => state.portfolios);

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme);
  };

  const handleInitialCashChange = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isNaN(numValue) && numValue >= 0) {
      setInitialCash(numValue);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = {
        version: '3.0',
        exportDate: new Date().toISOString(),
        settings,
        portfolios,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mca-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toastSuccess('데이터를 성공적으로 내보냈습니다');
    } catch (error) {
      toastError('데이터 내보내기에 실패했습니다');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (data.version !== '3.0') {
          toastError('지원하지 않는 데이터 형식입니다');
          return;
        }

        // TODO: Implement actual import logic
        toastInfo('데이터 가져오기 기능은 준비 중입니다');
      } catch (error) {
        toastError('파일을 읽는 중 오류가 발생했습니다');
      }
    };
    input.click();
  };

  const handleClearAllData = async () => {
    try {
      // Clear IndexedDB
      const databases = await indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
        }
      }

      // Clear localStorage
      localStorage.clear();

      toastSuccess('모든 데이터가 삭제되었습니다. 페이지를 새로고침합니다.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      toastError('데이터 삭제 중 오류가 발생했습니다');
    }
  };

  const themeOptions: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: '라이트', icon: Sun },
    { value: 'dark', label: '다크', icon: Moon },
    { value: 'system', label: '시스템', icon: Monitor },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="설정"
        description="앱 설정 및 데이터 관리"
      />

      {/* Theme Settings */}
      <Section title="🎨 테마">
        <Card>
          <div className="flex flex-wrap gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = settings.theme === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleThemeChange(option.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </Section>

      {/* Fund Settings */}
      <Section title="💰 자금 설정">
        <Card>
          <div className="max-w-sm">
            <NumericInput
              label="초기 예수금"
              value={formatCurrency(settings.initialCash).replace(/[^0-9]/g, '')}
              onChange={handleInitialCashChange}
              placeholder="예: 100,000,000"
            />
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              총 투자 가능 금액을 설정합니다. 대시보드에서 잔여 현금 계산에 사용됩니다.
            </p>
          </div>
        </Card>
      </Section>

      {/* Data Management */}
      <Section title="📦 데이터 관리">
        <Card>
          <div className="space-y-4">
            {/* Stats */}
            <div className="flex items-center gap-3 p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <Database className="w-5 h-5 text-zinc-500" />
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  저장된 데이터
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {portfolios.length}개 종목
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExportData}
                isLoading={isExporting}
              >
                데이터 내보내기
              </Button>
              <Button
                variant="secondary"
                leftIcon={<Upload className="w-4 h-4" />}
                onClick={handleImportData}
              >
                데이터 가져오기
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <h4 className="text-sm font-medium text-danger-600 dark:text-danger-400 mb-2">
                위험 영역
              </h4>
              <Button
                variant="danger"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                모든 데이터 삭제
              </Button>
            </div>
          </div>
        </Card>
      </Section>

      {/* App Info */}
      <Section title="ℹ️ 앱 정보">
        <Card>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">버전</span>
              <span className="text-zinc-900 dark:text-zinc-100">3.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">개발자</span>
              <span className="text-zinc-900 dark:text-zinc-100">Moonwave</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500 dark:text-zinc-400">저장소</span>
              <a
                href="https://github.com/hersouls/moonwave-mca"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 dark:text-primary-400 hover:underline"
              >
                GitHub
              </a>
            </div>
          </div>
        </Card>
      </Section>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleClearAllData}
        title="모든 데이터를 삭제하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다. 모든 종목 데이터와 설정이 영구적으로 삭제됩니다."
        confirmText="삭제"
        variant="danger"
      />
    </PageContainer>
  );
}
