// ============================================
// Backup/Restore Service
// ============================================

import type { BackupFile, BackupValidationResult, Portfolio, Settings, Trade } from '@/types';
import { BACKUP_CONFIG } from '@/utils/constants';
import { exportAllData, importData } from './database';

/**
 * Create a backup file with all application data
 */
export async function createBackup(): Promise<BackupFile> {
  const data = await exportAllData();

  return {
    version: BACKUP_CONFIG.CURRENT_VERSION,
    appName: BACKUP_CONFIG.APP_NAME,
    exportDate: new Date().toISOString(),
    data,
  };
}

/**
 * Download backup as JSON file
 */
export function downloadBackup(backup: BackupFile): void {
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10);
  const timeStr = date.toTimeString().slice(0, 5).replace(':', '');
  const filename = `${BACKUP_CONFIG.FILE_PREFIX}_${dateStr}_${timeStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate backup file before import
 */
export function validateBackup(data: unknown): BackupValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Type guard
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['유효한 JSON 파일이 아닙니다.'], warnings: [] };
  }

  const backup = data as Partial<BackupFile>;

  // Check required fields
  if (!backup.version) {
    errors.push('버전 정보가 없습니다.');
  } else if (!(BACKUP_CONFIG.SUPPORTED_VERSIONS as readonly string[]).includes(backup.version)) {
    warnings.push(`지원되지 않는 버전입니다: ${backup.version}. 호환성 문제가 발생할 수 있습니다.`);
  }

  if (!backup.data) {
    errors.push('데이터가 없습니다.');
    return { valid: false, errors, warnings };
  }

  if (!Array.isArray(backup.data.portfolios)) {
    errors.push('포트폴리오 데이터가 유효하지 않습니다.');
  }

  if (!Array.isArray(backup.data.trades)) {
    errors.push('거래 데이터가 유효하지 않습니다.');
  }

  if (!backup.data.settings || typeof backup.data.settings !== 'object') {
    warnings.push('설정 데이터가 없습니다. 기본값이 사용됩니다.');
  }

  // Validate portfolio structure (sample check)
  if (backup.data.portfolios?.length > 0) {
    const sample = backup.data.portfolios[0];
    if (!sample.name || !sample.params) {
      errors.push('포트폴리오 데이터 구조가 올바르지 않습니다.');
    }
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    warnings,
    metadata: valid
      ? {
          version: backup.version || 'unknown',
          exportDate: backup.exportDate || 'unknown',
          portfolioCount: backup.data?.portfolios?.length || 0,
          tradeCount: backup.data?.trades?.length || 0,
        }
      : undefined,
  };
}

/**
 * Read and parse backup file
 */
export function parseBackupFile(
  file: File
): Promise<{ success: boolean; data?: BackupFile; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        resolve({ success: true, data });
      } catch {
        resolve({
          success: false,
          error: '파일을 읽을 수 없습니다. 유효한 JSON 파일인지 확인하세요.',
        });
      }
    };

    reader.onerror = () => {
      resolve({ success: false, error: '파일 읽기에 실패했습니다.' });
    };

    reader.readAsText(file);
  });
}

/**
 * Restore data from backup
 */
export async function restoreFromBackup(
  backup: BackupFile
): Promise<{ success: boolean; error?: string }> {
  try {
    // Convert date strings back to Date objects
    const portfolios: Portfolio[] = backup.data.portfolios.map((p) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      fundamentalData: p.fundamentalData
        ? {
            ...p.fundamentalData,
            lastUpdated: new Date(p.fundamentalData.lastUpdated),
          }
        : undefined,
    }));

    const trades: Trade[] = backup.data.trades.map((t) => ({
      ...t,
      orderedAt: t.orderedAt ? new Date(t.orderedAt) : undefined,
      executedAt: t.executedAt ? new Date(t.executedAt) : undefined,
    }));

    const settings: Settings = {
      ...backup.data.settings,
      // Ensure colorPalette has a default value for older backups
      colorPalette: backup.data.settings.colorPalette || 'default',
      lastBackupDate: backup.data.settings.lastBackupDate
        ? new Date(backup.data.settings.lastBackupDate)
        : undefined,
    };

    await importData({ portfolios, trades, settings });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '데이터 복원에 실패했습니다.',
    };
  }
}
