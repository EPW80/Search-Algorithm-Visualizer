import React from 'react';
import { GridProvider } from '../context/GridContext';
import Grid from '../components/Grid';
import '../styles/App.css';
import '../styles/Dropdown.css'; // Import dropdown styles

const App: React.FC = () => {
  const handleAlgorithmSelect = (algorithm: string) => {
    console.log(`Selected algorithm: ${algorithm}`);
    // Implement your logic to set the selected algorithm
  };

  return (
    <GridProvider>
      <div className="App">
        <header className="App-header">
          <h1>Search Algorithm Visualizer</h1>
          <div className="controls">
            <button className="btn select-algorithm-btn">Select an algorithm!</button>
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
                <a href="#" onClick={() => handleAlgorithmSelect('Dijkstra')}>Djikstra's Algorithm</a>
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
    </GridProvider>
  );
};

export default App;
