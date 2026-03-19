let { Vec2D, Rect } = toxi.geom;
let { VerletPhysics2D, VerletParticle2D, VerletSpring2D } = toxi.physics2d;
let { GravityBehavior } = toxi.physics2d.behaviors;
let px = 0;
let py = 0;
let particles = [];
let springs = [];
let d = 90;
let d2 = 67;
let h = 25;
let allCircs = true;
let angle = 0;

let left = [];
let right = [];
let flip = false;
let colorCount = 0;
let colors = ['rgb(218,94,155)','rgb(237,204,186)','rgb(141,195,112)','rgb(75,82,186)'];
let colorsBg = ['rgb(151,112,131)','rgb(221,201,190)','rgb(129,175,105)','rgb(134,137,179)'];

function setupNeckPhys(){
	 physics = new VerletPhysics2D();
  let bounds = new Rect(0, 0, width, height);
	 cx = width/2;
	 cy = height/2;
  physics.setWorldBounds(bounds);
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 0.01)));
	
	
	let p1 = new Particle(cx+d, height);
	let p2 = new Particle(cx-d, height);
  particles.push(p1);
	right.push(p1);
	particles.push(p2);
	left.push(p2);
	
	let segs = 10;

	for (let i=1; i<=segs*2-1; i+=2){
		p1 = new Particle(cx-d2, height-(i*h))
		particles.push(p1);
		left.push(p1);
		p2 = new Particle(cx-d, height-((i+1)*h));
		particles.push(p2);
		left.push(p2);
		
	}
	for (let i=segs*2; i>1; i-=2){
		p1 = new Particle(cx+d, height-(i*h));
		particles.push(p1);
		right.splice(1,0,p1)
		p2 = new Particle(cx+d2, height-((i-1)*h));
		particles.push(p2);
		right.splice(1,0,p2)
		// particles.push(new Particle(400, 225+i));
	}
	let count = particles.length;
	for (let i=0; i<count-1; i++){
		springs.push(new Spring(particles[i], particles[i+1]));
	}
	springs.push(new Spring(particles[0], particles[count-1]));

	for (let i=0; i<left.length-1; i++){
		springs.push(new Spring(left[i], right[i]));
		if (i%2==0 && i>=2){
			springs.push(new Spring(left[i], right[i-2]));
			springs.push(new Spring(left[i-2], right[i]));
			
			
			// springs.push(new Spring(left[i], left[i-2]));
			// springs.push(new Spring(right[i], right[i-2]));
		}
		if (i>=1){
			springs.push(new Spring(left[i], right[i-1]));
			springs.push(new Spring(left[i-1], right[i]));
		}
		// if (i>=3){
		// 	springs.push(new Spring(left[i], right[i-3]));
		// 	springs.push(new Spring(left[i-3], right[i]));
		// }
	}
	particles[0].lock();
	particles[1].lock();
	// print(left);
	// print(right);
	lastL = left[left.length-1];
	lastR = right[right.length-1];
	drawingContext.shadowOffsetX = 2;
  drawingContext.shadowOffsetY = 3;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'black';
}

function drawNeck(){
	
	// fill(127);
  // stroke(0);
	let s;
	let s2;
	noStroke();
	for (let i=0; i<left.length-1; i++){
		

		
		if (i%2==0){
			fill(237,153,167);

			
			s = d*2-20;
			s2 = d2*2;
			
		}
		else {
			fill(250,83,115);


			s = d2*2;
			s2 = d*2-20;
		}
		if (lockedOn){
			let colnum = (i+colorCount)%colors.length;
			let curcol = colors[colnum];
			fill(curcol);
		}
		
		// if (i>10){
		// 	drawingContext.shadowColor = 'rgb(32,35,159)';
		// 	drawingContext.shadowOffsetY = i^2;
		// }
		p1 = left[i];
		p2 = right[i];
		p3 = right[i+1];
		p4 = left[i+1];
		if (!allCircs){
				beginShape();
			// for (let left of particles) {
			//   vertex(particle.x, particle.y);
			// }
			vertex(p1.x, p1.y);
			vertex(p2.x, p2.y);
			vertex(p3.x, p3.y);
			vertex(p4.x, p4.y);
			endShape(CLOSE);
		}
		
// 		for (let i=p1.y; i<p4.y;i++){
// 			let leftX = p1.x;
// 			let leftY = i;
// 			let rightX = map(i,p1.x,p4.x,p2.y,p3.y);
// 			let rightY = map(i,p1.y,p4.y,p2.y,p3.y);
// 			let a = atan2(p1.x-p2.x, p1.y -p2.y);
// 			let x = (p1.x+p2.x)/2;
// 			let y = (p1.y+p2.y)/2;
// 			let hei = constrain(y-cy,40,s);
// 			push();
// 			translate(x,y)
// 			rotate(-a);

// 			ellipse(0,0,hei,s);
// 		}
  	
		let a = atan2(p1.x-p2.x, p1.y -p2.y);
		let x = (p1.x+p2.x)/2;
		let y = (p1.y+p2.y)/2;
		let hei = constrain(y-cy,40,s/2);
		if (allCircs){
			let a2 = atan2(p4.x-p3.x, p4.y -p3.y);
			let x2 = (p4.x+p3.x)/2;
			let y2 = (p4.y+p3.y)/2;
			let hei2 = constrain(y2-cy,40,s/2);
			let num = 30;
			for (let i=0; i<num; i++){
				if (i>0){
					drawingContext.shadowBlur = 0;
					drawingContext.shadowOffsetX = 0;
  				drawingContext.shadowOffsetY = 0;
				}
				else {
					drawingContext.shadowBlur = 10;
					drawingContext.shadowOffsetX = 2;
  				drawingContext.shadowOffsetY = 3;
				}
				let newX = map(i,0,num,x,x2);
				let newY = map(i,0,num,y,y2);
				let newA = map(i,0,num,a,a2);
				let newH = map(i,0,num,hei,hei2);
				let newS = map(i,0,num,s,s2);

				push();
				translate(newX,newY)
				rotate(-newA);

				ellipse(0,0,newH,newS);
				pop();
			}
		}
			else {
			push();
			translate(x,y)
			rotate(-a);

			ellipse(0,0,hei,s);
			pop();
		}
	}
	drawingContext.shadowBlur = 10;
					drawingContext.shadowOffsetX = 2;
  				drawingContext.shadowOffsetY = 3;
	s = d*2-20;
	fill(250,83,115);
	p1 = lastL;
	p2 = lastR;
	a = atan2(p1.x-p2.x, p1.y -p2.y);
	x = (p1.x+p2.x)/2;
	y = (p1.y+p2.y)/2;
	hei = constrain(y-cy,40,s/2);
	push();
	translate(x,y)
	rotate(-a);

	ellipse(0,0,hei,s);
	pop();
}

class Particle extends VerletParticle2D {
  constructor(x, y, r) {
    super(x, y);
    this.r = r;
    physics.addParticle(this);


  }

  show() {
    fill(127);
    stroke(0);
    circle(this.x, this.y, this.r * 2);
  }
}

function updateNeck(x,y,rot){
		physics.update();
		let distL = dist(x,y,lastL.x,lastL.y);
		let distR = dist(x,y,lastR.x,lastR.y);
		angle = atan2(lastL.x-lastR.x, lastL.y -lastR.y);
		// if (abs(distL-distR)<30){
		let dx = sin(rot);
		let dy = cos(rot);
		lastL.lock();
		lastR.lock();
		// var A = 0.93;
		// var B = 1.0-A;
		// px = A*px + B*x;
		// py = A*py + B*y; 
		px = x;
		py = y;
		lastL.x = px+d*dx;
		lastL.y = py+d*dy;
		lastR.x = px-d*dx;
		lastR.y = py-d*dy;
		lastL.unlock();
		lastR.unlock();
	
	
}

function keyTyped(){
	if (key === "x") flashMode = !flashMode;
	allCircs = !allCircs;
}

class Spring extends VerletSpring2D {
  constructor(a, b) {
//Constructor receives two particles as arguments

    let length = dist(a.x, a.y, b.x, b.y);
//Calculating the rest length as the distance between the particles

    super(a, b, length, 0.01);
//Hardcoding the spring strength

    physics.addSpring(this);
//Another enhancement to to have the object add itself to the physics world!

  }
}
