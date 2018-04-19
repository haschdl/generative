var isDebug = false;

var animate = false;

// prevent scrolling of page
document.ontouchmove = function (event) {
    if (isDebug == false) {
        event.preventDefault();
    }
}

//dimensions, adjusted for landscape
var windowH_L, windowW_L;


var mic;
var amp;

var scale = 1.0;

var capture, capturePixels;
var slider;
var stepSizeInit = 6;

//Two options for noise, 1, using x and y, and 2, using clock
var noiseMode = 1;

//Which curve to use when drawing the light. 1=circle, 2=teardrop
var curveMode = 1;

function preload() {
    var params = getURLParams();
    imgNumber = params.img;
    if (imgNumber == undefined) {
        imgNumber = "theshining";
    }
    if (params.debug == undefined) {
        isDebug = false;
    }
    else {
        isDebug = true;
    }
    if (params.step != undefined) {
        stepSizeInit = int(params.step);
    }
    if (params.noiseMode != undefined) {
        noiseMode = int(params.noiseMode);
    }

    if (params.curveMode != undefined) {
        curveMode = int(params.curveMode);
    }


    capture = loadImage("./images/" + imgNumber + ".jpg");
    capturePixels = loadImage("./images/" + imgNumber + ".jpg");
}
function setup() {
    //forcing landscape also on mobile
    var cv = createCanvas(100, 100);
    cv.style('display', 'block'); //see https://github.com/processing/p5.js/wiki/Positioning-your-canvas#making-the-canvas-fill-the-window
    var mainSection = document.querySelectorAll("*[class='main-content']")[0];
    var header = document.querySelectorAll("*[class='page-header']")[0];
    cv.parent(mainSection);
    
    cv.resize(windowWidth, windowHeight -  header.offsetHeight);
    
    // Attach listeners for mouse events related to canvas
    cv.mouseMoved(() => { animate = true });
    cv.mouseOver(() => { animate = true });
    cv.mouseOut(() => {animate = false });
    
    background(0);

    //when using a static image and not a camere
    //loadPixels can be called just once during startup()
    capturePixels.loadPixels();


    //UI
    slider = createSlider(4, 32, stepSizeInit);
    if (isDebug) {
        slider.position(20, 20);
    }
    else {
        slider.hide();
    }
    var constraints = {
        video: {
            mandatory: {
                minWidth: 1280,
                minHeight: 720
            },
            optional: [
              { maxFrameRate: 10 }
            ]
        },
        audio: false
    };

    if (getUserMedia() == true) {
        // Create a new amplitude analyzer and patch into input
        mic = new p5.AudioIn();
        mic.start();
        amp = new p5.Amplitude();
        //toggleNormalize will not provide interesting results
        //if the audio 1) is a regular level noise 2) is heavily compressed
        amp.toggleNormalize(true);
        amp.smooth(0.95);
        amp.setInput(mic);
    }
    else {
        console.debug("getUserMedia is not supported.");
    }
}

function draw() {
    if(animate==false)
     return;
    var width_c = capture.width / windowWidth;
    var height_c = capture.height / windowHeight;

    noStroke();
    
    fill(0, 0,0,100);
    //rect(0, 0, width, height);

    // The analyze() method returns values between 0 and 1,&nbsp;
    // so map() is used to convert the values to larger numbers
    if (mic !== undefined) {
        scale = map(amp.getLevel(), 0, 1.0, 10, width);
    }

    //filter(BLUR, 1);
    var stepSize = slider.value();
    var r_flashlight = 300;
    var d = pixelDensity();

    //adjusting mouse coordinates to image size.
    var mouseX_c = round(mouseX * width_c);
    var mouseY_c = round(mouseY * height_c);

    //playing with step and amplitude: the higher the noise, the smaller the detail
    //var stepSize_audio = round(stepSize * (1 + amp.getLevel()));
    for (var y = mouseY_c - r_flashlight * 4 ; y < mouseY_c + r_flashlight ; y += stepSize) {
        for (var x = mouseX_c - r_flashlight ; x < mouseX_c + r_flashlight ; x += stepSize) {

            var noiseValue = 1;
            switch (noiseMode) {
                case 0:
                    break;
                case 1:
                    noiseValue += noise(x, y, millis());
                    break;
                case 2:
                    noiseValue += 0;//noise(x,millis())/20;
                    break;
                case 3:
                    noiseValue += noise(sin(millis()), millis());
                    break;
            }

            var r_noise = round(r_flashlight / 2 * noiseValue);

            var dx = x - mouseX_c;
            var dy = y - mouseY_c;            
            var distance = distanceF(x, y, mouseX_c, mouseY_c, r_noise, noiseValue, millis() * noiseValue);
            if (distance <= 1) {
                var i = 4 * (y * capture.width + x);
                var r = capturePixels.pixels[i];
                var g = capturePixels.pixels[i + 1];
                var b = capturePixels.pixels[i + 2];
                var a = 255 * (1 - smoothstep(0, 1, distance));

                //THis allows for different effects in different regions. Look at candle flame for ideas
                var perceivedLum = 0;
                if (distance > 0.75) {

                    var b_temp = b;
                    b = r * smoothstep(0, 1, distance);
                    r = b_temp * smoothstep(0, 1, distance);

                }
                perceivedLum = sqrt(0.299 * r ^ 2 + 0.587 * g ^ 2 + 0.114 * b ^ 2)

                //applying noise
                perceivedLum = perceivedLum * noiseValue * smoothstep(0, 1, distance);

                //var darkness = capturePixels.pixels[i*4 +3] / 255;
                var radius = stepSize * constrain(perceivedLum / 10, 1, 2);
                fill(color(r, g, b, a));
                //if (deviceOrientation == 'portrait') {
                //    rotate(90);
                //}
                ellipse(x / width_c, y / height_c, radius, radius);
            }
        }
    }
}
function smoothstep(min, max, value) {
    var x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
};

function distanceF(x, y, x0, y0, radius, noise1, noise2) {
    switch (curveMode) {
        //circle
        case 1:
            var distanceSq = sq(noise1 * (x - x0)) + noise1 * (sq(y - y0));
            return distanceSq / sq(radius);
            break;
            //teardrop
        case 2:
            //TODO Apply noise to X so that flame moves a little bit
            x = x + noise1 * 5 * (2 * sin(noise2 / 300) - 1) * (y - y0) / y0;
            var distanceSq = sq(1.8 * (x - x0)) + sq((y - y0 + .9 * radius));
            var ang = atan2(50 * (x0 - x), 2.5 * (y0 - y));
            ang = ang + PI;
            var m = 7;
            var distanceT1 = sq(1.1 * radius * (cos(ang) - 1)) + sq(radius * sin(ang) * pow(sin(0.5 * ang), m));


            x = x + noise1 * 5 * (2 * sin(noise2 / 250) - 1) * (y - y0) / y0;
            distanceSq = sq(1.8 * (x - x0)) + sq((y - y0 + .9 * radius));
            ang = atan2(50 * (x0 - x), 2.0 * (y0 - y));
            ang = ang + PI;
            m = 7;
            var distanceT2 = sq(1.1 * radius * (cos(ang) - 1)) + sq(radius * sin(ang) * pow(sin(0.5 * ang), m));

            x = x + noise1 * 5 * (2 * sin(noise2 / 400) - 1) * (y - y0) / y0;
            distanceSq = sq(1.8 * (x - x0)) + sq((y - y0 + .9 * radius));
            ang = atan2(40 * (x0 - x), 2.8 * (y0 - y));
            ang = ang + PI;
            m = 7;
            var distanceT3 = sq(1.1 * radius * (cos(ang) - 1)) + sq(radius * sin(ang) * pow(sin(0.5 * ang), m));

            var distanceT = Math.max(distanceT1, distanceT2, distanceT3);
            return (distanceSq / distanceT);
            break;
        default:
            return false;

    }
}

/// <summary>   Returns true if MeadiaStreamTrack is supported</summary>
///
/// <remarks>   Scheihal, 03/05/2016. </remarks>
///
/// <returns>   True if getUserMedia is supported.</returns>
function getUserMedia() {
    return !!window.MediaStreamTrack;
}

  

function windowResized() {
    //resizeCanvas(windowWidth, windowHeight);
}
