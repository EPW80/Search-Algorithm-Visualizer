import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface CellState {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isWeight: boolean;
  isPath: boolean;
  isVisited: boolean;
}

interface GridStore {
  grid: CellState[][];
  setGrid: (grid: CellState[][]) => void;
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void;
  resetGrid: () => void;
  clearAnimations: () => void;
  clearWalls: () => void;
}

const createInitialGrid = (): CellState[][] => {
  const [rows, columns] = getGridDimensions();
  const grid: CellState[][] = [];
  for (let row = 0; row < rows; row++) {
    const currentRow: CellState[] = [];
    for (let col = 0; col < columns; col++) {
      currentRow.push(createCell(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createCell = (col: number, row: number): CellState => {
  return {
    col,
    row,
    isStart: row === 10 && col === 5,
    isEnd: row === 10 && col === 45,
    isWall: false,
    isWeight: false,
    isPath: false,
    isVisited: false,
  };
};

const getGridDimensions = (): [number, number] => {
  const columns = Math.floor(window.innerWidth / 25);
  const rows = Math.floor(window.innerHeight / 25) - 2;
  return [rows, columns];
};

export const useGridStore = create<GridStore>()(
  immer((set) => ({
    grid: createInitialGrid(),

    setGrid: (grid: CellState[][]) => {
      set({ grid });
    },

    updateCellState: (row: number, col: number, newState: Partial<CellState>) => {
      set((state) => {
        const cell = state.grid[row]?.[col];
        if (cell) {
          Object.assign(cell, newState);
        }
      });
    },

    resetGrid: () => {
      set({ grid: createInitialGrid() });
    },

    clearAnimations: () => {
      set((state) => {
        for (const row of state.grid) {
          for (const cell of row) {
            cell.isVisited = false;
            cell.isPath = false;
          }
        }
      });
    },

    clearWalls: () => {
      set((state) => {
        for (const row of state.grid) {
          for (const cell of row) {
            cell.isWall = false;
            cell.isVisited = false;
            cell.isPath = false;
          }
        }
      });
    },
  }))
);
