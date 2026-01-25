/**
 * Comparison Mode Type Definitions
 */

export interface ComparisonAlgorithm {
  name: string;
  visited: [number, number][];
  path: [number, number][] | null;
  nodesVisited: number;
  pathLength: number;
  executionTime: number;
  pathFound: boolean;
}

export interface ComparisonState {
  isActive: boolean;
  algorithms: [string, string];
  results: [ComparisonAlgorithm | null, ComparisonAlgorithm | null];
}

export type ComparisonPanelSide = 'left' | 'right';
