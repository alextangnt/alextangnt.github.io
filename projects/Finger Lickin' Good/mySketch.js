// Have you ever wanted to eat your fingers, bite them off, or turn them into laffy taffy-like physics items using your mouth??? Well now you can!!!

// the code in phys.js extremely messy and not the best way to do all this, more of just a demo
// if i had more time i would redo the finger system and make better classes to keep track of things rather than so many lists
// known problems: the hands switch if you wave them around too fast or take away one hand and then put it back (doesn't keep track of which is hand 0 and which is hand 1. other model did keep track for some reason?)

// as expected, stops working if you cover up too much of your face with your hand. partially remedied with a slight y offset for the mouth drawing (you will move your hand above your head rather than in front of it)
// but can still bug out if face ends up being covered

let offsetX = 0;
let offsetY = -200;

//
// Note: this downloads large models the first time it's run.
let myTracker;

// Points on the faces and hands. 
// Don't delete or change these variable names.
// These are formatted as p5.Vector objects;
// See https://p5js.org/reference/#/p5.Vector
let eyeLeftPt, eyeRightPt;
let browLeftPt, browRightPt;
let nosePt, chinPt, foreheadPt;
let mouthLeftPt, mouthRightPt, mouthTopPt, mouthBottomPt;
let fingerIndexPt1, fingerMiddlePt1, fingerRingPt1, fingerPinkyPt1, thumbPt1, palmPt1;
let fingerIndexPt2, fingerMiddlePt2, fingerRingPt2, fingerPinkyPt2, thumbPt2, palmPt2;
let headPt, shoulderLeftPt, shoulderRightPt, elbowLeftPt, elbowRightPt;
let wristLeftPt, wristRightPt, hipLeftPt, hipRightPt;
let kneeLeftPt, kneeRightPt, footLeftPt, footRightPt;
let biteSounds = [];
// let dropSounds = [];
let boing;
let bloodSound;

//------------------------------------------
function preload(){
	biteSounds.push(loadSound('munch1.mp3'));
	biteSounds.push(loadSound('pop.mp3'));
	biteSounds.push(loadSound('chew2.mp3'));
	biteSounds.push(loadSound('chew3.mp3'));
	biteSounds.push(loadSound('chew4.mp3'));
	
	// dropSounds.push(loadSound('bamboo.mp3'));
	boing = loadSound('drop.mp3')
	// dropSounds.push(drop);
	bloodSound = loadSound('splooshing.mp3');
	
}

function setup() {
	// The canvas should match aspect ratio of your camera:
	createCanvas(windowWidth, windowHeight);
	cx = width/2;
	cy = height/2;
	//print("Initializing..."); 

	// Which data should we subscribe to? Hands, face, or both?
	// If you don't need one, turn it off for better performance.
	var bComputeFace = true;
	var bComputeHands = true;
	let bComputeBody = false;
	myTracker = new HandsAndFaceWrapper(bComputeFace, bComputeHands, bComputeBody);
	physics = new VerletPhysics2D();
  let bounds = new Rect(0, 0, windowWidth, windowHeight);
	 cx = 640/2;
	 cy = 480/2;
  physics.setWorldBounds(bounds);
  physics.addBehavior(new GravityBehavior(new Vec2D(0, 1)));
  createdParts = false
	angleMode(DEGREES);
	myBlood = new Blood();
	volume = new p5.Amplitude();
}

//------------------------------------------
function draw() {
	background(255);
	myTracker.update();
	
	// Optional diagnostic displays; comment these out as necessary:
	// myTracker.drawVideoBackground(true);
	// myTracker.drawHandMesh();
	// myTracker.drawFaceMesh();
	// myTracker.drawFPS();
	
	// Draw a triangle connecting nose and two index fingers
	if (myTracker.getDoesFaceExist()) {
		// stroke(0); 
		// strokeWeight(5);
		// strokeJoin(ROUND);
		// fill(255,0,0, 40); 
		// beginShape(); 
		// vertex(nosePt.x, nosePt.y);
		// vertex(fingerIndexPt1.x, fingerIndexPt1.y);
		// vertex(fingerIndexPt2.x, fingerIndexPt2.y);
		// endShape(CLOSE); 
		updateMouth();
		updateHandparts();
		myBlood.update();
		
	}
	if (gotFace){
		drawMouth();
		if (myTracker.getDoesHand1Exist()){
			drawParts();
		}
		myBlood.display();
	}
	// print(handParts);
	
	// fill(0);
	// noStroke(); 
	// text("hold up your two index fingers, and show your nose", 30,30); 
}