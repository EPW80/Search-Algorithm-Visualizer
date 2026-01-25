/**
 * Toolbar Component - Main control bar
 */

import React from 'react';
import { AnimationSpeedType } from '../../types';
import { ActionButtons } from './ActionButtons';
import { AlgorithmSelector } from './AlgorithmSelector';
import { ExportControls } from './ExportControls';
import { MazeSelector } from './MazeSelector';
import { SaveLoadControls } from './SaveLoadControls';
import { SpeedSelector } from './SpeedSelector';
import { StepControls } from './StepControls';
import { UndoRedoButtons } from './UndoRedoButtons';

interface SavedGrid {
  id: string;
  name: string;
  timestamp: number;
}

interface StepState {
  currentStep: number;
  totalSteps: number;
  phase: 'idle' | 'exploring' | 'path' | 'complete';
}

interface ToolbarProps {
  selectedAlgorithm: string | null;
  isAnimating: boolean;
  onVisualize: () => void;
  onReset: () => void;
  onAlgorithmSelect: (algorithm: string) => void;
  onSpeedSelect: (speed: AnimationSpeedType) => void;
  onMazeSelect: (mazeType: string) => void;
  // Undo/Redo
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  // Save/Load
  savedGrids?: SavedGrid[];
  onSaveGrid?: (name: string) => boolean;
  onLoadGrid?: (id: string) => boolean;
  onDeleteGrid?: (id: string) => boolean;
  onExportGrid?: (name: string) => void;
  onImportGrid?: (file: File) => Promise<boolean>;
  // Step Controls
  isStepping?: boolean;
  isPaused?: boolean;
  stepState?: StepState;
  onInitializeStep?: () => void;
  onStepForward?: () => void;
  onStepBackward?: () => void;
  onPlayStep?: () => void;
  onPauseStep?: () => void;
  onResetStep?: () => void;
  onJumpToStep?: (step: number) => void;
  // Comparison Mode
  onComparisonMode?: () => void;
  // Export
  isRecording?: boolean;
  recordingProgress?: number;
  onExportVisualization?: () => void;
  onExportImage?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedAlgorithm,
  isAnimating,
  onVisualize,
  onReset,
  onAlgorithmSelect,
  onSpeedSelect,
  onMazeSelect,
  // Undo/Redo
  canUndo = false,
  canRedo = false,
  onUndo = () => { },
  onRedo = () => { },
  // Save/Load
  savedGrids = [],
  onSaveGrid = () => false,
  onLoadGrid = () => false,
  onDeleteGrid = () => false,
  onExportGrid = () => { },
  onImportGrid = async () => false,
  // Step Controls
  isStepping = false,
  isPaused = false,
  stepState = { currentStep: 0, totalSteps: 0, phase: 'idle' as const },
  onInitializeStep = () => { },
  onStepForward = () => { },
  onStepBackward = () => { },
  onPlayStep = () => { },
  onPauseStep = () => { },
  onResetStep = () => { },
  onJumpToStep = () => { },
  // Comparison Mode
  onComparisonMode = () => { },
  // Export
  isRecording = false,
  recordingProgress = 0,
  onExportVisualization = () => { },
  onExportImage = () => { },
}) => {
  return (
    <div className="controls flex flex-wrap items-center justify-center gap-3 py-2">
      {/* Primary Actions */}
      <div className="flex items-center gap-2">
        <ActionButtons
          selectedAlgorithm={selectedAlgorithm}
          isAnimating={isAnimating || isStepping}
          onVisualize={onVisualize}
          onReset={onReset}
        />
      </div>

      {/* Algorithm & Speed Selection */}
      <div className="flex items-center gap-2">
        <AlgorithmSelector onSelect={onAlgorithmSelect} disabled={isAnimating || isStepping} />
        <SpeedSelector onSelect={onSpeedSelect} disabled={isAnimating} />
        <MazeSelector onSelect={onMazeSelect} disabled={isAnimating || isStepping} />
      </div>

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-blockchain-accent/30" />

      {/* Undo/Redo */}
      <UndoRedoButtons
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={onUndo}
        onRedo={onRedo}
        disabled={isAnimating || isStepping}
      />

      {/* Step Controls */}
      <StepControls
        isStepping={isStepping}
        isPaused={isPaused}
        stepState={stepState}
        onInitialize={onInitializeStep}
        onStepForward={onStepForward}
        onStepBackward={onStepBackward}
        onPlay={onPlayStep}
        onPause={onPauseStep}
        onReset={onResetStep}
        onJumpToStep={onJumpToStep}
        selectedAlgorithm={selectedAlgorithm}
        disabled={isAnimating}
      />

      {/* Divider */}
      <div className="hidden md:block w-px h-8 bg-blockchain-accent/30" />

      {/* Comparison Mode */}
      <button
        onClick={onComparisonMode}
        disabled={isAnimating || isStepping}
        className="
          btn
          px-4 py-2 rounded-lg
          bg-orange-500/30 text-orange-300
          border border-orange-400/30
          hover:bg-orange-500/40 hover:border-orange-400/50
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center gap-2
        "
        title="Compare two algorithms side-by-side"
      >
        <span>⚔️</span>
        <span className="hidden sm:inline">Compare</span>
      </button>

      {/* Save/Load */}
      <SaveLoadControls
        savedGrids={savedGrids}
        onSave={onSaveGrid}
        onLoad={onLoadGrid}
        onDelete={onDeleteGrid}
        onExport={onExportGrid}
        onImport={onImportGrid}
        disabled={isAnimating || isStepping}
      />

      {/* Export */}
      <ExportControls
        isRecording={isRecording}
        recordingProgress={recordingProgress}
        onExportVisualization={onExportVisualization}
        onExportImage={onExportImage}
        disabled={isAnimating || isStepping}
      />
    </div>
  );
};
