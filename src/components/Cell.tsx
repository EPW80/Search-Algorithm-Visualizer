import React, { memo } from 'react';
import '../styles/Cell.css';
// Uncomment for development performance tracking:
// import { useRenderCount } from '../helpers/performanceUtils';

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
  // Uncomment for development performance tracking:
  // useRenderCount('Cell');

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

// Memoize the Cell component with custom comparison function
const MemoizedCell = memo(Cell, (prevProps, nextProps) => {
  // Only re-render if the visual state or position has changed
  // We don't need to check event handlers as they're typically stable
  return (
    prevProps.row === nextProps.row &&
    prevProps.col === nextProps.col &&
    prevProps.isStart === nextProps.isStart &&
    prevProps.isEnd === nextProps.isEnd &&
    prevProps.isWall === nextProps.isWall &&
    prevProps.isPath === nextProps.isPath &&
    prevProps.isVisited === nextProps.isVisited
  );
});

// Set display name for debugging
MemoizedCell.displayName = 'Cell';

export default MemoizedCell;
