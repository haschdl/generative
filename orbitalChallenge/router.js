/// <reference path="../libraries/p5.min.js" />

var ROUTER = ROUTER || {};

ROUTER = {

    
    routeNode: function (satelliteID, keep, hopCount) {
        this.id = satelliteID;
        if (hopCount !== undefined)
            this.hopCount = hopCount;
        else
            this.hopCount = 0;
        this.keep = keep;
    },

    //A route is a combination of a starting point, a sequence of satellites IDs and an end point.
    route: function (routeId) {

        this.start = null;
        this.nodes = [];
        this.end = null;
        this.routeLength = 0;
        this.routeId = routeId;

        this.addNode = function (newNode,hopLength) {
            this.nodes.push(newNode);
            this.routeLength += hopLength;
        }
    }
}

ROUTER.route.prototype.cloneRoute = function () {
    var newRoute = new ROUTER.route();
    newRoute.start = this.start;
    newRoute.nodes = this.nodes.slice();
    newRoute.end = this.end;
    newRoute.routeLength = this.routeLength;
    newRoute.routeId = this.routeId;
    return newRoute;
}

ROUTER.route.prototype.toString = function () {
    var result = "";
    for (var j = 0; j < this.nodes.length ; j++) {
        //result += "SAT" + this.nodes[j].id + ",";
        result += this.nodes[j].id + ",";
    }
    result = result.slice(0, -1);
    return result;
};


ROUTER.route.prototype.setRouteNode = function (satelliteID, keepValue) {
    for (var i = this.nodes.length - 1; i >= 0; i--) {
        if (this.nodes[i].id === satelliteID) {
            this.nodes[i].keep = keepValue;
            break;
        }
    }
}

function coordToVector(lat, lon, alt, earthRadius) {
    var x = (earthRadius + alt) * cos(radians(lat)) * cos(radians(lon));
    var y = -1 * (earthRadius + alt) * cos(radians(lat)) * sin(radians(lon));
    var z = (earthRadius) * sin(radians(lat));
    return createVector(x, y, z);
}


///Source: https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm
///These were not used by my solution but support the rendering, splash screen etc.
///The formulas were modified because of the clock-wise rotation in P5JS/WebGL
function rotateX_point(pointVec, angle) {
    var x = pointVec.x;
    var y = pointVec.y * cos(angle) + pointVec.z * sin(angle);
    var z = -pointVec.y * sin(angle) + pointVec.z * cos(angle);
    return createVector(x, y, z);
}

function rotateY_point(pointVec, angle) {
    var x = pointVec.x * cos(angle) - pointVec.z * sin(angle);    
    var y = pointVec.y;
    var z = pointVec.x * sin(angle) + pointVec.z * cos(angle) ;
    return createVector(x, y, z);
}
function rotateZ_point(pointVec, angle) {
    var x = pointVec.x * cos(angle) + pointVec.y * sin(angle);
    var y = -pointVec.x * sin(angle) + pointVec.y * cos(angle);
    var z = pointVec.z;
    return createVector(x, y, z);
}

//Math.sign is not supported in IE11
function sign(x) {
    if (+x === x) { // check if a number was given
        return (x === 0) ? x : (x > 0) ? 1 : -1;
    }
    return NaN;
}

/// <summary>   Returns true if the satellite with index 1 can see the satellite with index 2 </summary>
///
/// <remarks>   Scheihal, 05/05/2016. </remarks>
///
/// <param name="satelliteIndex1">  The first satellite index. </param>
/// <param name="satelliteIndex2">  The second satellite index. </param>
///
/// <returns>   . </returns>

function satCanSeeSat(satelliteIndex1, satelliteIndex2) {
    if (satelliteIndex1 == satelliteIndex2) {
        return false;
    }
    var vect1 = satellites[satelliteIndex1];
    var vect2 = satellites[satelliteIndex2];
    return pointCanSeePoint(vect1, vect2);
}

function pointCanSeeSat(pointA,satelliteIndex1) {
    var vect1 = satellites[satelliteIndex1];
    return pointCanSeePoint(pointA, vect1);
}

/// <summary>   Returns true if a point A "can see" point B around the Earth. 
///             This is geometrically determined as: 
///             1. Draw a vector from point A to point B, call it vect_AB
///             2. Draw a vector which is normal to vect_AB and which crosses the center of the sphere, call it v_normal.
///             3. If the length of v_normal is smaller than the radius, it means that vect_AB is not  
///             crossing the sphere. It means point A "can see" point B, or in the contect of this problem,
///             it means that there is an unobstructed path from A to B. </summary>
/// <param name="pointA">   The point a. </param>
/// <param name="pointB">   The point b. </param>
///
/// <returns>   . </returns>
function pointCanSeePoint(pointA, pointB) {
    var vect_AB = p5.Vector.sub( pointA, pointB);
    //var angle = p5.Vector.angleBetween(pointB, vect_AB);
    var angle = pointB.angleBetween(vect_AB);
    var distance = pointB.mag() * sin(angle);

    var result = false;
    //if point is on the surface, then it's enough to compare the angle
    if (abs(pointB.mag() - earthRadius) < 0.01) {
        if (abs(angle) >= HALF_PI )
            result = true;
    }
    else
     if (abs(distance) +40 > earthRadius) {
        result = true;
    }
    return result;
}