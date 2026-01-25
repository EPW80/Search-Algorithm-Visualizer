/**
 * Hook for executing pathfinding algorithms
 */

import { useState } from 'react';
import { AStar } from '../algorithms/AStar';
import { BFS } from '../algorithms/BFS';
import { DFS } from '../algorithms/DFS';
import { Dijkstra } from '../algorithms/Dijkstra';
import { GBFS } from '../algorithms/GBFS';
import {
  AnimationSpeedType,
  animateAlgorithm,
  resetGridAnimations,
} from '../helpers/animationHelpers';
import { AlgorithmResult, CellState, Position } from '../types';
import { AlgorithmStatsData } from './useStats';

interface UseAlgorithmExecutionProps {
  grid: CellState[][];
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void;
  findStartNode: () => Position;
  findEndNode: () => Position;
  animationSpeed: AnimationSpeedType;
  setStats: (stats: AlgorithmStatsData) => void;
}

export const useAlgorithmExecution = ({
  grid,
  updateCellState,
  findStartNode,
  findEndNode,
  animationSpeed,
  setStats,
}: UseAlgorithmExecutionProps) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const executeAlgorithm = async (selectedAlgorithm: string) => {
    if (!selectedAlgorithm || isAnimating) {
      if (isAnimating) {
        console.warn('Animation already in progress.');
      } else {
        console.warn('No algorithm selected.');
      }
      return;
    }

    setIsAnimating(true);

    // Update stats to show running state
    setStats({
      algorithmName: selectedAlgorithm,
      nodesVisited: 0,
      pathLength: 0,
      executionTime: 0,
      pathFound: false,
      isRunning: true,
    });

    console.log(
      `🚀 Executing algorithm: ${selectedAlgorithm} at speed: ${
        animationSpeed === 0 ? 'INSTANT' : `${animationSpeed}ms`
      }`
    );

    const startTime = performance.now();
    const startNode = findStartNode();
    const endNode = findEndNode();

    console.log('🎯 Algorithm execution setup:', {
      algorithm: selectedAlgorithm,
      startNode,
      endNode,
      startCell: grid[startNode[0]]?.[startNode[1]],
      endCell: grid[endNode[0]]?.[endNode[1]],
      gridSize: `${grid.length}x${grid[0]?.length || 0}`,
      startEqualsEnd: startNode[0] === endNode[0] && startNode[1] === endNode[1],
    });

    // Validate that start and end positions are within bounds and not walls
    const startCell = grid[startNode[0]]?.[startNode[1]];
    const endCell = grid[endNode[0]]?.[endNode[1]];

    if (!startCell || !endCell) {
      console.error('❌ Invalid start or end position - outside grid bounds');
      setIsAnimating(false);
      return;
    }

    if (startCell.isWall || endCell.isWall) {
      console.warn('⚠️ Start or end position is on a wall');
      // Clear walls from start/end positions
      if (startCell.isWall) {
        updateCellState(startNode[0], startNode[1], { isWall: false });
      }
      if (endCell.isWall) {
        updateCellState(endNode[0], endNode[1], { isWall: false });
      }
    }

    let algorithmResult: AlgorithmResult | null = null;

    try {
      // Clear any previous animations first
      resetGridAnimations(grid, updateCellState);

      switch (selectedAlgorithm) {
        case 'BFS':
          algorithmResult = BFS(grid, startNode, endNode);
          break;
        case 'DFS':
          algorithmResult = DFS(grid, startNode, endNode);
          break;
        case 'GBFS':
          algorithmResult = GBFS(grid, startNode, endNode);
          break;
        case 'Dijkstra':
          algorithmResult = Dijkstra(grid, startNode, endNode);
          break;
        case 'A*':
          algorithmResult = AStar(grid, startNode, endNode);
          break;
        default:
          console.error('Algorithm not implemented.');
          setIsAnimating(false);
          return;
      }

      if (algorithmResult && algorithmResult.visited) {
        const executionTime = performance.now() - startTime;
        const pathFound = algorithmResult.pathArray !== null;
        const pathLength = pathFound && algorithmResult.pathArray ? algorithmResult.pathArray.length : 0;

        console.log('📊 Algorithm result:', {
          visitedCount: algorithmResult.visited.length,
          pathCount: pathLength,
          pathFound,
          executionTime: `${executionTime.toFixed(2)}ms`,
        });

        // Animate the algorithm execution
        await animateAlgorithm(
          algorithmResult.visited,
          algorithmResult.pathArray || [], // Use empty array if no path found
          updateCellState,
          animationSpeed
        );

        // Update statistics with final results
        setStats({
          algorithmName: selectedAlgorithm,
          nodesVisited: algorithmResult.visited.length,
          pathLength,
          executionTime,
          pathFound,
          isRunning: false,
        });

        // Log result status
        if (algorithmResult.pathArray === null) {
          console.info('🚫 No path found - target may be unreachable');
        } else if (algorithmResult.pathArray.length === 0) {
          console.info('🎯 Already at target - no movement needed');
        } else {
          console.info('✅ Path found successfully');
        }
      } else {
        console.warn('⚠️ Algorithm result missing data:', {
          hasResult: !!algorithmResult,
          hasVisited: !!(algorithmResult && algorithmResult.visited),
          hasPath: !!(algorithmResult && algorithmResult.pathArray),
        });

        // Update stats to show failure
        setStats({
          algorithmName: selectedAlgorithm,
          nodesVisited: 0,
          pathLength: 0,
          executionTime: performance.now() - startTime,
          pathFound: false,
          isRunning: false,
        });
      }
    } catch (error) {
      console.error('Error executing algorithm:', error);
      setStats({
        algorithmName: selectedAlgorithm,
        nodesVisited: 0,
        pathLength: 0,
        executionTime: performance.now() - startTime,
        pathFound: false,
        isRunning: false,
      });
    } finally {
      setIsAnimating(false);
    }
  };

  return {
    isAnimating,
    executeAlgorithm,
  };
};
