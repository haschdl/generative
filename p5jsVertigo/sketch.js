function init() {
	//ellipse rotation and rotation factor (=rotation increases by a_coef)
	a = .1;
	a_coef = 1.05;

	//ellipse initial size (e) and size factor (=ellipse grow by e_coef)
	e = 250;
  e_coef = 1.015;
	
	//aspect ratio of the ellipse (elongation) and ellongation factor
	//in the composition, the bigger ellipses are less elongated
	aspect = 2;
	aspect_coef = .994
	
	
	//number of ellipses
	n = 85;

}
function setup() {
	createCanvas(windowWidth, windowHeight);
  background("#C33721");
  init();
	//just for animation purposes
	frameRate(20);
}

function draw() {  
	if(frameCount >= n) {
		noLoop();
	}
  strokeWeight(3);

  translate(windowWidth/ 2, windowHeight / 2);
  noFill();
  //stroke(255,255,255,map(i,0,n,255,0));
	stroke(255);
  rotate(a-.1);
  
  ellipse(0, 0, e, e / aspect );
  a *= a_coef;
  e *= e_coef;
  aspect *= aspect_coef;
}