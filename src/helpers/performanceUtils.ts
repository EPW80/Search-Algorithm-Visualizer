// Performance monitoring utilities for development
export const performanceUtils = {
  // Track component render counts
  renderCounts: new Map<string, number>(),
  
  // Log render count for a component
  logRender: (componentName: string): void => {
    if (process.env.NODE_ENV === 'development') {
      const count = performanceUtils.renderCounts.get(componentName) || 0;
      performanceUtils.renderCounts.set(componentName, count + 1);
      
      // Log every 10 renders to avoid spam
      if (count % 10 === 0) {
        console.log(`🔄 ${componentName} rendered ${count + 1} times`);
      }
    }
  },
  
  // Reset render counts
  resetCounts: (): void => {
    performanceUtils.renderCounts.clear();
    console.log('🧹 Render counts reset');
  },
  
  // Get all render counts
  getAllCounts: (): Record<string, number> => {
    const counts: Record<string, number> = {};
    performanceUtils.renderCounts.forEach((count, name) => {
      counts[name] = count;
    });
    return counts;
  },
  
  // Measure execution time
  measureTime: <T>(name: string, fn: () => T): T => {
    if (process.env.NODE_ENV === 'development') {
      const start = performance.now();
      const result = fn();
      const end = performance.now();
      console.log(`⏱️ ${name} took ${(end - start).toFixed(2)}ms`);
      return result;
    }
    return fn();
  },
  
  // Start a performance mark
  startMark: (name: string): void => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-start`);
    }
  },
  
  // End a performance mark and measure
  endMark: (name: string): void => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measures = performance.getEntriesByName(name, 'measure');
      if (measures.length > 0) {
        const duration = measures[measures.length - 1].duration;
        console.log(`📊 ${name} duration: ${duration.toFixed(2)}ms`);
      }
    }
  }
};

// Hook for tracking component renders
export const useRenderCount = (componentName: string): void => {
  if (process.env.NODE_ENV === 'development') {
    performanceUtils.logRender(componentName);
  }
};

// Development helper to log performance stats
export const logPerformanceStats = (): void => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🚀 Performance Stats');
    console.table(performanceUtils.getAllCounts());
    console.groupEnd();
  }
};

// Add to window for debugging
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).performanceUtils = performanceUtils;
  (window as any).logPerformanceStats = logPerformanceStats;
}
