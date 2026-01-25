import React, { memo, useCallback, useState } from 'react';
import { CellState, useGridStore } from '../store/gridStore';
import Cell from './Cell';

const Grid: React.FC = () => {
  const grid = useGridStore((state) => state.grid);
  const updateCellState = useGridStore((state) => state.updateCellState);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<'start' | 'end' | null>(null);
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);

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

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!focusedCell) {
      // If no cell is focused, focus on start node
      const [startRow, startCol] = findStartOrEndNode('start');
      if (startRow !== -1 && startCol !== -1) {
        setFocusedCell([startRow, startCol]);
        const cellElement = document.getElementById(`cell-${startRow}-${startCol}`);
        cellElement?.focus();
      }
      return;
    }

    const [currentRow, currentCol] = focusedCell;
    let newRow = currentRow;
    let newCol = currentCol;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        newRow = Math.max(0, currentRow - 1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        newRow = Math.min(grid.length - 1, currentRow + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        newCol = Math.max(0, currentCol - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (grid[currentRow]) {
          newCol = Math.min(grid[currentRow].length - 1, currentCol + 1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Toggle wall on space/enter
        const cell = grid[currentRow]?.[currentCol];
        if (cell && !cell.isStart && !cell.isEnd) {
          updateCellState(currentRow, currentCol, { isWall: !cell.isWall });
        }
        break;
      default:
        return;
    }

    if (newRow !== currentRow || newCol !== currentCol) {
      setFocusedCell([newRow, newCol]);
      const cellElement = document.getElementById(`cell-${newRow}-${newCol}`);
      cellElement?.focus();
    }
  }, [focusedCell, grid, updateCellState, findStartOrEndNode]);

  return (
    <div
      role="grid"
      aria-label="Pathfinding visualization grid. Use arrow keys to navigate, Enter or Space to toggle walls"
      onKeyDown={handleKeyDown}
      className="
      grid grid-cols-[repeat(auto-fill,25px)] mx-auto max-w-full
      bg-linear-to-b from-[rgba(40,60,120,0.8)] to-[rgba(60,80,140,0.85)]
      backdrop-blur-[15px]
      border-[3px] border-blockchain-accent/90 rounded-xl
      shadow-[0_0_40px_rgba(0,255,245,0.6),0_0_80px_rgba(0,212,255,0.4),0_15px_60px_rgba(0,153,204,0.5),inset_0_2px_0_rgba(0,255,245,0.5),inset_0_0_80px_rgba(0,212,255,0.15)]
      p-3 relative overflow-hidden
      transform-[perspective(1200px)_rotateX(2deg)]
      transform-3d
      hover:border-blockchain-accent
      hover:shadow-[0_0_50px_rgba(0,255,245,0.8),0_0_100px_rgba(0,212,255,0.6),0_20px_80px_rgba(0,153,204,0.6),inset_0_2px_0_rgba(0,255,245,0.6),inset_0_0_100px_rgba(0,212,255,0.2)]
      hover:transform-[perspective(1200px)_rotateX(1deg)_scale(1.01)]
      transition-all duration-300
      before:content-[''] before:absolute before:inset-0
      before:bg-[linear-gradient(rgba(0,255,245,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,245,0.25)_1px,transparent_1px)]
      before:bg-size-[25px_25px] before:pointer-events-none before:opacity-60
      after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-0.75
      after:bg-[linear-gradient(90deg,transparent,rgba(0,255,245,0.6),transparent)]
      after:animate-[gridScan_4s_linear_infinite] after:pointer-events-none after:blur-[1px]
      md:p-3 md:border-[3px]
      max-md:p-1.5 max-md:border-2
    ">
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
    <div role="row" aria-rowindex={rowIndex + 1} className="contents">
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
