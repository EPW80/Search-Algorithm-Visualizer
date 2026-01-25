/**
 * Hook for running algorithm comparison mode (side-by-side)
 */

import { useCallback, useRef, useState } from 'react';
import { AStar } from '../algorithms/AStar';
import { BFS } from '../algorithms/BFS';
import { DFS } from '../algorithms/DFS';
import { Dijkstra } from '../algorithms/Dijkstra';
import { GBFS } from '../algorithms/GBFS';
import {
  AnimationSpeed,
  AnimationSpeedType,
} from '../helpers/animationHelpers';
import {
  CellState,
  ComparisonAlgorithm,
  ComparisonState,
  Position,
} from '../types';

interface UseAlgorithmComparisonProps {
  grid: CellState[][];
  findStartNode: () => Position;
  findEndNode: () => Position;
  animationSpeed: AnimationSpeedType;
}

const delay = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// DOM manipulation for comparison panels
const animateComparisonCell = (
  side: 'left' | 'right',
  row: number,
  col: number,
  type: 'visited' | 'path'
): void => {
  const cell = document.getElementById(`comparison-${side}-cell-${row}-${col}`);
  if (cell) {
    if (type === 'visited') {
      cell.classList.remove('cell-path');
      cell.classList.add('cell-visited');
    } else if (type === 'path') {
      cell.classList.remove('cell-visited');
      cell.classList.add('cell-path');
    }
  }
};

const clearComparisonCell = (
  side: 'left' | 'right',
  row: number,
  col: number
): void => {
  const cell = document.getElementById(`comparison-${side}-cell-${row}-${col}`);
  if (cell) {
    cell.classList.remove('cell-visited', 'cell-path');
  }
};

export const useAlgorithmComparison = ({
  grid,
  findStartNode,
  findEndNode,
  animationSpeed,
}: UseAlgorithmComparisonProps) => {
  const [comparisonState, setComparisonState] = useState<ComparisonState>({
    isActive: false,
    algorithms: ['BFS', 'DFS'],
    results: [null, null],
  });
  const [isComparing, setIsComparing] = useState(false);
  const abortRef = useRef(false);

  const executeAlgorithm = useCallback(
    (
      algorithm: string,
      start: Position,
      end: Position
    ): ComparisonAlgorithm | null => {
      const startTime = performance.now();

      let result;
      switch (algorithm) {
        case 'BFS':
          result = BFS(grid, start, end);
          break;
        case 'DFS':
          result = DFS(grid, start, end);
          break;
        case 'GBFS':
          result = GBFS(grid, start, end);
          break;
        case 'Dijkstra':
          result = Dijkstra(grid, start, end);
          break;
        case 'A*':
          result = AStar(grid, start, end);
          break;
        default:
          return null;
      }

      const executionTime = performance.now() - startTime;

      if (!result || !result.visited) return null;

      return {
        name: algorithm,
        visited: result.visited,
        path: result.pathArray,
        nodesVisited: result.visited.length,
        pathLength: result.pathArray?.length ?? 0,
        executionTime,
        pathFound: result.pathArray !== null,
      };
    },
    [grid]
  );

  const startComparison = useCallback(async () => {
    const [algo1, algo2] = comparisonState.algorithms;
    if (!algo1 || !algo2) return;

    setIsComparing(true);
    abortRef.current = false;

    const startNode = findStartNode();
    const endNode = findEndNode();

    // Execute both algorithms
    const result1 = executeAlgorithm(algo1, startNode, endNode);
    const result2 = executeAlgorithm(algo2, startNode, endNode);

    if (!result1 || !result2) {
      console.error('Failed to execute comparison algorithms');
      setIsComparing(false);
      return;
    }

    setComparisonState(prev => ({
      ...prev,
      results: [result1, result2],
    }));

    console.log('📊 Comparison started:', {
      left: {
        algorithm: algo1,
        visited: result1.nodesVisited,
        path: result1.pathLength,
      },
      right: {
        algorithm: algo2,
        visited: result2.nodesVisited,
        path: result2.pathLength,
      },
    });

    // Animate both panels simultaneously
    const maxVisited = Math.max(result1.visited.length, result2.visited.length);
    const speed =
      animationSpeed === AnimationSpeed.INSTANT ? 0 : animationSpeed;

    // Animate visited nodes
    for (let i = 0; i < maxVisited; i++) {
      if (abortRef.current) break;

      const node1 = result1.visited[i];
      const node2 = result2.visited[i];

      if (node1) animateComparisonCell('left', node1[0], node1[1], 'visited');
      if (node2) animateComparisonCell('right', node2[0], node2[1], 'visited');

      if (speed > 0) await delay(speed);
    }

    if (!abortRef.current) {
      // Small pause before showing paths
      if (speed > 0) await delay(speed * 3);

      // Animate paths
      const maxPath = Math.max(
        result1.path?.length ?? 0,
        result2.path?.length ?? 0
      );
      for (let i = 0; i < maxPath; i++) {
        if (abortRef.current) break;

        const node1 = result1.path?.[i];
        const node2 = result2.path?.[i];

        if (node1) animateComparisonCell('left', node1[0], node1[1], 'path');
        if (node2) animateComparisonCell('right', node2[0], node2[1], 'path');

        if (speed > 0) await delay(speed * 2);
      }
    }

    setIsComparing(false);
    console.log('✅ Comparison complete');
  }, [
    comparisonState.algorithms,
    findStartNode,
    findEndNode,
    executeAlgorithm,
    animationSpeed,
  ]);

  const clearComparisonAnimations = useCallback(() => {
    for (const side of ['left', 'right'] as const) {
      for (let row = 0; row < grid.length; row++) {
        const gridRow = grid[row];
        if (!gridRow) continue;
        for (let col = 0; col < gridRow.length; col++) {
          clearComparisonCell(side, row, col);
        }
      }
    }
  }, [grid]);

  const activateComparisonMode = useCallback(() => {
    setComparisonState(prev => ({
      ...prev,
      isActive: true,
      results: [null, null],
    }));
  }, []);

  const deactivateComparisonMode = useCallback(() => {
    abortRef.current = true;
    clearComparisonAnimations();
    setComparisonState({
      isActive: false,
      algorithms: ['BFS', 'DFS'],
      results: [null, null],
    });
    setIsComparing(false);
  }, [clearComparisonAnimations]);

  const setComparisonAlgorithms = useCallback(
    (algorithms: [string, string]) => {
      setComparisonState(prev => ({
        ...prev,
        algorithms,
        results: [null, null],
      }));
    },
    []
  );

  const stopComparison = useCallback(() => {
    abortRef.current = true;
    setIsComparing(false);
  }, []);

  return {
    comparisonState,
    isComparing,
    activateComparisonMode,
    deactivateComparisonMode,
    setComparisonAlgorithms,
    startComparison,
    stopComparison,
    clearComparisonAnimations,
  };
};
