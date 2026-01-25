import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AStar } from '../algorithms/AStar';
import { BFS } from '../algorithms/BFS';
import { DFS } from '../algorithms/DFS';
import { Dijkstra } from '../algorithms/Dijkstra';
import { GBFS } from '../algorithms/GBFS';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FeatureErrorBoundary } from '../components/FeatureErrorBoundary';
import Grid from '../components/Grid';
import { Loading } from '../components/Loading';
import { GlobalScreenReaderAnnouncer, useScreenReaderAnnouncer } from '../components/ScreenReaderAnnouncer';
import { Toolbar } from '../components/Toolbar';
import { AnimationSpeed, resetBoard } from '../helpers/animationHelpers';
import {
  useAlgorithmComparison,
  useAlgorithmExecution,
  useGifExport,
  useGridNavigation,
  useGridPersistence,
  useMazeGeneration,
  useStats,
  useSteppedExecution,
  useUndoRedo,
} from '../hooks';
import { useGridStore } from '../store/gridStore';
import { AlgorithmResult, AnimationSpeedType } from '../types';

// Lazy load non-critical components
const AlgorithmStats = lazy(() => import('../components/AlgorithmStats'));
const InteractiveLegend = lazy(() => import('../components/InteractiveLegend'));
const AlgorithmComparison = lazy(() => import('../components/AlgorithmComparison'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

const AppContent: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>('BFS');
  const [animationSpeed, setAnimationSpeed] = useState<AnimationSpeedType>(
    AnimationSpeed.NORMAL
  );
  const [currentDrawMode, setCurrentDrawMode] = useState<string>('wall');
  const { announce } = useScreenReaderAnnouncer();

  const grid = useGridStore((state) => state.grid);
  const setGrid = useGridStore((state) => state.setGrid);
  const updateCellState = useGridStore((state) => state.updateCellState);
  const { stats, setStats, resetStats } = useStats();
  const { findStartNode, findEndNode } = useGridNavigation(grid);

  // Store last algorithm result for export
  const lastAlgorithmResult = useRef<AlgorithmResult | null>(null);

  const { isAnimating, executeAlgorithm } = useAlgorithmExecution({
    grid,
    updateCellState,
    findStartNode,
    findEndNode,
    animationSpeed,
    setStats,
  });

  const { isGenerating, generateMaze } = useMazeGeneration({
    grid,
    updateCellState,
    animationSpeed,
  });

  // Undo/Redo functionality
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory,
  } = useUndoRedo(updateCellState);

  // Grid persistence (save/load)
  const {
    savedGrids,
    saveGrid,
    loadGrid,
    deleteGrid,
    exportGrid,
    importGrid,
  } = useGridPersistence(grid, setGrid);

  // Step-by-step execution
  const {
    isStepping,
    isPaused,
    stepState,
    initializeStepMode,
    stepForward,
    stepBackward,
    play: playStep,
    pause: pauseStep,
    resetStepMode,
    jumpToStep,
  } = useSteppedExecution({
    grid,
    findStartNode,
    findEndNode,
    animationSpeed,
  });

  // Algorithm comparison mode
  const {
    comparisonState,
    isComparing,
    activateComparisonMode,
    deactivateComparisonMode,
    setComparisonAlgorithms,
    startComparison,
  } = useAlgorithmComparison({
    grid,
    findStartNode,
    findEndNode,
    animationSpeed,
  });

  // GIF/Video export
  const {
    isRecording,
    recordingProgress,
    exportVisualization,
    exportGridImage,
  } = useGifExport({
    grid,
    animationSpeed,
  });

  // Execute algorithm and store result for export
  const executeAndStoreAlgorithm = useCallback((algorithm: string): AlgorithmResult | null => {
    const startNode = findStartNode();
    const endNode = findEndNode();

    let result: AlgorithmResult | null = null;
    switch (algorithm) {
      case 'BFS':
        result = BFS(grid, startNode, endNode);
        break;
      case 'DFS':
        result = DFS(grid, startNode, endNode);
        break;
      case 'GBFS':
        result = GBFS(grid, startNode, endNode);
        break;
      case 'Dijkstra':
        result = Dijkstra(grid, startNode, endNode);
        break;
      case 'A*':
        result = AStar(grid, startNode, endNode);
        break;
    }

    if (result) {
      lastAlgorithmResult.current = result;
    }
    return result;
  }, [grid, findStartNode, findEndNode]);

  const handleAlgorithmSelect = (algorithm: string) => {
    setSelectedAlgorithm(algorithm);
    announce(`Selected ${algorithm} algorithm`);
    console.log(`🔧 Selected algorithm: ${algorithm}`);
  };

  const handleSpeedSelect = (speed: AnimationSpeedType) => {
    setAnimationSpeed(speed);
    const speedName =
      speed === AnimationSpeed.SLOW
        ? 'Slow'
        : speed === AnimationSpeed.NORMAL
          ? 'Normal'
          : speed === AnimationSpeed.FAST
            ? 'Fast'
            : 'Instant';
    console.log(`⚡ Selected speed: ${speedName}`);
  };

  const handleDrawModeChange = (mode: string) => {
    setCurrentDrawMode(mode);
    console.log(`🎨 Draw mode changed to: ${mode}`);
  };

  const handleVisualizeClick = async () => {
    if (selectedAlgorithm) {
      announce(`Starting ${selectedAlgorithm} algorithm`, 'assertive');
      executeAndStoreAlgorithm(selectedAlgorithm);
      await executeAlgorithm(selectedAlgorithm);
      announce(`${selectedAlgorithm} algorithm completed`, 'assertive');
    }
  };

  const handleResetBoard = () => {
    if (!isAnimating && !isGenerating && !isStepping) {
      resetBoard(grid, updateCellState);
      resetStats();
      clearHistory();
      resetStepMode();
      lastAlgorithmResult.current = null;
      announce('Board has been reset');
      console.log('🔄 Board reset - all walls, visited nodes, and paths cleared');
    }
  };

  const handleMazeGeneration = async (mazeType: string) => {
    announce(`Generating ${mazeType} maze`, 'assertive');
    clearHistory();
    await generateMaze(mazeType);
    announce(`${mazeType} maze generated`, 'assertive');
  };

  // Handle step mode initialization
  const handleInitializeStepMode = () => {
    if (selectedAlgorithm) {
      const success = initializeStepMode(selectedAlgorithm);
      if (success) {
        announce(`Step mode initialized for ${selectedAlgorithm}`, 'assertive');
      }
    }
  };

  // Handle export visualization
  const handleExportVisualization = async () => {
    if (!selectedAlgorithm) {
      announce('Please select an algorithm first', 'assertive');
      return;
    }

    let result = lastAlgorithmResult.current;
    if (!result) {
      result = executeAndStoreAlgorithm(selectedAlgorithm);
    }

    if (result) {
      announce('Recording visualization...', 'assertive');
      const success = await exportVisualization(result, selectedAlgorithm);
      if (success) {
        announce('Visualization exported successfully', 'assertive');
      }
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (!isAnimating && !isGenerating && !isStepping) {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        if (!isAnimating && !isGenerating && !isStepping) {
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnimating, isGenerating, isStepping, undo, redo]);

  // Initialize on component mount
  useEffect(() => {
    const hasRunTest = sessionStorage.getItem('algorithmsTestedOnce');
    if (!hasRunTest && grid.length > 0) {
      console.log('🔧 Search Algorithm Visualizer loaded');
      console.log('📏 Grid size:', grid.length, 'x', grid[0]?.length);
      sessionStorage.setItem('algorithmsTestedOnce', 'true');
    }
  }, [grid]);

  return (
    <>
      <GlobalScreenReaderAnnouncer />
      <div className="
      min-h-screen text-center overflow-x-hidden relative
      bg-linear-to-br from-blockchain-dark via-[#001f3f] to-[#003d5c]
      before:content-[''] before:fixed before:inset-0
      before:bg-[radial-gradient(2px_2px_at_20%_30%,#00fff5,transparent),radial-gradient(2px_2px_at_60%_70%,#00d4ff,transparent),radial-gradient(1px_1px_at_50%_50%,#9d4edd,transparent),radial-gradient(1px_1px_at_80%_10%,#00fff5,transparent),radial-gradient(2px_2px_at_90%_60%,#00d4ff,transparent),radial-gradient(1px_1px_at_33%_80%,#00fff5,transparent)]
      before:bg-size-[200%_200%] before:bg-position-[0%_0%]
      before:animate-[particleFloat_20s_ease-in-out_infinite]
      before:opacity-30 before:z-0 before:pointer-events-none
    ">
        <header className="
        relative z-10
        bg-linear-to-b from-blockchain-medium/95 to-blockchain-dark/90
        backdrop-blur-[10px] px-2.5 py-5 text-blockchain-accent
        flex flex-col items-center
        border-b-2 border-primary-500
        shadow-[0_4px_30px_rgba(0,212,255,0.3),0_8px_60px_rgba(0,153,204,0.2)]
        after:content-[''] after:absolute after:inset-0
        after:bg-[linear-gradient(90deg,transparent,rgba(0,212,255,0.1),transparent)]
        after:animate-[holoScan_3s_linear_infinite] after:pointer-events-none
      ">
          <h1 className="
        text-4xl md:text-[2.2rem] m-0 font-bold tracking-[1px] md:tracking-[2px] relative z-1
        bg-linear-to-br from-blockchain-accent via-primary-500 to-purple-500
        bg-size-[200%_200%] bg-clip-text text-transparent
          animate-[gradientShift_4s_ease_infinite]
          [text-shadow:0_0_30px_rgba(0,255,245,0.5),0_0_60px_rgba(0,212,255,0.6)]
        ">
            Search Algorithm Visualizer
          </h1>
          <FeatureErrorBoundary featureName="Toolbar">
            <Toolbar
              selectedAlgorithm={selectedAlgorithm}
              isAnimating={isAnimating || isGenerating}
              onVisualize={handleVisualizeClick}
              onReset={handleResetBoard}
              onAlgorithmSelect={handleAlgorithmSelect}
              onSpeedSelect={handleSpeedSelect}
              onMazeSelect={handleMazeGeneration}
              // Undo/Redo
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
              // Save/Load
              savedGrids={savedGrids}
              onSaveGrid={saveGrid}
              onLoadGrid={loadGrid}
              onDeleteGrid={deleteGrid}
              onExportGrid={exportGrid}
              onImportGrid={importGrid}
              // Step Controls
              isStepping={isStepping}
              isPaused={isPaused}
              stepState={stepState}
              onInitializeStep={handleInitializeStepMode}
              onStepForward={stepForward}
              onStepBackward={stepBackward}
              onPlayStep={playStep}
              onPauseStep={pauseStep}
              onResetStep={resetStepMode}
              onJumpToStep={jumpToStep}
              // Comparison Mode
              onComparisonMode={activateComparisonMode}
              // Export
              isRecording={isRecording}
              recordingProgress={recordingProgress}
              onExportVisualization={handleExportVisualization}
              onExportImage={() => exportGridImage('grid-snapshot')}
            />
          </FeatureErrorBoundary>
        </header>

        <FeatureErrorBoundary featureName="Statistics & Legend">
          <div className="
          flex justify-center items-start gap-5 p-5 flex-wrap relative z-5
          bg-linear-to-b from-blockchain-dark/60 to-blockchain-medium/80
          backdrop-blur-[10px]
          border-b border-primary-500/30
          shadow-[0_4px_20px_rgba(0,212,255,0.15)]
          max-md:flex-col max-md:items-center max-md:p-3.75
        ">
            <Suspense fallback={<Loading message="Loading Legend..." size="small" />}>
              <InteractiveLegend
                currentDrawMode={currentDrawMode}
                onDrawModeChange={handleDrawModeChange}
              />
            </Suspense>
            <Suspense fallback={<Loading message="Loading Statistics..." size="small" />}>
              <AlgorithmStats stats={stats} />
            </Suspense>
          </div>
        </FeatureErrorBoundary>

        <main className="
        flex justify-center items-center px-5 py-10 mt-5 relative z-1
        before:content-[''] before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
        before:w-[90%] before:h-2 before:rounded-[50%] before:blur-sm
        before:bg-[linear-gradient(90deg,transparent,rgba(0,255,245,0.4)_20%,rgba(0,255,245,0.6)_50%,rgba(0,255,245,0.4)_80%,transparent)]
        before:shadow-[0_0_40px_rgba(0,255,245,0.5),0_0_80px_rgba(0,212,255,0.3)]
        before:animate-[platformPulse_3s_ease-in-out_infinite]
      ">
          <FeatureErrorBoundary featureName="Grid Visualization">
            <Grid />
          </FeatureErrorBoundary>
        </main>

        {/* Algorithm Comparison Modal */}
        {comparisonState.isActive && (
          <Suspense fallback={<Loading message="Loading Comparison Mode..." />}>
            <AlgorithmComparison
              grid={grid}
              algorithms={comparisonState.algorithms}
              results={comparisonState.results}
              isComparing={isComparing}
              onAlgorithmChange={setComparisonAlgorithms}
              onCompare={startComparison}
              onClose={deactivateComparisonMode}
            />
          </Suspense>
        )}
      </div>
    </>
  );
};

export default App;
