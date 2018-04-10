import java.text.SimpleDateFormat;
import java.util.Date;


final int NB_PARTICLES = 5000;
ArrayList<Triangle> triangles;
Particle[] parts = new Particle[NB_PARTICLES];

PImage backImg, maskImg, mask;
PGraphics buffer,finalImage;
boolean saveImage = false;
color c;

void setup()
{
  size(800, 600, P2D);

  int w = 5000;
  int h = 3750; //5000x3750 for a 40cmx30cm print
  buffer = createGraphics(w,h,P2D);  
  finalImage = createGraphics(w,h,P2D);  
  
  backImg = loadImage("saopaulo2.jpg");
  backImg.resize(buffer.width,buffer.height);
  maskImg = backImg.get();
  
  for (int i = 0; i < NB_PARTICLES; i++)
  {
    parts[i] = new Particle(buffer,40);
  }
  
  println("Setup completed");
      finalImage.beginDraw();
   
   background(255,255); //screen
    finalImage.endDraw(); 
}

void draw() {
  background(255,255); //screen

   
  //c = colr(30, 157, 93);  // Main hue for the composition
  c = color(47, 143, 18);  // Main hue for the composition 
  
  
  //float h = map(mouseX, 0, width, 0, 360);  float sat = map(mouseY, 0, height, 0, 100);   c = color(h, sat, brightness(c));
  surface.setTitle(String.format("Triangle, H =%.1f, S =%.1f, B=%.1f", hue(c),saturation(c), brightness(c)));    

  buffer.beginDraw();
  buffer.blendMode(ADD); //we want to accumulate alpha values
  buffer.clear();
  //buffer.background(240,0);//transparent background
  //buffer.rect(0,0,buffer.width, buffer.height); //white,solid background
  
  triangles = new ArrayList<Triangle>();
  Particle p1,p2;

  for(Particle p : parts)
    p.move();
  

  for (int i = 0; i < NB_PARTICLES; i++)
  {
    p1 = parts[i];
    p1.neighboors = new ArrayList<Particle>();
    p1.neighboors.add(p1);
    for (int j = i+1; j < NB_PARTICLES; j++)
    {
      p2 = parts[j];
      float d = PVector.dist(p1.pos, p2.pos); 
      if (d > 0 && d < Particle.DIST_MAX)
      {
        p1.neighboors.add(p2);
      }
    }
    if(p1.neighboors.size() > 1)
    {
      addTriangles(p1.neighboors);
    }
  }
  
  drawTriangles(buffer);
  
  //buffer.mask(img);  
  buffer.endDraw();
  
 
  
  maskImg.mask(buffer);  image(maskImg,0,0);
  
    finalImage.beginDraw();    
    finalImage.image(maskImg,0,0);
    finalImage.endDraw(); 
 

  //image(finalImage,0,0);
  
  if(saveImage) {  
    String fileName = new SimpleDateFormat("yyyyMMddHHmmss'.tiff'").format(new Date());
    finalImage.save("out\\triangles_" + fileName );
    println("File saved!");
    saveImage = false;
  } 
}

void drawTriangles(PGraphics target)
{
  target.noStroke();

  //noFill();
  //if using MASK, then Green component is used as alpha, and color is ignored.
  //target.fill(0,0,50 ); target.stroke(0,0,70);
  
  target.fill(c,30); target.stroke(c,45);
  
  target.beginShape(TRIANGLES);
  for (int i = 0; i < triangles.size(); i ++)
  {
 
    triangles.get(i).draw(target);    
  }
  target.endShape();  
  
}

void addTriangles(ArrayList<Particle> p_neighboors)
{
  int s = p_neighboors.size();
  if (s > 2)
  {
    for (int i = 1; i < s-1; i ++)
    { 
      for (int j = i+1; j < s; j ++)
      { 
         triangles.add(new Triangle(p_neighboors.get(0).pos, p_neighboors.get(i).pos, p_neighboors.get(j).pos));
      }
    }
  }
}


void mousePressed()
{
   finalImage.clear();
      
}

void keyPressed() {
  if (java.lang.Character.toUpperCase(key) == 'S') {
    saveImage = true;
  }
  else if (java.lang.Character.toUpperCase(key) == 'R') {
    buffer.clear();
  }
}
