/**
 * Hook for persisting grid configurations to localStorage
 */

import { useCallback, useEffect, useState } from 'react';
import { CellState } from '../store/gridStore';

interface SavedGrid {
  id: string;
  name: string;
  timestamp: number;
  grid: SerializedCell[][];
}

interface SerializedCell {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
}

const STORAGE_KEY = 'search-visualizer-saved-grids';
const MAX_SAVED_GRIDS = 10;

export const useGridPersistence = (
  grid: CellState[][],
  setGrid: (grid: CellState[][]) => void
) => {
  const [savedGrids, setSavedGrids] = useState<SavedGrid[]>([]);

  // Load saved grids from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SavedGrid[];
        setSavedGrids(parsed);
      }
    } catch (error) {
      console.error('Failed to load saved grids:', error);
    }
  }, []);

  // Serialize grid for storage (only save essential properties)
  const serializeGrid = useCallback(
    (gridToSerialize: CellState[][]): SerializedCell[][] => {
      return gridToSerialize.map(row =>
        row.map(cell => ({
          row: cell.row,
          col: cell.col,
          isStart: cell.isStart,
          isEnd: cell.isEnd,
          isWall: cell.isWall,
        }))
      );
    },
    []
  );

  // Deserialize grid from storage
  const deserializeGrid = useCallback(
    (serialized: SerializedCell[][]): CellState[][] => {
      return serialized.map(row =>
        row.map(cell => ({
          row: cell.row,
          col: cell.col,
          isStart: cell.isStart,
          isEnd: cell.isEnd,
          isWall: cell.isWall,
          isWeight: false,
          isPath: false,
          isVisited: false,
        }))
      );
    },
    []
  );

  // Save current grid to localStorage
  const saveGrid = useCallback(
    (name: string): boolean => {
      try {
        const newSave: SavedGrid = {
          id: `grid-${Date.now()}`,
          name: name || `Grid ${new Date().toLocaleString()}`,
          timestamp: Date.now(),
          grid: serializeGrid(grid),
        };

        const updatedGrids = [newSave, ...savedGrids].slice(0, MAX_SAVED_GRIDS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGrids));
        setSavedGrids(updatedGrids);

        console.log('💾 Grid saved:', name);
        return true;
      } catch (error) {
        console.error('Failed to save grid:', error);
        return false;
      }
    },
    [grid, savedGrids, serializeGrid]
  );

  // Load a saved grid
  const loadGrid = useCallback(
    (id: string): boolean => {
      const savedGrid = savedGrids.find(g => g.id === id);
      if (!savedGrid) {
        console.error('Grid not found:', id);
        return false;
      }

      try {
        const loadedGrid = deserializeGrid(savedGrid.grid);

        // Validate grid dimensions match current grid
        if (
          loadedGrid.length !== grid.length ||
          (loadedGrid[0]?.length ?? 0) !== (grid[0]?.length ?? 0)
        ) {
          console.warn('Grid dimensions mismatch. Attempting to fit...');
          // For simplicity, just use what we can
        }

        setGrid(loadedGrid);
        console.log('📂 Grid loaded:', savedGrid.name);
        return true;
      } catch (error) {
        console.error('Failed to load grid:', error);
        return false;
      }
    },
    [savedGrids, deserializeGrid, grid, setGrid]
  );

  // Delete a saved grid
  const deleteGrid = useCallback(
    (id: string): boolean => {
      try {
        const updatedGrids = savedGrids.filter(g => g.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGrids));
        setSavedGrids(updatedGrids);

        console.log('🗑️ Grid deleted:', id);
        return true;
      } catch (error) {
        console.error('Failed to delete grid:', error);
        return false;
      }
    },
    [savedGrids]
  );

  // Quick save/load for last session
  const saveLastSession = useCallback(() => {
    try {
      localStorage.setItem(
        `${STORAGE_KEY}-last-session`,
        JSON.stringify(serializeGrid(grid))
      );
    } catch (error) {
      console.error('Failed to save last session:', error);
    }
  }, [grid, serializeGrid]);

  const loadLastSession = useCallback((): boolean => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}-last-session`);
      if (stored) {
        const parsed = JSON.parse(stored) as SerializedCell[][];
        setGrid(deserializeGrid(parsed));
        console.log('📂 Last session restored');
        return true;
      }
    } catch (error) {
      console.error('Failed to load last session:', error);
    }
    return false;
  }, [setGrid, deserializeGrid]);

  // Export grid as JSON file
  const exportGrid = useCallback(
    (name: string) => {
      try {
        const exportData = {
          name,
          timestamp: Date.now(),
          grid: serializeGrid(grid),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${name.replace(/\s+/g, '-').toLowerCase()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('📤 Grid exported:', name);
      } catch (error) {
        console.error('Failed to export grid:', error);
      }
    },
    [grid, serializeGrid]
  );

  // Import grid from JSON file
  const importGrid = useCallback(
    (file: File): Promise<boolean> => {
      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.grid) {
              setGrid(deserializeGrid(data.grid));
              console.log('📥 Grid imported:', data.name);
              resolve(true);
            } else {
              console.error('Invalid grid file format');
              resolve(false);
            }
          } catch (error) {
            console.error('Failed to parse grid file:', error);
            resolve(false);
          }
        };
        reader.onerror = () => resolve(false);
        reader.readAsText(file);
      });
    },
    [setGrid, deserializeGrid]
  );

  return {
    savedGrids,
    saveGrid,
    loadGrid,
    deleteGrid,
    saveLastSession,
    loadLastSession,
    exportGrid,
    importGrid,
  };
};
