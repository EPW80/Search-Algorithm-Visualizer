import React from 'react';
import '../styles/Cell.css';

interface CellProps {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isPath: boolean;
  isVisited: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
}

const Cell: React.FC<CellProps> = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isPath,
  isVisited,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  const extraClassName = isStart
    ? 'cell-start'
    : isEnd
      ? 'cell-end'
      : isWall
        ? 'cell-wall'
        : isPath
          ? 'cell-path'
          : isVisited
            ? 'cell-visited'
            : '';

  return (
    <div
      id={`cell-${row}-${col}`}
      className={`cell ${extraClassName}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Cell;
