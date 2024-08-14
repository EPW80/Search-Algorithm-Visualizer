import { jsx as _jsx } from "react/jsx-runtime";
import '../styles/Cell.css';
var Cell = function (_a) {
    var row = _a.row, col = _a.col, isStart = _a.isStart, isEnd = _a.isEnd, isWall = _a.isWall, onMouseDown = _a.onMouseDown, onMouseEnter = _a.onMouseEnter, onMouseUp = _a.onMouseUp;
    var extraClassName = isStart
        ? 'cell-start'
        : isEnd
            ? 'cell-end'
            : isWall
                ? 'cell-wall'
                : '';
    return (_jsx("div", { id: "cell-".concat(row, "-").concat(col), className: "cell ".concat(extraClassName), onMouseDown: function () { return onMouseDown(row, col); }, onMouseEnter: function () { return onMouseEnter(row, col); }, onMouseUp: function () { return onMouseUp(); } }));
};
export default Cell;
