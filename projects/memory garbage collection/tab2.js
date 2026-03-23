



// Code taken from Golan Levin's template: https://openprocessing.org/sketch/2059071

// Original copyright:
// Copyright (c) 2023 ml5
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
// Originally from https://editor.p5js.org/ml5/sketches/QGH3dwJ1A
// Requires: https://unpkg.com/ml5@0.20.0-alpha.3/dist/ml5.js
let zigProgress = 0
let w = 1620
let h = 1080
let mw = 640
let mh = 480
let wratio = w/mw
let hratio = h/mh
let handTracker;
let grabbables = [];
let zig = [];
let zstart;
let zigmode = false;

let handpose;
let video;
let hands = [];
let hand = [];
let options = { maxHands: 2, flipHorizontal: true };
let s = 15
let pinch = [false,false]

function vdist(p1,p2){
	return dist(p1.x,p1.y,p2.x,p2.y)
}
function vadd(p1,p2){
	return createVector(p1.x+p2.x,p1.y+p2.y)
}
function mid(p1,p2){
	return createVector((p1.x+p2.x)/2,(p1.y+p2.y)/2)
}

class tracker{
	constructor() {
		this.hands = [];

		this.handsAv = []
	}
	getPinchPt(i){
		return this.hands[i].pinchPt
	}
	addHand(hand, num){
		if (this.hands.length>=2){
			this.hands.shift();
			this.handsAv.shift();
		}
		else{
			this.hands.push(new oneHand(hand,num));
			this.handsAv.push(hand.av)
		}
	}
	ud() {
		if (this.hands.length>1 && this.handsAv[0]!=null && this.handsAv[1]!=null){
			let hand0 = this.hands[0].av
			let hand1 = this.hands[1].av
			if (vdist(this.handsAv[0],hand0)> vdist(this.handsAv[0],hand1)){
				let temp = this.hands[1]
				this.hands[0] = this.hands[1]
				this.hands[1] = temp
			}
		}
		for (let i=0; i<this.hands.length; i++){
			this.hands[i].ud()
			this.handsAv[i] = this.hands[i].av
		}
	}
	display() {
		strokeWeight(10)
		for (let i = 0; i < this.hands.length; i++) {
			let hand = this.hands[i];
			for (let j = 0; j < hand.hand.keypoints.length; j++) {
				let keypoint = hand.hand.keypoints[j];
				fill(0,255,0);
				noStroke();
				circle(keypoint.x*wratio, keypoint.y*hratio, 10);
				// if (j==ML5HAND_THUMB_TIP)
			}	
		}
	}
}

class oneHand {
	constructor(hand, num){
		this.hand = hand
		this.av;
		this.getAv()
		this.num = num;
		this.thumbTip = createVector(this.hand.keypoints[ML5HAND_THUMB_TIP].x*wratio,this.hand.keypoints[ML5HAND_THUMB_TIP].y*hratio)
		this.indexTip = createVector(this.hand.keypoints[ML5HAND_INDEX_FINGER_TIP].x*wratio,this.hand.keypoints[ML5HAND_INDEX_FINGER_TIP].y*hratio)
		this.ti = vdist(this.thumbTip,this.indexTip);
		this.pinchPt = mid(this.thumbTip,this.indexTip) ;
		this.pinching = false;
		this.grabbed = null;
		this.buffer = 0;
		this.zigProgress = 0;
		this.ud()
		
	}
	
	getAv(){
		let sumx = 0
		let sumy = 0
		let len = this.hand.keypoints.length
    for (let j = 0; j < len; j++) {
      let keypoint = this.hand.keypoints[j];
      sumx += keypoint.x*wratio
			sumy += keypoint.y*hratio
  	}
		this.av = createVector(sumx/len,sumy/len)
	}
	ud(){
		
		
		s = dist(this.hand.keypoints[11].x*wratio,this.hand.keypoints[11].y*hratio,this.hand.keypoints[12].x*wratio,this.hand.keypoints[12].y*hratio)
		this.getAv()
		this.thumbTip = createVector(this.hand.keypoints[ML5HAND_THUMB_TIP].x*wratio,this.hand.keypoints[ML5HAND_THUMB_TIP].y*hratio)
		this.indexTip = createVector(this.hand.keypoints[ML5HAND_INDEX_FINGER_TIP].x*wratio,this.hand.keypoints[ML5HAND_INDEX_FINGER_TIP].y*hratio)
		this.pinchPt = mid(this.thumbTip,this.indexTip)
		if (zigmode) this.checkzig()
		if (this.grabbed!=null){
			 
			this.grabbed.ud(this.pinchPt)
			// this.grabbed.();
			return
		}
		else if (this.pinching && this.grabbed==null){

            let currClosestD = w;
            let currClosest = null;
            for (let i=0; i<grabbables.length; i++){
                let g = grabbables[i]
                let d = vdist(this.pinchPt,g.pt)
                if (d<s+g.s && d<=currClosestD){
                    // print("pinch on new object")
                    currClosestD = d
                    currClosest = g

                }
                if (currClosest == null){
                    this.grabbed = this.latestGrabbed;
                }
                else this.grabbed = currClosest;
            }

        }
			// if (this.grabbed!=null) this.grabbed.color = color(255,0,0)
			
		if (vdist(this.thumbTip,this.indexTip)<s) {
			this.buffer = 0
			this.pinching = true
			// print("pinch " + this.num)
			// this.pinchPt = mid(this.thumbTip,this.indexTip) 
		}
		else {
			this.pinching = false;
				// print("unpinch " + this.num);
			if (this.grabbed != null)	
				{
					this.grabbed.isGrabbed = false;
				}
			this.grabbed = null;
// 			this.buffer++;

// 			if (this.buffer>600){
// 				// print(vdist(this.thumbTip,this.indexTip))
// 				this.pinching = false;
// 				print("unpinch " + this.num);
// 				this.grabbed = null;
// 				this.buffer = 0
// 			}
			// else if (this.grabbed != null) this.grabbed.update(this.pinchPt)
		}
}
	checkzig() {
		if (zigProgress == zig.length){
			print("ZIGGED");
			zigProgress = 0;
			return
		}
		if (vdist(this.indexTip,zstart)<100){
			zigProgress = 1;
			print("reset")
			// circle(this.indexTip.x,this.indexTip.y,70)
			return
		}
		else {
			let next = zig[zigProgress]
			// print(zigProgress)
			if (vdist(this.indexTip,vadd(next,zstart))<100){
				// circle(this.indexTip.x,this.indexTip.y,50)
				zigProgress ++;
			}
		}
		
	}
	
	// pinch(p){
	// 	this.pinchPt = mid(indexTip,thumbTip)
	// }	
}

class grabbable {
	constructor(x,y,s,v, ID, pic) {
		this.pt = createVector(x,y)
		this.s = s
		this.grabbed = false
		this.color = color(s*2,s*2,255)
		this.visible = v;
		this.isGrabbed = false;
		this.hasBeenGrabbed = false;
		this.itemID = ID;
		this.pic = pic;
		this.origX = x;
		this.origY = y;
		this.movable = true;
	}
	
	drop(){
        // print("dropped")
        if (this.pt.x<400 && (200 < this.pt.y && this.pt.y < 500)){
						if (lithiumIsOpen)
						{toss(this)}
						if(this.itemID%2==0)
							{
								
							}
					else{
						
					}
            // let index = grabbables.indexOf(this);
            // grabbables.splice(index, 1);
        }
        if (this.pt.x<400 && (600 < this.pt.y && this.pt.y < 900)){
            if (alkalineIsOpen) {toss(this)}
						if(this.itemID%2==1)
							{
								 
							}
						else{
							
						}
        }
	}
ud(pt) {
		if (this.movable)
		{this.pt = pt;}
		this.visible=true;
		
		if (!this.hasBeenGrabbed)
			{
				let rand = random(4);
				if (rand>3)
					{
						rustle.play()
					}
				else if (rand>2) {
					rustleL.play()
				}
				else if (rand>1){
					pickup.play();
				}
				else {
					pickupL.play();
				}
				print("update")
				this.hasBeenGrabbed = true;
				switch (this.itemID){
					case B1FLAP:
						body1hasFlap = false;
						break;
					case B1ARM:
						body1hasArm = false;
						break;
					case B1LEG1:
						body1hasLeg = false;
						toss(grabbables[B1LEG2]);
						break;
					case B1LEG2:
						body1hasLeg = false;
						toss(grabbables[B1LEG1]);
						break;
					case B1EYEBALL:
						body1hasEyelid = false;
						untoss(grabbables[B1EYEBALL2])
						grabbables[B1EYEBALL2].visible = true;
						//toss(grabbables[B1EYEBALL2]);
						break;
					case B1EYEBALL2:
						body1hasEyeball = false;
						break;
					//blob :3 — Today at 11:55 AM
					//TOOLS BREAK
					case B2HAND:
							body2hasHand = false;
							break;
					case B2KNEE:
							body2hasKnee = false;
							break;
					case B2HEART:
							body2hasHeart = false;
							break;
					case B2FLAP:
							body2hasFlap = false;
							untoss(grabbables[B2SKIN])
							break;
					case B2SKIN:
							if(!scalpelInUse)
							{
								untoss(this);
							}
						else {
								this.movable = true;
								toss(this);
								body2hasSkin = false;
								scalpelInUse = false;
								grabbables[SCALPELG].visible = false;
								untoss(grabbables[SCALPELG])
								untoss(grabbables[B2RIB])
							}
							break;
					case B2RIB:
							body2hasRibs = false;
							untoss(grabbables[B2HEART])
							break;
					case B3GUTS:
							body3hasGuts = false;
							break;
					case B3BRAIN:
							body3hasBrain = false;
							break;
					case B3FOOT:
							body3hasFoot = false;
							break;
					case B3FLAP:
							body3hasFlap = false;
							untoss(grabbables[B3SKIN])
							break;
					case B3SKIN:
							if(!scalpelInUse)
							{
								untoss(this);
							}
						else {
								this.movable = true;
								body3hasSkin = false;
								scalpelInUse = false;
								toss(this);
								grabbables[SCALPELG].visible = false;
								untoss(grabbables[SCALPELG])
								untoss(grabbables[B3GUTS])
							}
							break;
					case B3SKULL:
							body3hasSkull = false;
							untoss(grabbables[B3BRAIN])
							break;
						
					case SCALPELG:
					scalpelInUse = true;
					//toss(grabbables[SCALPELG]);
						this.hasBeenGrabbed=false;
						break;
					case BONESAWG:
					bonesawInUse = true;
					//toss(grabbables[BONESAWG]);
						this.hasBeenGrabbed=false;
						break;
						
					case HAMMERG:
					bonesawInUse = true;
					//toss(grabbables[HAMMERG]);
						this.hasBeenGrabbed=false;
						break;
				}
				
					
			}
	}
	
	display() {
		noStroke();
		fill(255, 255, 255, 50);
		//circle(this.pt.x,this.pt.y, this.s);
		
		if(this.visible && (this.pic != null))
			{
				image(this.pic, this.pt.x,this.pt.y);
				//image(this.pic, wc, hc);
			}
	}
}


function toss(g)
{
	g.pt.x = GONE;
	g.pt.y = GONE;
	g.visible = false;
}

function untoss(g)
{
	g.pt.x = g.origX;
	g.pt.y = g.origY;
	//g.visible = true;
}

function preloadWeg() {
  // Load the handpose model.
	zig = [createVector(0,0),createVector(200,0),createVector(400,0),createVector(500,0),createVector(400,100),createVector(200,400),createVector(0,500),createVector(500,500)];
	zstart = createVector(w/5,h/5);
  handpose = ml5.handpose(options);
}

//SETUP

function setupWeg() {
	
	colorMode(RGB,255)
  createCanvas(w, h);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  // start detecting hands from the webcam video
  handpose.detectStart(video, gotHands);
	// for (let i=0; i<10; i++){
	// 	grabbables.push(new grabbable(width/2, i*height/10,30+(5*i)))
	// }
	handTracker = (new tracker());
	
	setupBody1();
	
}

function drawWeg() {
	
  // Draw the webcam video
	//background(255);
	push();
	if (options.flipHorizontal){
		translate(width,0); 
		scale(-1,1);
	}
	let transparency = 100; // reduce this to make video transparent
	tint(255,255,255,transparency); 
  //image(video, 0, 0, width, height);
	pop();

	drawHands();
	// updateHand();

	// updateObj();
	for (let i=0; i<grabbables.length; i++){
		grabbables[i].display();
		grabbables[i].drop();
	}
	handTracker.ud();
	// handTracker.display();
	stroke(255,0,0)
	strokeWeight(10)
	line(10,10,s,10)
	noFill();
	if (zigmode){
		circle(zstart.x,zstart.y,100);
		for (let i=0; i<zig.length-1; i++){
			line(zig[i].x+zstart.x,zig[i].y+zstart.y,zig[i+1].x+zstart.x,zig[i+1].y+zstart.y);
		}
	}
}

function drawHands(){
	for (let i=0; i<handTracker.hands.length; i++){
		let h = handTracker.hands[i]
		let p = h.pinchPt;
		if (h.pinching){
			image(closedclaw,p.x,p.y);
		}
		else {
		image(openclaw,p.x,p.y);
		}
	}
	
}



function updateObj(){
	for (let i = 0; i < hands.length; i++) {
		if (pinch[i] && vdist(pinchPt[i],obj)<s){
			// print("pinch on obj")
			pinched[i] = true
			
		}
		if (pinched[i]){
			obj.x = pinchPt[i].x
			obj.y = pinchPt[i].y
		}
	}
}


// Callback function for when handpose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
	
	for (let i = 0; i < hands.length; i++) {
		let hand = hands[i];
		handTracker.addHand(hand,i)
		// handObjs.push(new handTracker(hand,i))
		// thumbPt.push(createVector(hand.keypoints[ML5HAND_THUMB_TIP].x,hand.keypoints[ML5HAND_THUMB_TIP].y))
		// indexPt.push(createVector(hand.keypoints[ML5HAND_INDEX_FINGER_TIP].x,hand.keypoints[ML5HAND_INDEX_FINGER_TIP].y))
	}
}

function setupBody1()
{
	B1flap = new grabbable(810, 472, B1flapRadius, false, B1FLAP, body1flap);
	grabbables.push(B1flap);
	B1arm = new grabbable(995, 513, B1armRadius, false, B1ARM, body1arm_severed);
	grabbables.push(B1arm);
	B1leg1 = new grabbable(728, 751, B1leg1Radius, false, B1LEG1, body1leg_severed);
	grabbables.push(B1leg1);
	B1leg2 = new grabbable(666, 874, B1leg2Radius, false, B1LEG2, body1leg_severed);
	grabbables.push(B1leg2);
	B1eyeball = new grabbable(700, 271, B1eyeballRadius, false, B1EYEBALL, null);
	grabbables.push(B1eyeball);
	B1eyeball2 = new grabbable(700, 271, B1eyeball2Radius, false, B1EYEBALL2, body1eyeball_severed);
	grabbables.push(B1eyeball2);
	toss(B1eyeball2);
	scalpelG = new grabbable(scalpelX, scalpelY, scalpelRadius, false, SCALPELG, scalpel);
	grabbables.push(scalpelG);
	toss(scalpelG);
	bonesawG = new grabbable(bonesawX, bonesawY, bonesawRadius, false, BONESAWG, bonesaw);
	grabbables.push(bonesawG);
	toss(bonesawG);
	hammerG = new grabbable(hammerX, hammerY, hammerRadius, false, HAMMERG, hammer);
	grabbables.push(hammerG);
	toss(hammerG);
}

function setupBody2()
{
	B2hand = new grabbable(944, 632, B2handRadius, false, B2HAND, body2_hand_severed);
    grabbables.push(B2hand);
	B2knee = new grabbable(653, 734, B2kneeRadius, false, B2KNEE, body2_knee_severed);
			grabbables.push(B2knee);
	B2heart = new grabbable(801, 429, B2heartRadius, false, B2HEART, body2_heart_severed);
			grabbables.push(B2heart);
	toss(B2heart);
	B2flap = new grabbable(801, 429, B2flapRadius, false, B2FLAP, body2flap);
			grabbables.push(B2flap);
	B2skin = new grabbable(801, 429, B2skinRadius, false, B2SKIN, null);
			grabbables.push(B2skin);
	toss(B2skin);
	B2skin.movable = false;
	B2rib = new grabbable(801, 429, B2ribRadius, false, B2RIB, null);
			grabbables.push(B2rib);
	toss(B2rib);
	//B2rib.movable = false;
}

function setupBody3()
{
	B3guts = new grabbable(885, 485, B3gutsRadius, false, B3GUTS, body3_guts_severed);
    grabbables.push(B3guts);
	toss(B3guts);
	B3brain = new grabbable(647, 242, B3brainRadius, false, B3BRAIN, body3_brain_severed);
			grabbables.push(B3brain);
	toss(B3brain);
	B3foot = new grabbable(736, 868, B3footRadius, false, B3FOOT, body3_foot_severed);
			grabbables.push(B3foot);
	B3flap = new grabbable(885, 485, B3flapRadius, false, B3FLAP, body3flap);
			grabbables.push(B3flap);
	B3skin = new grabbable(885, 485, B3skinRadius, false, B3SKIN, null);
			grabbables.push(B3skin);
	toss(B3skin);
	//B3skin.movable = false;
	B3skull = new grabbable(647, 242, B3skullRadius, false, B3SKULL, null);
			grabbables.push(B3skull);
	//B3skull.movable = false;
}


// grabbable constants
const B1FLAP = 0;
B1flapRadius = 250;
const B1ARM = 1;
B1armRadius = 160;
const B1LEG1 = 2;
B1leg1Radius = 150;
const B1LEG2 = 3;
B1leg2Radius = 190;
const B1EYEBALL = 4;
B1eyeballRadius = 50;
const B1EYEBALL2 = 5;
B1eyeball2Radius = 50;
const SCALPELG = 6;
scalpelRadius = 180;
scalpelX = 1320;
scalpelY = 295;
const BONESAWG = 7;
bonesawX = 1333;
bonesawY = 571;
bonesawRadius = 240;
const HAMMERG = 8;
hammerX = 1324;
hammerY = 883;
hammerRadius = 170;
const B2HAND = 9;
B2handRadius = 170;
const B2KNEE = 10;
B2kneeRadius = 220;
const B2HEART = 11;
B2heartRadius = 120;
const B2FLAP = 12;
B2flapRadius = 250;
const B2SKIN = 13;
B2skinRadius = 140;
const B2RIB = 14;
B2ribRadius = 140;
const B3GUTS = 15;
B3gutsRadius = 140;
const B3BRAIN = 16;
B3brainRadius = 150;
const B3FOOT = 17;
B3footRadius = 140;
const B3FLAP = 18;
B3flapRadius = 250;
const B3SKIN = 19;
B3skinRadius = 180;
const B3SKULL = 20;
B3skullRadius = 150;


const GONE = 9000;

// The following index labels may be helpful:
const ML5HAND_WRIST = 0; 
const ML5HAND_THUMB_CMC = 1; 
const ML5HAND_THUMB_MCP = 2; 
const ML5HAND_THUMB_IP = 3; 
const ML5HAND_THUMB_TIP = 4; 
const ML5HAND_INDEX_FINGER_MCP = 5; 
const ML5HAND_INDEX_FINGER_PIP = 6; 
const ML5HAND_INDEX_FINGER_DIP = 7; 
const ML5HAND_INDEX_FINGER_TIP = 8; 
const ML5HAND_MIDDLE_FINGER_MCP = 9; 
const ML5HAND_MIDDLE_FINGER_PIP = 10; 
const ML5HAND_MIDDLE_FINGER_DIP = 11; 
const ML5HAND_MIDDLE_FINGER_TIP = 12; 
const ML5HAND_RING_FINGER_MCP = 13; 
const ML5HAND_RING_FINGER_PIP = 14; 
const ML5HAND_RING_FINGER_DIP = 15; 
const ML5HAND_RING_FINGER_TIP = 16; 
const ML5HAND_PINKY_MCP = 17; 
const ML5HAND_PINKY_PIP = 18; 
const ML5HAND_PINKY_DIP = 19; 
const ML5HAND_PINKY_TIP = 20; 
