export var searchHelpers = {
    manhattanDistance: function (start, end) {
        return Math.abs(start[0] - end[0]) + Math.abs(start[1] - end[1]);
    },
    getNeighbours: function (node, grid, rows, cols) {
        var row = node[0], col = node[1];
        var neighbours = [];
        if (row > 0)
            neighbours.push([row - 1, col]);
        if (row < rows - 1)
            neighbours.push([row + 1, col]);
        if (col > 0)
            neighbours.push([row, col - 1]);
        if (col < cols - 1)
            neighbours.push([row, col + 1]);
        return neighbours;
    },
    arraysMatch: function (arr1, arr2) {
        return (arr1.length === arr2.length &&
            arr1.every(function (value, index) { return value === arr2[index]; }));
    },
    getPath: function (path, end) {
        var pathArray = [];
        var currentNode = end;
        while (path[currentNode.toString()] !== null) {
            pathArray.push(currentNode);
            currentNode = path[currentNode.toString()];
        }
        return pathArray.reverse();
    },
    updateGrid: function (grid, nodes, isPath) {
        var newGrid = grid.map(function (row) { return row.slice(); });
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            var x = node[0], y = node[1];
            if (isPath) {
                newGrid[x][y] = "path";
            }
            else {
                newGrid[x][y] = "visited";
            }
        }
        return newGrid;
    },
};
