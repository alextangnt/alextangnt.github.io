

let {
	Vec2D,
	Rect
} = toxi.geom;
let {
	VerletPhysics2D,
	VerletParticle2D,
	VerletSpring2D
} = toxi.physics2d;
let {
	GravityBehavior
} = toxi.physics2d.behaviors;
let particles = [];
let handParts = [
	[],
	[]
];
let numHandsMade = 0;
let springs = [[],[]];
let currPull = [];
let currPart = null;
let handVertexIndices = [
	[17, 0, 1, 5, 9, 13, 17], /* palm */
	[1, 2, 3, 4], /* thumb */
	[5, 6, 7, 8], /* index */
	[9, 10, 11, 12], /* middle */
	[13, 14, 15, 16], /* ring */
	[17, 18, 19, 20], /* pinky */
];
const FINGERJOINT = 0; 
const PALMJOINT = 1; 
const TIP = 2; 

let jointTypes = [0,1,2];

// let chewed = [[],[]];
// let eaten = [[],[]];
let cMouth;
let rMouth;
let mouthLeft;
let mouthRight;
let gotFace = false;
let hMouth;
let mouthOpen = false;
let dMouth;
let dForehead;
let wMouth;
let pulling = false;
let mouthPullCount = 0;
let biting = false;
let bit = false;
let mouthScale = 1;
let mouthSpeed = -4;
let openSize = 5;
let rSize = 15;

let hHead;
// var pointx = 0;
// var pointy = 0; 
let biteThreshold = 30;


let amtBlood = 150;

class Blood{
	constructor(){
		this.holes = [];
		this.bloodArrays = [];
	}
	makeHole(point){
		
		if (point.isBleeding) return;
		point.isBleeding = true;
		// point is a Particle
		if (this.holes.length>10){
			this.holes.shift();
			this.bloodArrays.shift();
		}
		this.holes.push(point);
		this.bloodArrays.push([]);
	}

	
	update(){
		this.remHole();
		for (let i=0; i<this.holes.length; i++){
			let currHole = this.holes[i];
			let currHoleArr = this.bloodArrays[i];
			while (currHoleArr.length>amtBlood){
				let deleting = currHoleArr[0];
				currHoleArr.shift();
				deleting.remove();
			}
			for (let j=0;j<3;j++){
				let rx = random(rSize/2);
				let ry = random(rSize);
				currHoleArr.push(new BloodPart(currHole.x+rx,currHole.y+ry));
			}
			
		}
	}
	reset() {
		this.holes = [];
		this.bloodArrays = [];
	}
	display(){
		for (let bloodArray of this.bloodArrays){
			for (let i = bloodArray.length-1; i>=0;i--){
				bloodArray[i].display();
				if (mouthOpen && inMouth(bloodArray[i])){
					bloodArray.splice(i,1);
				}
			}
		}
	}
	remHole(){
		for (let i=this.holes.length-1; i>=0; i--){
			let currHole = this.holes[i];
			if (currHole.ate) {
				this.holes.splice(i, 1);
				this.bloodArrays.splice(i,1);
			}
		}
	}
	amtBlood(){
		return this.holes.length;
	}
}

class BloodPart extends VerletParticle2D{
	constructor(x,y){
		super(x,y);
		physics.addParticle(this);
	}
	display(){
		strokeWeight(10);
		stroke(255,0,0)
		point(this.x,this.y);
	}
	remove() {
		physics.removeParticle(this);
	}
}

class Particle extends VerletParticle2D {
	constructor(x, y, jointType, hand) {
		super(x, y);
		this.type = jointType;
		this.loose = false;
		this.ate = false;
		this.isBleeding = false;
		this.hand = hand;
		// this.toRemove = false;
		physics.addParticle(this);
	}

	display() {
		fill(127);
		stroke(0);
		circle(this.x, this.y, rSize);
	}
	remove() {
		physics.removeParticle(this);
	}

}

class Spring extends VerletSpring2D {
	constructor(a, b) {
		//Constructor receives two particles as arguments

		let length = dist(a.x, a.y, b.x, b.y);
		//Calculating the rest length as the distance between the particles

		super(a, b, length, 0.05);
		//Hardcoding the spring strength
		// this.a = a;
		// this.b = b;
		physics.addSpring(this);
		this.toRemove = false;
		//Another enhancement to to have the object add itself to the physics world!
	}
	remove() {
		physics.removeSpring(this);
		this.toRemove = true;
	}

	display() {
		stroke(0);
		strokeWeight(rSize);
		strokeCap(SQUARE);
		line(this.a.x, this.a.y, this.b.x, this.b.y);
		// stroke(255);
		// strokeWeight(10);
		// line(this.a.x, this.a.y, this.b.x, this.b.y);
	}
}

		
function inMouth(p){
	if (dist(p.x,p.y,cMouth.x,cMouth.y) < wMouth * mouthScale / 2){
		return true;
	}
	return false;
}
function drawMouth() {
	noFill();
	strokeWeight(10);
	// 	stroke(255,0,0);
	// 	line(mouthLeftPt.x,mouthLeftPt.y,mouthTopPt.x,mouthTopPt.y);
	// 	line(mouthTopPt.x,mouthTopPt.y,mouthRightPt.x,mouthRightPt.y);
	// 	line(mouthRightPt.x,mouthRightPt.y,mouthBottomPt.x,mouthBottomPt.y);
	// 	line(mouthBottomPt.x,mouthBottomPt.y,mouthLeftPt.x,mouthLeftPt.y);
	stroke(0);

	// push();
	// 	translate(cMouth.x, cMouth.y);
	// 	rotate(90-rMouth);

	// 	line(mouthLeft.x-cMouth.x,mouthLeft.y-cMouth.y,topLip.x-cMouth.x,topLip.y-cMouth.y);
	// 	line(topLip.x-cMouth.x,topLip.y-cMouth.y,mouthRight.x-cMouth.x,mouthRight.y-cMouth.y);
	// 	line(mouthRight.x-cMouth.x,mouthRight.y-cMouth.y,botLip.x-cMouth.x,botLip.y-cMouth.y);
	// 	line(botLip.x-cMouth.x,botLip.y-cMouth.y,mouthLeft.x-cMouth.x,mouthLeft.y-cMouth.y);
	// pop();
	push();

	translate(cMouth.x, cMouth.y);
	rotate(90 - rMouth);
	ellipse(0, 0, wMouth * mouthScale, hMouth * mouthScale);
	pop();

}

function updateMouth() {
	wMouth = dist(mouthLeftPt.x, mouthLeftPt.y, mouthRightPt.x, mouthRightPt.y);
	newhMouth = dist(mouthTopPt.x, mouthTopPt.y, mouthBottomPt.x, mouthBottomPt.y);
	dMouth = newhMouth - hMouth;
	hMouth = newhMouth

	newhHead = dist(chinPt.x, chinPt.y, foreheadPt.x, foreheadPt.y);
	dForehead = newhHead - hHead;
	hHead = newhHead



	// cMouth = createVector(
	// (foreheadPt.x + chinPt.x) / 2,
	// (foreheadPt.y + chinPt.y) / 2,
	// );

	topLip = createVector(mouthTopPt.x, mouthTopPt.y - hMouth * mouthScale / 2);
	botLip = createVector(mouthBottomPt.x, mouthBottomPt.y + hMouth * mouthScale / 2);
	mouthLeft = createVector(mouthLeftPt.x + wMouth * mouthScale / 2, mouthLeftPt.y);
	mouthRight = createVector(mouthRightPt.x - wMouth * mouthScale / 2, mouthRightPt.y);
	cMouth = createVector(
		(mouthTopPt.x + mouthBottomPt.x) / 2 + offsetX,
		(mouthTopPt.y + mouthBottomPt.y) / 2 + offsetY,
	);
	rMouth = atan2(mouthLeftPt.x - mouthRightPt.x, mouthLeftPt.y - mouthRightPt.y);
	if (hMouth > openSize) {
		mouthOpen = true;
		if (!biting) {
			if (pulling && !bit && mouthPullCount>=30) {
				boing.amp(0.5);
				boing.play();
			}
			pulling = false;
			
		}
		if (mouthPullCount > 0 && mouthPullCount < biteThreshold) {
			bit = true;
			biting = false;
		}
		mouthPullCount = 0;
		// print("mouth open");
	} else {
		mouthOpen = false;
		// print("mouth close");
		if (pulling) {
			mouthPullCount++;
		}
	}
	if (dMouth < mouthSpeed || dForehead < mouthSpeed) {
		biting = true;
		// print("biting!");
	} else biting = false;
	gotFace = true;
}

function makeHandparts(h) {
	if (myTracker.handsValid() && handParts[h].length == 0 && h <= 1) {
		var handLandmarks = myTracker.handsfree.data.hands.multiHandLandmarks;
		// let joints = handLandmarks.landmarks[h];
		for (let i = 0; i <= 20; i++) {
			if (handParts[h].length > 20) return;
			let p = myTracker.getScaledHandPoint(h, i);
			let type = FINGERJOINT;
			if (handVertexIndices[0].includes(i)) type = PALMJOINT;
			else if (i%4==0) type = TIP;
			handParts[h].push(newPart(p.x, p.y, type, h));
		}
		makeSprings(h, HANDLANDMARKER_PALM);
		makeSprings(h, HANDLANDMARKER_THUMB);
		makeSprings(h, HANDLANDMARKER_INDEX_FINGER);
		makeSprings(h, HANDLANDMARKER_MIDDLE_FINGER);
		makeSprings(h, HANDLANDMARKER_RING_FINGER);
		makeSprings(h, HANDLANDMARKER_PINKY);
	}
}

function updateFingers(h) {
	for (let i = 1; i < HAND_VERTEX_INDICES.length; i++) {
		let foundAte = false;
		for (let j = 0; j < HAND_VERTEX_INDICES[i].length; j++) {
			let currHandPart = handParts[h][HAND_VERTEX_INDICES[i][j]];
			
				// print("found " + j);
			if (currHandPart.ate) {
				
				foundAte = true;
				
				continue;
			}

			if (foundAte) {
				// print("loosen " + j);
				currHandPart.loose = true;
				if (!currHandPart.isBleeding && currHandPart.type!=TIP){
					myBlood.makeHole(currHandPart);
				}
			}
		}
	}
}

function updateHandparts() {
	if (myTracker.handsValid()) {
		physics.update();
		var handLandmarks = myTracker.handsfree.data.hands.multiHandLandmarks;
		var nHands = handLandmarks.length;
		if (nHands > 0) {
			numHandsMade = (max, numHandsMade, nHands);
			for (let h = 0; h < nHands; h++) {

				if (h > 1) return;
				// print(handParts);
				// print(h);
				if (handParts[h].length == 0) {
					makeHandparts(h);
				}

				// let joints = myTracker.handLandmarks.landmarks[h];
				for (let i = 0; i <= 20; i++) {
					let currHandPart = handParts[h][i];
					if (!currHandPart.ate) {
						if (!currHandPart.loose || currHandPart.type==PALMJOINT) {
							let p = myTracker.getScaledHandPoint(h, i);
							// let px = joints[i].x;
							// let py = joints[i].y;
							// px = map(px, 0, 1, width, 0);
							// py = map(py, 0, 1, 0, height);
							currHandPart.lock()
							currHandPart.x = p.x;
							currHandPart.y = p.y;
							currHandPart.unlock();
						}
						// let currHandPart = handParts[h][i];

						// if (gotFace) {
						if (biting && mouthOpen && currHandPart.type!=PALMJOINT) {
							if (inMouth(currHandPart)) {
								// if (!chewed[h].includes(i))   {
								//   chewed[h].push(i);
								// }
								// print("Chewed " + (h, i));
								currHandPart.loose = true;
								// checkPulling = true;
								pulling = true;
								bit = false;
								currPull = [h, i];
								// var A = 0.95;
								// var B = 1.0-A; 
								// pointx = A*pointx + B*cMouth.x; 
								// pointy = A*pointy + B*cMouth.y; 
								currHandPart.lock()
								currHandPart.x = cMouth.x;
								currHandPart.y = cMouth.y;
								currHandPart.unlock()
							}
						}

					}

					if (h == currPull[0] && i == currPull[1]) {
						let currHandPart = handParts[h][i];
						if (pulling) {
							currHandPart.lock()
							currHandPart.x = cMouth.x;
							currHandPart.y = cMouth.y;
							currHandPart.unlock()
						} else if (bit) {
							// print("BITE!");
							currHandPart.ate = true;
							random(biteSounds).play();
							let volume = map(myBlood.amtBlood(), 0, 20, 0, 0.8);
							volume = constrain(volume, 0, 1);
							bloodSound.loop();
							bloodSound.amp(volume);
							bloodSound.play();
							// let prevHandPart = handParts[h][i-1];
							// if (prevHandPart.type!=PALMJOINT){
							// 	myBlood.makeHole(prevHandPart);
							// 	print(i + " is bit. Making hole in ");
							// }
							
							
							bit = false;
							// physics.removeParticle(currHandPart);
							// eaten[h].push(i);
							// print(eaten);
							// print(chewed);
						}
					}
				}

			}
		}
	}
}


function makeSprings(h, connectorSet) {
	let nConnectors = connectorSet.length;
	for (let i = 0; i < nConnectors; i++) {
		let index0 = connectorSet[i].start;
		let index1 = connectorSet[i].end;
		let p0 = handParts[h][index0];
		let p1 = handParts[h][index1];
		springs[h].push(new Spring(p0, p1));
		// line(x0, y0, x1, y1);
	}
}

function drawSprings(h) {
	strokeWeight(10);
	for (let i = springs.length - 1; i >= 0; i--) {
		if (springs[i].toRemove) {
			springs.splice(i, 1);
		}
	}
	strokeWeight(10);
	// print(springs[h]+ ": "+ h );
	for (let s of springs[h]) {
		
		// print(s.a.x);
		// print(s.a.y);
		if (s.a.ate) {
			s.b.loose = true;
			if (!s.b.isBleeding){
				
				myBlood.makeHole(s.b);
			}
			s.remove();
			
		}
		else if (s.b.ate) {
			s.a.loose = true;
			if (!s.a.isBleeding){
				
				myBlood.makeHole(s.a);
			}
			s.remove();
		}
		else s.display();
	}

}

function newPart(x, y, type, h) {
	let p1 = new Particle(x, y, type, h);
	particles.push(p1);
	currPart = p1;
	return p1;
}

function drawParts() {
	beginShape();
	noStroke();
	fill(0);
	var handLandmarks = myTracker.handsfree.data.hands.multiHandLandmarks;
	var nHands = handLandmarks.length;
	nHands = min(2,nHands);
	for (let h = 0; h < nHands; h++) {
		for (let i = 0; i < HAND_VERTEX_INDICES[0].length; i++) {
			let p = handParts[h][HAND_VERTEX_INDICES[0][i]];
			vertex(p.x, p.y);
		}
	}
	endShape();
	for (let h = 0; h < nHands; h++){
	drawSprings(h);
	}
	for (let i = particles.length - 1; i >= 0; i--) {
		if (particles[i].toRemove) {
			particles.splice(i, 1);
		}
	}
	noStroke();
// 	for (let particle of particles) {

// 		if (particle.loose) {

// 			fill(255, 0, 0);
// 		} else {
// 			fill(0);
// 		}
// 		if (!particle.ate) {
// 			noStroke();
// 			circle(particle.x, particle.y, rSize);
// 		} else {
// 			particle.remove();
// 		}
// 	}
	for (let h = 0; h < nHands; h++) {
		for (let i = 0; i <= 20; i++) {
			let particle = handParts[h][i];
			if (particle.loose && particle.type!=TIP) {

				fill(255, 0, 0);
			} else {
				fill(0);
			}
			if (!particle.ate) {
				noStroke();
				circle(particle.x, particle.y, rSize);
			} else {
				updateFingers(h);
				particle.remove();
			}
		}
	}

}

function keyPressed(){
	particles = [];
	handParts = [[],[]];
	springs = [[],[]];
	myBlood.reset();
}