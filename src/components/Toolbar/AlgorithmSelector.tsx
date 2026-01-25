/**
 * Algorithm Selector Component
 */

import React from 'react';

interface AlgorithmSelectorProps {
  onSelect: (algorithm: string) => void;
  disabled?: boolean;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="dropdown">
      <button className="btn dropdown-btn" aria-label="Select algorithm">
        Algorithms
      </button>
      <div className="dropdown-content" role="menu">
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('BFS')}
          disabled={disabled}
        >
          Breadth First Search
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('DFS')}
          disabled={disabled}
        >
          Depth First Search
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('GBFS')}
          disabled={disabled}
        >
          Greedy Best First Search
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('Dijkstra')}
          disabled={disabled}
        >
          Dijkstra's Algorithm
        </button>
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect('A*')}
          disabled={disabled}
        >
          A* Search
        </button>
      </div>
    </div>
  );
};
