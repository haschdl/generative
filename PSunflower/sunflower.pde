// Sunflower.
//
// The core of this sketch is based on the tutorial by Daniel Shiffman on 'Phyllotaxis', the arrangement of leaves on an axis or stem.
// Dan's tutorial on Phyllotaxis is at https://youtu.be/KWoJgHFYWxY
import java.text.SimpleDateFormat;
import java.util.Date;

float c = 6;
PImage img, mask;
PGraphics buffer;
int max_seeds = 8000;

//n is the number of initial seeds
//using n=0 will simulate the seeds growing.
//using n=max_seeds will paint the all seeds in one step
float n = max_seeds;

float actual_seeds = 0;
float angle_0 = 0;

Seed seeds[];

void setup() {
  size(1000, 1000, P2D);
  smooth(8);
  c = 12;
  img = loadImage("theshining.jpg");
  img.resize(width, height);
  buffer = createGraphics(width, height);

  seeds = new Seed[max_seeds];
}

void draw() {
  background(10);
  
  float s =  c+7.; 

 

  
  surface.setTitle(String.format("Sunflower c=%.2f n=%.2f angle=%.2f ", c, n, angle_0));

  System.out.println(String.format("Completed: %.2f with n=%.2f", n/max_seeds*100, n));
  for (int i = 0; i < n; i++) {
    float a = i * radians(angle_0);
    float r = c * sqrt(i);
    float x = r * cos(a);
    float y = r * sin(a);
    s *= constrain(exp(1 - pow(1.1 - n/max_seeds, 2))/2.6, .2, 0.998);
    seeds[i] = new Seed(a, r, x, y, s);
  }
  actual_seeds = n;
  if (n<max_seeds)
    n += c;
    
  buffer.beginDraw(); 
  buffer.clear();
  buffer.smooth(8);
  buffer.translate(width / 2, height / 2);
  for (int i = 0; i < actual_seeds; i++) {
    Seed seed = seeds[i];
    buffer.fill(0, 0, 255 - i/actual_seeds*255, 255);
    buffer.noStroke();   

    buffer.ellipse(seed.x, seed.y, seed.s, seed.s);
  }
  buffer.endDraw();
  img.mask(buffer);
  image(img, 0, 0);
}

void mouseMoved() {
   angle_0 = 137.5 + map(mouseX, 0, width, -180, 180);
   c = map(mouseY, 0, height, 4, 20);
}
void keyPressed() {
  if (key=='S') {
    String fileName = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
    fileName = String.format("%s c=%.2f n=%.2f angle=%.2f .jpg", fileName, c, n, angle_0);
    save("out\\" + fileName );
    print("File saved!");
  }
  switch(keyCode) {
    case LEFT: 
       c--; 
       break;
    case RIGHT:
       c++;
       break;
  }
}
