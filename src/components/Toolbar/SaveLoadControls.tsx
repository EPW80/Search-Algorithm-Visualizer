/**
 * Save/Load Grid Controls Component
 */

import React, { useRef, useState } from 'react';

interface SavedGrid {
    id: string;
    name: string;
    timestamp: number;
}

interface SaveLoadControlsProps {
    savedGrids: SavedGrid[];
    onSave: (name: string) => boolean;
    onLoad: (id: string) => boolean;
    onDelete: (id: string) => boolean;
    onExport: (name: string) => void;
    onImport: (file: File) => Promise<boolean>;
    disabled?: boolean;
}

export const SaveLoadControls: React.FC<SaveLoadControlsProps> = ({
    savedGrids,
    onSave,
    onLoad,
    onDelete,
    onExport,
    onImport,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [saveName, setSaveName] = useState('');
    const [showSaveInput, setShowSaveInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSave = () => {
        if (saveName.trim()) {
            const success = onSave(saveName.trim());
            if (success) {
                setSaveName('');
                setShowSaveInput(false);
            }
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await onImport(file);
            e.target.value = ''; // Reset input
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="
          btn
          px-4 py-2 rounded-lg
          bg-blockchain-light/50 text-white
          border border-blockchain-accent/30
          hover:bg-blockchain-accent/20 hover:border-blockchain-accent/60
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center gap-2
        "
            >
                <span>💾</span>
                <span className="hidden sm:inline">Save/Load</span>
            </button>

            {isOpen && (
                <div className="
          absolute top-full mt-2 right-0 z-50
          bg-blockchain-dark border border-blockchain-accent/50 rounded-lg
          shadow-[0_0_20px_rgba(0,255,245,0.3)]
          p-4 min-w-70
        ">
                    {/* Save Section */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-blockchain-accent mb-2">Save Grid</h4>
                        {showSaveInput ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={saveName}
                                    onChange={(e) => setSaveName(e.target.value)}
                                    placeholder="Enter name..."
                                    className="
                    flex-1 px-3 py-1.5 rounded
                    bg-blockchain-light/30 text-white
                    border border-blockchain-accent/30
                    focus:outline-none focus:border-blockchain-accent
                    text-sm
                  "
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                                />
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1.5 rounded bg-blockchain-accent text-blockchain-dark text-sm font-semibold"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSaveInput(false);
                                        setSaveName('');
                                    }}
                                    className="px-3 py-1.5 rounded bg-gray-600 text-white text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowSaveInput(true)}
                                className="w-full px-3 py-2 rounded bg-blockchain-accent/20 text-white hover:bg-blockchain-accent/30 text-sm"
                            >
                                + Save Current Grid
                            </button>
                        )}
                    </div>

                    {/* Saved Grids List */}
                    <div className="mb-4">
                        <h4 className="text-sm font-semibold text-blockchain-accent mb-2">
                            Saved Grids ({savedGrids.length})
                        </h4>
                        <div className="max-h-37.5 overflow-y-auto space-y-1">
                            {savedGrids.length === 0 ? (
                                <p className="text-gray-400 text-sm italic">No saved grids</p>
                            ) : (
                                savedGrids.map((grid) => (
                                    <div
                                        key={grid.id}
                                        className="flex items-center justify-between gap-2 p-2 rounded bg-blockchain-light/20 hover:bg-blockchain-light/30"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm truncate">{grid.name}</p>
                                            <p className="text-gray-400 text-xs">{formatDate(grid.timestamp)}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => {
                                                    onLoad(grid.id);
                                                    setIsOpen(false);
                                                }}
                                                className="px-2 py-1 rounded bg-blockchain-accent/20 text-blockchain-accent text-xs hover:bg-blockchain-accent/30"
                                            >
                                                Load
                                            </button>
                                            <button
                                                onClick={() => onDelete(grid.id)}
                                                className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Import/Export Section */}
                    <div className="border-t border-blockchain-accent/20 pt-3">
                        <h4 className="text-sm font-semibold text-blockchain-accent mb-2">Import/Export</h4>
                        <div className="flex gap-2">
                            <button
                                onClick={() => onExport('grid-export')}
                                className="flex-1 px-3 py-2 rounded bg-purple-500/20 text-purple-300 text-sm hover:bg-purple-500/30"
                            >
                                📤 Export JSON
                            </button>
                            <button
                                onClick={handleImportClick}
                                className="flex-1 px-3 py-2 rounded bg-blue-500/20 text-blue-300 text-sm hover:bg-blue-500/30"
                            >
                                📥 Import JSON
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".json"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            )}
        </div>
    );
};
