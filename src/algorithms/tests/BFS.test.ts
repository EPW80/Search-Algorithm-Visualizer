import { describe, it, expect } from 'vitest';
import { BFSAlgorithm, BFS } from '../BFS';
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
} from './testHelpers';

describe('BFSAlgorithm', () => {
  describe('Basic path finding', () => {
    it('should find a path in an empty grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
      expect(result.pathArray).not.toBeNull();
    });

    it('should visit nodes in BFS order (level by level)', () => {
      const { grid, start, end } = createSimpleGrid(3, 3, [0, 0], [2, 2]);
      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // BFS should explore all neighbors at current level before moving deeper
      expect(result.visited.length).toBeGreaterThanOrEqual(5);
    });

    it('should find shortest path (BFS guarantees shortest path)', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [0, 0], [0, 4]);
      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Shortest path from [0,0] to [0,4] is 4 steps
      expect(result.pathArray?.length).toBe(4);
    });

    it('should return path when start equals end', () => {
      const { grid, start } = createSimpleGrid(5, 5, [2, 2], [2, 2]);
      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, start);

      // Path should be empty since we're already at the destination
      expect(result.pathArray).toEqual([]);
      expect(result.visited).toContainEqual(start);
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
      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Path should not go through any walls
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });

    it('should return null path when no path exists', () => {
      const { grid, start, end } = createNoPathGrid();
      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.pathArray).toBeNull();
      expect(result.visited.length).toBeGreaterThan(0); // Should still visit accessible nodes
    });

    it('should handle grid with walls surrounding the start', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [2, 2];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Surround start with walls except one opening
      setWall(grid, 1, 2);
      setWall(grid, 2, 1);
      setWall(grid, 2, 3);
      // Leave bottom open: [3, 2]

      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should escape through the opening
      expect(includesCoord(result.visited, [3, 2])).toBe(true);
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

      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });
  });

  describe('Edge cases and validation', () => {
    it('should throw error for empty grid', () => {
      const algorithm = new BFSAlgorithm();
      const emptyGrid: any[][] = [];
      const start: [number, number] = [0, 0];
      const end: [number, number] = [1, 1];

      expect(() => algorithm.execute(emptyGrid, start, end)).toThrow('Invalid grid');
    });

    it('should throw error for start position out of bounds', () => {
      const { grid, end } = createSimpleGrid();
      const algorithm = new BFSAlgorithm();
      const invalidStart: [number, number] = [10, 10];

      expect(() => algorithm.execute(grid, invalidStart, end)).toThrow('Invalid start position');
    });

    it('should throw error for end position out of bounds', () => {
      const { grid, start } = createSimpleGrid();
      const algorithm = new BFSAlgorithm();
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

      const algorithm = new BFSAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot start on a wall');
    });

    it('should throw error for end on wall', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setWall(grid, end[0], end[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new BFSAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot end on a wall');
    });

    it('should handle 1x1 grid', () => {
      const grid = createEmptyGrid(1, 1);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 0];
      setStart(grid, 0, 0);
      setEnd(grid, 0, 0);

      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.pathArray).toEqual([]);
      expect(result.visited).toContainEqual([0, 0]);
    });

    it('should handle large grid', () => {
      const grid = createEmptyGrid(50, 50);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [49, 49];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
    });
  });

  describe('Grid state preservation', () => {
    it('should not modify original grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const originalGrid = JSON.parse(JSON.stringify(grid));
      const algorithm = new BFSAlgorithm();

      algorithm.execute(grid, start, end);

      expect(grid).toEqual(originalGrid);
    });

    it('should return new grid with visited and path cells marked', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.newGrid).toBeDefined();
      expect(result.gridWithPath).toBeDefined();
      expect(result.newGrid).not.toBe(grid); // Different reference
    });
  });

  describe('Multiple executions', () => {
    it('should handle multiple executions with same instance', () => {
      const algorithm = new BFSAlgorithm();

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
    it('should work with legacy BFS function', () => {
      const { grid, start, end } = createSimpleGrid();
      const result = BFS(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
    });

    it('should produce same results as class-based approach', () => {
      const { grid, start, end } = createSimpleGrid();

      const algorithm = new BFSAlgorithm();
      const classResult = algorithm.execute(grid, start, end);

      const functionResult = BFS(grid, start, end);

      expect(classResult.pathArray).toEqual(functionResult.pathArray);
      expect(classResult.visited).toEqual(functionResult.visited);
    });
  });

  describe('Weighted cells (BFS treats all weights equally)', () => {
    it('should ignore weights and find any path', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Add weights along the direct path
      grid[0][1].isWeight = true;
      grid[0][2].isWeight = true;
      grid[0][3].isWeight = true;

      const algorithm = new BFSAlgorithm();
      const result = algorithm.execute(grid, start, end);

      // BFS doesn't consider weights, so it should still find the shortest path
      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.pathArray?.length).toBe(4);
    });
  });
});
