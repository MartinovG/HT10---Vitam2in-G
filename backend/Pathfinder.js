import EarthMatrix from './EarthMatrix.js';

function findPath(startX, startY, endX, endY) {
    var pathArray = [];
    var steps = [];

    for (var i = 0; i < 180; i++) {
        pathArray[i] = [];
        for (var j = 0; j < 360; j++) {
            pathArray[i][j] = {cost: Infinity, previous: null};
        }
    }

    startX = startX + 90; 
    startY = startY + 180;

    pathArray[startX][startY].cost = 0;

    var queue = [{x: startX, y: startY}];

    while (queue.length > 0) {
        queue.sort((a, b) => pathArray[a.x][a.y].cost - pathArray[b.x][b.y].cost);
        var current = queue.shift();

        var directions = [
            {x: 0, y: -1}, // Up
            {x: 0, y: 1}, // Down
            {x: -1, y: 0}, // Left
            {x: 1, y: 0}, // Right
            {x: -1, y: -1}, // Diagonal Up-Left
            {x: -1, y: 1}, // Diagonal Down-Left
            {x: 1, y: -1}, // Diagonal Up-Right
            {x: 1, y: 1} // Diagonal Down-Right
        ]; 

        for (var dir of directions) {
            var newX = current.x + dir.x;
            var newY = current.y + dir.y;

            if (newX < 0 || newX >= 180 || newY < 0 || newY >= 360 || EarthMatrix[newX][newY] == 1) {
                continue;
            }

            var newCost = pathArray[current.x][current.y].cost + 1;

            if (newCost < pathArray[newX][newY].cost) {
                pathArray[newX][newY].cost = newCost;
                pathArray[newX][newY].previous = current;
                queue.push({x: newX, y: newY});
            }
        }
    }

    var current = {x: endX + 90, y: endY + 180};
    if (pathArray[current.x][current.y].previous === null) {
        console.log("No path");
        return;
    }
    while (current != null) {
        steps.push({x: current.x - 90, y: current.y - 180});
        current = pathArray[current.x][current.y].previous;
    }

    steps.reverse();

    return { pathArray, steps };
}

export default findPath;
