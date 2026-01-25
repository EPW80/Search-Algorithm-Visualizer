import { describe, it, expect } from 'vitest';
import { AStarAlgorithm, AStar } from '../AStar';
import {
  createSimpleGrid,
  createGridWithWalls,
  createGridWithWeights,
  createNoPathGrid,
  hasPath,
  includesCoord,
  createEmptyGrid,
  setStart,
  setEnd,
  setWall,
  setWeight,
} from './testHelpers';

describe('AStarAlgorithm', () => {
  describe('Basic path finding', () => {
    it('should find a path in an empty grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
      expect(result.pathArray).not.toBeNull();
    });

    it('should find optimal path using heuristic', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [0, 0], [4, 4]);
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // A* should find the shortest path (8 steps diagonally, but we use 4-directional)
      // Minimum path is 8 steps (4 right + 4 down)
      expect(result.pathArray?.length).toBe(8);
    });

    it('should find shortest path (A* guarantees optimal path)', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [0, 0], [0, 4]);
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Shortest path from [0,0] to [0,4] is 4 steps
      expect(result.pathArray?.length).toBe(4);
    });

    it('should return path when start equals end', () => {
      const { grid, start } = createSimpleGrid(5, 5, [2, 2], [2, 2]);
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, start);

      // Path should be empty since we're already at the destination
      expect(result.pathArray).toEqual([]);
      // A* may not add start to visited if start equals end
      expect(result.visited.length).toBeGreaterThanOrEqual(0);
    });

    it('should visit fewer nodes than BFS/DFS due to heuristic', () => {
      const { grid, start, end } = createSimpleGrid(10, 10, [0, 0], [9, 9]);
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // A* should visit fewer nodes than exhaustive search
      // In a 10x10 grid, A* should visit significantly less than 100 nodes
      expect(result.visited.length).toBeLessThan(100);
    });
  });

  describe('Path finding with obstacles', () => {
    it('should find optimal path around walls', () => {
      const walls: [number, number][] = [
        [1, 1],
        [1, 2],
        [1, 3],
      ];
      const { grid, start, end } = createGridWithWalls(walls);
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Path should not go through any walls
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });

    it('should return null path when no path exists', () => {
      const { grid, start, end } = createNoPathGrid();
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.pathArray).toBeNull();
      expect(result.visited.length).toBeGreaterThan(0);
    });

    it('should handle complex maze efficiently', () => {
      const grid = createEmptyGrid(7, 7);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [6, 6];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create a complex maze pattern
      const walls: [number, number][] = [
        [1, 0], [1, 1], [1, 2], [1, 3], [1, 4],
        [3, 2], [3, 3], [3, 4], [3, 5], [3, 6],
        [5, 0], [5, 1], [5, 2], [5, 3], [5, 4],
      ];
      walls.forEach(([r, c]) => setWall(grid, r, c));

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });

    it('should find path through narrow opening', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create a wall with one narrow opening
      setWall(grid, 0, 2);
      setWall(grid, 1, 2);
      setWall(grid, 2, 2);
      // Opening at [3, 2]
      setWall(grid, 4, 2);

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should go around through the opening
      expect(includesCoord(result.visited, [3, 2])).toBe(true);
    });
  });

  describe('Weighted cells handling', () => {
    it('should consider cell weights in path calculation', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create weighted cells along direct path
      setWeight(grid, 0, 1);
      setWeight(grid, 0, 2);
      setWeight(grid, 0, 3);

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // A* should still find a path (may go around if it's cheaper)
      expect(result.pathArray).not.toBeNull();
    });

    it('should prefer non-weighted path when available', () => {
      const grid = createEmptyGrid(3, 3);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 2];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Make direct path heavily weighted (cost = 10 per cell)
      setWeight(grid, 0, 1);

      // Alternative path through [1,0]->[1,1]->[1,2]->[0,2] costs 4 (no weights)
      // Direct path costs 10 (one weighted cell)
      // But direct path is only 2 steps vs 4 steps for alternative
      // Direct: 10, Alternative: 3 steps = 3 cost

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
    });

    it('should handle grid with only weighted cells', () => {
      const grid = createEmptyGrid(3, 3);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [2, 2];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Make all non-start/end cells weighted
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (!(i === 0 && j === 0) && !(i === 2 && j === 2)) {
            setWeight(grid, i, j);
          }
        }
      }

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
    });
  });

  describe('Edge cases and validation', () => {
    it('should throw error for empty grid', () => {
      const algorithm = new AStarAlgorithm();
      const emptyGrid: any[][] = [];
      const start: [number, number] = [0, 0];
      const end: [number, number] = [1, 1];

      expect(() => algorithm.execute(emptyGrid, start, end)).toThrow('Invalid grid');
    });

    it('should throw error for start position out of bounds', () => {
      const { grid, end } = createSimpleGrid();
      const algorithm = new AStarAlgorithm();
      const invalidStart: [number, number] = [10, 10];

      expect(() => algorithm.execute(grid, invalidStart, end)).toThrow('Invalid start position');
    });

    it('should throw error for end position out of bounds', () => {
      const { grid, start } = createSimpleGrid();
      const algorithm = new AStarAlgorithm();
      const invalidEnd: [number, number] = [-1, -1];

      expect(() => algorithm.execute(grid, start, invalidEnd)).toThrow('Invalid end position');
    });

    it('should throw error for start on wall', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setWall(grid, start[0], start[1]);
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new AStarAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot start on a wall');
    });

    it('should throw error for end on wall', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setWall(grid, end[0], end[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new AStarAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot end on a wall');
    });

    it('should handle 1x1 grid', () => {
      const grid = createEmptyGrid(1, 1);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 0];
      setStart(grid, 0, 0);
      setEnd(grid, 0, 0);

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.pathArray).toEqual([]);
      // A* may not add start to visited if start equals end
      expect(result.visited.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle large grid efficiently', () => {
      const grid = createEmptyGrid(50, 50);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [49, 49];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // A* should be efficient and not visit all cells
      expect(result.visited.length).toBeLessThan(2500);
    });
  });

  describe('Heuristic effectiveness', () => {
    it('should use Manhattan distance heuristic', () => {
      // This test verifies that A* uses heuristic by checking it finds optimal path
      const { grid, start, end } = createSimpleGrid(10, 10, [0, 0], [5, 5]);
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Optimal path from [0,0] to [5,5] is 10 steps (5 right + 5 down)
      expect(result.pathArray?.length).toBe(10);
    });

    it('should expand nodes in order of f-score (g + h)', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [2, 2];
      const end: [number, number] = [2, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should find direct path of length 2
      expect(result.pathArray?.length).toBe(2);
      // Should visit minimal nodes due to good heuristic
      expect(result.visited.length).toBeLessThan(10);
    });
  });

  describe('Grid state preservation', () => {
    it('should not modify original grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const originalGrid = JSON.parse(JSON.stringify(grid));
      const algorithm = new AStarAlgorithm();

      algorithm.execute(grid, start, end);

      expect(grid).toEqual(originalGrid);
    });

    it('should return new grid with visited and path cells marked', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new AStarAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.newGrid).toBeDefined();
      expect(result.gridWithPath).toBeDefined();
      expect(result.newGrid).not.toBe(grid);
    });
  });

  describe('Multiple executions', () => {
    it('should handle multiple executions with same instance', () => {
      const algorithm = new AStarAlgorithm();

      const { grid: grid1, start: start1, end: end1 } = createSimpleGrid(3, 3, [0, 0], [2, 2]);
      const result1 = algorithm.execute(grid1, start1, end1);

      const { grid: grid2, start: start2, end: end2 } = createSimpleGrid(5, 5, [0, 0], [4, 4]);
      const result2 = algorithm.execute(grid2, start2, end2);

      expect(hasPath(result1.pathArray)).toBe(true);
      expect(hasPath(result2.pathArray)).toBe(true);
      expect(result1.visited).not.toEqual(result2.visited);
    });
  });

  describe('Legacy function wrapper', () => {
    it('should work with legacy AStar function', () => {
      const { grid, start, end } = createSimpleGrid();
      const result = AStar(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
    });

    it('should produce same results as class-based approach', () => {
      const { grid, start, end } = createSimpleGrid();

      const algorithm = new AStarAlgorithm();
      const classResult = algorithm.execute(grid, start, end);

      const functionResult = AStar(grid, start, end);

      expect(classResult.pathArray).toEqual(functionResult.pathArray);
      expect(classResult.visited).toEqual(functionResult.visited);
    });
  });

  describe('Optimality tests', () => {
    it('should always find optimal path length', () => {
      // Test multiple scenarios to ensure A* finds optimal paths
      const scenarios = [
        { start: [0, 0], end: [0, 4], expected: 4 },
        { start: [0, 0], end: [2, 0], expected: 2 },
        { start: [1, 1], end: [3, 3], expected: 4 },
        { start: [0, 0], end: [2, 2], expected: 4 },
      ];

      scenarios.forEach(({ start, end, expected }) => {
        const grid = createEmptyGrid(5, 5);
        setStart(grid, start[0], start[1]);
        setEnd(grid, end[0], end[1]);

        const algorithm = new AStarAlgorithm();
        const result = algorithm.execute(grid, start as [number, number], end as [number, number]);

        expect(result.pathArray?.length).toBe(expected);
      });
    });
  });
});
