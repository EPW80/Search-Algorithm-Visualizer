/**
 * Hook for managing undo/redo functionality for wall placement
 */

import { useCallback, useRef, useState } from 'react';
import { CellState } from '../store/gridStore';

interface WallChange {
  row: number;
  col: number;
  wasWall: boolean;
}

interface UndoRedoState {
  past: WallChange[][];
  future: WallChange[][];
}

const MAX_HISTORY_SIZE = 50;

export const useUndoRedo = (
  updateCellState: (
    row: number,
    col: number,
    newState: Partial<CellState>
  ) => void
) => {
  const [history, setHistory] = useState<UndoRedoState>({
    past: [],
    future: [],
  });

  // Track current batch of changes (for drag operations)
  const currentBatch = useRef<WallChange[]>([]);
  const isDragging = useRef(false);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Start tracking a new batch of changes
  const startBatch = useCallback(() => {
    isDragging.current = true;
    currentBatch.current = [];
  }, []);

  // Add a change to the current batch
  const recordChange = useCallback(
    (row: number, col: number, wasWall: boolean) => {
      // Don't record if this cell is already in the current batch
      const exists = currentBatch.current.some(
        change => change.row === row && change.col === col
      );

      if (!exists) {
        currentBatch.current.push({ row, col, wasWall });
      }
    },
    []
  );

  // End the current batch and add to history
  const endBatch = useCallback(() => {
    if (currentBatch.current.length > 0) {
      setHistory(prev => ({
        past: [...prev.past.slice(-MAX_HISTORY_SIZE + 1), currentBatch.current],
        future: [], // Clear redo stack on new action
      }));
    }
    isDragging.current = false;
    currentBatch.current = [];
  }, []);

  // Record a single change (for click operations)
  const recordSingleChange = useCallback(
    (row: number, col: number, wasWall: boolean) => {
      const change: WallChange[] = [{ row, col, wasWall }];
      setHistory(prev => ({
        past: [...prev.past.slice(-MAX_HISTORY_SIZE + 1), change],
        future: [], // Clear redo stack on new action
      }));
    },
    []
  );

  // Undo the last action
  const undo = useCallback(() => {
    if (history.past.length === 0) return;

    const lastBatch = history.past[history.past.length - 1];
    if (!lastBatch) return;

    // Revert the changes
    const redoBatch: WallChange[] = [];
    for (const change of lastBatch) {
      // Record current state for redo
      redoBatch.push({
        row: change.row,
        col: change.col,
        wasWall: !change.wasWall,
      });
      // Revert to previous state
      updateCellState(change.row, change.col, { isWall: change.wasWall });
    }

    setHistory(prev => ({
      past: prev.past.slice(0, -1),
      future: [redoBatch, ...prev.future].slice(0, MAX_HISTORY_SIZE),
    }));

    console.log('↩️ Undo:', lastBatch.length, 'changes reverted');
  }, [history.past, updateCellState]);

  // Redo the last undone action
  const redo = useCallback(() => {
    if (history.future.length === 0) return;

    const nextBatch = history.future[0];
    if (!nextBatch) return;

    // Apply the changes
    const undoBatch: WallChange[] = [];
    for (const change of nextBatch) {
      // Record current state for undo
      undoBatch.push({
        row: change.row,
        col: change.col,
        wasWall: !change.wasWall,
      });
      // Apply the redo state
      updateCellState(change.row, change.col, { isWall: change.wasWall });
    }

    setHistory(prev => ({
      past: [...prev.past, undoBatch].slice(-MAX_HISTORY_SIZE),
      future: prev.future.slice(1),
    }));

    console.log('↪️ Redo:', nextBatch.length, 'changes reapplied');
  }, [history.future, updateCellState]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory({ past: [], future: [] });
    currentBatch.current = [];
    isDragging.current = false;
  }, []);

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    startBatch,
    recordChange,
    endBatch,
    recordSingleChange,
    clearHistory,
  };
};
