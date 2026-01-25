import React, { memo } from 'react';
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

  // Base cell styles
  const baseStyles = `
    w-[25px] h-[25px] cursor-pointer
    flex justify-center items-center
    transition-all duration-300 relative
    backdrop-blur-sm
  `;

  // Default cell styles
  const defaultStyles = `
    ${baseStyles}
    bg-gradient-to-br from-white/12 to-sky-100/15
    border border-blockchain-accent/50
    shadow-[inset_0_0_8px_rgba(0,212,255,0.2),0_0_3px_rgba(0,255,245,0.3)]
    hover:bg-gradient-to-br hover:from-blockchain-accent/15 hover:to-blockchain-accent/25
    hover:border-blockchain-accent/60 hover:scale-110 hover:shadow-[0_0_15px_rgba(0,255,245,0.5),inset_0_0_10px_rgba(0,212,255,0.3)]
    hover:z-10
    active:scale-95 active:shadow-[0_0_10px_rgba(0,212,255,0.4),inset_0_0_15px_rgba(0,255,245,0.2)]
  `;

  // Start node - Neon Green with holographic glow
  const startStyles = `
    ${baseStyles}
    bg-gradient-to-br from-green-400 to-green-500
    border-2 border-green-300
    shadow-[0_0_25px_rgba(0,255,170,0.9),0_0_40px_rgba(0,255,136,0.6),inset_0_0_20px_rgba(255,255,255,0.3)]
    animate-pulse-slow
    hover:scale-[1.15] hover:brightness-125 hover:z-10
  `;

  // End node - Neon Pink with holographic glow
  const endStyles = `
    ${baseStyles}
    bg-gradient-to-br from-pink-500 to-rose-600
    border-2 border-pink-400
    shadow-[0_0_25px_rgba(255,51,153,0.9),0_0_40px_rgba(255,0,128,0.6),inset_0_0_20px_rgba(255,255,255,0.3)]
    animate-pulse-slow
    hover:scale-[1.15] hover:brightness-125 hover:z-10
  `;

  // Wall node - Dark with blockchain texture
  const wallStyles = `
    ${baseStyles}
    bg-gradient-to-br from-blockchain-light to-blockchain-dark
    border border-gray-600
    shadow-[inset_0_0_10px_rgba(0,0,0,0.8),0_0_5px_rgba(0,212,255,0.2)]
    scale-95
    cell-wall
  `;

  // Path node - Bright cyan holographic
  const pathStyles = `
    ${baseStyles}
    bg-gradient-to-br from-cyan-300 to-cyan-400
    border-2 border-cyan-300
    shadow-[0_0_30px_rgba(102,255,255,1),0_0_50px_rgba(0,255,245,0.6),inset_0_0_20px_rgba(255,255,255,0.4)]
    cell-path
  `;

  // Visited node - Sky blue holographic
  const visitedStyles = `
    ${baseStyles}
    bg-gradient-to-br from-sky-400 to-primary-500
    border border-sky-300
    shadow-[0_0_15px_rgba(0,238,255,0.7),0_0_25px_rgba(0,212,255,0.4),inset_0_0_12px_rgba(255,255,255,0.25)]
    cell-visited
  `;

  const cellStyles = isStart
    ? startStyles
    : isEnd
      ? endStyles
      : isWall
        ? wallStyles
        : isPath
          ? pathStyles
          : isVisited
            ? visitedStyles
            : defaultStyles;

  const getCellLabel = () => {
    if (isStart) return 'Start node';
    if (isEnd) return 'End node';
    if (isWall) return 'Wall';
    if (isPath) return 'Path';
    if (isVisited) return 'Visited';
    return 'Empty cell';
  };

  return (
    <div
      id={`cell-${row}-${col}`}
      role="gridcell"
      aria-label={`${getCellLabel()} at row ${row + 1}, column ${col + 1}`}
      aria-colindex={col + 1}
      aria-readonly={isStart || isEnd}
      tabIndex={0}
      className={cellStyles.replace(/\s+/g, ' ').trim()}
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
