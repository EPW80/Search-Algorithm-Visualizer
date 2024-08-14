import React from 'react';
import '../styles/Cell.css';

interface CellProps {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
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

// If there is no import/export, you can add an empty export statement like this:
export { };
