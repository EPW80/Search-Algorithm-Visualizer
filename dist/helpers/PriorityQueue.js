var PriorityQueue = /** @class */ (function () {
    function PriorityQueue() {
        this.elements = [];
    }
    PriorityQueue.prototype.push = function (value, priority) {
        var newNode = { value: value, priority: priority };
        this.elements.push(newNode);
        this.bubbleUp();
    };
    PriorityQueue.prototype.pop = function () {
        var root = this.elements[0];
        var end = this.elements.pop();
        if (this.elements.length > 0 && end) {
            this.elements[0] = end;
            this.bubbleDown();
        }
        return root;
    };
    PriorityQueue.prototype.size = function () {
        return this.elements.length;
    };
    PriorityQueue.prototype.hasElement = function (checkFn) {
        return this.elements.some(checkFn);
    };
    PriorityQueue.prototype.bubbleUp = function () {
        var idx = this.elements.length - 1;
        var element = this.elements[idx];
        while (idx > 0) {
            var parentIdx = Math.floor((idx - 1) / 2);
            var parent_1 = this.elements[parentIdx];
            if (element.priority >= parent_1.priority)
                break;
            this.elements[parentIdx] = element;
            this.elements[idx] = parent_1;
            idx = parentIdx;
        }
    };
    PriorityQueue.prototype.bubbleDown = function () {
        var idx = 0;
        var length = this.elements.length;
        var element = this.elements[0];
        while (true) {
            var leftChildIdx = 2 * idx + 1;
            var rightChildIdx = 2 * idx + 2;
            var swap = null;
            if (leftChildIdx < length) {
                var leftChild = this.elements[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                var rightChild = this.elements[rightChildIdx];
                if ((swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < this.elements[swap].priority)) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null)
                break;
            this.elements[idx] = this.elements[swap];
            this.elements[swap] = element;
            idx = swap;
        }
    };
    return PriorityQueue;
}());
export default PriorityQueue;
