/**
 * Export Controls Component for GIF/Image Export
 */

import React, { useState } from 'react';

interface ExportControlsProps {
    isRecording: boolean;
    recordingProgress: number;
    onExportVisualization: () => void;
    onExportImage: () => void;
    disabled?: boolean;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
    isRecording,
    recordingProgress,
    onExportVisualization,
    onExportImage,
    disabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled || isRecording}
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
                title="Export visualization"
            >
                {isRecording ? (
                    <>
                        <span className="animate-pulse">🔴</span>
                        <span className="hidden sm:inline">{Math.round(recordingProgress)}%</span>
                    </>
                ) : (
                    <>
                        <span>📹</span>
                        <span className="hidden sm:inline">Export</span>
                    </>
                )}
            </button>

            {isOpen && !isRecording && (
                <div className="
          absolute top-full mt-2 right-0 z-50
          bg-blockchain-dark border border-blockchain-accent/50 rounded-lg
          shadow-[0_0_20px_rgba(0,255,245,0.3)]
          p-4 min-w-50
        ">
                    <h4 className="text-sm font-semibold text-blockchain-accent mb-3">Export Options</h4>

                    <div className="space-y-2">
                        <button
                            onClick={() => {
                                onExportVisualization();
                                setIsOpen(false);
                            }}
                            className="
                w-full px-3 py-2 rounded
                bg-purple-500/20 text-purple-300
                hover:bg-purple-500/30
                text-sm text-left
                flex items-center gap-2
              "
                        >
                            <span>🎬</span>
                            <div>
                                <div className="font-semibold">Export Animation</div>
                                <div className="text-xs text-gray-400">WebM video of algorithm</div>
                            </div>
                        </button>

                        <button
                            onClick={() => {
                                onExportImage();
                                setIsOpen(false);
                            }}
                            className="
                w-full px-3 py-2 rounded
                bg-blue-500/20 text-blue-300
                hover:bg-blue-500/30
                text-sm text-left
                flex items-center gap-2
              "
                        >
                            <span>📸</span>
                            <div>
                                <div className="font-semibold">Export Image</div>
                                <div className="text-xs text-gray-400">PNG snapshot of grid</div>
                            </div>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Recording Progress Overlay */}
            {isRecording && (
                <div className="
          absolute top-full mt-2 right-0 z-50
          bg-blockchain-dark border border-blockchain-accent/50 rounded-lg
          shadow-[0_0_20px_rgba(0,255,245,0.3)]
          p-4 min-w-50
        ">
                    <div className="text-sm text-white mb-2">Recording visualization...</div>
                    <div className="w-full h-2 bg-blockchain-light/30 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blockchain-accent transition-all duration-100"
                            style={{ width: `${recordingProgress}%` }}
                        />
                    </div>
                    <div className="text-xs text-gray-400 mt-1 text-center">
                        {Math.round(recordingProgress)}%
                    </div>
                </div>
            )}
        </div>
    );
};
