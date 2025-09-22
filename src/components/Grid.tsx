import React, { memo, useCallback, useState } from 'react';
import { CellState, useGrid } from '../context/GridContext';
import '../styles/Grid.css';
import Cell from './Cell';

const Grid: React.FC = () => {
  const { grid, updateCellState } = useGrid();
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<'start' | 'end' | null>(null);

  const findStartOrEndNode = useCallback((type: 'start' | 'end'): [number, number] => {
    for (let row = 0; row < grid.length; row++) {
      const gridRow = grid[row];
      if (!gridRow) continue;

      for (let col = 0; col < gridRow.length; col++) {
        const cell = gridRow[col];
        if (!cell) continue;

        if (type === 'start' && cell.isStart) return [row, col];
        if (type === 'end' && cell.isEnd) return [row, col];
      }
    }
    return [-1, -1]; // If no node is found, return an invalid position.
  }, [grid]);

  const handleMouseDown = useCallback((row: number, col: number) => {
    const gridRow = grid[row];
    if (!gridRow) return;

    const cell = gridRow[col];
    if (!cell) return;

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

    const gridRow = grid[row];
    if (!gridRow) return;

    const cell = gridRow[col];
    if (!cell) return;

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

const GridRow = memo<GridRowProps>(({ row, rowIndex: _rowIndex, onMouseDown, onMouseEnter, onMouseUp }) => {
  return (
    <div className="grid-row">
      {row.map((cell, _cellIdx) => (
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

    // Check if either cell is undefined
    if (!prevCell || !nextCell) return false;

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
