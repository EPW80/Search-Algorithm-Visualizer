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
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridProvider } from '../context/GridContext';
import Grid from '../components/Grid';
import '../styles/App.css';
import '../styles/Dropdown.css'; // Import dropdown styles
var App = function () {
    var handleAlgorithmSelect = function (algorithm) {
        console.log("Selected algorithm: ".concat(algorithm));
        // Implement your logic to set the selected algorithm
    };
    return (_jsx(GridProvider, { children: _jsxs("div", __assign({ className: "App" }, { children: [_jsxs("header", __assign({ className: "App-header" }, { children: [_jsx("h1", { children: "Search Algorithm Visualizer" }), _jsxs("div", __assign({ className: "controls" }, { children: [_jsx("button", __assign({ className: "btn select-algorithm-btn" }, { children: "Select an algorithm!" })), _jsx("button", __assign({ className: "btn reset-board-btn" }, { children: "Reset Board" })), _jsx("div", __assign({ className: "dropdown" }, { children: _jsx("button", __assign({ className: "btn dropdown-btn" }, { children: "Mazes & Patterns" })) })), _jsxs("div", __assign({ className: "dropdown" }, { children: [_jsx("button", __assign({ className: "btn dropdown-btn" }, { children: "Algorithms" })), _jsxs("div", __assign({ className: "dropdown-content" }, { children: [_jsx("a", __assign({ href: "#", onClick: function () { return handleAlgorithmSelect('BFS'); } }, { children: "Breadth First Search" })), _jsx("a", __assign({ href: "#", onClick: function () { return handleAlgorithmSelect('DFS'); } }, { children: "Depth First Search" })), _jsx("a", __assign({ href: "#", onClick: function () { return handleAlgorithmSelect('GBFS'); } }, { children: "Greedy Best First Search" })), _jsx("a", __assign({ href: "#", onClick: function () { return handleAlgorithmSelect('Dijkstra'); } }, { children: "Djikstra's Algorithm" })), _jsx("a", __assign({ href: "#", onClick: function () { return handleAlgorithmSelect('A*'); } }, { children: "A* Search" }))] }))] })), _jsx("div", __assign({ className: "dropdown" }, { children: _jsx("button", __assign({ className: "btn dropdown-btn" }, { children: "Speed" })) }))] }))] })), _jsxs("div", __assign({ className: "legend" }, { children: [_jsxs("div", __assign({ className: "legend-item" }, { children: [_jsx("span", { className: "legend-icon start-node" }), " Start Node"] })), _jsxs("div", __assign({ className: "legend-item" }, { children: [_jsx("span", { className: "legend-icon target-node" }), " Target Node"] })), _jsxs("div", __assign({ className: "legend-item" }, { children: [_jsx("span", { className: "legend-icon weight-node" }), " Weight Node"] })), _jsxs("div", __assign({ className: "legend-item" }, { children: [_jsx("span", { className: "legend-icon path-node" }), " Path Node"] })), _jsxs("div", __assign({ className: "legend-item" }, { children: [_jsx("span", { className: "legend-icon visited-node" }), " Visited Node"] })), _jsxs("div", __assign({ className: "legend-item" }, { children: [_jsx("span", { className: "legend-icon unvisited-node" }), " Unvisited Node"] })), _jsxs("div", __assign({ className: "legend-item" }, { children: [_jsx("span", { className: "legend-icon wall-node" }), " Wall Node"] }))] })), _jsx("main", { children: _jsx(Grid, {}) })] })) }));
};
export default App;
