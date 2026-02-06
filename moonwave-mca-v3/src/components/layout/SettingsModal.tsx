// ============================================
// Settings Modal Component
// ============================================

import { clsx } from 'clsx';
import {
  AlertTriangle,
  Bell,
  Download,
  Monitor,
  Moon,
  Navigation,
  RefreshCw,
  Star,
  Sun,
  Upload,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  ConfirmDialog,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/Dialog';
import { NumericInput } from '@/components/ui/Input';
import {
  createBackup,
  downloadBackup,
  parseBackupFile,
  restoreFromBackup,
  validateBackup,
} from '@/services/backup';
import { usePortfolioStore } from '@/stores/portfolioStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUIStore } from '@/stores/uiStore';
import type { BackupValidationResult, ColorPalette, ThemeMode } from '@/types';
import { COLOR_PALETTES, STORAGE_KEYS } from '@/utils/constants';
import { formatNumber } from '@/utils/format';

const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: '라이트', icon: <Sun className="w-4 h-4" /> },
  { value: 'dark', label: '다크', icon: <Moon className="w-4 h-4" /> },
  { value: 'system', label: '시스템', icon: <Monitor className="w-4 h-4" /> },
];

function formatBackupDate(date: Date | undefined): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SettingsModal() {
  const isOpen = useUIStore((state) => state.isSettingsModalOpen);
  const closeModal = useUIStore((state) => state.closeSettingsModal);
  const showToast = useUIStore((state) => state.showToast);

  const settings = useSettingsStore((state) => state.settings);
  const setTheme = useSettingsStore((state) => state.setTheme);
  const setColorPalette = useSettingsStore((state) => state.setColorPalette);
  const setInitialCash = useSettingsStore((state) => state.setInitialCash);
  const setLastBackupDate = useSettingsStore((state) => state.setLastBackupDate);
  const toggleNotificationPreference = useSettingsStore(
    (state) => state.toggleNotificationPreference
  );

  const initializePortfolios = usePortfolioStore((state) => state.initialize);
  const initializeSettings = useSettingsStore((state) => state.initialize);
  const startTour = useUIStore((state) => state.startTour);

  // Local state for form
  const [localTheme, setLocalTheme] = useState<ThemeMode>(settings.theme);
  const [localInitialCash, setLocalInitialCash] = useState(settings.initialCash.toString());

  // Backup/restore state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [pendingRestore, setPendingRestore] = useState<{
    file: File;
    validation: BackupValidationResult;
  } | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalTheme(settings.theme);
      setLocalInitialCash(formatNumber(settings.initialCash));
      setRestoreError(null);
    }
  }, [isOpen, settings.theme, settings.initialCash]);

  // Backup handler
  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      const backup = await createBackup();
      downloadBackup(backup);
      await setLastBackupDate(new Date());
      showToast('백업 파일이 다운로드되었습니다.', 'success');
    } catch (error) {
      showToast('백업 생성에 실패했습니다.', 'error');
      console.error('Backup failed:', error);
    } finally {
      setIsBackingUp(false);
    }
  };

  // File selection handler
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input
    e.target.value = '';

    setRestoreError(null);

    // Parse file
    const result = await parseBackupFile(file);
    if (!result.success || !result.data) {
      setRestoreError(result.error || '파일을 읽을 수 없습니다.');
      return;
    }

    // Validate
    const validation = validateBackup(result.data);
    if (!validation.valid) {
      setRestoreError(validation.errors.join('\n'));
      return;
    }

    // Store for confirmation
    setPendingRestore({ file, validation });
    setShowRestoreConfirm(true);
  };

  // Restore confirmation handler
  const handleRestoreConfirm = async () => {
    if (!pendingRestore) return;

    setShowRestoreConfirm(false);
    setIsRestoring(true);

    try {
      const parseResult = await parseBackupFile(pendingRestore.file);
      if (!parseResult.success || !parseResult.data) {
        throw new Error('파일을 읽을 수 없습니다.');
      }

      const result = await restoreFromBackup(parseResult.data);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Refresh application state
      await initializePortfolios();
      await initializeSettings();

      showToast('데이터가 복원되었습니다.', 'success');
      closeModal();
    } catch (error) {
      setRestoreError(error instanceof Error ? error.message : '복원에 실패했습니다.');
      showToast('데이터 복원에 실패했습니다.', 'error');
    } finally {
      setIsRestoring(false);
      setPendingRestore(null);
    }
  };

  const handleSave = async () => {
    // Parse initial cash (remove commas, handle empty)
    const parsedCash = Number.parseInt(localInitialCash.replace(/,/g, ''), 10) || 0;
    const validCash = Math.max(0, parsedCash);

    // Update settings
    setTheme(localTheme);
    await setInitialCash(validCash);

    closeModal();
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} size="md">
        <DialogHeader title="설정" onClose={handleClose} />
        <DialogBody>
          <div className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                테마
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLocalTheme(option.value)}
                    className={clsx(
                      'flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all',
                      localTheme === option.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-400'
                        : 'border-border text-muted-foreground hover:border-foreground/20'
                    )}
                  >
                    {option.icon}
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Palette Selection - Light Mode Only */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                컬러 팔레트
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  (라이트 모드 전용)
                </span>
              </label>
              <div className="grid grid-cols-5 gap-2">
                {Object.values(COLOR_PALETTES).map((palette) => (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setColorPalette(palette.id as ColorPalette)}
                    className={clsx(
                      'flex flex-col items-center p-2 rounded-lg border-2 transition-all',
                      settings.colorPalette === palette.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                        : 'border-border hover:border-foreground/20'
                    )}
                  >
                    {/* Color swatches preview */}
                    <div className="flex gap-0.5 mb-1.5">
                      <div
                        className="w-4 h-4 rounded-full border border-foreground/10 shadow-sm"
                        style={{ backgroundColor: palette.colors.primary }}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-foreground/10 shadow-sm"
                        style={{ backgroundColor: palette.colors.secondary }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {palette.nameKo}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                라이트 모드에서 앱의 강조색을 변경합니다.
              </p>
            </div>

            {/* Initial Cash */}
            <div>
              <NumericInput
                label="초기 투자금"
                value={localInitialCash}
                onChange={(value) => setLocalInitialCash(String(value))}
                unit="원"
                placeholder="0"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                수익률 계산에 사용되는 기준 금액입니다.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Additional Settings */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                추가 기능
              </label>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium text-foreground">
                    음악 플레이어
                  </div>
                  <div className="text-xs text-muted-foreground">
                    푸터에 배경음악 플레이어를 표시합니다.
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.isMusicPlayerEnabled}
                  onClick={() => useSettingsStore.getState().toggleMusicPlayer()}
                  className={clsx(
                    'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                    settings.isMusicPlayerEnabled
                      ? 'bg-primary-500'
                      : 'bg-surface-active'
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      settings.isMusicPlayerEnabled ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </button>
              </div>

              {/* Onboarding Tour Restart */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card mt-2">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 text-muted-foreground">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      온보딩 투어
                    </p>
                    <p className="text-xs text-muted-foreground">
                      처음 방문 시 표시되는 기능 안내
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
                    closeModal();
                    setTimeout(() => startTour(), 300);
                  }}
                  className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1.5 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  다시 보기
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Notification Settings */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  알림 설정
                </div>
              </label>
              <div className="space-y-2">
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

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Data Management Section */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-3">
                데이터 관리
              </label>

              {/* Last backup info */}
              {settings.lastBackupDate && (
                <p className="text-xs text-muted-foreground mb-3">
                  마지막 백업: {formatBackupDate(settings.lastBackupDate)}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Backup Button */}
                <Button
                  color="secondary"
                  outline
                  onClick={handleBackup}
                  disabled={isBackingUp}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isBackingUp ? '백업 중...' : '백업 다운로드'}
                </Button>

                {/* Restore Button */}
                <Button
                  color="secondary"
                  outline
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isRestoring}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isRestoring ? '복원 중...' : '백업 복원'}
                </Button>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Error message */}
              {restoreError && (
                <div className="mt-3 p-3 bg-danger-50 dark:bg-danger-900/20 rounded-lg border border-danger-200 dark:border-danger-800">
                  <div className="flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-danger-700 dark:text-danger-300 whitespace-pre-line">
                      {restoreError}
                    </p>
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs text-muted-foreground">
                모든 포트폴리오와 설정을 JSON 파일로 백업하거나 복원할 수 있습니다.
              </p>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button plain color="secondary" onClick={handleClose}>
            취소
          </Button>
          <Button color="primary" onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <ConfirmDialog
        open={showRestoreConfirm}
        onClose={() => {
          setShowRestoreConfirm(false);
          setPendingRestore(null);
        }}
        onConfirm={handleRestoreConfirm}
        title="데이터 복원"
        description={
          pendingRestore?.validation.metadata
            ? `백업 파일을 복원하시겠습니까?\n\n` +
              `버전: ${pendingRestore.validation.metadata.version}\n` +
              `백업일: ${pendingRestore.validation.metadata.exportDate.slice(0, 10)}\n` +
              `포트폴리오: ${pendingRestore.validation.metadata.portfolioCount}개\n` +
              `거래: ${pendingRestore.validation.metadata.tradeCount}건\n\n` +
              `주의: 현재 데이터는 모두 삭제됩니다.`
            : '백업 파일을 복원하시겠습니까?\n현재 데이터는 모두 삭제됩니다.'
        }
        confirmText="복원"
        cancelText="취소"
        variant="danger"
      />
    </>
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

function NotificationToggle({
  icon,
  label,
  description,
  enabled,
  onChange,
}: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 text-muted-foreground">{icon}</div>
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onChange}
        className={clsx(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          enabled ? 'bg-primary-500' : 'bg-surface-active'
        )}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={clsx(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
}
