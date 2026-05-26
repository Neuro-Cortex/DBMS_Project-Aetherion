/* src/utils/reportWebVitals.ts */
/* ============================================
   AETHERION HEALTH - WEB VITALS REPORTING
   Performance monitoring utility
   ============================================ */

type ReportHandler = (metric: {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
}) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onFCP(onPerfEntry);
      onINP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    }).catch((err) => {
      console.warn('Failed to load web-vitals:', err);
    });
  }
};

export { reportWebVitals };
export type { ReportHandler };