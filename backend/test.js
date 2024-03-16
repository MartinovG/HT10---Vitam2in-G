// import earthMatrix from './EarthMatrix.js';
		
// function heuristic(a, b) {
// 	return Math.abs(a.lng - b.lng) + Math.abs(a.lat - b.lat);
//   }
  
//   function aStar(start, end) {
// 	const openSet = [start];
// 	const cameFrom = new Map();
// 	const gScore = new Map();
// 	gScore.set(JSON.stringify(start), 0);
// 	const fScore = new Map();
// 	fScore.set(JSON.stringify(start), heuristic(start, end));
  
// 	while (openSet.length > 0) {
// 	  const current = openSet.reduce((a, b) => fScore.get(JSON.stringify(a)) < fScore.get(JSON.stringify(b)) ? a : b);
  
// 	  if (current.lng === end.lng && current.lat === end.lat) {
// 		return true;
// 	  }
  
// 	  openSet.splice(openSet.indexOf(current), 1);
  
// 	  const successors = [
// 		earthMatrix.find(cell => cell.lng === current.lng && cell.lat === current.lat - 1),
// 		earthMatrix.find(cell => cell.lng === current.lng && cell.lat === current.lat + 1),
// 		earthMatrix.find(cell => cell.lng === current.lng - 1 && cell.lat === current.lat),
// 		earthMatrix.find(cell => cell.lng === current.lng + 1 && cell.lat === current.lat)
// 	  ];
  
// 	  for (const neighbor of successors) {
// 		if (neighbor && neighbor.status === 0) {
// 		  const tentativeGScore = gScore.get(JSON.stringify(current)) + 1;
  
// 		  if (tentativeGScore < (gScore.get(JSON.stringify(neighbor)) || Infinity)) {
// 			cameFrom.set(JSON.stringify(neighbor), current);
// 			gScore.set(JSON.stringify(neighbor), tentativeGScore);
// 			fScore.set(JSON.stringify(neighbor), gScore.get(JSON.stringify(neighbor)) + heuristic(neighbor, end));
  
// 			if (!openSet.includes(neighbor)) {
// 			  openSet.push(neighbor);
// 			}
// 		  }
// 		}
// 	  }
// 	}
  
// 	return false;
//   }

// const start = earthMatrix.find(cell => cell.lng === 24 && cell.lat === 54 - 1);
// console.log(start)
// const end = earthMatrix.find(cell => cell.lng === -28 && cell.lat === 32 - 1);
//   console.log(aStar(start, end)) // => 13

// const earthMatrix = [
// 	{"lng":64,"lat":22,"status":0},
// 	{"lng":64,"lat":23,"status":0},
// 	{"lng":64,"lat":24,"status":0},
// 	{"lng":64,"lat":25,"status":0},
// 	{"lng":64,"lat":26,"status":0},
//   ];

import earthMatrix from './EarthMatrix.js';

  function bfs(start, end) {
	const queue = [[start]];
	const visited = new Set();
  
	while (queue.length > 0) {
	  const path = queue.shift();
	  const current = path[path.length - 1];

	  if (current.lng === end.lng && current.lat === end.lat) {
		return path;
	  }
  
	  visited.add(JSON.stringify(current));
  
	  const successors = [
		earthMatrix.find(cell => cell.lng === current.lng && cell.lat === current.lat - 1),
		earthMatrix.find(cell => cell.lng === current.lng && cell.lat === current.lat + 1),
		earthMatrix.find(cell => cell.lng === current.lng - 1 && cell.lat === current.lat),
		earthMatrix.find(cell => cell.lng === current.lng + 1 && cell.lat === current.lat)
	  ];

	  for (const successor of successors) {
		if (successor && !visited.has(JSON.stringify(successor)) && successor.status === 0) {
		  queue.push([...path, successor]);
		}
	  }
	}
  
	return false;
  }
  
  const start = earthMatrix.find(cell => cell.lng === 53 && cell.lat === 24);
  const end = earthMatrix.find(cell => cell.lng === -28 && cell.lat === 114);
  
  console.log(bfs(start, end));