var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useContext } from 'react';
// Create the context with a default value
var GridContext = createContext(undefined);
// Create a provider component
export var GridProvider = function (_a) {
    var children = _a.children;
    var _b = useState(createInitialGrid()), grid = _b[0], setGrid = _b[1];
    var updateCellState = function (row, col, newState) {
        setGrid(function (prevGrid) {
            var newGrid = prevGrid.slice();
            newGrid[row][col] = __assign(__assign({}, newGrid[row][col]), newState);
            return newGrid;
        });
    };
    return (_jsx(GridContext.Provider, __assign({ value: { grid: grid, setGrid: setGrid, updateCellState: updateCellState } }, { children: children })));
};
// Custom hook for consuming the grid context
export var useGrid = function () {
    var context = useContext(GridContext);
    if (!context) {
        throw new Error('useGrid must be used within a GridProvider');
    }
    return context;
};
// Reuse your existing functions for creating the grid
var createInitialGrid = function () {
    var _a = getGridDimensions(), rows = _a[0], columns = _a[1];
    var grid = [];
    for (var row = 0; row < rows; row++) {
        var currentRow = [];
        for (var col = 0; col < columns; col++) {
            currentRow.push(createCell(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};
var createCell = function (col, row) {
    return {
        col: col,
        row: row,
        isStart: row === 10 && col === 5,
        isEnd: row === 10 && col === 45,
        isWall: false,
    };
};
var getGridDimensions = function () {
    var columns = Math.floor(window.innerWidth / 25);
    var rows = Math.floor(window.innerHeight / 25) - 2;
    return [rows, columns];
};
