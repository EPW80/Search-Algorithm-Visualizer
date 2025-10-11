import React, { useState } from 'react';
import '../styles/InteractiveLegend.css';

export interface LegendItem {
    id: string;
    label: string;
    className: string;
    description: string;
    editable?: boolean;
}

interface InteractiveLegendProps {
    onToggleNodeType?: (nodeType: string) => void;
    currentDrawMode?: string;
    onDrawModeChange?: (mode: string) => void;
}

export const InteractiveLegend: React.FC<InteractiveLegendProps> = ({
    onToggleNodeType,
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

    return (
        <div className="interactive-legend">
            <div className="legend-title">
                <span>Node Types</span>
                {onDrawModeChange && (
                    <span className="current-mode">Drawing: {currentDrawMode}</span>
                )}
            </div>

            <div className="legend-items">
                {legendItems.map(item => (
                    <div
                        key={item.id}
                        className={`legend-item-container ${currentDrawMode === item.id ? 'active' : ''} ${item.editable ? 'clickable' : ''}`}
                        onClick={() => handleItemClick(item)}
                    >
                        <div className="legend-item">
                            <span className={`legend-icon ${item.className}`}></span>
                            <span className="legend-label">{item.label}</span>
                            {item.editable && (
                                <span className="legend-badge">
                                    {currentDrawMode === item.id ? '✓' : 'Click'}
                                </span>
                            )}
                        </div>

                        {expandedItem === item.id && (
                            <div className="legend-description">
                                {item.description}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="legend-tips">
                <p><strong>Tips:</strong></p>
                <ul>
                    <li>Click and drag to draw walls</li>
                    <li>Hold Shift + Click for weights</li>
                    <li>Drag start/end nodes to reposition</li>
                </ul>
            </div>
        </div>
    );
};