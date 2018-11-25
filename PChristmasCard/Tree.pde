class Tree {
  PGraphics buffer;
  PVector pos;  
  float tree_height;
  int n_branches = 10;
  //size
  float tree_width;
  float stem_width;
  
  int leaf_color;
  float strokeWeight = 5;

  Tree(PGraphics p, float x, float y, float tree_height, float stem_width) {
    this.buffer = p;
    this.pos = new PVector(x, y);
    this.tree_height = tree_height;
    this.stem_width = stem_width;
  }

  void draw() {
    buffer.beginDraw();
    buffer.pushMatrix();
    buffer.translate(pos.x, pos.y);
    stem(0, 0, stem_width, tree_height);
    for (int i = -n_branches; i <= n_branches; i+=1) {
      if (i==0) continue;
      float y = w/15 * abs(i)/n_branches + 2*(1 - 2* noise(i*23230));
      float lengthB = 10+sqrt(y)*10;
      this.tree_width = max(this.tree_width, 2*lengthB + this.stem_width);

      buffer.pushMatrix();
      buffer.scale(Long.signum(i), 1);
      float a = map(abs(i), 0, n_branches, .00001, .000001);
      branch( this.stem_width, y, lengthB, a);
      buffer.popMatrix();
    }
    buffer.popMatrix();
    buffer.endDraw();
  }
  void leaf(float x, float y, float s) {
    buffer.pushMatrix();
    buffer.pushStyle();
    buffer.translate(x, y);
    buffer.noStroke();
    buffer.fill(this.leaf_color);
    buffer.ellipse(0, 0, s, s);
    buffer.popStyle();
    buffer.popMatrix();
  }
  void stem(float x, float y, float w1, float h1) {
    buffer.fill(mainColor);
    buffer.noStroke();
    buffer.rect(x-w1, y, w1*2, h1);
    leaf(x, y, w1*4);
  }
  void branch(float x, float y, float w1, float a) {
    buffer.pushMatrix();
    buffer.translate(x, y);
    buffer.beginShape();
    buffer.vertex(0, 0);
    buffer.noFill();
    buffer.stroke(mainColor);
    buffer.strokeWeight(this.strokeWeight);
    int n = 100;
    float x_i=0, y_i=0;
    for (int i = 1; i <= n; i++) {
      x_i =  (float)i/n * w1;
      y_i = - a*pow(x_i/2, 2);
      buffer.vertex(x_i, y_i);
    }
    buffer.endShape();
    float s = randomGaussian()*5 + tree_height/20;
    leaf(x_i, y_i, s);
    buffer.popMatrix();
  }
}
