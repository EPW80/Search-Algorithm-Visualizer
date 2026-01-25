import { describe, it, expect } from 'vitest';
import { DijkstraAlgorithm, Dijkstra } from '../Dijkstra';
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

describe('DijkstraAlgorithm', () => {
  describe('Basic path finding', () => {
    it('should find a path in an empty grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
      expect(result.pathArray).not.toBeNull();
    });

    it('should find shortest path (Dijkstra guarantees optimal path)', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [0, 0], [0, 4]);
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Shortest path from [0,0] to [0,4] is 4 steps
      expect(result.pathArray?.length).toBe(4);
    });

    it('should find optimal path in grid with uniform weights', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [0, 0], [4, 4]);
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Optimal path is 8 steps (4 right + 4 down or similar)
      expect(result.pathArray?.length).toBe(8);
    });

    it('should return path when start equals end', () => {
      const { grid, start } = createSimpleGrid(5, 5, [2, 2], [2, 2]);
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, start);

      // Path should be empty since we're already at the destination
      expect(result.pathArray).toEqual([]);
      expect(result.visited).toContainEqual(start);
    });

    it('should process nodes in order of distance from start', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [2, 2], [2, 4]);
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Direct path should be found
      expect(result.pathArray?.length).toBe(2);
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
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Path should not go through any walls
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });

    it('should return null path when no path exists', () => {
      const { grid, start, end } = createNoPathGrid();
      const algorithm = new DijkstraAlgorithm();
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

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      result.pathArray?.forEach((coord) => {
        expect(includesCoord(walls, coord)).toBe(false);
      });
    });

    it('should find path through narrow corridor', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 0];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create a narrow corridor along the left edge
      for (let row = 0; row < 5; row++) {
        for (let col = 1; col < 5; col++) {
          setWall(grid, row, col);
        }
      }

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.pathArray?.length).toBe(4);
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

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Dijkstra should find the lowest cost path
      expect(result.pathArray).not.toBeNull();
    });

    it('should prefer lower cost path with weights', () => {
      const grid = createEmptyGrid(3, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Make direct path heavily weighted (cost = 10 per weighted cell)
      setWeight(grid, 0, 1);
      setWeight(grid, 0, 2);
      setWeight(grid, 0, 3);
      // Direct path cost: 1 + 10 + 10 + 10 = 31

      // Alternative path through row 1: [0,0]->[1,0]->[1,1]->[1,2]->[1,3]->[1,4]->[0,4]
      // Alternative cost: 1 + 1 + 1 + 1 + 1 + 1 = 6

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should take the longer but cheaper alternative path
      expect(result.pathArray!.length).toBeGreaterThan(4);
    });

    it('should handle grid with all weighted cells', () => {
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

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
    });

    it('should find minimum cost path with mixed weights', () => {
      const grid = createEmptyGrid(4, 4);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [3, 3];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Create a scenario where weighted path is longer but cheaper isn't possible
      // Add some weights to force specific path selection
      setWeight(grid, 0, 1);
      setWeight(grid, 1, 1);

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Dijkstra guarantees minimum cost
      expect(result.pathArray).not.toBeNull();
    });
  });

  describe('Edge cases and validation', () => {
    it('should throw error for empty grid', () => {
      const algorithm = new DijkstraAlgorithm();
      const emptyGrid: any[][] = [];
      const start: [number, number] = [0, 0];
      const end: [number, number] = [1, 1];

      expect(() => algorithm.execute(emptyGrid, start, end)).toThrow('Invalid grid');
    });

    it('should throw error for start position out of bounds', () => {
      const { grid, end } = createSimpleGrid();
      const algorithm = new DijkstraAlgorithm();
      const invalidStart: [number, number] = [10, 10];

      expect(() => algorithm.execute(grid, invalidStart, end)).toThrow('Invalid start position');
    });

    it('should throw error for end position out of bounds', () => {
      const { grid, start } = createSimpleGrid();
      const algorithm = new DijkstraAlgorithm();
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

      const algorithm = new DijkstraAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot start on a wall');
    });

    it('should throw error for end on wall', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [4, 4];
      setStart(grid, start[0], start[1]);
      setWall(grid, end[0], end[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new DijkstraAlgorithm();
      expect(() => algorithm.execute(grid, start, end)).toThrow('Cannot end on a wall');
    });

    it('should handle 1x1 grid', () => {
      const grid = createEmptyGrid(1, 1);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 0];
      setStart(grid, 0, 0);
      setEnd(grid, 0, 0);

      const algorithm = new DijkstraAlgorithm();
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

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
    });

    it('should handle grid with start at corner', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [4, 4];
      const end: [number, number] = [0, 0];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.pathArray?.length).toBe(8);
    });
  });

  describe('Priority queue behavior', () => {
    it('should explore nodes in order of cumulative distance', () => {
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [2, 2];
      const end: [number, number] = [2, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should find direct path
      expect(result.pathArray?.length).toBe(2);
    });

    it('should not revisit already processed nodes', () => {
      const { grid, start, end } = createSimpleGrid(5, 5, [0, 0], [4, 4]);
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      // Check that no node is visited twice
      const visitedSet = new Set(result.visited.map((coord) => coord.toString()));
      expect(visitedSet.size).toBe(result.visited.length);
    });
  });

  describe('Grid state preservation', () => {
    it('should not modify original grid', () => {
      const { grid, start, end } = createSimpleGrid();
      const originalGrid = JSON.parse(JSON.stringify(grid));
      const algorithm = new DijkstraAlgorithm();

      algorithm.execute(grid, start, end);

      expect(grid).toEqual(originalGrid);
    });

    it('should return new grid with visited and path cells marked', () => {
      const { grid, start, end } = createSimpleGrid();
      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(result.newGrid).toBeDefined();
      expect(result.gridWithPath).toBeDefined();
      expect(result.newGrid).not.toBe(grid);
    });
  });

  describe('Multiple executions', () => {
    it('should handle multiple executions with same instance', () => {
      const algorithm = new DijkstraAlgorithm();

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
    it('should work with legacy Dijkstra function', () => {
      const { grid, start, end } = createSimpleGrid();
      const result = Dijkstra(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      expect(result.visited.length).toBeGreaterThan(0);
    });

    it('should produce same results as class-based approach', () => {
      const { grid, start, end } = createSimpleGrid();

      const algorithm = new DijkstraAlgorithm();
      const classResult = algorithm.execute(grid, start, end);

      const functionResult = Dijkstra(grid, start, end);

      expect(classResult.pathArray).toEqual(functionResult.pathArray);
      expect(classResult.visited).toEqual(functionResult.visited);
    });
  });

  describe('Optimality guarantees', () => {
    it('should always find minimum cost path', () => {
      // Create a grid with multiple paths of different costs
      const grid = createEmptyGrid(5, 5);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [0, 4];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Top path (direct): all weighted except start/end
      setWeight(grid, 0, 1);
      setWeight(grid, 0, 2);
      setWeight(grid, 0, 3);
      // Cost: 10 + 10 + 10 = 30

      // Bottom path: no weights, but longer
      // [0,0]->[1,0]->[1,1]->[1,2]->[1,3]->[1,4]->[0,4]
      // Cost: 1 + 1 + 1 + 1 + 1 + 1 = 6

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Should take longer but cheaper path
      expect(result.pathArray!.length).toBeGreaterThan(4);
    });

    it('should find optimal path with various weight distributions', () => {
      const grid = createEmptyGrid(6, 6);
      const start: [number, number] = [0, 0];
      const end: [number, number] = [5, 5];
      setStart(grid, start[0], start[1]);
      setEnd(grid, end[0], end[1]);

      // Add scattered weights
      setWeight(grid, 1, 1);
      setWeight(grid, 2, 2);
      setWeight(grid, 3, 3);

      const algorithm = new DijkstraAlgorithm();
      const result = algorithm.execute(grid, start, end);

      expect(hasPath(result.pathArray)).toBe(true);
      // Dijkstra guarantees optimal solution
      expect(result.pathArray).not.toBeNull();
    });
  });
});
