/**
 * Hook for managing algorithm statistics
 */

import { useState } from 'react';

export interface AlgorithmStatsData {
  algorithmName: string | null;
  nodesVisited: number;
  pathLength: number;
  executionTime: number;
  pathFound: boolean;
  isRunning: boolean;
}

export const useStats = () => {
  const [stats, setStats] = useState<AlgorithmStatsData>({
    algorithmName: null,
    nodesVisited: 0,
    pathLength: 0,
    executionTime: 0,
    pathFound: false,
    isRunning: false,
  });

  const resetStats = () => {
    setStats({
      algorithmName: null,
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
      pathFound: false,
      isRunning: false,
    });
  };

  const updateStats = (newStats: Partial<AlgorithmStatsData>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  return {
    stats,
    setStats,
    resetStats,
    updateStats,
  };
};
