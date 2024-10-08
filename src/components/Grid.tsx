import React, { useState } from 'react';
import Cell from './Cell';
import { useGrid } from '../context/GridContext'; // Ensure this import doesn't conflict
import '../styles/Grid.css';

const Grid: React.FC = () => {
  const { grid, updateCellState } = useGrid();
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState<'start' | 'end' | null>(null);

  const findStartOrEndNode = (type: 'start' | 'end'): [number, number] => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (type === 'start' && grid[row][col].isStart) return [row, col];
        if (type === 'end' && grid[row][col].isEnd) return [row, col];
      }
    }
    return [-1, -1]; // If no node is found, return an invalid position.
  };

  const handleMouseDown = (row: number, col: number) => {
    const cell = grid[row][col];

    if (cell.isStart) {
      setDraggedNodeType('start');
    } else if (cell.isEnd) {
      setDraggedNodeType('end');
    } else {
      updateCellState(row, col, { isWall: !cell.isWall });
    }
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row: number, col: number) => {
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
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setDraggedNodeType(null);
  };

  return (
    <div className="grid">
      {grid.map((row, rowIdx) => (
        <div key={rowIdx} className="grid-row">
          {row.map((cell, cellIdx) => (
            <Cell
              key={cellIdx}
              row={cell.row}
              col={cell.col}
              isStart={cell.isStart}
              isEnd={cell.isEnd}
              isWall={cell.isWall}
              onMouseDown={() => handleMouseDown(cell.row, cell.col)}
              onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
              onMouseUp={handleMouseUp}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Grid;
