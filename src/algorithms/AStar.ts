import { BaseAlgorithm, AlgorithmResult } from "./BaseAlgorithm";
import PriorityQueue from "../helpers/PriorityQueue";
import { CellState } from "../context/GridContext";

export class AStarAlgorithm extends BaseAlgorithm {
  execute(
    grid: CellState[][],
    start: [number, number],
    end: [number, number]
  ): AlgorithmResult {
    this.resetState();
    this.validateInputs(grid, start, end);

    const visited: [number, number][] = [];
    let pathArray: [number, number][] | null = null;

    const pathMap = new Map<string, [number, number]>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    const openSet = new PriorityQueue<[number, number]>();

    const startKey = this.createKey(start);
    gScore.set(startKey, 0);
    fScore.set(startKey, this.calculateManhattanDistance(start, end));
    openSet.push(start, fScore.get(startKey)!);

    // Initialize all non-wall cells
    for (let i = 0; i < grid.length; i++) {
      const row = grid[i];
      if (!row) continue;

      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        if (!cell || cell.isWall) continue;

        const cellKey = this.createKey([i, j]);
        if (!cell.isStart) {
          gScore.set(cellKey, Infinity);
          fScore.set(cellKey, Infinity);
        }
      }
    }

    while (openSet.size() > 0) {
      const minCell = openSet.pop();
      if (!minCell) break;

      const currentNode = minCell.value;
      const currentKey = this.createKey(currentNode);

      console.log(`🔍 A* Processing node [${currentNode}]`);

      if (this.isTargetReached(currentNode, end)) {
        pathArray = this.reconstructPath(pathMap, end, start);
        break;
      }

      if (!visited.some((node) => this.isTargetReached(node, currentNode))) {
        visited.push(currentNode);
        console.log(`✅ Added [${currentNode}] to visited (total: ${visited.length})`);
      }

      const neighbors = this.getValidNeighbors(currentNode, grid);
      console.log(`🔍 Node [${currentNode}] has ${neighbors.length} neighbors:`, neighbors.map(n => `[${n[0]}, ${n[1]}]`));

      for (const neighbor of neighbors) {
        const [row, col] = neighbor;
        const neighborCell = grid[row]?.[col];

        if (!neighborCell) {
          console.log(`❌ Neighbor [${neighbor}] cell is undefined`);
          continue;
        }

        if (neighborCell.isWall) {
          console.log(`🧱 Neighbor [${neighbor}] is a wall`);
          continue;
        }

        console.log(`🔍 Processing neighbor [${neighbor}], cell:`, {
          isWall: neighborCell.isWall,
          isStart: neighborCell.isStart,
          isEnd: neighborCell.isEnd,
          isWeight: neighborCell.isWeight
        });

        const neighborKey = this.createKey(neighbor);
        const currentGScore = gScore.get(currentKey);
        if (currentGScore === undefined) {
          console.log(`❌ ERROR: currentGScore is undefined for [${currentNode}]`);
          continue;
        }
        
        const tentativeGScore = currentGScore + this.getCellWeight(neighborCell);
        const neighborGScore = gScore.get(neighborKey) || Infinity;
        
        console.log(`📊 Score comparison for [${neighbor}]: tentative=${tentativeGScore}, current=${neighborGScore}, currentNodeScore=${currentGScore}`);

        if (tentativeGScore < neighborGScore) {
          pathMap.set(neighborKey, currentNode);
          gScore.set(neighborKey, tentativeGScore);
          const heuristic = this.calculateManhattanDistance(neighbor, end);
          fScore.set(neighborKey, tentativeGScore + heuristic);

          if (
            !openSet.hasElement((element) =>
              this.isTargetReached(element.value, neighbor)
            )
          ) {
            openSet.push(neighbor, fScore.get(neighborKey)!);
            console.log(`✅ Added neighbor [${neighbor}] to openSet with fScore ${fScore.get(neighborKey)}`);
          } else {
            console.log(`⏭️ Neighbor [${neighbor}] already in openSet`);
          }
        } else {
          console.log(`⏭️ Neighbor [${neighbor}] has worse score (${tentativeGScore} >= ${neighborGScore})`);
        }
      }
    }

    return this.createResult(grid, visited, pathArray);
  }
}

// Legacy function wrapper for backward compatibility
export function AStar(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
): AlgorithmResult {
  const algorithm = new AStarAlgorithm();
  return algorithm.execute(grid, start, end);
}
