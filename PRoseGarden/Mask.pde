//noise mask
float increment = 0.02;
PGraphics noiseMask;



void prepareMask() {

  noiseMask.beginDraw();
  noiseMask.background(255);
  noiseMask.loadPixels();

  float xoff = 0.0; // Start xoff at 0
  float detail = .4; //map(mouseX, 0, width, 0.1, 0.6);
  noiseDetail(8, detail);

  // For every x,y coordinate in a 2D space, calculate a noise value and produce a brightness value
  for (int x = 0; x < w; x++) {
    xoff += increment;   // Increment xoff 
    float yoff = 0.0;   // For every xoff, start yoff at 0
    for (int y = 0; y < h; y++) {
      yoff += increment; // Increment yoff

      // Calculate noise and scale by 255
      float bright = noise(xoff, yoff, millis()) * 255;

      // Try using this line instead
      //float bright = random(0,255);

      // Set each pixel onscreen to a grayscale value
      noiseMask.pixels[x+y*w] = color(bright, 255-bright);
    }
  }

  noiseMask.updatePixels();
  noiseMask.endDraw();
}
