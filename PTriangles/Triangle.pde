class Triangle
{
  PVector A, B, C; 

  Triangle(PVector p1, PVector p2, PVector p3)
  {
    A = p1;
    B = p2;
    C = p3;
  }
  
  public void draw(PGraphics target)
  {
    target.vertex(A.x, A.y);
    target.vertex(B.x, B.y);
    target.vertex(C.x, C.y);
  }
}