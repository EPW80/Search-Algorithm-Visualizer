var PriorityQueue = /** @class */ (function () {
    function PriorityQueue() {
        this.elements = [];
    }
    PriorityQueue.prototype.push = function (value, priority) {
        this.elements.push({ value: value, priority: priority });
        this.elements.sort(function (a, b) { return a.priority - b.priority; });
    };
    PriorityQueue.prototype.pop = function () {
        return this.elements.shift();
    };
    PriorityQueue.prototype.size = function () {
        return this.elements.length;
    };
    PriorityQueue.prototype.hasElement = function (checkFn) {
        return this.elements.some(checkFn);
    };
    return PriorityQueue;
}());
export default PriorityQueue;
