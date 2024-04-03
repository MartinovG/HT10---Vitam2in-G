import EarthMatrix from './EarthMatrix.js';
import calculateDistance from './Distance.js';

function findPath(startX, startY, endX, endY) {
    var pathArray = [];
    var steps = [];

    for (var i = 0; i < 360; i++) {
        pathArray[i] = [];
        for (var j = 0; j < 720; j++) {
            pathArray[i][j] = {cost: Infinity, previous: null, heuristic: Infinity};
        }
    }

    startX = Math.floor((-startX + 90) * 2);
    startY = Math.floor((startY + 180) * 2);
    endX = Math.floor((-endX + 90) * 2);
    endY = Math.floor((endY + 180) * 2);

    console.log("Start coordinates:", startX, startY);
    console.log("End coordinates:", endX, endY);
    console.log("Start node value in EarthMatrix:", EarthMatrix[startX][startY]);
    console.log("End node value in EarthMatrix:", EarthMatrix[endX][endY]);

    console.log("node up:", EarthMatrix[startX][startY-1]);
    console.log("node down:" ,EarthMatrix[startX][startY+1]);
    console.log("node left:", EarthMatrix[startX-1][startY]);
    console.log("node right:", EarthMatrix[startX+1][startY]);
    console.log("node up-left:", EarthMatrix[startX-1][startY-1]);
    console.log("node up-right:", EarthMatrix[startX+1][startY-1]);
    console.log("node down-left:", EarthMatrix[startX-1][startY+1]);
    console.log("node down-right:", EarthMatrix[startX+1][startY+1]);
    
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
        
            if (EarthMatrix[newX][newY] == 1|| EarthMatrix[newX][newY] === undefined) {
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
        steps.push({x: (-current.x + 180) / 2, y: (-current.y + 360) / -2});
        // console.log(EarthMatrix[current.x][current.y])
        current = pathArray[current.x][current.y].previous;
    }

    steps.reverse();

    let totalDistance = 0;
    for (let i = 0; i < steps.length - 1; i++) {
        let currentStep = steps[i];
        let nextStep = steps[i + 1];
        totalDistance += calculateDistance(currentStep.x, currentStep.y, nextStep.x, nextStep.y);
    }

    console.log("Total distance:", totalDistance);

    return { pathArray, steps, totalDistance };
}

function heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

export default findPath;

