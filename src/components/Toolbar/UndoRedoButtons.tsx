/**
 * Undo/Redo Buttons Component
 */

import React from 'react';

interface UndoRedoButtonsProps {
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
    disabled?: boolean;
}

export const UndoRedoButtons: React.FC<UndoRedoButtonsProps> = ({
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    disabled = false,
}) => {
    return (
        <div className="flex gap-1">
            <button
                onClick={onUndo}
                disabled={disabled || !canUndo}
                className="
          btn btn-icon
          px-3 py-2 rounded-lg
          bg-blockchain-light/50 text-white
          border border-blockchain-accent/30
          hover:bg-blockchain-accent/20 hover:border-blockchain-accent/60
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
        "
                title="Undo (Ctrl+Z)"
                aria-label="Undo last action"
            >
                <span className="text-lg">↩</span>
            </button>
            <button
                onClick={onRedo}
                disabled={disabled || !canRedo}
                className="
          btn btn-icon
          px-3 py-2 rounded-lg
          bg-blockchain-light/50 text-white
          border border-blockchain-accent/30
          hover:bg-blockchain-accent/20 hover:border-blockchain-accent/60
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
        "
                title="Redo (Ctrl+Y)"
                aria-label="Redo last action"
            >
                <span className="text-lg">↪</span>
            </button>
        </div>
    );
};
