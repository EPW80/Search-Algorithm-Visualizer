import { searchHelpers } from "../helpers/searchHelpers";
import PriorityQueue from "../helpers/PriorityQueue";
export function AStar(grid, start, end) {
    var visited = [];
    var pathArray = [];
    var path = {};
    var gScore = {};
    var fScore = {};
    var open = new PriorityQueue();
    gScore[start.toString()] = 0;
    fScore[start.toString()] = searchHelpers.manhattanDistance(start, end);
    open.push(start, fScore[start.toString()]);
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            var thisCell = [i, j];
            if (!grid[i][j].includes("wall")) {
                if (!grid[i][j].includes("start")) {
                    gScore[thisCell.toString()] = Infinity;
                    fScore[thisCell.toString()] = Infinity;
                }
                path[thisCell.toString()] = null;
            }
        }
    }
    var _loop_1 = function () {
        var minCell = open.pop();
        if (!minCell)
            return "break"; // Handle the case where pop() returns undefined
        var currentNode = minCell.value;
        if (searchHelpers.arraysMatch(currentNode, end)) {
            pathArray = searchHelpers.getPath(path, end);
            return "break";
        }
        if (!visited.some(function (node) { return searchHelpers.arraysMatch(node, currentNode); })) {
            visited.push(currentNode);
        }
        var neighbors = searchHelpers.getNeighbours(currentNode, grid, grid.length, grid[0].length);
        var _loop_2 = function (neighbor) {
            var neighborKey = neighbor.toString();
            var currentNodeKey = currentNode.toString();
            var potentialScore = gScore[currentNodeKey] + (grid[neighbor[0]][neighbor[1]].includes("weight") ? 10 : 1);
            if (potentialScore < gScore[neighborKey]) {
                path[neighborKey] = currentNode;
                gScore[neighborKey] = potentialScore;
                fScore[neighborKey] = potentialScore + searchHelpers.manhattanDistance(neighbor, end);
                if (!open.hasElement(function (element) { return searchHelpers.arraysMatch(element.value, neighbor); })) {
                    open.push(neighbor, fScore[neighborKey]);
                }
            }
        };
        for (var _i = 0, neighbors_1 = neighbors; _i < neighbors_1.length; _i++) {
            var neighbor = neighbors_1[_i];
            _loop_2(neighbor);
        }
    };
    while (open.size() > 0) {
        var state_1 = _loop_1();
        if (state_1 === "break")
            break;
    }
    var newGrid = searchHelpers.updateGrid(grid, visited, false);
    var gridWithPath = searchHelpers.updateGrid(newGrid, pathArray || [], true);
    return { newGrid: newGrid, gridWithPath: gridWithPath, visited: visited, pathArray: pathArray };
}
