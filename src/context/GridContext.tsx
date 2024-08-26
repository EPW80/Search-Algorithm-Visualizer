import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the CellState and GridContextState
export interface CellState {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isWeight: boolean;
}

interface GridContextState {
  grid: CellState[][];
  setGrid: React.Dispatch<React.SetStateAction<CellState[][]>>;
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void;
  resetGrid: () => void;
}

interface GridProviderProps {
  children: ReactNode; // Correctly define the type for children prop
}

// Create the context with a default value
const GridContext = createContext<GridContextState | undefined>(undefined);

// Create a provider component
export const GridProvider: React.FC<GridProviderProps> = ({ children }) => {
  const [grid, setGrid] = useState<CellState[][]>(createInitialGrid());

  const updateCellState = (row: number, col: number, newState: Partial<CellState>) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.slice();
      newGrid[row][col] = { ...newGrid[row][col], ...newState };
      return newGrid;
    });
  };

  const resetGrid = () => {
    setGrid(createInitialGrid());
  };

  return (
    <GridContext.Provider value={{ grid, setGrid, updateCellState, resetGrid }}>
      {children}
    </GridContext.Provider>
  );
};

// Custom hook for consuming the grid context
export const useGrid = (): GridContextState => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};

// Reuse your existing functions for creating the grid
const createInitialGrid = (): CellState[][] => {
  const [rows, columns] = getGridDimensions();
  const grid = [];
  for (let row = 0; row < rows; row++) {
    const currentRow = [];
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
  };
};

const getGridDimensions = (): [number, number] => {
  const columns = Math.floor(window.innerWidth / 25);
  const rows = Math.floor(window.innerHeight / 25) - 2;
  return [rows, columns];
};
