/**
 * Algorithm Type Definitions
 */

import { CellState, Position } from './grid.types';

export interface AlgorithmResult {
  newGrid: CellState[][];
  gridWithPath: CellState[][];
  visited: Position[];
  pathArray: Position[] | null;
}

export type AlgorithmType =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'gbfs';

export type AlgorithmName =
  | 'Breadth-First Search'
  | 'Depth-First Search'
  | 'Dijkstra\'s Algorithm'
  | 'A* Search'
  | 'Greedy Best-First Search';

export interface AlgorithmStats {
  name: AlgorithmName;
  nodesVisited: number;
  pathLength: number;
  executionTime: number;
  pathFound: boolean;
}

export type PathMap = Map<string, Position>;
export type PathObject = { [key: string]: Position | null };
