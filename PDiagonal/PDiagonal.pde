float SQ2 = sqrt(2)/2;
void setup() {
  size(500, 500);
  rectMode(CENTER);

  noStroke();
}
float offset = -QUARTER_PI;
float a;
void draw() {
  background(5);
  offset += .015 ; 
  //a = QUARTER_PI;
  a=sin(offset) * QUARTER_PI;

  translate(width/2, height/2);
  float l = width *SQ2 * map(a/QUARTER_PI, -1, 1, .3, 1);

  //animate
  //rotate(a);

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

  //if (abs(a-QUARTER_PI) < 0.002)
  //noLoop();
}
