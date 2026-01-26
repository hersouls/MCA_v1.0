// ============================================
// Settings Page Component
// ============================================

import {
  AlertTriangle,
  Bell,
  Database,
  Download,
  Info,
  Monitor,
  Moon,
  Palette,
  RefreshCw,
  Smartphone,
  Star,
  Sun,
  Trash2,
  Upload,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { PageContainer, PageHeader, Section } from '@/components/layout';
import { Button, Card, ConfirmDialog, NumericInput, StatGrid, StatItem } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useSettingsStore } from '@/stores/settingsStore';
import type { ThemeMode } from '@/types';
import { formatCurrency } from '@/utils/format';

export function Settings() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const { success: toastSuccess, error: toastError, info: toastInfo } = useToast();

  // PWA install detection
  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isStandalone);

    // Listen for install availability
    const handleInstallAvailable = () => setCanInstallPWA(true);
    window.addEventListener('pwaInstallAvailable', handleInstallAvailable);

    // Check if already available
    if ((window as Window & { installPWA?: () => Promise<boolean> }).installPWA) {
      setCanInstallPWA(true);
    }

    return () => {
      window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
    };
  }, []);

  const handleInstallPWA = async () => {
    const installFn = (window as Window & { installPWA?: () => Promise<boolean> }).installPWA;
    if (installFn) {
      const accepted = await installFn();
      if (accepted) {
        toastSuccess('앱이 설치되었습니다!');
        setCanInstallPWA(false);
        setIsInstalled(true);
      }
    }
  };
  const settings = useSettingsStore((state) => state.settings);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setInitialCash = useSettingsStore((state) => state.setInitialCash);
  const toggleNotificationPreference = useSettingsStore((state) => state.toggleNotificationPreference);

  const portfolios = usePortfolioStore((state) => state.portfolios);

  const handleThemeChange = (theme: ThemeMode) => {
    setTheme(theme);
  };

  const handleInitialCashChange = (value: string | number) => {
    const numValue = typeof value === 'string' ? Number.parseFloat(value) : value;
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
    } catch {
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
      } catch {
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
    } catch {
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
      <PageHeader title="설정" description="앱 설정 및 데이터 관리" />

      {/* Theme Settings */}
      <Section title="테마" icon={<Palette className="w-5 h-5" />}>
        <Card>
          <div className="flex flex-wrap gap-3">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = settings.theme === option.value;

              return (
                <Button
                  key={option.value}
                  outline={!isSelected}
                  color={isSelected ? 'primary' : 'secondary'}
                  leftIcon={<Icon className="w-5 h-5" />}
                  onClick={() => handleThemeChange(option.value)}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </Card>
      </Section>

      {/* Fund Settings */}
      <Section title="자금 설정" icon={<Wallet className="w-5 h-5" />}>
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

      {/* Notification Settings */}
      <Section title="알림 설정" icon={<Bell className="w-5 h-5" />}>
        <Card>
          <div className="space-y-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              알림 유형별로 수신 여부를 설정할 수 있습니다.
            </p>
            <div className="space-y-3">
              {/* Gap Warning Toggle */}
              <NotificationToggle
                icon={<AlertTriangle className="w-4 h-4" />}
                label="주문 갭 경고"
                description="주문/체결 구간에 갭이 발생하면 알림"
                enabled={settings.notificationPreferences?.gapWarning ?? true}
                onChange={() => toggleNotificationPreference('gapWarning')}
              />
              {/* Backup Reminder Toggle */}
              <NotificationToggle
                icon={<RefreshCw className="w-4 h-4" />}
                label="백업 알림"
                description="마지막 백업 후 7일 경과 시 알림"
                enabled={settings.notificationPreferences?.backupReminder ?? true}
                onChange={() => toggleNotificationPreference('backupReminder')}
              />
              {/* Grade Change Toggle */}
              <NotificationToggle
                icon={<Star className="w-4 h-4" />}
                label="등급 변경 알림"
                description="Fundamental Grade 변경 시 알림"
                enabled={settings.notificationPreferences?.gradeChange ?? true}
                onChange={() => toggleNotificationPreference('gradeChange')}
              />
            </div>
          </div>
        </Card>
      </Section>

      {/* Data Management */}
      <Section title="데이터 관리" icon={<Database className="w-5 h-5" />}>
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
                color="secondary"
                leftIcon={<Download className="w-4 h-4" />}
                onClick={handleExportData}
                isLoading={isExporting}
              >
                데이터 내보내기
              </Button>
              <Button
                color="secondary"
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
                color="danger"
                leftIcon={<Trash2 className="w-4 h-4" />}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                모든 데이터 삭제
              </Button>
            </div>
          </div>
        </Card>
      </Section>

      {/* PWA Install */}
      <Section title="앱 설치" icon={<Smartphone className="w-5 h-5" />}>
        <Card>
          <div className="space-y-3">
            {isInstalled ? (
              <div className="flex items-center gap-3 p-3 bg-success-500/10 text-success-700 dark:text-success-400 rounded-lg">
                <Smartphone className="w-5 h-5" />
                <span className="text-sm font-medium">앱이 이미 설치되어 있습니다</span>
              </div>
            ) : canInstallPWA ? (
              <>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Moonwave MCA를 홈 화면에 추가하여 네이티브 앱처럼 사용할 수 있습니다.
                </p>
                <Button
                  color="primary"
                  leftIcon={<Download className="w-4 h-4" />}
                  onClick={handleInstallPWA}
                >
                  앱 설치하기
                </Button>
              </>
            ) : (
              <div className="text-sm text-zinc-500 dark:text-zinc-400">
                <p className="mb-2">
                  브라우저 메뉴에서 "홈 화면에 추가"를 선택하여 앱을 설치할 수 있습니다.
                </p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>Chrome: 메뉴 → 앱 설치</li>
                  <li>Safari: 공유 → 홈 화면에 추가</li>
                  <li>Samsung: 메뉴 → 페이지를 다음으로 추가 → 홈 화면</li>
                </ul>
              </div>
            )}
          </div>
        </Card>
      </Section>

      {/* App Info */}
      <Section title="앱 정보" icon={<Info className="w-5 h-5" />}>
        <Card>
          <StatGrid columns={3} divided>
            <StatItem label="버전" value="3.1.0" />
            <StatItem label="개발자" value="Moonwave" />
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">저장소</span>
              <p className="font-semibold text-right">
                <a
                  href="https://github.com/hersouls/moonwave-mca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  GitHub
                </a>
              </p>
            </div>
          </StatGrid>
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

// Notification Toggle Component
interface NotificationToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}

function NotificationToggle({ icon, label, description, enabled, onChange }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 text-zinc-500 dark:text-zinc-400">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
          enabled ? 'bg-primary-500' : 'bg-zinc-300 dark:bg-zinc-600'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
