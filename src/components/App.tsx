import React, { useState } from 'react';
import { GridProvider, useGrid, CellState } from '../context/GridContext'; // Import CellState here
import Grid from '../components/Grid';
import '../styles/App.css';
import '../styles/Dropdown.css'; // Import dropdown styles
import { AStar } from '../algorithms/AStar'; // Import the AStar algorithm

const App: React.FC = () => {
  return (
    <GridProvider>
      <AppContent />
    </GridProvider>
  );
};

const AppContent: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const { grid, setGrid } = useGrid();

  const handleAlgorithmSelect = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    console.log(`Selected algorithm: ${algorithm}`);
  };

  const handleVisualizeClick = () => {
    if (selectedAlgorithm) {
      console.log(`Executing algorithm: ${selectedAlgorithm}`);
      const startNode: [number, number] = [10, 5]; // Replace with actual start node position
      const endNode: [number, number] = [10, 45]; // Replace with actual end node position

      let resultGrid: CellState[][] | null = null;

      switch (selectedAlgorithm) {
        case 'BFS':
          resultGrid = grid; // Implement BFS and set result grid
          break;
        case 'DFS':
          resultGrid = grid; // Implement DFS and set result grid
          break;
        case 'GBFS':
          resultGrid = grid; // Implement GBFS and set result grid
          break;
        case 'Dijkstra':
          resultGrid = grid; // Implement Dijkstra and set result grid
          break;
        case 'A*':
          const { gridWithPath } = AStar(grid, startNode, endNode);
          resultGrid = gridWithPath;
          break;
        default:
          console.error('Algorithm not implemented.');
          return;
      }

      if (resultGrid) {
        setGrid(resultGrid); // Update the grid with the result
      }
    } else {
      console.warn('No algorithm selected.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Search Algorithm Visualizer</h1>
        <div className="controls">
          <button className="btn select-algorithm-btn" onClick={handleVisualizeClick}>
            {selectedAlgorithm ? `Visualize ${selectedAlgorithm}` : 'Select an algorithm!'}
          </button>
          <button className="btn reset-board-btn">Reset Board</button>
          <div className="dropdown">
            <button className="btn dropdown-btn">Mazes & Patterns</button>
            {/* Dropdown content goes here */}
          </div>
          <div className="dropdown">
            <button className="btn dropdown-btn">Algorithms</button>
            <div className="dropdown-content">
              <a href="#" onClick={() => handleAlgorithmSelect('BFS')}>Breadth First Search</a>
              <a href="#" onClick={() => handleAlgorithmSelect('DFS')}>Depth First Search</a>
              <a href="#" onClick={() => handleAlgorithmSelect('GBFS')}>Greedy Best First Search</a>
              <a href="#" onClick={() => handleAlgorithmSelect('Dijkstra')}>Dijkstra's Algorithm</a>
              <a href="#" onClick={() => handleAlgorithmSelect('A*')}>A* Search</a>
            </div>
          </div>

          <div className="dropdown">
            <button className="btn dropdown-btn">Speed</button>
            {/* Dropdown content goes here */}
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
