# Animation and Visualization Features

This document explains the new animation and visualization features added to the Search Algorithm Visualizer.

## Features Added

### 1. Animation System (`src/helpers/animationHelpers.ts`)

The animation system provides smooth, visual feedback when algorithms execute:

- **Visited Nodes Animation**: Shows nodes being explored with a scaling effect
- **Path Animation**: Highlights the final path with a glowing effect  
- **Speed Controls**: Four different animation speeds to choose from

### 2. Animation Speeds

- **Slow**: 50ms delay (great for educational purposes)
- **Normal**: 10ms delay (default, good balance)
- **Fast**: 5ms delay (quick overview)
- **Instant**: 0ms delay (immediate results)

### 3. Visual Enhancements

#### Cell Animations
- **Start Node**: Pulsing green animation with shadow effect
- **End Node**: Pulsing red animation with shadow effect
- **Visited Nodes**: Scale-in animation when first visited
- **Path Nodes**: Glow effect transitioning from yellow to blue
- **Wall Nodes**: Slightly scaled down for depth effect

#### UI Improvements
- **Disabled States**: Buttons are disabled during animation
- **Visual Feedback**: "Visualizing..." text during execution
- **Smooth Transitions**: All state changes are animated

## How to Use

### 1. Select an Algorithm
Click the "Algorithms" dropdown and choose:
- Breadth First Search (BFS)
- Depth First Search (DFS) 
- Dijkstra's Algorithm
- A* Search

### 2. Choose Animation Speed
Click the "Speed" dropdown and select:
- Slow (educational pace)
- Normal (recommended)
- Fast (quick overview)
- Instant (no animation)

### 3. Visualize
- Click "Visualize [Algorithm]" to start the animation
- Watch as the algorithm explores nodes (light blue)
- See the final path highlighted (blue with glow effect)

### 4. Reset
- Click "Reset Board" to clear all animations
- Start and end nodes remain in place
- Walls are preserved

## Implementation Details

### Animation Flow
1. Clear any previous animations
2. Animate visited nodes one by one
3. Pause briefly
4. Animate the final path
5. Re-enable controls

### Performance Considerations
- Animations use `requestAnimationFrame` for smooth performance
- Large grids automatically optimize animation speed
- Instant mode bypasses all delays for immediate results

### Accessibility
- Animations can be disabled via "Instant" speed
- High contrast colors for visibility
- Keyboard navigation support maintained

## Code Structure

```typescript
// Main animation function
animateAlgorithm(visited, path, updateCellState, speed)

// Clear previous states  
clearAnimations(visited, path, updateCellState)

// Reset entire grid
resetGridAnimations(grid, updateCellState)
```

## CSS Animations

Key animations defined in `Cell.css`:
- `pulse-start`: Start node pulsing effect
- `pulse-end`: End node pulsing effect  
- `visited-appear`: Visited node scale-in
- `path-glow`: Path highlighting effect

All animations are designed to be:
- Smooth and non-jarring
- Educational (help understand algorithm flow)
- Performance-optimized
- Accessible (can be disabled)
