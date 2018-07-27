/** //<>//
 "At the rose garden"
 A water-color like composition with warm colors.
 Code for 
 
 Half Scheidl, 2018 
 */

ArrayList<PVector> basePolygon = new ArrayList<PVector>();
ArrayList<PVector> vertices = new ArrayList<PVector>();

//Summer colors: https://coolors.co/e28413-f56416-dd4b1a-ef271b-ea1744
int[] palette = new int[]{ 0xFF780116, 0xFFF7B538, 0xFFDB7C26, 0xFFD8572A, 0xFFC32F27 };


//int[] palette = new int[]{ 0xFFE28413, 0xFFF56416, 0xFFDD4B1A, 0xFFEF271B, 0xFFEA1744 };




int h = 2000, w = 3000;
PGraphics buffer, buffer2;

float blobRadius= 200;
int n_x = 24; int n_y = 15;
float margin_left = blobRadius;
float margin_top = blobRadius;
float offsetX = (w -blobRadius - 2 * margin_left)/(n_x -1);
float offsetY = (h -blobRadius - 2 * margin_top)/(n_y -1);


void setup() {
  size(1200, 800, P2D);
  noiseMask = createGraphics(w, h);
  buffer = createGraphics(w, h);
  buffer2 = createGraphics(w, h);
  prepareMask();

  background(255);
  buffer.beginDraw();
  buffer.background(255);
  buffer.noStroke();
  buffer.endDraw();

  buffer2.beginDraw();
  buffer2.background(255);
  buffer2.endDraw();
  basePolygon = blob(blobRadius, 10, 3);
  vertices = deformBlob(basePolygon, 7);;
}

void draw() {

  //prepareMask();
  buffer2.beginDraw();

  buffer2.noStroke();
  buffer2.translate(margin_left, margin_top  );

  
  buffer2.translate(offsetX*((frameCount-1)%n_x), offsetY * floor((frameCount-1)/n_x));
  //buffer2.fill(palette[int(random(palette.length))], 12);
  buffer2.fill(palette[frameCount % palette.length], 12);
  
  //rotate a little bit
  //buffer2.translate(blobRadius/2, blobRadius/2);
  //buffer2.rotate(random(TWO_PI));
  
  buffer2.beginShape();
  for (int i = 0, l = vertices.size(); i < l; i++) {
    PVector p = vertices.get(i);
    buffer2.vertex(p.x, p.y);
  }
  buffer2.endShape(CLOSE);

  buffer2.mask(noiseMask);
  buffer2.endDraw();


  buffer.beginDraw();
  buffer.image(buffer2, 0, 0);
  buffer.endDraw();

  if (frameCount <= n_x * n_y ) {
    vertices = deformBlob(basePolygon, 7);
    image(buffer, 100, 100, width-200, height-200);
  } else {
    println("Done");
    noLoop();
  }
}


ArrayList<PVector> blob(float radius, int sides, int iterations) {
  ArrayList<PVector> basePolygon = polygon(radius, sides);
  return deformBlob(basePolygon, iterations);
}

/**
 Given a list of vertices of a polygon, it generates a new polygon by spliting
 and distorting the sides. 
 For details see http://www.tylerlhobbs.com/writings/watercolor
 */
ArrayList<PVector> deformBlob(ArrayList<PVector> basePolygon, int iterations) {
  ArrayList<PVector> blob = new ArrayList<PVector>();
  blob.clear();
  for (int j=0, si=basePolygon.size(); j<si; j++) {
    blob.add(basePolygon.get(j));
  }

  for (int i = 1; i < iterations; i++) {
    vertices = new ArrayList<PVector>();
    for (int v =0, l = blob.size(); v<l; v++) {
      PVector A = blob.get((v%l));
      PVector B = blob.get((v+1)%l);
      PVector C = PVector.lerp(A, B, 0.5); //medium point

      // Get a gaussian random number w/ mean of 0 and standard deviation of m
      // moves point B by adding to the Gaussian number
      float m = A.dist(B);
      C.x +=randomGaussian() * m * .25;
      C.y +=randomGaussian() * m * .25;

      vertices.add(A);
      vertices.add(C);      
      //Note we don't add "B", since it would be added twice
      //"B" is "A" in the next iteration of "i"
    }
    blob.clear();
    for (int j=0, si=vertices.size(); j<si; j++) {
      blob.add(vertices.get(j));
    }
  }
  vertices.clear();
  return blob;
}
