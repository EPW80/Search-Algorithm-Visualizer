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
var App = function () {
    return (_jsx(GridProvider, { children: _jsxs("div", __assign({ className: "App" }, { children: [_jsxs("header", __assign({ className: "App-header" }, { children: [_jsx("h1", { children: "Search Algorithm Visualizer" }), _jsxs("div", __assign({ className: "controls" }, { children: [_jsx("button", __assign({ className: "btn" }, { children: "Select an algorithm!" })), _jsx("button", __assign({ className: "btn reset-btn" }, { children: "Reset Board" })), _jsx("div", __assign({ className: "dropdown" }, { children: _jsx("button", __assign({ className: "btn dropdown-btn" }, { children: "Mazes & Patterns" })) })), _jsx("div", __assign({ className: "dropdown" }, { children: _jsx("button", __assign({ className: "btn dropdown-btn" }, { children: "Algorithms" })) })), _jsx("div", __assign({ className: "dropdown" }, { children: _jsx("button", __assign({ className: "btn dropdown-btn" }, { children: "Speed" })) }))] }))] })), _jsx("main", { children: _jsx(Grid, {}) })] })) }));
};
export default App;
