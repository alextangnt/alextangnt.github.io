// HAND:
//
const WRIST = 0; 
const THUMB_CMC = 1; 
const THUMB_MCP = 2; 
const THUMB_IP = 3; 
const THUMB_TIP = 4; 
const INDEX_FINGER_MCP = 5; 
const INDEX_FINGER_PIP = 6; 
const INDEX_FINGER_DIP = 7; 
const INDEX_FINGER_TIP = 8; 
const MIDDLE_FINGER_MCP = 9; 
const MIDDLE_FINGER_PIP = 10; 
const MIDDLE_FINGER_DIP = 11; 
const MIDDLE_FINGER_TIP = 12; 
const RING_FINGER_MCP = 13; 
const RING_FINGER_PIP = 14; 
const RING_FINGER_DIP = 15; 
const RING_FINGER_TIP = 16; 
const PINKY_MCP = 17; 
const PINKY_PIP = 18; 
const PINKY_DIP = 19; 
const PINKY_TIP = 20; 

const HAND_VERTEX_INDICES = [
  [PINKY_MCP,WRIST,THUMB_CMC,INDEX_FINGER_MCP,MIDDLE_FINGER_MCP,RING_FINGER_MCP,PINKY_MCP],
  [THUMB_CMC,THUMB_MCP,THUMB_IP,THUMB_TIP],
  [INDEX_FINGER_MCP,INDEX_FINGER_PIP,INDEX_FINGER_DIP,INDEX_FINGER_TIP],
  [MIDDLE_FINGER_MCP,MIDDLE_FINGER_PIP,MIDDLE_FINGER_DIP,MIDDLE_FINGER_TIP],
  [RING_FINGER_MCP,RING_FINGER_PIP,RING_FINGER_DIP,RING_FINGER_TIP],
  [PINKY_MCP,PINKY_PIP,PINKY_DIP,PINKY_TIP],
  ];

const HANDLANDMARKER_PALM = [
  {start:PINKY_MCP,end:WRIST}, 
  {start:WRIST,end:THUMB_CMC}, 
  {start:THUMB_CMC,end:INDEX_FINGER_MCP},
  {start:INDEX_FINGER_MCP,end:MIDDLE_FINGER_MCP},
  {start:MIDDLE_FINGER_MCP,end:RING_FINGER_MCP},
  {start:RING_FINGER_MCP,end:PINKY_MCP}];
const HANDLANDMARKER_THUMB = [
  {start:THUMB_CMC,end:THUMB_MCP},
  {start:THUMB_MCP,end:THUMB_IP},
  {start:THUMB_IP,end:THUMB_TIP}];
const HANDLANDMARKER_INDEX_FINGER = [
  {start:INDEX_FINGER_MCP,end:INDEX_FINGER_PIP},
  {start:INDEX_FINGER_PIP,end:INDEX_FINGER_DIP},
  {start:INDEX_FINGER_DIP,end:INDEX_FINGER_TIP}];
const HANDLANDMARKER_MIDDLE_FINGER = [
  {start:MIDDLE_FINGER_MCP,end:MIDDLE_FINGER_PIP},
  {start:MIDDLE_FINGER_PIP,end:MIDDLE_FINGER_DIP},
  {start:MIDDLE_FINGER_DIP,end:MIDDLE_FINGER_TIP}];
const HANDLANDMARKER_RING_FINGER = [
  {start:RING_FINGER_MCP,end:RING_FINGER_PIP},
  {start:RING_FINGER_PIP,end:RING_FINGER_DIP},
  {start:RING_FINGER_DIP,end:RING_FINGER_TIP}];
const HANDLANDMARKER_PINKY = [
  {start:PINKY_MCP,end:PINKY_PIP},
  {start:PINKY_PIP,end:PINKY_DIP},
  {start:PINKY_DIP,end:PINKY_TIP}];

//======================================================================
// DON'T CHANGE ANYTHING UNDER THIS LINE
// Uses handsfree.js by Oz Ramos
class HandsAndFaceWrapper {

	constructor(bDoFace, bDoHands, bDoComputeBody) {
		this.bComputeFace = bDoFace;
		this.bComputeHands = bDoHands;
		this.bComputeBody = bDoComputeBody;
		this.webcam = createCapture(VIDEO);
		this.webcam.size(640, 480);
		this.webcam.hide();
		this.handsfree = new Handsfree({
			showDebug: false,
			pose: this.bComputeBody,
			hands: this.bComputeHands,
			facemesh: this.bComputeFace,
		});
		this.handsfree.start();
		this.VTX = VTX33;
		this.TRI = TRI33;
		this.faceExists = false;
		this.hand1Exists = false;
		this.hand2Exists = false;
		this.bodyExists = false;
		const unwantedDomElements = document.querySelectorAll('.handsfree-debugger');
		unwantedDomElements.forEach(element => {
			element.remove();
		});
	}

	//------------------------------------------
	getDoesFaceExist() {
		return this.faceExists;
	}
	getDoesHand1Exist() {
		return this.hand1Exists;
	}
	getDoesHand2Exist() {
		return this.hand2Exists;
	}
	getDoesBodyExist(){
		return this.bodyExists;
	}

	//------------------------------------------
	drawVideoBackground(bDoIt) {
		if (bDoIt) {
			push();
			translate(width, 0);
			scale(-1, 1);
			tint(255, 255, 255, 72);
			image(this.webcam, 0, 0, width, height);
			tint(255);
			pop();
		}
	}

	//------------------------------------------
	update() {
		this.faceExists = false;
		this.hand1Exists = false;
		this.hand2Exists = false;
		this.bodyExists = false;

		if (this.bComputeFace) {
			if (this.handsfree.data.facemesh) {
				if (this.handsfree.data.facemesh.multiFaceLandmarks) {
					var faceLandmarks = this.handsfree.data.facemesh.multiFaceLandmarks;
					if (faceLandmarks.length > 0) {
						this.faceExists = true;
						nosePt = this.getScaledFacePoint(4);
						mouthLeftPt = this.getScaledFacePoint(5);
						mouthRightPt = this.getScaledFacePoint(6);
						mouthTopPt = this.getScaledFacePoint(15);
						mouthBottomPt = this.getScaledFacePoint(16);
						chinPt = this.getScaledFacePoint(32);
						foreheadPt = this.getScaledFacePoint(24);
						eyeLeftPt = p5.Vector.add(this.getScaledFacePoint(0), this.getScaledFacePoint(1)).mult(0.5);
						eyeRightPt = p5.Vector.add(this.getScaledFacePoint(2), this.getScaledFacePoint(3)).mult(0.5);
						browLeftPt = p5.Vector.add(this.getScaledFacePoint(18), this.getScaledFacePoint(19)).mult(0.5);
						browRightPt = p5.Vector.add(this.getScaledFacePoint(20), this.getScaledFacePoint(21)).mult(0.5);
					}
				}
			}
		}

		if (this.bComputeHands) {
			if (this.handsfree.data.hands) {
				if (this.handsfree.data.hands.multiHandLandmarks) {
					var handLandmarks = this.handsfree.data.hands.multiHandLandmarks;
					var nHands = handLandmarks.length;
					if (nHands > 0) {
						this.hand1Exists = true;
						palmPt1 = this.getScaledHandPoint(0, 0);
						thumbPt1 = this.getScaledHandPoint(0, 4);
						fingerIndexPt1 = this.getScaledHandPoint(0, 8);
						fingerMiddlePt1 = this.getScaledHandPoint(0, 12);
						fingerRingPt1 = this.getScaledHandPoint(0, 16);
						fingerPinkyPt1 = this.getScaledHandPoint(0, 20);
					}
					if (nHands > 1) {
						this.hand2Exists = true;
						palmPt2 = this.getScaledHandPoint(1, 0);
						thumbPt2 = this.getScaledHandPoint(1, 4);
						fingerIndexPt2 = this.getScaledHandPoint(1, 8);
						fingerMiddlePt2 = this.getScaledHandPoint(1, 12);
						fingerRingPt2 = this.getScaledHandPoint(1, 16);
						fingerPinkyPt2 = this.getScaledHandPoint(1, 20);
					}
				}
			}
		}

		if (this.bComputeBody) {
			if (this.handsfree.data.pose) {
				if (this.handsfree.data.pose.poseLandmarks) {
					var poseLandmarks = this.handsfree.data.pose.poseLandmarks;
					var nPoseLandmarks = poseLandmarks.length;
					if (nPoseLandmarks > 0){
						this.bodyExists = true; 
						headPt = this.getScaledBodyPoint(0);
						shoulderRightPt = this.getScaledBodyPoint(11)
						shoulderLeftPt = this.getScaledBodyPoint(12);
						elbowRightPt = this.getScaledBodyPoint(13);
						elbowLeftPt = this.getScaledBodyPoint(14);
						wristRightPt = this.getScaledBodyPoint(15);
						wristLeftPt = this.getScaledBodyPoint(16);
						hipRightPt = this.getScaledBodyPoint(23);
						hipLeftPt = this.getScaledBodyPoint(24);
						kneeRightPt = this.getScaledBodyPoint(25);
						kneeLeftPt = this.getScaledBodyPoint(26);
						footRightPt = this.getScaledBodyPoint(27);
						footLeftPt = this.getScaledBodyPoint(28);
					}
				}
			}
		}
	}


	//------------------------------------------
	drawFPS() {
		noStroke();
		fill('black');
		text("FPS: " + int(frameRate()), 10, 20);
	}

	//------------------------------------------
	drawFaceMesh() {
		if (this.handsfree.data.facemesh) {
			if (this.handsfree.data.facemesh.multiFaceLandmarks) {
				var faceLandmarks = this.handsfree.data.facemesh.multiFaceLandmarks;
				var nFaces = faceLandmarks.length;
				if (nFaces > 0) {
					for (var j = 0; j < this.TRI.length; j += 3) {

						let pa = this.getScaledFacePoint(this.TRI[j + 0]);
						let pb = this.getScaledFacePoint(this.TRI[j + 1]);
						let pc = this.getScaledFacePoint(this.TRI[j + 2]);

						noFill();
						stroke('black');
						triangle(pa.x, pa.y, pb.x, pb.y, pc.x, pc.y);

						noStroke();
						fill(0);
						text(this.TRI[j + 0], pa.x, pa.y);
						text(this.TRI[j + 1], pb.x, pb.y);
						text(this.TRI[j + 2], pc.x, pc.y);
					}
				}
			}
		}
	}

	//------------------------------------------
	getScaledFacePoint(index) {
		if (this.handsfree.data.facemesh) {
			if (this.handsfree.data.facemesh.multiFaceLandmarks) {
				var faceLandmarks = this.handsfree.data.facemesh.multiFaceLandmarks;
				var nFaces = faceLandmarks.length;
				if (nFaces > 0) {
					let a = faceLandmarks[0][this.VTX[index]];
					let ax = map(a.x, 0, 1, width, 0);
					let ay = map(a.y, 0, 1, 0, height);
					return createVector(ax, ay);
				}
			}
		}
		return null;
	}

	//------------------------------------------
	getScaledHandPoint(whichHand, jointIndex) {
		if (this.handsfree.data.hands) {
			if (this.handsfree.data.hands.multiHandLandmarks) {
				var handLandmarks = this.handsfree.data.hands.multiHandLandmarks;
				var nHands = handLandmarks.length;
				if (nHands > 0) {
					let a = handLandmarks[whichHand][jointIndex];
					let ax = map(a.x, 0, 1, width, 0);
					let ay = map(a.y, 0, 1, 0, height);
					return createVector(ax, ay);
				}
			}
		}
		return null;
	}
	
	//------------------------------------------
	getScaledBodyPoint(jointIndex) {
		if (this.handsfree.data.pose) {
			if (this.handsfree.data.pose.poseLandmarks) {
				var poseLandmarks = this.handsfree.data.pose.poseLandmarks;
				var nPoseLandmarks = poseLandmarks.length;
				if ((nPoseLandmarks > 0) && (jointIndex < nPoseLandmarks)) {
					let a = poseLandmarks[jointIndex];
					let ax = map(a.x, 0, 1, width, 0);
					let ay = map(a.y, 0, 1, 0, height);
					return createVector(ax, ay);
				}
			}
		}
		return null;
	}

	//------------------------------------------
	drawHandMesh() {
		if (this.handsfree.data.hands) {
			if (this.handsfree.data.hands.multiHandLandmarks) {
				var handLandmarks = this.handsfree.data.hands.multiHandLandmarks;
				var nHands = handLandmarks.length;

				var handVertexIndices = [
					[17, 0, 1, 5, 9, 13, 17], /* palm */
					[1, 2, 3, 4], /* thumb */
					[5, 6, 7, 8], /* index */
					[9, 10, 11, 12], /* middle */
					[13, 14, 15, 16], /* ring */
					[17, 18, 19, 20], /* pinky */
				];

				// Draw lines connecting the parts of the fingers
				noFill();
				stroke('black');
				strokeWeight(1);
				for (var h = 0; h < nHands; h++) {
					for (var f = 0; f < handVertexIndices.length; f++) { // finger
						beginShape();
						for (var j = 0; j < handVertexIndices[f].length; j++) {
							var ji = handVertexIndices[f][j];
							var jx = handLandmarks[h][ji].x;
							var jy = handLandmarks[h][ji].y;
							jx = map(jx, 0, 1, width, 0);
							jy = map(jy, 0, 1, 0, height);
							vertex(jx, jy);
						}
						endShape();
					}
				}

				// Draw just the points of the hands
				for (var h = 0; h < nHands; h++) {
					for (var i = 0; i <= 20; i++) {
						var px = handLandmarks[h][i].x;
						var py = handLandmarks[h][i].y;
						px = map(px, 0, 1, width, 0);
						py = map(py, 0, 1, 0, height);
						noStroke();
						fill('black');
						circle(px, py, 4);
						text(i, px, py);
					}
				}
				noFill();
			}
		}
	}
	
	handsValid(){
		if (this.handsfree.data.hands) {
			if (this.handsfree.data.hands.multiHandLandmarks) {
				return true;
			}
		}
	}
}