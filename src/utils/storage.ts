import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ScanLog } from '@/src/types';

const SCAN_LOGS_KEY = '@busbound_scan_logs';

export async function saveScanLog(log: ScanLog): Promise<void> {
  const logs = await getScanLogs();
  logs.unshift(log);
  const trimmed = logs.slice(0, 100);
  await AsyncStorage.setItem(SCAN_LOGS_KEY, JSON.stringify(trimmed));
}

export async function getScanLogs(): Promise<ScanLog[]> {
  const data = await AsyncStorage.getItem(SCAN_LOGS_KEY);
  if (!data) return [];
  try {
    const logs = JSON.parse(data) as ScanLog[];
    return logs.map(l => ({ ...l, timestamp: new Date(l.timestamp) }));
  } catch {
    return [];
  }
}

export async function clearScanLogs(): Promise<void> {
  await AsyncStorage.removeItem(SCAN_LOGS_KEY);
}