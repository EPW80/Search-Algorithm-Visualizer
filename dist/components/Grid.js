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
import { useState } from 'react';
import Cell from './Cell';
import { useGrid } from '../context/GridContext'; // Ensure this import doesn't conflict
import '../styles/Grid.css';
var Grid = function () {
    var _a = useGrid(), grid = _a.grid, updateCellState = _a.updateCellState;
    var _b = useState(false), mouseIsPressed = _b[0], setMouseIsPressed = _b[1];
    var _c = useState(null), draggedNodeType = _c[0], setDraggedNodeType = _c[1];
    var findStartOrEndNode = function (type) {
        for (var row = 0; row < grid.length; row++) {
            for (var col = 0; col < grid[row].length; col++) {
                if (type === 'start' && grid[row][col].isStart)
                    return [row, col];
                if (type === 'end' && grid[row][col].isEnd)
                    return [row, col];
            }
        }
        return [-1, -1]; // If no node is found, return an invalid position.
    };
    var handleMouseDown = function (row, col) {
        var cell = grid[row][col];
        if (cell.isStart) {
            setDraggedNodeType('start');
        }
        else if (cell.isEnd) {
            setDraggedNodeType('end');
        }
        else {
            updateCellState(row, col, { isWall: !cell.isWall });
        }
        setMouseIsPressed(true);
    };
    var handleMouseEnter = function (row, col) {
        if (!mouseIsPressed)
            return;
        var cell = grid[row][col];
        if (draggedNodeType === 'start') {
            var _a = findStartOrEndNode('start'), startRow = _a[0], startCol = _a[1];
            if (startRow !== -1 && startCol !== -1) {
                updateCellState(row, col, { isStart: true });
                updateCellState(startRow, startCol, { isStart: false });
            }
        }
        else if (draggedNodeType === 'end') {
            var _b = findStartOrEndNode('end'), endRow = _b[0], endCol = _b[1];
            if (endRow !== -1 && endCol !== -1) {
                updateCellState(row, col, { isEnd: true });
                updateCellState(endRow, endCol, { isEnd: false });
            }
        }
        else {
            updateCellState(row, col, { isWall: !cell.isWall });
        }
    };
    var handleMouseUp = function () {
        setMouseIsPressed(false);
        setDraggedNodeType(null);
    };
    return (_jsx("div", __assign({ className: "grid" }, { children: grid.map(function (row, rowIdx) { return (_jsx("div", __assign({ className: "grid-row" }, { children: row.map(function (cell, cellIdx) { return (_jsx(Cell, { row: cell.row, col: cell.col, isStart: cell.isStart, isEnd: cell.isEnd, isWall: cell.isWall, onMouseDown: function () { return handleMouseDown(cell.row, cell.col); }, onMouseEnter: function () { return handleMouseEnter(cell.row, cell.col); }, onMouseUp: handleMouseUp }, cellIdx)); }) }), rowIdx)); }) })));
};
export default Grid;
