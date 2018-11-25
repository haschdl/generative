/*
 * Half Scheidl
 * Code for https://github.com/haschdl/dear-gen/tree/master/Week-01-Araucaria
 * Part of the Dear Gen project, see https://github.com/haschdl/dear-gen
 */

float h, w;
float stem_width = 5;
PGraphics buffer1;
PGraphics buffer2;
ArrayList<Tree> trees = new ArrayList<Tree>();
int mainColor;
int[] palette = new int[] {0xFFEB5F58, 0xFF6D865E, 0xFF3D4B50, 0xFFA5ADB0 };

void setup() {
  size(825, 600);
  buffer1 = createGraphics(3300, 2400);
  buffer2 = createGraphics(3300, 2400);
  h = buffer1.height;
  w = buffer1.width;

  mainColor = color(56, 90, 78);

  background(255);
  smooth();
}

void draw() {
  buffer1.beginDraw();
  buffer1.background(255, 2);
  buffer1.translate(0, h/2);
  buffer1.endDraw();

  trees.clear();
  float three_height = 370;
  int t_per_row = int((float)h/three_height);
  int n_trees = 8;

  float x=0, y=0;
  float y0 = 20;
  Tree t = new Tree(buffer1, 0., 0., 0., 0.);
  for (int i=0; i<n_trees; i++) {
    x =  w/n_trees * (.5 + i + .1 *(1 - 2*noise(i+millis()))) + 5 ;
    y =  y0 + (three_height + 10) * ((frameCount-1) % t_per_row ) + frameCount*10  ;
    x = max(x, t.pos.x+t.tree_width + 10);    
    t = new Tree(buffer1, x, y, three_height, stem_width);

    t.leaf_color = palette[int(random(4))];//color(0, 116, 98);

    t.n_branches = int(6 + 2* randomGaussian());
    if (t.n_branches > 4)
      trees.add(t);
    else
      i--;
  }
  for (Tree tree : trees) {
    tree.draw();
  }

  buffer2.beginDraw();
  buffer1.background(255, 5);
  buffer2.image(buffer1, 0, 0, w, h);
  buffer2.endDraw();
  image(buffer2, 0, 0, width, height);

  if (frameCount >= t_per_row)
    noLoop();
}

void keyPressed() {
  if (key == 'S' || key == 's') {
    buffer2.save(String.format("/out/araucaria_%d.tiff", frameCount));
    println("Composition saved!");
  }
}
