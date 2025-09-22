// Export all algorithm implementations for easy importing

// Legacy function exports for backward compatibility
export { BFS } from "./BFS";
export { DFS } from "./DFS";
export { AStar } from "./AStar";
export { Dijkstra } from "./Dijkstra";
export { GBFS } from "./GBFS";

// New class-based algorithm exports
export { BFSAlgorithm } from "./BFS";
export { DFSAlgorithm } from "./DFS";
export { AStarAlgorithm } from "./AStar";
export { DijkstraAlgorithm } from "./Dijkstra";
export { GBFSAlgorithm } from "./GBFS";

// Base algorithm class and types
export { BaseAlgorithm, type AlgorithmResult } from "./BaseAlgorithm";
