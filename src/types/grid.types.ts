/**
 * Grid and Cell Type Definitions
 */

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

export type Position = [number, number];

export type GridDimensions = {
  rows: number;
  cols: number;
};

export interface GridContextState {
  grid: CellState[][];
  setGrid: React.Dispatch<React.SetStateAction<CellState[][]>>;
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void;
  resetGrid: () => void;
}
