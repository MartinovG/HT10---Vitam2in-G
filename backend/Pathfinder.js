import EarthMatrix from './EarthMatrix.js';

function findPath(startX, startY, endX, endY) {
    var pathArray = [];
    var steps = [];

    for (var i = 0; i < 360; i++) {
        pathArray[i] = [];
        for (var j = 0; j < 720; j++) {
            pathArray[i][j] = {cost: Infinity, previous: null, heuristic: Infinity};
        }
    }

    startX = Math.round(startX * 2 + 180);
    startY = Math.round(startY * 2 + 360);
    endX = Math.round(endX * 2 + 180);
    endY = Math.round(endY * 2 + 360);

    pathArray[startX][startY].cost = 0;
    pathArray[startX][startY].heuristic = heuristic(startX, startY, endX, endY);

    var queue = [{x: startX, y: startY}];

    while (queue.length > 0) {
        queue.sort((a, b) => pathArray[a.x][a.y].heuristic - pathArray[b.x][b.y].heuristic);
        var current = queue.shift();

        if (current.x === endX && current.y === endY) {
            break;
        }

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
        
            if (newX < 0 || newX >= 360 || newY < 0 || newY >= 720) {
                continue;
            }
        
            if (EarthMatrix[newX][newY] == 1) {
                continue;
            }
        
            var newCost = pathArray[current.x][current.y].cost + 1;
        
            if (newCost < pathArray[newX][newY].cost) {
                pathArray[newX][newY].cost = newCost;
                pathArray[newX][newY].previous = current;
                pathArray[newX][newY].heuristic = newCost + heuristic(newX, newY, endX, endY);
                queue.push({x: newX, y: newY});
            }
        }
    }

    var current = {x: endX, y: endY};
    if (pathArray[current.x][current.y].previous === null) {
        console.log("No path");
        return { pathArray: [], steps: [] };
    }
    while (current != null) {
        steps.push({x: (current.x - 180) / 2, y: (current.y - 360) / 2});
        current = pathArray[current.x][current.y].previous;
    }

    steps.reverse();

    return { pathArray, steps };
}

function heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export default findPath;

console.log(EarthMatrix[10.5*2+180][15.5*2+360]);
console.log(EarthMatrix[201][391]);



