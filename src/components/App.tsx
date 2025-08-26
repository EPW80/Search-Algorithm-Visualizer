import React, { useState, useEffect } from 'react';
import { GridProvider, useGrid } from '../context/GridContext';
import Grid from '../components/Grid';
import '../styles/App.css';
import '../styles/Dropdown.css'; // Import dropdown styles
import { AStar } from '../algorithms/AStar'; // Import the AStar algorithm
import { BFS } from '../algorithms/BFS';
import { DFS } from '../algorithms/DFS';
import { Dijkstra } from '../algorithms/Dijkstra';
import { GBFS } from '../algorithms/GBFS';
import { animateAlgorithm, resetGridAnimations, AnimationSpeed, AnimationSpeedType } from '../helpers/animationHelpers';

const App: React.FC = () => {
  return (
    <GridProvider>
      <AppContent />
    </GridProvider>
  );
};

const AppContent: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>('BFS');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeedType>(AnimationSpeed.NORMAL);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
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

  const findStartNode = (): [number, number] => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].isStart) {
          return [row, col];
        }
      }
    }
    return [10, 5]; // Default fallback
  };

  const findEndNode = (): [number, number] => {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col].isEnd) {
          return [row, col];
        }
      }
    }
    return [10, 45]; // Default fallback
  };

  const handleVisualizeClick = async () => {
    if (selectedAlgorithm && !isAnimating) {
      setIsAnimating(true);
      console.log(`🚀 Executing algorithm: ${selectedAlgorithm} at speed: ${animationSpeed === AnimationSpeed.INSTANT ? 'INSTANT' : `${animationSpeed}ms`}`);

      const startNode = findStartNode();
      const endNode = findEndNode();

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

        if (algorithmResult && algorithmResult.visited && algorithmResult.pathArray) {
          console.log('📊 Algorithm result:', {
            visitedCount: algorithmResult.visited.length,
            pathCount: algorithmResult.pathArray.length
          });

          // Animate the algorithm execution
          await animateAlgorithm(
            algorithmResult.visited,
            algorithmResult.pathArray,
            updateCellState,
            animationSpeed
          );
        } else {
          console.warn('⚠️ Algorithm result missing data:', {
            hasResult: !!algorithmResult,
            hasVisited: !!(algorithmResult && algorithmResult.visited),
            hasPath: !!(algorithmResult && algorithmResult.pathArray)
          });
        }
      } catch (error) {
        console.error('Error executing algorithm:', error);
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
      resetGridAnimations(grid, updateCellState);
      console.log('🔄 Board reset');
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
            <button className="btn dropdown-btn">Mazes & Patterns</button>
            {/* Dropdown content goes here */}
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

      {/* Legend Section placed outside the header */}
      <div className="legend">
        <div className="legend-item"><span className="legend-icon start-node"></span> Start Node</div>
        <div className="legend-item"><span className="legend-icon target-node"></span> Target Node</div>
        <div className="legend-item"><span className="legend-icon weight-node"></span> Weight Node</div>
        <div className="legend-item"><span className="legend-icon path-node"></span> Path Node</div>
        <div className="legend-item"><span className="legend-icon visited-node"></span> Visited Node</div>
        <div className="legend-item"><span className="legend-icon unvisited-node"></span> Unvisited Node</div>
        <div className="legend-item"><span className="legend-icon wall-node"></span> Wall Node</div>
      </div>

      <main>
        <Grid />
      </main>
    </div>
  );
};

export default App;
