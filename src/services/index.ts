/**
 * Barrel export for all service modules in the LifeReceipts application.
 * Services encapsulate business logic and data processing.
 */

// Correlation, filtering, pattern discovery, and chapter synthesis
export {
  filterAndSortReceipts,
  findConnectedReceipts,
  discoverStoryThreads,
  compileReceiptTape,
  discoverDynamicPatterns,
  synthesizeDynamicChapters,
} from './correlationEngine';
export type { ReceiptTapeBreakdown } from './correlationEngine';

// Multi-format data export
export { exportToJson, exportToCsv, exportToThermalText } from './exportService';

// Security and sanitization
export {
  hasPrototypePollution,
  sanitizeObject,
  sanitizeText,
  isSafeUrl,
  validateDatasetStructure,
} from './security';
