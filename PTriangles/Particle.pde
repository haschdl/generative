class Particle
{
  //final static float RAD = 2;
  final static float BOUNCE = -1;
  final static float SPEED_MAX = 10.5;
  final static float DIST_MAX = 120;
  PVector speed = new PVector(random(-SPEED_MAX, SPEED_MAX), random(-SPEED_MAX, SPEED_MAX));
  PVector acc = new PVector(0, 0);
  PVector pos;
  //neighboors contains the particles within DIST_MAX distance, as well as itself
  ArrayList<Particle> neighboors;
  PGraphics parent;
  float m = 0;
  
  Particle(PGraphics parent, float margin)
  {
    this.parent = parent;
    pos = new PVector (random(parent.width), random(parent.height));
    this.m = margin;
  }

  public void move()
  {    
    pos.add(speed);
    
    acc.mult(0);
    
    if (pos.x < m)
    {
      pos.x = m;
      speed.x *= BOUNCE;
    }
    else if (pos.x > parent.width - m)
    {
      pos.x = parent.width -m;
      speed.x *= BOUNCE;
    }
    if (pos.y < m)
    {
      pos.y = m;
      speed.y *= BOUNCE;
    }
    else if (pos.y > parent.height - m)
    {
      pos.y = parent.height -m;
      speed.y *= BOUNCE;
    }
  }
  
  //public void display()
  //{
  //  fill(255, 14);
  //  ellipse(pos.x, pos.y, RAD, RAD);
  //}
}
