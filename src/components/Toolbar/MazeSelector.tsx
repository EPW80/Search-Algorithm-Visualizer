/**
 * Maze Selector Component
 */

import React from 'react';

interface MazeSelectorProps {
  onSelect: (mazeType: string) => void;
  disabled?: boolean;
}

export const MazeSelector: React.FC<MazeSelectorProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="dropdown">
      <button className="btn dropdown-btn" aria-label="Select maze pattern">
        Mazes & Patterns
      </button>
      <div className="dropdown-content" role="menu">
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('recursive-division')}
          disabled={disabled}
        >
          Recursive Division
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('random')}
          disabled={disabled}
        >
          Random Maze
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('spiral')}
          disabled={disabled}
        >
          Spiral Pattern
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('vertical-skew')}
          disabled={disabled}
        >
          Vertical Skew
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('horizontal-skew')}
          disabled={disabled}
        >
          Horizontal Skew
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('clear')}
          disabled={disabled}
        >
          Clear Walls
        </button>
      </div>
    </div>
  );
};
