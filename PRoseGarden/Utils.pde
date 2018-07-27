ArrayList<PVector> getVertices(PShape s) {
  int n = s.getVertexCount();
  ArrayList<PVector> v = new ArrayList<PVector>();
  while (n>0) {
    v.add(s.getVertex(n));
    n--;
  }
  return v;
}


//Source: https://processing.org/examples/regularpolygon.html
ArrayList<PVector> polygon( float radius, int npoints) {
  float angle = TWO_PI / npoints; 
  ArrayList<PVector> p = new ArrayList<PVector>(); 
  for (float a = 0; a < TWO_PI - angle; a += angle) {
    float sx =  + cos(a) * radius; 
    float sy =  + sin(a) * radius; 
    p.add(new PVector(sx, sy));
  }
  return p;
}
