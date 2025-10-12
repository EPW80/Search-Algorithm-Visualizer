import React, { useEffect, useState } from 'react';
import { AStar } from '../algorithms/AStar'; // Import the AStar algorithm
import { BFS } from '../algorithms/BFS';
import { DFS } from '../algorithms/DFS';
import { Dijkstra } from '../algorithms/Dijkstra';
import { GBFS } from '../algorithms/GBFS';
import { MazeGenerator, animateMazeGeneration } from '../algorithms/MazeGenerator';
import { AlgorithmStats, AlgorithmStatsData } from '../components/AlgorithmStats';
import { ErrorBoundary } from '../components/ErrorBoundary';
import Grid from '../components/Grid';
import { InteractiveLegend } from '../components/InteractiveLegend';
import { GridProvider, useGrid } from '../context/GridContext';
import { AnimationSpeed, AnimationSpeedType, animateAlgorithm, resetBoard, resetGridAnimations } from '../helpers/animationHelpers';
import '../styles/App.css';
import '../styles/Dropdown.css'; // Import dropdown styles

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <GridProvider>
        <AppContent />
      </GridProvider>
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>('BFS');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeedType>(AnimationSpeed.NORMAL);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [currentDrawMode, setCurrentDrawMode] = useState<string>('wall');
  const [stats, setStats] = useState<AlgorithmStatsData>({
    algorithmName: null,
    nodesVisited: 0,
    pathLength: 0,
    executionTime: 0,
    pathFound: false,
    isRunning: false,
  });
  const { grid, updateCellState } = useGrid();

  const handleAlgorithmSelect = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    console.log(`🔧 Selected algorithm: ${algorithm}`);
  };

  const handleSpeedSelect = (speed: AnimationSpeedType) => {
    setAnimationSpeed(speed);
    const speedName = speed === AnimationSpeed.SLOW ? 'Slow' :
      speed === AnimationSpeed.NORMAL ? 'Normal' :
        speed === AnimationSpeed.FAST ? 'Fast' : 'Instant';
    console.log(`⚡ Selected speed: ${speedName}`);
  };

  const handleDrawModeChange = (mode: string) => {
    setCurrentDrawMode(mode);
    console.log(`🎨 Draw mode changed to: ${mode}`);
  };

  const findStartNode = (): [number, number] => {
    for (let row = 0; row < grid.length; row++) {
      const currentRow = grid[row];
      if (currentRow) {
        for (let col = 0; col < currentRow.length; col++) {
          const currentCell = currentRow[col];
          if (currentCell && currentCell.isStart) {
            return [row, col];
          }
        }
      }
    }
    // Dynamic fallback: use grid center or safe position
    const safeRow = Math.min(10, grid.length - 1);
    const safeCol = Math.min(5, (grid[0]?.length || 1) - 1);
    return [safeRow, safeCol];
  };

  const findEndNode = (): [number, number] => {
    for (let row = 0; row < grid.length; row++) {
      const currentRow = grid[row];
      if (currentRow) {
        for (let col = 0; col < currentRow.length; col++) {
          const currentCell = currentRow[col];
          if (currentCell && currentCell.isEnd) {
            return [row, col];
          }
        }
      }
    }
    // Dynamic fallback: use grid right side or safe position
    const safeRow = Math.min(10, grid.length - 1);
    const safeCol = Math.max(0, Math.min(45, (grid[0]?.length || 50) - 1));
    return [safeRow, safeCol];
  };

  const handleVisualizeClick = async () => {
    if (selectedAlgorithm && !isAnimating) {
      setIsAnimating(true);

      // Update stats to show running state
      setStats({
        algorithmName: selectedAlgorithm,
        nodesVisited: 0,
        pathLength: 0,
        executionTime: 0,
        pathFound: false,
        isRunning: true,
      });

      console.log(`🚀 Executing algorithm: ${selectedAlgorithm} at speed: ${animationSpeed === AnimationSpeed.INSTANT ? 'INSTANT' : `${animationSpeed}ms`}`);

      const startTime = performance.now();
      const startNode = findStartNode();
      const endNode = findEndNode();

      console.log('🎯 Algorithm execution setup:', {
        algorithm: selectedAlgorithm,
        startNode,
        endNode,
        startCell: grid[startNode[0]]?.[startNode[1]],
        endCell: grid[endNode[0]]?.[endNode[1]],
        gridSize: `${grid.length}x${grid[0]?.length || 0}`,
        startEqualsEnd: startNode[0] === endNode[0] && startNode[1] === endNode[1]
      });

      // Validate that start and end positions are within bounds and not walls
      const startCell = grid[startNode[0]]?.[startNode[1]];
      const endCell = grid[endNode[0]]?.[endNode[1]];

      if (!startCell || !endCell) {
        console.error('❌ Invalid start or end position - outside grid bounds');
        setIsAnimating(false);
        return;
      }

      if (startCell.isWall || endCell.isWall) {
        console.warn('⚠️ Start or end position is on a wall');
        // Clear walls from start/end positions
        if (startCell.isWall) {
          updateCellState(startNode[0], startNode[1], { isWall: false });
        }
        if (endCell.isWall) {
          updateCellState(endNode[0], endNode[1], { isWall: false });
        }
      }

      let algorithmResult: any = null;

      try {
        // Clear any previous animations first
        resetGridAnimations(grid, updateCellState);

        switch (selectedAlgorithm) {
          case 'BFS':
            algorithmResult = BFS(grid, startNode, endNode);
            break;
          case 'DFS':
            algorithmResult = DFS(grid, startNode, endNode);
            break;
          case 'GBFS':
            algorithmResult = GBFS(grid, startNode, endNode);
            break;
          case 'Dijkstra':
            algorithmResult = Dijkstra(grid, startNode, endNode);
            break;
          case 'A*':
            algorithmResult = AStar(grid, startNode, endNode);
            break;
          default:
            console.error('Algorithm not implemented.');
            setIsAnimating(false);
            return;
        }

        if (algorithmResult && algorithmResult.visited) {
          const executionTime = performance.now() - startTime;
          const pathFound = algorithmResult.pathArray !== null;
          const pathLength = pathFound ? algorithmResult.pathArray.length : 0;

          console.log('📊 Algorithm result:', {
            visitedCount: algorithmResult.visited.length,
            pathCount: pathLength,
            pathFound,
            executionTime: `${executionTime.toFixed(2)}ms`
          });

          // Animate the algorithm execution
          await animateAlgorithm(
            algorithmResult.visited,
            algorithmResult.pathArray || [], // Use empty array if no path found
            updateCellState,
            animationSpeed
          );

          // Update statistics with final results
          setStats({
            algorithmName: selectedAlgorithm,
            nodesVisited: algorithmResult.visited.length,
            pathLength,
            executionTime,
            pathFound,
            isRunning: false,
          });

          // Log result status
          if (algorithmResult.pathArray === null) {
            console.info('🚫 No path found - target may be unreachable');
          } else if (algorithmResult.pathArray.length === 0) {
            console.info('🎯 Already at target - no movement needed');
          } else {
            console.info('✅ Path found successfully');
          }
        } else {
          console.warn('⚠️ Algorithm result missing data:', {
            hasResult: !!algorithmResult,
            hasVisited: !!(algorithmResult && algorithmResult.visited),
            hasPath: !!(algorithmResult && algorithmResult.pathArray)
          });

          // Update stats to show failure
          setStats({
            algorithmName: selectedAlgorithm,
            nodesVisited: 0,
            pathLength: 0,
            executionTime: performance.now() - startTime,
            pathFound: false,
            isRunning: false,
          });
        }
      } catch (error) {
        console.error('Error executing algorithm:', error);
        setStats({
          algorithmName: selectedAlgorithm,
          nodesVisited: 0,
          pathLength: 0,
          executionTime: performance.now() - startTime,
          pathFound: false,
          isRunning: false,
        });
      } finally {
        setIsAnimating(false);
      }
    } else if (isAnimating) {
      console.warn('Animation already in progress.');
    } else {
      console.warn('No algorithm selected.');
    }
  };

  const handleResetBoard = () => {
    if (!isAnimating) {
      resetBoard(grid, updateCellState);
      // Reset statistics
      setStats({
        algorithmName: null,
        nodesVisited: 0,
        pathLength: 0,
        executionTime: 0,
        pathFound: false,
        isRunning: false,
      });
      console.log('🔄 Board reset - all walls, visited nodes, and paths cleared');
    }
  };

  const handleMazeGeneration = async (mazeType: string) => {
    if (isAnimating) {
      console.warn('Cannot generate maze while animation is running');
      return;
    }

    setIsAnimating(true);
    console.log(`🧱 Generating ${mazeType} maze`);

    try {
      // First clear existing walls
      resetGridAnimations(grid, updateCellState);

      // Wait a bit for the grid to clear
      await new Promise(resolve => setTimeout(resolve, 100));

      const mazeGenerator = new MazeGenerator(grid);
      let mazeResult;

      switch (mazeType) {
        case 'recursive-division':
          mazeResult = mazeGenerator.recursiveDivision();
          break;
        case 'random':
          mazeResult = mazeGenerator.randomMaze(0.35);
          break;
        case 'spiral':
          mazeResult = mazeGenerator.spiralPattern();
          break;
        case 'vertical-skew':
          mazeResult = mazeGenerator.verticalSkew();
          break;
        case 'horizontal-skew':
          mazeResult = mazeGenerator.horizontalSkew();
          break;
        case 'clear':
          mazeResult = mazeGenerator.clearWalls();
          break;
        default:
          console.warn('Unknown maze type:', mazeType);
          return;
      }

      // Animate the maze generation
      const speed = animationSpeed === AnimationSpeed.SLOW ? 50 :
        animationSpeed === AnimationSpeed.NORMAL ? 20 :
          animationSpeed === AnimationSpeed.FAST ? 5 : 0;

      if (mazeType === 'clear') {
        // For clearing, we don't need animation
        resetGridAnimations(grid, updateCellState);
      } else {
        await animateMazeGeneration(mazeResult.animationOrder, updateCellState, speed);
      }

      console.log(`✅ ${mazeType} maze generation complete`);
    } catch (error) {
      console.error('Error generating maze:', error);
    } finally {
      setIsAnimating(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    // Only run once when component mounts
    const hasRunTest = sessionStorage.getItem('algorithmsTestedOnce');
    if (!hasRunTest && grid.length > 0) {
      console.log('🔧 Search Algorithm Visualizer loaded');
      console.log('📏 Grid size:', grid.length, 'x', grid[0]?.length);
      sessionStorage.setItem('algorithmsTestedOnce', 'true');
    }
  }, [grid]); // Include grid dependency to get accurate size

  return (
    <div className="App">
      <header className="App-header">
        <h1>Search Algorithm Visualizer</h1>
        <div className="controls">
          <button
            className="btn select-algorithm-btn"
            onClick={handleVisualizeClick}
            disabled={isAnimating}
          >
            {isAnimating
              ? 'Visualizing...'
              : selectedAlgorithm
                ? `Visualize ${selectedAlgorithm}`
                : 'Select an algorithm!'
            }
          </button>
          <button
            className="btn reset-board-btn"
            onClick={handleResetBoard}
            disabled={isAnimating}
          >
            Reset Board
          </button>
          <div className="dropdown">
            <button className="btn dropdown-btn" aria-label="Select maze pattern">Mazes & Patterns</button>
            <div className="dropdown-content" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMazeGeneration('recursive-division')}
                disabled={isAnimating}
              >
                Recursive Division
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMazeGeneration('random')}
                disabled={isAnimating}
              >
                Random Maze
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMazeGeneration('spiral')}
                disabled={isAnimating}
              >
                Spiral Pattern
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMazeGeneration('vertical-skew')}
                disabled={isAnimating}
              >
                Vertical Skew
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMazeGeneration('horizontal-skew')}
                disabled={isAnimating}
              >
                Horizontal Skew
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => handleMazeGeneration('clear')}
                disabled={isAnimating}
              >
                Clear Walls
              </button>
            </div>
          </div>
          <div className="dropdown">
            <button className="btn dropdown-btn" aria-label="Select algorithm">Algorithms</button>
            <div className="dropdown-content" role="menu">
              <button type="button" role="menuitem" onClick={() => handleAlgorithmSelect('BFS')}>Breadth First Search</button>
              <button type="button" role="menuitem" onClick={() => handleAlgorithmSelect('DFS')}>Depth First Search</button>
              <button type="button" role="menuitem" onClick={() => handleAlgorithmSelect('GBFS')}>Greedy Best First Search</button>
              <button type="button" role="menuitem" onClick={() => handleAlgorithmSelect('Dijkstra')}>Dijkstra's Algorithm</button>
              <button type="button" role="menuitem" onClick={() => handleAlgorithmSelect('A*')}>A* Search</button>
            </div>
          </div>

          <div className="dropdown">
            <button className="btn dropdown-btn" aria-label="Select animation speed">Speed</button>
            <div className="dropdown-content" role="menu">
              <button type="button" role="menuitem" onClick={() => handleSpeedSelect(AnimationSpeed.SLOW)}>Slow</button>
              <button type="button" role="menuitem" onClick={() => handleSpeedSelect(AnimationSpeed.NORMAL)}>Normal</button>
              <button type="button" role="menuitem" onClick={() => handleSpeedSelect(AnimationSpeed.FAST)}>Fast</button>
              <button type="button" role="menuitem" onClick={() => handleSpeedSelect(AnimationSpeed.INSTANT)}>Instant</button>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Legend and Stats Section */}
      <div className="legend-section">
        <InteractiveLegend
          currentDrawMode={currentDrawMode}
          onDrawModeChange={handleDrawModeChange}
        />
        <AlgorithmStats stats={stats} />
      </div>

      <main>
        <Grid />
      </main>
    </div>
  );
};

export default App;
