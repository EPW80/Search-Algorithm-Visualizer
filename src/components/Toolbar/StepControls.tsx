/**
 * Step Controls Component for Step-by-Step Execution
 */

import React from 'react';

interface StepState {
    currentStep: number;
    totalSteps: number;
    phase: 'idle' | 'exploring' | 'path' | 'complete';
}

interface StepControlsProps {
    isStepping: boolean;
    isPaused: boolean;
    stepState: StepState;
    onInitialize: () => void;
    onStepForward: () => void;
    onStepBackward: () => void;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    onJumpToStep: (step: number) => void;
    selectedAlgorithm: string | null;
    disabled?: boolean;
}

export const StepControls: React.FC<StepControlsProps> = ({
    isStepping,
    isPaused,
    stepState,
    onInitialize,
    onStepForward,
    onStepBackward,
    onPlay,
    onPause,
    onReset,
    onJumpToStep,
    selectedAlgorithm,
    disabled = false,
}) => {
    const { currentStep, totalSteps, phase } = stepState;
    const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

    const getPhaseLabel = () => {
        switch (phase) {
            case 'exploring':
                return 'Exploring';
            case 'path':
                return 'Drawing Path';
            case 'complete':
                return 'Complete';
            default:
                return 'Ready';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'exploring':
                return 'text-cyan-400';
            case 'path':
                return 'text-green-400';
            case 'complete':
                return 'text-blockchain-accent';
            default:
                return 'text-gray-400';
        }
    };

    if (!isStepping) {
        return (
            <button
                onClick={onInitialize}
                disabled={disabled || !selectedAlgorithm}
                className="
          btn
          px-4 py-2 rounded-lg
          bg-purple-500/30 text-purple-300
          border border-purple-400/30
          hover:bg-purple-500/40 hover:border-purple-400/50
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center gap-2
        "
                title="Enter step-by-step mode"
            >
                <span>⏯</span>
                <span className="hidden sm:inline">Step Mode</span>
            </button>
        );
    }

    return (
        <div className="
      flex flex-col sm:flex-row items-center gap-3
      bg-blockchain-light/30 rounded-lg
      px-4 py-2 border border-blockchain-accent/30
    ">
            {/* Step Controls */}
            <div className="flex items-center gap-1">
                <button
                    onClick={onStepBackward}
                    disabled={currentStep === 0}
                    className="
            px-2 py-1 rounded
            bg-blockchain-accent/20 text-blockchain-accent
            hover:bg-blockchain-accent/30
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all
          "
                    title="Step backward"
                    aria-label="Step backward"
                >
                    ⏮
                </button>

                {isPaused ? (
                    <button
                        onClick={onPlay}
                        disabled={phase === 'complete'}
                        className="
              px-3 py-1 rounded
              bg-green-500/30 text-green-400
              hover:bg-green-500/40
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all
            "
                        title="Play"
                        aria-label="Play animation"
                    >
                        ▶
                    </button>
                ) : (
                    <button
                        onClick={onPause}
                        className="
              px-3 py-1 rounded
              bg-yellow-500/30 text-yellow-400
              hover:bg-yellow-500/40
              transition-all
            "
                        title="Pause"
                        aria-label="Pause animation"
                    >
                        ⏸
                    </button>
                )}

                <button
                    onClick={onStepForward}
                    disabled={phase === 'complete'}
                    className="
            px-2 py-1 rounded
            bg-blockchain-accent/20 text-blockchain-accent
            hover:bg-blockchain-accent/30
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all
          "
                    title="Step forward"
                    aria-label="Step forward"
                >
                    ⏭
                </button>

                <button
                    onClick={onReset}
                    className="
            px-2 py-1 rounded
            bg-red-500/20 text-red-400
            hover:bg-red-500/30
            transition-all ml-1
          "
                    title="Exit step mode"
                    aria-label="Exit step mode"
                >
                    ✕
                </button>
            </div>

            {/* Progress Info */}
            <div className="flex flex-col items-center sm:items-start min-w-25">
                <div className="text-xs text-gray-400">
                    Step {currentStep} / {totalSteps}
                </div>
                <div className={`text-xs font-semibold ${getPhaseColor()}`}>
                    {getPhaseLabel()}
                </div>
            </div>

            {/* Progress Slider */}
            <div className="flex-1 min-w-25 max-w-50">
                <input
                    type="range"
                    min="0"
                    max={totalSteps}
                    value={currentStep}
                    onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
                    className="
            w-full h-2 rounded-lg appearance-none cursor-pointer
            bg-blockchain-light/50
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-blockchain-accent
            [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,255,245,0.5)]
          "
                />
                <div
                    className="h-0.5 bg-blockchain-accent/50 rounded-full -mt-1.5 pointer-events-none"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
};
