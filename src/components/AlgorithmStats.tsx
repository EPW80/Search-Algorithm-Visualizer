import React from 'react';
import '../styles/AlgorithmStats.css';

export interface AlgorithmStatsData {
  algorithmName: string | null;
  nodesVisited: number;
  pathLength: number;
  executionTime: number;
  pathFound: boolean;
  isRunning: boolean;
}

interface AlgorithmStatsProps {
  stats: AlgorithmStatsData;
}

export const AlgorithmStats: React.FC<AlgorithmStatsProps> = ({ stats }) => {
  const formatTime = (ms: number): string => {
    if (ms < 1) return '<1ms';
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getEfficiencyRating = (): string => {
    if (!stats.pathFound || stats.pathLength === 0) return 'N/A';
    const efficiency = (stats.pathLength / stats.nodesVisited) * 100;
    if (efficiency >= 80) return 'Excellent';
    if (efficiency >= 60) return 'Good';
    if (efficiency >= 40) return 'Fair';
    return 'Poor';
  };

  const getEfficiencyClass = (): string => {
    const rating = getEfficiencyRating();
    if (rating === 'Excellent') return 'efficiency-excellent';
    if (rating === 'Good') return 'efficiency-good';
    if (rating === 'Fair') return 'efficiency-fair';
    if (rating === 'Poor') return 'efficiency-poor';
    return 'efficiency-na';
  };

  if (!stats.algorithmName && !stats.isRunning) {
    return (
      <div className="algorithm-stats empty-state">
        <div className="stats-header">
          <h3>Algorithm Statistics</h3>
          <div className="status-badge status-waiting">Waiting</div>
        </div>
        <div className="empty-message">
          <p>Select an algorithm and click "Visualize" to see statistics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="algorithm-stats">
      <div className="stats-header">
        <h3>Algorithm Statistics</h3>
        {stats.isRunning ? (
          <div className="status-badge status-running">Running...</div>
        ) : (
          <div className={`status-badge ${stats.pathFound ? 'status-success' : 'status-failed'}`}>
            {stats.pathFound ? 'Path Found' : 'No Path'}
          </div>
        )}
      </div>

      <div className="stats-content">
        {stats.algorithmName && (
          <div className="stat-item algorithm-name">
            <div className="stat-label">Algorithm</div>
            <div className="stat-value highlight">{stats.algorithmName}</div>
          </div>
        )}

        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">🔍</span>
              Nodes Visited
            </div>
            <div className="stat-value">{stats.nodesVisited.toLocaleString()}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">📏</span>
              Path Length
            </div>
            <div className="stat-value">
              {stats.pathFound ? stats.pathLength.toLocaleString() : 'N/A'}
            </div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">⚡</span>
              Execution Time
            </div>
            <div className="stat-value">{formatTime(stats.executionTime)}</div>
          </div>

          <div className="stat-item">
            <div className="stat-label">
              <span className="stat-icon">⭐</span>
              Efficiency
            </div>
            <div className={`stat-value ${getEfficiencyClass()}`}>
              {getEfficiencyRating()}
            </div>
          </div>
        </div>

        {stats.pathFound && stats.pathLength > 0 && (
          <div className="efficiency-bar-container">
            <div className="efficiency-bar-label">Path Efficiency</div>
            <div className="efficiency-bar">
              <div
                className={`efficiency-bar-fill ${getEfficiencyClass()}`}
                style={{
                  width: `${Math.min((stats.pathLength / stats.nodesVisited) * 100, 100)}%`
                }}
              ></div>
            </div>
            <div className="efficiency-bar-value">
              {((stats.pathLength / stats.nodesVisited) * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlgorithmStats;
