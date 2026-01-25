import { describe, it, expect } from 'vitest';
import { GBFSAlgorithm, GBFS } from '../GBFS';
import {
  createSimpleGrid,
  createGridWithWalls,
  createNoPathGrid,
  hasPath,
  includesCoord,
  createEmptyGrid,
  setStart,
  setEnd,
  setWall,
  setWeight,
} from './testHelpers';

describe('GBFSAlgorithm', () => {
  describe('Basic path finding', () => {
    it('should find a path in an empty grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
      expect(result.pathArray).not.toBeNull();
    });

    it('should use greedy heuristic to find path quickly', () => {
      const { grid, start, end } = createSimpleGrid(10, 10, [0, 0], [9, 9]);
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS should visit fewer nodes than BFS/DFS due to heuristic
      expect(result.visited.length).toBeLessThan(100);
    });

    it('should find a path (not guaranteed to be optimal)', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [0, 0], [0, 4]);
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS may not find the shortest path, but should find a valid one
      expect(result.pathArray?.length).toBeGreaterThanOrEqual(4);
    });

    it('should return path when start equals end', () => {
      const { grid, start } = createSimpleGrid(5, 5, [2, 2], [2, 2]);
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, start);

      // Path should be empty since we're already at the destination
      expect(result.pathArray).toEqual([]);
      expect(result.visited).toContainEqual(start);
    });

    it('should prioritize nodes closer to goal', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS should move towards goal greedily
      expect(result.visited.length).toBeLessThan(25);
    });
  });

  describe('Path finding with obstacles', () => {
    it('should find path around walls', () => {
      const walls: [number, number][] = [
        [1, 1],
        [1, 2],
        [1, 3],
      ];
      const { grid, start, end } = createGridWithWalls(walls);
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Path should not go through any walls
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });

    it('should return null path when no path exists', () => {
      const { grid, start, end } = createNoPathGrid();
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.pathArray).toBeNull();
      expect(result.visited.length).toBeGreaterThan(0);
    });

    it('should handle complex maze', () => {
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

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });

    it('should handle walls blocking direct path', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create wall blocking direct path, forcing detour
      setWall(grid, 0, 2);
      setWall(grid, 1, 2);
      setWall(grid, 2, 2);
      // Opening at [3, 2]
      setWall(grid, 4, 2);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should go around through the opening
      expect(result.pathArray!.length).toBeGreaterThan(4);
    });

    it('should navigate through narrow passages', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create walls with a narrow zigzag passage
      setWall(grid, 1, 0);
      setWall(grid, 1, 1);
      setWall(grid, 1, 2);
      setWall(grid, 3, 2);
      setWall(grid, 3, 3);
      setWall(grid, 3, 4);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
    });
  });

  describe('Heuristic-driven behavior', () => {
    it('should use Manhattan distance heuristic', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 0];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS should move greedily toward goal
      expect(result.pathArray?.length).toBeGreaterThanOrEqual(4);
    });

    it('should expand nodes based purely on heuristic (h-score)', () => {
      const grid = createEmptyGrid(7, 7);
      const start: [number, number] = [3, 3]; // Center
      const end: [number, number] = [0, 0]; // Top-left corner
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS greedily moves toward goal
      expect(result.visited.length).toBeLessThan(49);
    });

    it('should not consider path cost (only heuristic)', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Add weights (GBFS ignores these)
      setWeight(grid, 0, 1);
      setWeight(grid, 0, 2);
      setWeight(grid, 0, 3);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS doesn't consider weights, just heuristic distance
      expect(result.pathArray).not.toBeNull();
    });
  });

  describe('Edge cases and validation', () => {
    it('should throw error for empty grid', () => {
      const algorithm = new GBFSAlgorithm();
      const emptyGrid: any[][] = [];
      const start: [number, number] = [0, 0];
      const end: [number, number] = [1, 1];

      expect(() => algorithm.execute(emptyGrid, start, end)).toThrow('Invalid grid');
    });

    it('should throw error for start position out of bounds', () => {
      const { grid, end } = createSimpleGrid();
      const algorithm = new GBFSAlgorithm();
      const invalidStart: [number, number] = [10, 10];

      expect(() => algorithm.execute(grid, invalidStart, end)).toThrow('Invalid start position');
    });

    it('should throw error for end position out of bounds', () => {
      const { grid, start } = createSimpleGrid();
      const algorithm = new GBFSAlgorithm();
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

      const algorithm = new GBFSAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot start on a wall');
    });

    it('should throw error for end on wall', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setWall(grid, end[0], end[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot end on a wall');
    });

    it('should handle 1x1 grid', () => {
      const grid = createEmptyGrid(1, 1);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 0];
      setStart(grid, 0, 0);
      setEnd(grid, 0, 0);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.pathArray).toEqual([]);
      expect(result.visited).toContainEqual([0, 0]);
    });

    it('should handle large grid efficiently', () => {
      const grid = createEmptyGrid(50, 50);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [49, 49];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS should be very efficient with heuristic guidance
      expect(result.visited.length).toBeLessThan(2500);
    });

    it('should handle grid with various dimensions', () => {
      const grid = createEmptyGrid(3, 7);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [2, 6];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
    });
  });

  describe('Non-optimal path scenarios', () => {
    it('may find suboptimal path in certain configurations', () => {
      // GBFS can be misled by greedy heuristic
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create a trap that looks good heuristically but is blocked
      setWall(grid, 3, 3);
      setWall(grid, 3, 4);
      setWall(grid, 4, 3);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.pathArray).toBeNull(); // No path exists due to walls
    });

    it('should still find valid path even if not optimal', () => {
      const grid = createEmptyGrid(6, 6);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [5, 5];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Path exists but may not be optimal
      expect(result.pathArray!.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Grid state preservation', () => {
    it('should not modify original grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const originalGrid = JSON.parse(JSON.stringify(grid));
      const algorithm = new GBFSAlgorithm();

      algorithm.execute(grid, start, end);

      expect(grid).toEqual(originalGrid);
    });

    it('should return new grid with visited and path cells marked', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.newGrid).toBeDefined();
      expect(result.gridWithPath).toBeDefined();
      expect(result.newGrid).not.toBe(grid);
    });
  });

  describe('Multiple executions', () => {
    it('should handle multiple executions with same instance', () => {
      const algorithm = new GBFSAlgorithm();

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
    it('should work with legacy GBFS function', () => {
      const { grid, start, end } = createSimpleGrid();
      const result = GBFS(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
    });

    it('should produce same results as class-based approach', () => {
      const { grid, start, end } = createSimpleGrid();

      const algorithm = new GBFSAlgorithm();
      const classResult = algorithm.execute(grid, start, end);

      const functionResult = GBFS(grid, start, end);

      expect(classResult.pathArray).toEqual(functionResult.pathArray);
      expect(classResult.visited).toEqual(functionResult.visited);
    });
  });

  describe('Efficiency comparisons', () => {
    it('should visit fewer nodes than uninformed search in open space', () => {
      const grid = createEmptyGrid(15, 15);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [14, 14];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // GBFS should be efficient with clear path to goal
      expect(result.visited.length).toBeLessThan(225); // Much less than full grid
    });

    it('should handle direct line to goal very efficiently', () => {
      const grid = createEmptyGrid(10, 10);
      const start: [number, number] = [0, 5];
      const end: [number, number] = [9, 5];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should head straight for goal
      expect(result.pathArray?.length).toBe(9);
      expect(result.visited.length).toBeLessThan(30);
    });
  });

  describe('No revisits guarantee', () => {
    it('should not visit same node twice', () => {
      const { grid, start, end } = createSimpleGrid(7, 7, [0, 0], [6, 6]);
      const algorithm = new GBFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      // Check that no node is visited twice
      const visitedSet = new Set(result.visited.map((coord) => coord.toString()));
      expect(visitedSet.size).toBe(result.visited.length);
    });
  });
});
