/**
 * Hook for step-by-step algorithm execution with pause/resume
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
import { AlgorithmResult, CellState, Position } from '../types';

interface StepState {
  visited: Position[];
  path: Position[] | null;
  currentStep: number;
  totalSteps: number;
  phase: 'idle' | 'exploring' | 'path' | 'complete';
}

interface UseSteppedExecutionProps {
  grid: CellState[][];
  findStartNode: () => Position;
  findEndNode: () => Position;
  animationSpeed: AnimationSpeedType;
}

// Direct DOM manipulation for animations
const animateCellDOM = (
  row: number,
  col: number,
  type: 'visited' | 'path'
): void => {
  const cell = document.getElementById(`cell-${row}-${col}`);
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

const clearCellAnimationDOM = (row: number, col: number): void => {
  const cell = document.getElementById(`cell-${row}-${col}`);
  if (cell) {
    cell.classList.remove('cell-visited', 'cell-path');
  }
};

export const useSteppedExecution = ({
  grid,
  findStartNode,
  findEndNode,
  animationSpeed,
}: UseSteppedExecutionProps) => {
  const [isPaused, setIsPaused] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const [stepState, setStepState] = useState<StepState>({
    visited: [],
    path: null,
    currentStep: 0,
    totalSteps: 0,
    phase: 'idle',
  });

  const algorithmResult = useRef<AlgorithmResult | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const timeoutId = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pausedRef = useRef(false);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  // Clear all animation states
  const clearStepAnimations = useCallback(() => {
    if (algorithmResult.current) {
      for (const [row, col] of algorithmResult.current.visited) {
        clearCellAnimationDOM(row, col);
      }
      if (algorithmResult.current.pathArray) {
        for (const [row, col] of algorithmResult.current.pathArray) {
          clearCellAnimationDOM(row, col);
        }
      }
    }
  }, []);

  // Initialize step mode
  const initializeStepMode = useCallback(
    (algorithm: string): boolean => {
      cleanup();
      clearStepAnimations();

      const startNode = findStartNode();
      const endNode = findEndNode();

      let result: AlgorithmResult | null = null;

      switch (algorithm) {
        case 'BFS':
          result = BFS(grid, startNode, endNode);
          break;
        case 'DFS':
          result = DFS(grid, startNode, endNode);
          break;
        case 'GBFS':
          result = GBFS(grid, startNode, endNode);
          break;
        case 'Dijkstra':
          result = Dijkstra(grid, startNode, endNode);
          break;
        case 'A*':
          result = AStar(grid, startNode, endNode);
          break;
        default:
          console.error('Algorithm not implemented for step mode');
          return false;
      }

      if (!result || !result.visited) {
        console.error('Algorithm failed to produce results');
        return false;
      }

      algorithmResult.current = result;

      const totalSteps =
        result.visited.length + (result.pathArray?.length ?? 0);

      setStepState({
        visited: result.visited,
        path: result.pathArray,
        currentStep: 0,
        totalSteps,
        phase: 'exploring',
      });

      setIsStepping(true);
      setIsPaused(true);
      pausedRef.current = true;

      console.log('🎮 Step mode initialized:', {
        visitedCount: result.visited.length,
        pathCount: result.pathArray?.length ?? 0,
        totalSteps,
      });

      return true;
    },
    [grid, findStartNode, findEndNode, cleanup, clearStepAnimations]
  );

  // Step forward one node
  const stepForward = useCallback(() => {
    if (!isStepping || stepState.phase === 'complete') return;

    const { visited, path, currentStep } = stepState;
    const visitedLength = visited.length;
    const pathLength = path?.length ?? 0;

    if (currentStep < visitedLength) {
      // Still in exploration phase
      const node = visited[currentStep];
      if (node) {
        animateCellDOM(node[0], node[1], 'visited');
      }

      setStepState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        phase: prev.currentStep + 1 >= visitedLength ? 'path' : 'exploring',
      }));
    } else if (path && currentStep < visitedLength + pathLength) {
      // In path phase
      const pathIndex = currentStep - visitedLength;
      const node = path[pathIndex];
      if (node) {
        animateCellDOM(node[0], node[1], 'path');
      }

      setStepState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        phase:
          prev.currentStep + 1 >= visitedLength + pathLength
            ? 'complete'
            : 'path',
      }));
    } else {
      // Complete
      setStepState(prev => ({ ...prev, phase: 'complete' }));
    }
  }, [isStepping, stepState]);

  // Step backward one node
  const stepBackward = useCallback(() => {
    if (!isStepping || stepState.currentStep === 0) return;

    const { visited, path, currentStep } = stepState;
    const visitedLength = visited.length;

    const prevStep = currentStep - 1;

    if (prevStep >= visitedLength && path) {
      // Was in path phase, remove path node
      const pathIndex = prevStep - visitedLength;
      const node = path[pathIndex];
      if (node) {
        // Revert to visited state if it was visited
        animateCellDOM(node[0], node[1], 'visited');
      }
    } else if (prevStep >= 0) {
      // Was in exploration phase, remove visited node
      const node = visited[prevStep];
      if (node) {
        clearCellAnimationDOM(node[0], node[1]);
      }
    }

    setStepState(prev => ({
      ...prev,
      currentStep: prevStep,
      phase: prevStep < visitedLength ? 'exploring' : 'path',
    }));
  }, [isStepping, stepState]);

  // Play/Resume animation
  const play = useCallback(() => {
    if (!isStepping) return;

    setIsPaused(false);
    pausedRef.current = false;

    const animate = () => {
      if (pausedRef.current) return;

      setStepState(prevState => {
        if (prevState.phase === 'complete') {
          setIsPaused(true);
          pausedRef.current = true;
          return prevState;
        }

        const { visited, path, currentStep } = prevState;
        const visitedLength = visited.length;
        const pathLength = path?.length ?? 0;

        if (currentStep < visitedLength) {
          const node = visited[currentStep];
          if (node) {
            animateCellDOM(node[0], node[1], 'visited');
          }
          return {
            ...prevState,
            currentStep: prevState.currentStep + 1,
            phase:
              prevState.currentStep + 1 >= visitedLength ? 'path' : 'exploring',
          };
        } else if (path && currentStep < visitedLength + pathLength) {
          const pathIndex = currentStep - visitedLength;
          const node = path[pathIndex];
          if (node) {
            animateCellDOM(node[0], node[1], 'path');
          }
          return {
            ...prevState,
            currentStep: prevState.currentStep + 1,
            phase:
              prevState.currentStep + 1 >= visitedLength + pathLength
                ? 'complete'
                : 'path',
          };
        }

        return { ...prevState, phase: 'complete' };
      });

      // Schedule next frame based on speed
      const speed =
        animationSpeed === AnimationSpeed.INSTANT ? 0 : animationSpeed;
      if (speed === 0) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        timeoutId.current = setTimeout(() => {
          animationFrameId.current = requestAnimationFrame(animate);
        }, speed);
      }
    };

    animate();
  }, [isStepping, animationSpeed]);

  // Pause animation
  const pause = useCallback(() => {
    setIsPaused(true);
    pausedRef.current = true;
    cleanup();
  }, [cleanup]);

  // Reset step mode
  const resetStepMode = useCallback(() => {
    cleanup();
    clearStepAnimations();
    setIsStepping(false);
    setIsPaused(false);
    pausedRef.current = false;
    algorithmResult.current = null;
    setStepState({
      visited: [],
      path: null,
      currentStep: 0,
      totalSteps: 0,
      phase: 'idle',
    });
  }, [cleanup, clearStepAnimations]);

  // Jump to specific step
  const jumpToStep = useCallback(
    (targetStep: number) => {
      if (!isStepping) return;

      const { visited, path } = stepState;
      const visitedLength = visited.length;
      const pathLength = path?.length ?? 0;
      const maxStep = visitedLength + pathLength;

      const clampedTarget = Math.max(0, Math.min(targetStep, maxStep));

      // Clear all animations first
      for (let i = 0; i < visitedLength; i++) {
        const node = visited[i];
        if (node) clearCellAnimationDOM(node[0], node[1]);
      }
      if (path) {
        for (const node of path) {
          if (node) clearCellAnimationDOM(node[0], node[1]);
        }
      }

      // Apply animations up to target step
      for (let i = 0; i < Math.min(clampedTarget, visitedLength); i++) {
        const node = visited[i];
        if (node) animateCellDOM(node[0], node[1], 'visited');
      }

      if (path && clampedTarget > visitedLength) {
        const pathSteps = clampedTarget - visitedLength;
        for (let i = 0; i < pathSteps; i++) {
          const node = path[i];
          if (node) animateCellDOM(node[0], node[1], 'path');
        }
      }

      let newPhase: StepState['phase'] = 'exploring';
      if (clampedTarget >= maxStep) {
        newPhase = 'complete';
      } else if (clampedTarget >= visitedLength) {
        newPhase = 'path';
      }

      setStepState(prev => ({
        ...prev,
        currentStep: clampedTarget,
        phase: newPhase,
      }));
    },
    [isStepping, stepState]
  );

  return {
    isStepping,
    isPaused,
    stepState,
    initializeStepMode,
    stepForward,
    stepBackward,
    play,
    pause,
    resetStepMode,
    jumpToStep,
  };
};
