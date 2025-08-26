# Greedy Best-First Search (GBFS) Algorithm

## Overview

Greedy Best-First Search is an informed search algorithm that uses a heuristic function to guide the search towards the goal. It always expands the node that appears to be closest to the goal according to the heuristic function.

## Algorithm Characteristics

### **Type**: Informed Search Algorithm
### **Completeness**: Not complete (can get stuck in loops)
### **Optimality**: Not optimal (may not find the shortest path)
### **Time Complexity**: O(b^m) where b is branching factor, m is maximum depth
### **Space Complexity**: O(b^m) in worst case

## How It Works

1. **Initialization**: Start with the initial node in the priority queue
2. **Heuristic Evaluation**: Use Manhattan distance to estimate distance to goal
3. **Node Selection**: Always expand the node with the lowest heuristic value
4. **Goal Test**: Check if current node is the goal
5. **Expansion**: Add unvisited neighbors to the priority queue
6. **Repeat**: Continue until goal is found or queue is empty

## Implementation Details

### **Heuristic Function**
```typescript
const heuristic = searchHelpers.manhattanDistance(neighbor, end);
```
- Uses Manhattan distance (|x1-x2| + |y1-y2|)
- Admissible for grid-based pathfinding
- Provides good guidance towards the goal

### **Priority Queue**
- Orders nodes by heuristic value (lowest first)
- Ensures greedy selection of most promising nodes
- Uses existing PriorityQueue helper class

### **Visited Tracking**
- Prevents revisiting nodes
- Maintains search efficiency
- Avoids infinite loops

## Comparison with Other Algorithms

### **vs BFS (Breadth-First Search)**
- **GBFS**: Uses heuristic, faster but not optimal
- **BFS**: Exhaustive, slower but guarantees shortest path

### **vs DFS (Depth-First Search)**
- **GBFS**: Goal-directed, better for pathfinding
- **DFS**: Memory efficient but can miss optimal paths

### **vs Dijkstra's Algorithm**
- **GBFS**: Ignores path cost, only considers heuristic
- **Dijkstra**: Considers actual path cost, guarantees optimal solution

### **vs A* Search**
- **GBFS**: f(n) = h(n) (heuristic only)
- **A***: f(n) = g(n) + h(n) (cost + heuristic)
- **GBFS**: Faster but not optimal
- **A***: Slower but optimal and complete

## Use Cases

### **When to Use GBFS**
- Quick pathfinding needed
- Approximate solutions acceptable
- Memory constraints exist
- Real-time applications

### **When NOT to Use GBFS**
- Optimal path required
- Complex obstacle layouts
- Critical applications
- When completeness is essential

## Performance Characteristics

### **Strengths**
- **Fast execution**: Direct path to goal
- **Low memory usage**: Focuses search direction
- **Simple implementation**: Easy to understand and code
- **Good for simple mazes**: Works well with clear paths

### **Weaknesses**
- **Not optimal**: May find longer paths
- **Can get stuck**: Local minima problems
- **Incomplete**: May not find solution even if one exists
- **Heuristic dependent**: Quality depends on heuristic accuracy

## Visual Behavior

### **Search Pattern**
- Moves directly towards goal
- Explores fewer nodes than BFS
- May take detours around obstacles
- Can appear "eager" or "rushed"

### **Animation Characteristics**
- Focused exploration pattern
- Rapid progress towards goal
- Less systematic than BFS/Dijkstra
- May show backtracking if stuck

## Educational Value

### **Learning Objectives**
- Understand heuristic-based search
- Compare informed vs uninformed search
- Explore trade-offs between speed and optimality
- Demonstrate greedy algorithm concepts

### **Common Misconceptions**
- **"Faster means better"**: Speed vs optimality trade-off
- **"Always finds a path"**: Incompleteness issues
- **"Shorter path guaranteed"**: Optimality not ensured

## Implementation Notes

### **Grid Integration**
- Works with existing grid system
- Handles walls and obstacles
- Integrates with animation system
- Uses consistent return format

### **Error Handling**
- Graceful handling of no-path scenarios
- Proper cleanup of data structures
- Consistent with other algorithms

### **Performance Optimizations**
- Efficient priority queue usage
- Minimal memory allocation
- Optimized neighbor generation
- Smart duplicate detection

## Example Scenarios

### **Best Case**: Clear path to goal
```
S.....G
.......
.......
```
GBFS will find direct path quickly.

### **Worst Case**: Goal behind wall
```
S......
.WWWWW.
.W...WG
.W.....
```
GBFS might get stuck against wall before finding way around.

### **Typical Case**: Moderate obstacles
```
S..W...
...W...
.W.W.WG
.......
```
GBFS will navigate efficiently around obstacles towards goal.

## Code Structure

```typescript
export function GBFS(
  grid: CellState[][],
  start: [number, number],
  end: [number, number]
) {
  // 1. Initialize data structures
  // 2. Set up priority queue with start node
  // 3. Main search loop
  // 4. Process current node
  // 5. Expand neighbors with heuristic
  // 6. Return results
}
```

## Integration

The GBFS algorithm integrates seamlessly with the existing Search Algorithm Visualizer:
- Same input/output format as other algorithms
- Compatible with animation system
- Works with all grid sizes
- Supports all visualization speeds
