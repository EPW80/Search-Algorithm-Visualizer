import React from 'react';
import { GridProvider } from '../context/GridContext';
import Grid from '../components/Grid';
import '../styles/App.css';

const App: React.FC = () => {
  return (
    <GridProvider>
      <div className="App">
        <header className="App-header">
          <h1>Search Algorithm Visualizer</h1>
          <div className="controls">
            <button className="btn">Select an algorithm!</button>
            <button className="btn reset-btn">Reset Board</button>
            <div className="dropdown">
              <button className="btn dropdown-btn">Mazes & Patterns</button>
              {/* Dropdown content goes here */}
            </div>
            <div className="dropdown">
              <button className="btn dropdown-btn">Algorithms</button>
              {/* Dropdown content goes here */}
            </div>
            <div className="dropdown">
              <button className="btn dropdown-btn">Speed</button>
              {/* Dropdown content goes here */}
            </div>
          </div>
        </header>
        <main>
          <Grid />
        </main>
      </div>
    </GridProvider>
  );
};

export default App;
