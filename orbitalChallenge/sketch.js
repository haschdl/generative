/// <reference path="../libraries/p5.js" />
/// <reference path="../libraries/p5.sound.js" />
/// <reference path="../libraries/p5.dom.js" />
/// <reference path="../libraries/jquery-1.11.0.min.js" />
/// <reference path="../misc/webGL.js" />

/****

Solution to Orbital Challenge proposed at https://reaktor.com/orbital-challenge/
More clean-up and refactoring is need to separate the problem solving algorithm 
from the visualizations.

Author: Half Scheidl, half.scheidl@gmail.com

****/

//UI related
var inputFrom, inputTo, buttonSubmit, greeting;
var imgTakingoff, imgLanding, img_splash;
var animate = false;

//Challenge related
var routerObj;
var earthRadius = 6371;
//coeficient for adjusting world size to screen size;
var coef;

var earthRadiusScreen;
var dataTable, seedValue;
var satellites = [];
// The number of valid routes or solutions
var countValidRoutes = 0;

//All possible routes between A and B. Each route is an ordered array of the positions of the satellites.
var routes = [];

//The shortest route, from all possible routes.
var shortestRoute;

var routeFrom, routeTo;
var routeFrom_G, routeTo_G;


var solved = false;
var globalRouteCounter = 0;


//debug, from query-string
//pFrom and pTo can be used to render one spefic hop
var pFrom, pTo;
//pRouteNumber to render a specific route, instead of the optimal route
var pRouteNumber;


//fun stuff: textures, animation
var img_star, img_sat, img_earth, img_fire, intro_txt;
var t, t_z = 0, rot_y = 0, rot_z = 0, rot_y_earth = 0;
var t0 ,d;
var showEarth = true;
var enableWebGl = true;

// P5JS specific: pre-loads images and files
function preload() {    
    
    imgTakingoff = loadImage("../media/takeoff.png");
    imgLanding = loadImage("../media/landing.png");
    img_star = loadImage("../media/star.jpg");
    img_sat = loadImage("../media/sat.png");
    img_earth = loadImage("../media/earth.png");
    img_splash = loadImage("../media/hipsterlogo.png");
    img_fire = loadImage("../media/fire.jpeg");



    var params = getURLParams();
    if (params.animate !== undefined) {
        animate = true;
    }
    if (params.pFrom !== undefined) {
        pFrom = params.pFrom * 1;
    }
    if (params.pTo !== undefined) {
        pFrom = params.pTo * 1;
    }
    if (params.pRouteNumber !== undefined) {
        pRouteNumber = params.pRouteNumber * 1;
    }

    dataTable = loadTable("data.txt", "csv");
}

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    coef = 1 / 3 * Math.min(height, width) / earthRadius ;
    //illustrate how I will adjust every point to screen - by multiplying by coef
    earthRadiusScreen = earthRadius * coef;
    d = pixelDensity();
    loadFile();
    drawInfo();

    //the initial position of the camere
    //it can be adjusted during mouseWheel event
    t0 = createVector(0, height / 8, 0);
}

function loadFile() {
    //first row has the seed value
    var seedStr = dataTable.getString(0, 0).replace("#SEED: ", "");
    seedValue = float(seedStr);

    //cycle through the table
    // starting at r = 1 because the first row is the header containing the seed
    // starting at c = 1 where the coordinates start

    //remember z is coming off the screen
    var nRows = dataTable.getRowCount();
    for (var r = 1; r < nRows; r++) {
        var lat = dataTable.getNum(r, 1);
        var lon = dataTable.getNum(r, 2);
        var alt = dataTable.getNum(r, 3);

        if (r < nRows - 1) {
            var satellite_i = coordToVector(lat, lon, alt, earthRadius);
            satellites.push(satellite_i);
        }
        else // last row is the route 
        {
            alt = 0;
            routeFrom = coordToVector(lat, lon, alt, earthRadius);
            lat = dataTable.getNum(r, 3);
            lon = dataTable.getNum(r, 4);
            routeTo = coordToVector(lat, lon, alt, earthRadius);
        }
    }
}



/// <summary>   Draws the information about the solution: the shortest route, route length etc.</summary>
function drawInfo() {
    if (solved) {
        //removes all elementes previously created.
        //intentionally removes also the button. 
        //Page must be refreshed for rendering the button again
        removeElements();

        var divInfo = createDiv("");
        divInfo.id("solutionInfo");
        divInfo.parent("offCanvasContent");
        
        createP('Tap or press G to visualize the route. Scroll or use arrows to zoom.').addClass('text').parent(divInfo);
        createP('Solutions for seed ' + seedValue).addClass('text').parent(divInfo);
        
        createP('Shortest route: [' + shortestRoute.routeId + "] " + shortestRoute.toString()).addClass('text').parent(divInfo);
        
        $("#offCanvasContent").replaceWith(divInfo.html());

        var selRoutes = createSelect(false);
        selRoutes.parent("content");
        selRoutes.id("selRoutes");
        selRoutes.class("routes");


        selRoutes.changed(function () {
            enableWebGl = true;
            pRouteNumber = selRoutes.value();
        });

        selRoutes.mouseOver(function () {
            enableWebGl = false;

        });
        selRoutes.mouseOut(function () {
            enableWebGl = true;

        });
        
        selRoutes.option("Select a route to draw...", -1);
        for (var i = 0, l = routes.length; i < l - 1; i++) {
            if (routes[i].to != null) {                
                selRoutes.option("[" + routes[i].routeId + "] " + routes[i].toString(), routes[i].routeId);
            }

        }

    }
}
function draw() {
    background(0);
    t = millis();

    if (keyIsDown(UP_ARROW) && document.getElementById("selRoutes") !== document.activeElement) {
        t0.z = constrain(t0.z + 10, -1000, 1000);
    }
    if (keyIsDown(DOWN_ARROW) && document.getElementById("selRoutes") !== document.activeElement) {
        t0.z = constrain(t0.z - 10, -1000, 1000);
    }
    if (keyIsDown(RIGHT_ARROW) && document.getElementById("selRoutes") !== document.activeElement) {
        t0.x = constrain(t0.x + 10, -1000, 1000);
    }
    if (keyIsDown(LEFT_ARROW) && document.getElementById("selRoutes") !== document.activeElement) {
        t0.x = constrain(t0.x - 10, -1000, 1000);
    }


    translate(t0.x, t0.y, t0.z);
    camera(0, 0, 0);


    if (animate == true) {
        if ( mouseIsPressed == false) {
            //t_z = -100 * (cos(t / 2500));
        }
    }
    //scene always animates
    //rot_y = -HALF_PI * frameCount / 800;
    //rot_z = t / 10000;

    //earth animates only if user is not interacting
    if (mouseIsPressed == false) {
        rot_y_earth = (t / 1000);
    }

    push();
    rotateY(rot_y);
    //rotateZ(rot_z);    
    translate(0, 0, t_z);
 

    drawStars(200 * width / 2000);
    if (animate == true) {
        orbitControl();
    }
    //this rotation will affect only earth, satellites and routes.    
    rotateY(rot_y_earth);

    //drawing the shortest route or the paramRoute
    if (shortestRoute !== undefined) {
        if (pRouteNumber !== undefined)
            drawRoute(routes[pRouteNumber]);
        else {
            drawRoute(shortestRoute)
        };
    }

    if (showEarth == true) {
        texture(img_earth);
        //making slightly smaller due to satellite
        //proportions
        sphere(earthRadiusScreen * .95, 40);
    }
    else {
        texture(img_fire);
        sphere(earthRadiusScreen / 5, 40);
    }

    //drawing the satellites
    texture(img_sat);
    var fLen = satellites.length;
    for (var i = 0; i < fLen; i++) {
        var sat = p5.Vector.mult(satellites[i], coef);
        push();
        translate(sat.x, sat.y, sat.z);
        box(2, 12, 4);
        box(4, 2, 8);
        box(2, 6, 6);
        pop();
    }

    //DRAWING THE source and destination spots    
    push();
    var routeFrom_s = p5.Vector.mult(routeFrom, coef);
    translate(routeFrom_s.x, routeFrom_s.y, routeFrom_s.z);
    texture(imgTakingoff);
    sphere(10);
    pop();

    push();
    var routeTo_s = p5.Vector.mult(routeTo, coef);
    translate(routeTo_s.x, routeTo_s.y, routeTo_s.z);
    texture(imgLanding);
    sphere(10, 20);
    pop();

    pop();

    //splash screen  for 5 seconds
    if (typeof showIntro == 'undefined') {
        //pointLight(255, 147, 41, 255, 0, 0, -t0.z );       

        if (t > 4000) {
            showIntro = false;
            createSolveButton();
            t_z += 300;
            animate = true;            
            return;
        }

        //Splash
        if (t < 4000) {
            var splash_w_0 = 0.1 * d * Math.min(width, height);

            push();
            translate(-t0.x, -t0.y, -t0.z);
            translate(0, 0, 600);
            ambientMaterial(200, 20, 20, 40);
            plane(width, splash_w_0 * 0.66);
            texture(img_splash);
            plane(splash_w_0, splash_w_0);
            pop();
        }        
    }
    else {
        pointLight(255, 255, 255, 255, 0, 0, 0);

    }
}

function drawRoute(routeToDraw) {
    var len = routeToDraw.nodes.length;
    for (var j = -1; j < len; j = j + 1) {

        beginShape();
        fill(255 * noise(j * pow(routeToDraw.routeId, 3)), 255 * noise(j * .981), 255 * noise(j * routeToDraw.routeId), 100);

        //drawing the first hop, from starting point to first satellite
        if (j == -1) {
            var sat_i = routeToDraw.nodes[0].id;

            vertex(routeFrom.x * coef, routeFrom.y * coef, routeFrom.z * coef);
            vertex(satellites[sat_i].x * coef, satellites[sat_i].y * coef, satellites[sat_i].z * coef);
            vertex(0, 0, 0);
            endShape();
            continue;
        }

        var sat_i = routeToDraw.nodes[j].id;

        //drawing the last hop
        if (j == len - 1) {
            vertex(satellites[sat_i].x * coef, satellites[sat_i].y * coef, satellites[sat_i].z * coef);
            vertex(routeTo.x * coef, routeTo.y * coef, routeTo.z * coef);
            vertex(0, 0, 0);
            endShape();
        }
        else {
            var sat_i_1 = routeToDraw.nodes[j + 1].id;
            vertex(satellites[sat_i].x * coef, satellites[sat_i].y * coef, satellites[sat_i].z * coef);
            vertex(satellites[sat_i_1].x * coef, satellites[sat_i_1].y * coef, satellites[sat_i_1].z * coef);
            vertex(0, 0, 0);
            endShape();
        }
    }
}



function solve() {
    console.debug("Solving started...");
    solved = false;

    routes = [];    
    //adding the initial route, containing the starting point
    var route0 = new ROUTER.route(0);
    route0.start = routeFrom;


    //which satellites are visible from source location and from the destination location?
    var solutionFound = false;
    var foundCount = 0;
    globalRouteCounter = 0;

    for (var i = 0; i < satellites.length; i++) {
        if (pointCanSeeSat(routeFrom, i)) {
            //console.debug("[ROUTE " + globalRouteCounter + "] Source can see satellite " + i);

            var route_i = new ROUTER.route(globalRouteCounter);
            var node_i = new ROUTER.routeNode(i, true, 1);
            var hopLength = p5.Vector.sub(routeFrom, satellites[i]).mag();
            route_i.addNode(node_i, hopLength);
            routes.push(route_i);

            solutionFound = solveRecursive(i, routeTo, 1);
            if (solutionFound == false) {
                routes[globalRouteCounter].setRouteNode(i, false);
            }
            globalRouteCounter += 1;

            //forcing a single-route solution
            //break;
        }
    }

    //If no satellite is visible from the origin, no solution is possible.
    if (solutionFound == false) {
        alert("You're in trouble! No routes found from location " + routeFrom.x + "," + routeFrom.y);
        return false;
    }
    else {

        //which one is the shortest route? (from the valid solutions :)
        var shortestRouteLength = 1000000000;
        shortestRoute = undefined;

        for (var i = 0; i < routes.length; i++) {

            var route_idx = routes[i];
            //is it a valid route?
            //valid routes have a "to" attribute
            if (route_idx.to != null) {
                countValidRoutes += 1;
                //console.debug("[ROUTE " + i + "] Total Length: " + route_idx.routeLength);
                if (route_idx.routeLength < shortestRouteLength) {
                    shortestRoute = route_idx;
                    shortestRouteLength = route_idx.routeLength;
                }
            }
        }

        //The solution for submission        
        console.debug("Problem solved! The shortest route is route " + shortestRoute.routeId);        
        console.debug(shortestRoute.toString());
    }
    solved = true;
    drawInfo();
    UI.offCanvasShow({ data : { forMilliseconds: 3000 }});
}



function solveRecursive(satelliteIndex, destination, depth) {
    //limiting to 20 iterations
    if (depth > 20) {
        console.warn("WARNING. Recursive function ran for 20 iterations.");
        return false;
    }
    else {
        var routeLengthSoFar = routes[globalRouteCounter].routeLength;
        var routeTemp = routes[globalRouteCounter].cloneRoute();

         var foundNext = false;

        if (pointCanSeeSat(destination, satelliteIndex) == true) {
            //found the destination!
            //console.info("[ROUTE " + globalRouteCounter + "] Satellite " + satelliteIndex + " reached the destination!");
            routes[globalRouteCounter].to = destination;
            var hopLength = p5.Vector.sub(destination, satellites[satelliteIndex]).mag()
            routes[globalRouteCounter].routeLength = routeLengthSoFar + hopLength;
            return true;
        }
        else {

            for (var i = 0; i < satellites.length; i++) {
                if (satelliteIndex == i || indexOfRouteNode(routeTemp.nodes, i) > -1) {
                    //console.debug("[ROUTE " + globalRouteCounter + "] Satellite " + satelliteIndex + " already added to this route, skipping...");
                    continue;
                }
                else if (satCanSeeSat(satelliteIndex, i)) {
                    foundNext = true;
                    //console.log("[ROUTE " + globalRouteCounter + "] " + satelliteIndex + " ==>> " + i + ". Depth:" + depth);

                    //here a new route "forks out"
                    var thisRoute = new ROUTER.route(globalRouteCounter);
                    thisRoute.nodes = routeTemp.nodes.slice();

                    //adding new nodes
                    var hopLength = p5.Vector.sub(satellites[satelliteIndex], satellites[i]).mag();
                    thisRoute.routeLength = routeLengthSoFar + hopLength;
                    thisRoute.addNode(new ROUTER.routeNode(i, true, depth), hopLength);

                    //storing new route info
                    routes.push(thisRoute);
                    globalRouteCounter += 1;

                    if (solveRecursive(i, destination, depth + 1) == true) {
                        routes[globalRouteCounter].setRouteNode(i, true);
                    }
                }
            }
            if (foundNext == false) {
                //console.warn("[ROUTE " + globalRouteCounter + "] Ooops.. It seems satellite " + satelliteIndex + " is not able to reach any other satellite!");
                //removing the latest added
                routes[globalRouteCounter].setRouteNode(satelliteIndex, false);
                return false;
            }
        }
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


function indexOfRouteNode(myArray, satelliteID) {
    for (var i = 0, len = myArray.length - 1; i < len; i++) {
        if (myArray[i].id === satelliteID)
            return i;
    }
    return -1;
}

function drawStars(howMany) {
    var spaceSize = 5 * earthRadiusScreen;
    for (var i = 0; i < howMany; i++) {
        var x = noise(i) * 2 * spaceSize - spaceSize;
        var y = noise(i * i) * 2 * spaceSize - spaceSize;
        var z = noise(i * i * i) * 2 * spaceSize - spaceSize;
        push();
        var mult = earthRadiusScreen;
        translate(x + sign(x) * mult, y + sign(y) * mult, z + sign(z) * mult);
        ambientMaterial(255, 255, 255);
        texture(img_star);
        var pos = createVector(x, y, -100);
        sphere(2, 10);
        pop();
    }

}

function keyPressed() {
    if (key === 'G') {
        showEarth = !showEarth;
    }
}

function touchEnded() {
    if (enableWebGl == true) {
        showEarth = !showEarth;
    }
    return true;
}
function createSolveButton() {
    buttonSubmit = createButton('solve');
    buttonSubmit.class("button").parent("content");    
    buttonSubmit.mousePressed(solve);
    buttonSubmit.mouseOver(function () {
        enableWebGl = false;

    });
    buttonSubmit.mouseOut(function () {
        enableWebGl = true;

    });
}

function mouseWheel(event) {
    t0.z = constrain(t0.z - event.delta / 5, -1000, 1000);
    //return false to block page scrolling
    return false;
}