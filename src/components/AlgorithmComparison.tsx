/**
 * Algorithm Comparison Component - Side-by-side visualization
 */

import React, { memo } from 'react';
import { CellState } from '../store/gridStore';
import { ComparisonAlgorithm } from '../types';

interface ComparisonGridProps {
    side: 'left' | 'right';
    grid: CellState[][];
    algorithm: ComparisonAlgorithm | null;
}

interface ComparisonCellProps {
    side: 'left' | 'right';
    row: number;
    col: number;
    isStart: boolean;
    isEnd: boolean;
    isWall: boolean;
}

const ComparisonCell: React.FC<ComparisonCellProps> = memo(
    ({ side, row, col, isStart, isEnd, isWall }) => {
        const baseStyles = `
      w-[15px] h-[15px] md:w-[18px] md:h-[18px]
      flex justify-center items-center
      transition-all duration-200 relative
    `;

        const defaultStyles = `
      ${baseStyles}
      bg-gradient-to-br from-white/10 to-sky-100/10
      border border-blockchain-accent/30
    `;

        const startStyles = `
      ${baseStyles}
      bg-gradient-to-br from-green-400 to-green-500
      border border-green-300
      shadow-[0_0_10px_rgba(0,255,170,0.6)]
    `;

        const endStyles = `
      ${baseStyles}
      bg-gradient-to-br from-pink-500 to-rose-600
      border border-pink-400
      shadow-[0_0_10px_rgba(255,51,153,0.6)]
    `;

        const wallStyles = `
      ${baseStyles}
      bg-gradient-to-br from-blockchain-light to-blockchain-dark
      border border-gray-600
    `;

        const cellStyles = isStart
            ? startStyles
            : isEnd
                ? endStyles
                : isWall
                    ? wallStyles
                    : defaultStyles;

        return (
            <div
                id={`comparison-${side}-cell-${row}-${col}`}
                className={cellStyles.replace(/\s+/g, ' ').trim()}
            />
        );
    },
    (prev, next) =>
        prev.row === next.row &&
        prev.col === next.col &&
        prev.isStart === next.isStart &&
        prev.isEnd === next.isEnd &&
        prev.isWall === next.isWall
);

ComparisonCell.displayName = 'ComparisonCell';

const ComparisonGrid: React.FC<ComparisonGridProps> = memo(({ side, grid, algorithm }) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <h3 className="text-lg font-semibold text-blockchain-accent">
                {algorithm?.name || 'Select Algorithm'}
            </h3>
            <div
                className="
          grid grid-cols-[repeat(auto-fill,15px)] md:grid-cols-[repeat(auto-fill,18px)]
          bg-linear-to-b from-[rgba(40,60,120,0.6)] to-[rgba(60,80,140,0.7)]
          backdrop-blur-[10px]
          border-2 border-blockchain-accent/60 rounded-lg
          shadow-[0_0_20px_rgba(0,255,245,0.3)]
          p-2 overflow-auto max-h-[50vh]
        "
            >
                {grid.map((row, rowIdx) => (
                    <div key={rowIdx} className="contents">
                        {row.map((cell) => (
                            <ComparisonCell
                                key={`${side}-${cell.row}-${cell.col}`}
                                side={side}
                                row={cell.row}
                                col={cell.col}
                                isStart={cell.isStart}
                                isEnd={cell.isEnd}
                                isWall={cell.isWall}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {algorithm && (
                <div className="text-sm text-gray-300 space-y-1">
                    <p>
                        Visited: <span className="text-blockchain-accent font-bold">{algorithm.nodesVisited}</span>
                    </p>
                    <p>
                        Path Length: <span className="text-cyan-400 font-bold">{algorithm.pathLength || 'N/A'}</span>
                    </p>
                    <p>
                        Time: <span className="text-purple-400 font-bold">{algorithm.executionTime.toFixed(2)}ms</span>
                    </p>
                    <p>
                        Path Found:{' '}
                        <span className={algorithm.pathFound ? 'text-green-400' : 'text-red-400'}>
                            {algorithm.pathFound ? '✓ Yes' : '✗ No'}
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
});

ComparisonGrid.displayName = 'ComparisonGrid';

interface AlgorithmComparisonProps {
    grid: CellState[][];
    algorithms: [string, string];
    results: [ComparisonAlgorithm | null, ComparisonAlgorithm | null];
    isComparing: boolean;
    onAlgorithmChange: (algorithms: [string, string]) => void;
    onCompare: () => void;
    onClose: () => void;
}

const AVAILABLE_ALGORITHMS = ['BFS', 'DFS', 'GBFS', 'Dijkstra', 'A*'];

export const AlgorithmComparison: React.FC<AlgorithmComparisonProps> = ({
    grid,
    algorithms,
    results,
    isComparing,
    onAlgorithmChange,
    onCompare,
    onClose,
}) => {
    const handleAlgorithmSelect = (side: 'left' | 'right', algorithm: string) => {
        if (side === 'left') {
            onAlgorithmChange([algorithm, algorithms[1]]);
        } else {
            onAlgorithmChange([algorithms[0], algorithm]);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="
        bg-linear-to-br from-blockchain-dark to-blockchain-medium
        border-2 border-blockchain-accent rounded-xl
        shadow-[0_0_40px_rgba(0,255,245,0.4)]
        p-6 max-w-6xl w-full max-h-[90vh] overflow-auto
      ">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blockchain-accent">
                        Algorithm Comparison Mode
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors text-2xl"
                        aria-label="Close comparison mode"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 mb-6">
                    {/* Left Panel */}
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <select
                            value={algorithms[0]}
                            onChange={(e) => handleAlgorithmSelect('left', e.target.value)}
                            disabled={isComparing}
                            className="
                bg-blockchain-light text-white px-4 py-2 rounded-lg
                border border-blockchain-accent/50
                focus:outline-none focus:border-blockchain-accent
                disabled:opacity-50
              "
                        >
                            {AVAILABLE_ALGORITHMS.map((algo) => (
                                <option key={algo} value={algo} disabled={algo === algorithms[1]}>
                                    {algo}
                                </option>
                            ))}
                        </select>
                        <ComparisonGrid side="left" grid={grid} algorithm={results[0]} />
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center">
                        <span className="text-4xl font-bold text-blockchain-accent">VS</span>
                    </div>

                    {/* Right Panel */}
                    <div className="flex-1 flex flex-col items-center gap-4">
                        <select
                            value={algorithms[1]}
                            onChange={(e) => handleAlgorithmSelect('right', e.target.value)}
                            disabled={isComparing}
                            className="
                bg-blockchain-light text-white px-4 py-2 rounded-lg
                border border-blockchain-accent/50
                focus:outline-none focus:border-blockchain-accent
                disabled:opacity-50
              "
                        >
                            {AVAILABLE_ALGORITHMS.map((algo) => (
                                <option key={algo} value={algo} disabled={algo === algorithms[0]}>
                                    {algo}
                                </option>
                            ))}
                        </select>
                        <ComparisonGrid side="right" grid={grid} algorithm={results[1]} />
                    </div>
                </div>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCompare}
                        disabled={isComparing}
                        className="
              px-6 py-3 rounded-lg font-semibold
              bg-linear-to-r from-blockchain-accent to-primary-500
              text-blockchain-dark
              hover:shadow-[0_0_20px_rgba(0,255,245,0.6)]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            "
                    >
                        {isComparing ? 'Comparing...' : 'Run Comparison'}
                    </button>
                </div>

                {/* Comparison Results Summary */}
                {results[0] && results[1] && (
                    <div className="mt-6 p-4 bg-blockchain-light/30 rounded-lg">
                        <h3 className="text-lg font-semibold text-white mb-3">Results Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                                <p className="text-gray-400">Faster Algorithm</p>
                                <p className="text-blockchain-accent font-bold text-lg">
                                    {results[0].executionTime < results[1].executionTime
                                        ? results[0].name
                                        : results[1].name}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400">Fewer Nodes Visited</p>
                                <p className="text-cyan-400 font-bold text-lg">
                                    {results[0].nodesVisited < results[1].nodesVisited
                                        ? results[0].name
                                        : results[1].name}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400">Shorter Path</p>
                                <p className="text-purple-400 font-bold text-lg">
                                    {!results[0].pathFound && !results[1].pathFound
                                        ? 'N/A'
                                        : !results[0].pathFound
                                            ? results[1].name
                                            : !results[1].pathFound
                                                ? results[0].name
                                                : results[0].pathLength <= results[1].pathLength
                                                    ? results[0].name
                                                    : results[1].name}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlgorithmComparison;
