/**
 * Maze Generation Type Definitions
 */

import { Position } from './grid.types';

export interface MazeGeneratorResult {
  walls: Position[];
  animationOrder: Position[];
}

export type MazeType =
  | 'recursiveDivision'
  | 'randomMaze'
  | 'spiral'
  | 'verticalSkew'
  | 'horizontalSkew';

export type MazeName =
  | 'Recursive Division'
  | 'Random Maze'
  | 'Spiral Pattern'
  | 'Vertical Skew'
  | 'Horizontal Skew';
