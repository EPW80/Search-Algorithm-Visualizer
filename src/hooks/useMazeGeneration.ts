/**
 * Hook for maze generation functionality
 */

import { useState } from 'react';
import {
  MazeGenerator,
  animateMazeGeneration,
} from '../algorithms/MazeGenerator';
import {
  AnimationSpeed,
  AnimationSpeedType,
  resetGridAnimations,
} from '../helpers/animationHelpers';
import { CellState } from '../types';

interface UseMazeGenerationProps {
  grid: CellState[][];
  updateCellState: (row: number, col: number, newState: Partial<CellState>) => void;
  animationSpeed: AnimationSpeedType;
}

export const useMazeGeneration = ({
  grid,
  updateCellState,
  animationSpeed,
}: UseMazeGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateMaze = async (mazeType: string) => {
    if (isGenerating) {
      console.warn('Cannot generate maze while animation is running');
      return;
    }

    setIsGenerating(true);
    console.log(`🧱 Generating ${mazeType} maze`);

    try {
      // First clear existing walls
      resetGridAnimations(grid, updateCellState);

      // Wait a bit for the grid to clear
      await new Promise((resolve) => setTimeout(resolve, 100));

      const mazeGenerator = new MazeGenerator(grid);
      let mazeResult;

      switch (mazeType) {
        case 'recursive-division':
          mazeResult = mazeGenerator.recursiveDivision();
          break;
        case 'random':
          mazeResult = mazeGenerator.randomMaze(0.35);
          break;
        case 'spiral':
          mazeResult = mazeGenerator.spiralPattern();
          break;
        case 'vertical-skew':
          mazeResult = mazeGenerator.verticalSkew();
          break;
        case 'horizontal-skew':
          mazeResult = mazeGenerator.horizontalSkew();
          break;
        case 'clear':
          mazeResult = mazeGenerator.clearWalls();
          break;
        default:
          console.warn('Unknown maze type:', mazeType);
          return;
      }

      // Animate the maze generation
      const speed =
        animationSpeed === AnimationSpeed.SLOW
          ? 50
          : animationSpeed === AnimationSpeed.NORMAL
          ? 20
          : animationSpeed === AnimationSpeed.FAST
          ? 5
          : 0;

      if (mazeType === 'clear') {
        // For clearing, we don't need animation
        resetGridAnimations(grid, updateCellState);
      } else {
        await animateMazeGeneration(
          mazeResult.animationOrder,
          updateCellState,
          speed
        );
      }

      console.log(`✅ ${mazeType} maze generation complete`);
    } catch (error) {
      console.error('Error generating maze:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateMaze,
  };
};
