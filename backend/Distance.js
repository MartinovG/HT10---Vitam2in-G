function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    var earthRadiusKm = 6371;
    var dLat = degreesToRadians(lat2 - lat1);
    var dLon = degreesToRadians(lon2 - lon1);
    var radLat1 = degreesToRadians(lat1);
    var radLat2 = degreesToRadians(lat2);
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(radLat1) * Math.cos(radLat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var distance = earthRadiusKm * c;
    
    return distance;
  }

function timeToDestination(distance, speed) {
    return distance / speed;
}

export {calculateDistance, timeToDestination};

