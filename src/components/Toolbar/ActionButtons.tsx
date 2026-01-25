/**
 * Action Buttons Component (Visualize and Reset)
 */

import React from 'react';

interface ActionButtonsProps {
  selectedAlgorithm: string | null;
  isAnimating: boolean;
  onVisualize: () => void;
  onReset: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  selectedAlgorithm,
  isAnimating,
  onVisualize,
  onReset,
}) => {
  return (
    <>
      <button
        className="btn select-algorithm-btn"
        onClick={onVisualize}
        disabled={isAnimating}
      >
        {isAnimating
          ? 'Visualizing...'
          : selectedAlgorithm
          ? `Visualize ${selectedAlgorithm}`
          : 'Select an algorithm!'}
      </button>
      <button
        className="btn reset-board-btn"
        onClick={onReset}
        disabled={isAnimating}
      >
        Reset Board
      </button>
    </>
  );
};
