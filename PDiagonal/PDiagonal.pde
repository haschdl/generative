/**
 * An animated reproduction of the painting "Funcão Diagonal" (Diagonal function), 1952, 
 * by artist GERALDO DE BARROS.
 *
 *
 * To generate a GIF:
 * First create video using lossless convertion
 *    ffmpeg -r 30 -i frames/%04d.png  -c:v ffv1 anim.avi
 * Then:
 *    ffmpeg -i video.avi -pix_fmt rgb24 -loop_output 0 out.gif
 */
float SQ2 = sqrt(2)/2;
void setup() {
  size(500, 500);
  rectMode(CENTER);
  frameRate(60);
  noStroke();
}

float a0= -HALF_PI;
float offset = a0;
float a;
void draw() {
  background(5);
  a=sin(offset);

  translate(width/2, height/2);
  float l = width *SQ2 * map(a, -1, 1, 0, 1);
  a*=QUARTER_PI;

  //First square
  rotate(a);
  fill(255);
  rect(0, 0, l, l);


  //second square
  rotate(-a);
  fill(5);
  l *= SQ2;
  rect(0, 0, l, l);


  //third square
  translate(l/2, 0);
  l*=SQ2;  
  rotate(a);
  fill(255);
  rect(0, 0, l, l);
  rotate(-a);

  //next
  for (int i=0; i<=5; i++) {
    translate(-l/2* (i%2), 0);
    l *= SQ2;
    pushMatrix();
    rotate(a*i);
    fill(255 * (i%2));
    rect(0, 0, l, l);
    popMatrix();
  }



  saveFrame("/frames/####.png");

  offset += .025 ;
  if (frameCount >100000) {
    noLoop();
    println("Loop done!");
  }
}
