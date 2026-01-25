import React, { useState } from 'react';

export interface LegendItem {
    id: string;
    label: string;
    className: string;
    description: string;
    editable?: boolean;
}

interface InteractiveLegendProps {
    currentDrawMode?: string;
    onDrawModeChange?: (mode: string) => void;
}

export const InteractiveLegend: React.FC<InteractiveLegendProps> = ({
    currentDrawMode = 'wall',
    onDrawModeChange
}) => {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const legendItems: LegendItem[] = [
        {
            id: 'start',
            label: 'Start Node',
            className: 'start-node',
            description: 'The beginning point of the path. Drag to move.',
            editable: false
        },
        {
            id: 'end',
            label: 'Target Node',
            className: 'target-node',
            description: 'The destination point. Drag to move.',
            editable: false
        },
        {
            id: 'wall',
            label: 'Wall Node',
            className: 'wall-node',
            description: 'Blocks the path. Click or drag to draw.',
            editable: true
        },
        {
            id: 'weight',
            label: 'Weight Node',
            className: 'weight-node',
            description: 'Adds cost to path (10x normal). Right-click to add.',
            editable: true
        },
        {
            id: 'path',
            label: 'Path Node',
            className: 'path-node',
            description: 'The shortest path found by the algorithm.',
            editable: false
        },
        {
            id: 'visited',
            label: 'Visited Node',
            className: 'visited-node',
            description: 'Nodes explored during search.',
            editable: false
        },
        {
            id: 'unvisited',
            label: 'Unvisited Node',
            className: 'unvisited-node',
            description: 'Default empty nodes.',
            editable: false
        }
    ];

    const handleItemClick = (item: LegendItem) => {
        if (item.editable && onDrawModeChange) {
            onDrawModeChange(item.id);
        }
        setExpandedItem(expandedItem === item.id ? null : item.id);
    };

    const getIconClasses = (className: string) => {
        const baseClasses = "w-5 h-5 rounded flex-shrink-0 border-2 border-white/30 relative transition-all duration-300 shadow-[0_0_10px_rgba(0,212,255,0.3)]";

        const typeClasses: Record<string, string> = {
            'start-node': "bg-gradient-to-br from-green-400 to-green-600 border-green-400 shadow-[0_0_15px_rgba(0,255,136,0.7)] after:content-['▶'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-[10px] after:leading-none after:[text-shadow:0_0_5px_rgba(0,0,0,0.5)]",
            'target-node': "bg-gradient-to-br from-pink-600 to-rose-700 border-pink-600 shadow-[0_0_15px_rgba(255,0,128,0.7)]",
            'wall-node': "bg-gradient-to-br from-blockchain-light to-blockchain-dark border-gray-600 shadow-[inset_0_0_10px_rgba(0,0,0,0.8),0_0_8px_rgba(0,212,255,0.2)]",
            'weight-node': "bg-[radial-gradient(circle,#ffd700,#ffaa00)] border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.7)] after:content-['W'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-[10px] after:font-bold after:leading-none after:[text-shadow:0_0_5px_rgba(0,0,0,0.5)]",
            'path-node': "bg-gradient-to-br from-blockchain-accent to-primary-500 border-blockchain-accent shadow-[0_0_20px_rgba(0,255,245,0.8)] animate-[pathPulse_2s_infinite]",
            'visited-node': "bg-gradient-to-br from-primary-500 to-secondary-500 border-primary-500 shadow-[0_0_12px_rgba(0,212,255,0.7)] opacity-90",
            'unvisited-node': "bg-white/5 border-primary-500/40 shadow-[inset_0_0_10px_rgba(0,212,255,0.2)]",
        };

        return `${baseClasses} ${typeClasses[className] || ''}`;
    };

    return (
        <div className="
            relative overflow-hidden
            bg-gradient-to-b from-blockchain-medium/95 to-blockchain-dark/90
            backdrop-blur-[15px]
            border-2 border-primary-500/50 rounded-xl p-5
            shadow-[0_8px_32px_rgba(0,212,255,0.4),0_4px_16px_rgba(0,153,204,0.3),inset_0_1px_0_rgba(0,255,245,0.2)]
            min-w-[320px] max-w-[360px]
            before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5
            before:bg-[linear-gradient(90deg,transparent,rgba(0,255,245,0.8),transparent)]
            before:animate-[legendScan_3s_linear_infinite]
            after:content-[''] after:absolute after:inset-0
            after:bg-[linear-gradient(rgba(0,212,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)]
            after:bg-[length:20px_20px] after:pointer-events-none after:opacity-60
            max-md:min-w-[280px] max-md:max-w-[320px] max-md:p-4
        ">
            <div className="
                flex justify-between items-center mb-[18px] max-md:mb-3.5
                font-bold text-lg max-md:text-base text-blockchain-accent
                border-b-2 border-primary-500/40 pb-2.5
                [text-shadow:0_0_15px_rgba(0,255,245,0.6)]
                uppercase tracking-[2px] relative z-[1]
            ">
                <span>Node Types</span>
                {onDrawModeChange && (
                    <span className="
                        text-[11px] max-md:text-[10px]
                        bg-gradient-to-br from-secondary-500 to-primary-500
                        text-white px-3 py-1 max-md:px-2.5 max-md:py-1
                        rounded-2xl font-semibold uppercase
                        border border-blockchain-accent
                        shadow-[0_0_15px_rgba(0,212,255,0.6),inset_0_-1px_4px_rgba(0,0,0,0.3)]
                        tracking-[1px]
                    ">
                        Drawing: {currentDrawMode}
                    </span>
                )}
            </div>

            <div className="mb-[18px] relative z-[1]">
                {legendItems.map(item => (
                    <div
                        key={item.id}
                        className={`
                            mb-2.5 rounded-lg transition-all duration-300
                            border border-transparent relative overflow-hidden
                            ${item.editable ? 'cursor-pointer' : ''}
                            ${item.editable ? 'hover:bg-[linear-gradient(90deg,rgba(0,212,255,0.1),rgba(0,255,245,0.15),rgba(0,212,255,0.1))] hover:translate-x-1 hover:border-primary-500/30 hover:shadow-[0_4px_15px_rgba(0,212,255,0.3),inset_0_0_20px_rgba(0,255,245,0.1)]' : ''}
                            ${currentDrawMode === item.id ? 'bg-[linear-gradient(90deg,rgba(0,153,204,0.2),rgba(0,212,255,0.3),rgba(0,153,204,0.2))] border-2 !border-primary-500 shadow-[0_4px_20px_rgba(0,212,255,0.5),inset_0_0_30px_rgba(0,255,245,0.15)] before:content-[\'\'] before:absolute before:inset-0 before:border-2 before:border-blockchain-accent before:rounded-lg before:animate-[activePulse_2s_ease-in-out_infinite] before:pointer-events-none' : ''}
                        `}
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="flex items-center p-2.5 px-3.5 max-md:p-2 max-md:px-3 gap-3.5 max-md:gap-2.5 relative z-[1]">
                            <span className={getIconClasses(item.className)}></span>
                            <span className="flex-1 text-sm max-md:text-[13px] font-medium text-sky-100 tracking-[0.5px]">
                                {item.label}
                            </span>
                            {item.editable && (
                                <span className={`
                                    text-[10px] max-md:text-[9px] px-2 py-0.5 max-md:px-1.5
                                    rounded-xl font-semibold uppercase tracking-[0.5px]
                                    ${currentDrawMode === item.id
                                        ? 'bg-gradient-to-br from-primary-500 to-blockchain-accent text-white border border-blockchain-accent shadow-[0_0_15px_rgba(0,255,245,0.6)]'
                                        : 'bg-gradient-to-br from-green-500/30 to-green-600/30 text-green-400 border border-green-400 shadow-[0_0_10px_rgba(0,255,136,0.4)]'
                                    }
                                `}>
                                    {currentDrawMode === item.id ? '✓' : 'Click'}
                                </span>
                            )}
                        </div>

                        {expandedItem === item.id && (
                            <div className="
                                p-2.5 px-3.5 text-xs text-sky-200
                                bg-primary-500/[0.08] border-t border-primary-500/20
                                rounded-b-lg -mt-1
                                animate-[expandDescription_0.3s_ease-out]
                                leading-relaxed
                            ">
                                {item.description}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="
                border-t-2 border-primary-500/30 pt-3.5
                text-xs text-sky-200 relative z-[1]
            ">
                <p className="
                    m-0 mb-2.5 font-bold text-blockchain-accent
                    uppercase tracking-[1px] text-[13px]
                ">
                    <strong>Tips:</strong>
                </p>
                <ul className="m-0 pl-[18px] list-none">
                    <li className="
                        mb-1.5 leading-relaxed relative pl-2
                        before:content-['▸'] before:absolute before:-left-2.5
                        before:text-primary-500 before:[text-shadow:0_0_10px_rgba(0,212,255,0.8)]
                    ">
                        Click and drag to draw walls
                    </li>
                    <li className="
                        mb-1.5 leading-relaxed relative pl-2
                        before:content-['▸'] before:absolute before:-left-2.5
                        before:text-primary-500 before:[text-shadow:0_0_10px_rgba(0,212,255,0.8)]
                    ">
                        Hold Shift + Click for weights
                    </li>
                    <li className="
                        mb-1.5 leading-relaxed relative pl-2
                        before:content-['▸'] before:absolute before:-left-2.5
                        before:text-primary-500 before:[text-shadow:0_0_10px_rgba(0,212,255,0.8)]
                    ">
                        Drag start/end nodes to reposition
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default InteractiveLegend;