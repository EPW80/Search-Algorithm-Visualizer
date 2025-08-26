import React, { useState, useCallback, memo } from 'react';
import Cell from './Cell';
import { useGrid, CellState } from '../context/GridContext';
import '../styles/Grid.css';

const Grid: React.FC = () => {
  const { grid, updateCellState } = useGrid();
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<'start' | 'end' | null>(null);

  const findStartOrEndNode = useCallback((type: 'start' | 'end'): [number, number] => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (type === 'start' && grid[row][col].isStart) return [row, col];
        if (type === 'end' && grid[row][col].isEnd) return [row, col];
      }
    }
    return [-1, -1]; // If no node is found, return an invalid position.
  }, [grid]);

  const handleMouseDown = useCallback((row: number, col: number) => {
    const cell = grid[row][col];

    if (cell.isStart) {
      setDraggedNodeType('start');
    } else if (cell.isEnd) {
      setDraggedNodeType('end');
    } else {
      updateCellState(row, col, { isWall: !cell.isWall });
    }
    setMouseIsPressed(true);
  }, [grid, updateCellState]);

  const handleMouseEnter = useCallback((row: number, col: number) => {
    if (!mouseIsPressed) return;
    const cell = grid[row][col];

    if (draggedNodeType === 'start') {
      const [startRow, startCol] = findStartOrEndNode('start');
      if (startRow !== -1 && startCol !== -1) {
        updateCellState(row, col, { isStart: true });
        updateCellState(startRow, startCol, { isStart: false });
      }
    } else if (draggedNodeType === 'end') {
      const [endRow, endCol] = findStartOrEndNode('end');
      if (endRow !== -1 && endCol !== -1) {
        updateCellState(row, col, { isEnd: true });
        updateCellState(endRow, endCol, { isEnd: false });
      }
    } else {
      updateCellState(row, col, { isWall: !cell.isWall });
    }
  }, [mouseIsPressed, draggedNodeType, grid, updateCellState, findStartOrEndNode]);

  const handleMouseUp = useCallback(() => {
    setMouseIsPressed(false);
    setDraggedNodeType(null);
  }, []);

  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <GridRow
          key={rowIdx}
          row={row}
          rowIndex={rowIdx}
          onMouseDown={handleMouseDown}
          onMouseEnter={handleMouseEnter}
          onMouseUp={handleMouseUp}
        />
      ))}
    </div>
  );
};

// Memoized GridRow component for better performance
interface GridRowProps {
  row: CellState[];
  rowIndex: number;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const GridRow = memo<GridRowProps>(({ row, rowIndex, onMouseDown, onMouseEnter, onMouseUp }) => {
  return (
    <div className="grid-row">
      {row.map((cell, cellIdx) => (
        <Cell
          key={`${cell.row}-${cell.col}`} // More stable key
          row={cell.row}
          col={cell.col}
          isStart={cell.isStart}
          isEnd={cell.isEnd}
          isWall={cell.isWall}
          isPath={cell.isPath}
          isVisited={cell.isVisited}
          onMouseDown={onMouseDown}
          onMouseEnter={onMouseEnter}
          onMouseUp={onMouseUp}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if the row data has actually changed
  if (prevProps.row.length !== nextProps.row.length) return false;

  for (let i = 0; i < prevProps.row.length; i++) {
    const prevCell = prevProps.row[i];
    const nextCell = nextProps.row[i];

    if (
      prevCell.isStart !== nextCell.isStart ||
      prevCell.isEnd !== nextCell.isEnd ||
      prevCell.isWall !== nextCell.isWall ||
      prevCell.isPath !== nextCell.isPath ||
      prevCell.isVisited !== nextCell.isVisited
    ) {
      return false; // Row has changed, re-render
    }
  }

  return true; // No changes, skip re-render
});

GridRow.displayName = 'GridRow';

export default Grid;
