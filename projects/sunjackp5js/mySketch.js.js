// Press any key to switch between graphics modes for rendering the neck
// Here's the link to the neck only to play with! press 1 for jumping mode, and press again to go back to mouse follow mode https://openprocessing.org/sketch/2037859


// Image Credit: Our good friend Zen Jitsajjapong drew the face assets and cursor

//notes to self:
//change prey location updating so it 
//doesnt update right as move starts
//there's a small disjoint of the mouse coordinates.
//see when locked on, eye tracking

heightCanvas = 450*2;
w = 800*2;
hh = heightCanvas/2;
hw = w/2;
//head size multiplier, bigger for... bigger.
headMod = 1.2;
zw = 576*headMod;
zh = 382*headMod;

headRadius = 100;

smoothingWeight= 0.8;
elasticMult = 0.2;
easeType = "backInOut";

eyeLim = 12*headMod;
eyeSize = 25*headMod;
eyeDownMod = 3*headMod;
eyeDist = 37*headMod;

breatheH = 10*headMod;
breatheW = 30*headMod; 
breatheTime = 15;
rotateBuffer = 15;
turnBase = 10;

px = 0;
py = 0;
rx = 0;
timeSinceMoved = 0;
moveTimeBase = 10;
moveDistMult = 0.02;
moveProg = 0;
thisMoveTime = 0;
moving = false;
preyX = 0;
preyY = 0;
headX = 0;
headY = 0;
oldX = 0;
oldY = 0;
lockedHeadX = 0;
lockedHeadY = 0;
newHeadX = 0;
newHeadY = 0;

moveDelayBase = 60;
moveDelay = moveDelayBase;
moveDelayChaos = 50;

eyeResetTimer = 0;
eyeResetDelay = 50;
eyeReset = false;

//the higher the faster
eyeSpinMod = 20;

headChaos = 3;
headChaosX = 0;
headChaosY = 0;
allowedError = 10;

invFilterBase = 150;
invFilterStrength = invFilterBase;

lockedOn = false;

pos = 0;

easer = new p5.Ease()

cursX = 0;
cursY = 0;
smoothCurs = 0;
grabbed = 0.98;
notGrabbed = 0.1;
jumpMode = false;
flashMode = false;

jx=0;
jy=0;

function preload() {
}

function setup() {
	angleMode(DEGREES);
	timeSinceMoved = 0;
	imageMode(CENTER);
	eye = loadImage("eye.png");
	eyeWhites = loadImage("D_eyeWhite.PNG");
	bothEyes = loadImage("D_EBoth.PNG");
	sun = loadImage("D_sun.PNG");
	face = loadImage("D_face.PNG");
	cursorImg = loadImage("cursor2.png");
	noCursor()
	createCanvas(w, heightCanvas);
	setupNeckPhys();
	background(255);
	smoothCurs = 0;
}

function draw() {
	if (frameCount%10 == 1) colorCount = (colorCount+1)%colors.length;
	var B = 1.0-smoothCurs;
	jx = smoothCurs*jx + B*mouseX; 
	jy = smoothCurs*jy + B*mouseY; 
	cursX = jx+5*headChaosX;
	cursY = jy+5*headChaosY;
	push();
	
	if (eyeReset)
	{
		eyeResetTimer++;
		//print(eyeResetTimer);
	}
	timeSinceMoved++;
	blendMode(BLEND);
	if (!flashMode || !lockedOn){
		background('rgb(5,25,62)');
	}
	else background(colorsBg[colorCount]);
	drawNeck();
	if ((timeSinceMoved > moveDelay) && !moving)
	{
		lockedOn = false;
		preyX = cursX-hw;
		preyY = cursY-hh;
		//moving pacing calcs
		oldX = headX;
		oldY = headY;
		thisMoveTime = moveTimeBase + moveDistMult * dist(preyX, preyY, headX, headY);
		moveProg = 0;
		
		moving = true;
		//print("moving");
		eyeReset = true;
		//print("eye resetting");
		eyeResetTimer = 0;
		invFilterStrength = invFilterBase;
	}
	else if ((timeSinceMoved > moveDelay) && moving)
	{
		moveProg++;
		timer = map(moveProg, 0, thisMoveTime, 0, 1);
		pos = easer[easeType](timer, elasticMult);
		/*var B = 1.0-smoothingWeight; 
		headX = smoothingWeight*headX + B*(preyX); 
  	headY = smoothingWeight*headY + B*(preyY);*/
		
		
		headX = map(pos, 0, 1, oldX, preyX);
		headY = map(pos, 0, 1, oldY, preyY);
		
		if (dist(headX, headY, preyX, preyY) < allowedError)
		{
			moving = false;
			timeSinceMoved = 0;
			moveDelay = random() * moveDelayChaos + moveDelayBase;
			eyeReset = true;
		}
	}
	
	newHeadX = headX+ (breatheW * cos(millis()/breatheTime));
	newHeadY = headY+ (breatheH * sin(2*millis()/breatheTime));
	
	
	if (!eyeReset)
	{
		if (dist(cursX, cursY, hw+newHeadX, hh+newHeadY) < headRadius)
		{
			if (!lockedOn)
			{
				lockedHeadX = newHeadX;
				lockedHeadY = newHeadY;
			}
			lockedOn = true;
			headChaosX = random()*headChaos;
			headChaosY = random()*headChaos;
			moveDelay = 100000000;
			smoothCurs = grabbed;
		}
		else
		{
			if(lockedOn)
			{
				timeSinceMoved = 0;
				moveDelay = moveDelayBase;
			}
			lockedOn = false;
			smoothCurs = notGrabbed;
		}
		invFilterStrength += 2;
	}
	else
	{
		headChaosX = 0;
		headChaosY = 0;
	}
	
	//breathe 
	
	//translate(hw, hh-turnBase);
	//timer = map(moveProg, 0, thisMoveTime, -1, 1);
	//pos = easer[easeType](timer, elasticMult);
	//r = rotateBuffer * pos;
	//rotate(r);
	//translate(-hw, -hh+turnBase);
	
	/*if(!lockedOn)
	{
		translate(breatheW * sin(millis()/breatheTime), breatheH * cos((millis()*2.5/breatheTime) + 90));
	}*/
	
	if (!lockedOn)
	{
		translate(hw+newHeadX, hh+newHeadY);
	}
	else
	{
		translate(hw+lockedHeadX+headChaosX, hh+lockedHeadY+headChaosY)
	}
	//print(newHeadY);
	
	//rotation!
	var B = 1.0-smoothingWeight; 
	if ((!eyeReset || moving) && !lockedOn)
	{
		takenX = cursX - headX;
	}
	else
	{
		takenX = hw;
	}
	
	rx = smoothingWeight*rx + B*(takenX); 
	rotate((rx-(hw))/rotateBuffer);
	
	
	image(sun, 0, 0, zw, zh);
	image(eyeWhites, 0, 0, zw, zh);
	
	drawEyes();
	
	image(face, 0, 0, zw, zh);
	
	//rotate(-(mouseX-hw)/rotateBuffer);
	
	pop();
	
	imageMode(CORNER);
	blendMode(BLEND);
	image(cursorImg,cursX,cursY,60,60);
	imageMode(CENTER);
	if (!eyeReset && lockedOn)
	{
		updateNeck(hw+lockedHeadX+headChaosX,hh+lockedHeadY+headChaosY,(rx-(hw))/rotateBuffer);
		blendMode(EXCLUSION);
		fill(255, invFilterStrength);
		noStroke();
		rect(0, 0, w, heightCanvas);
	}
	else updateNeck(newHeadX+hw, newHeadY+hh,(rx-(hw))/rotateBuffer);
	
	

}

function drawTrack(){
}

function drawEyes() {
	cond = false;
	//cond = lockedOn;
	//cond = moving;
	
	if (!cond && eyeReset)
	{
		push();
		//print(eyeReset);
		translate(eyeLim*sin(eyeResetTimer*eyeSpinMod), eyeLim*cos(eyeResetTimer*eyeSpinMod));
		image(bothEyes, 0, 0, zw, zh);
		if (eyeResetTimer > eyeResetDelay)
		{
			eyeReset = false;
		}
		
		pop();
	}
	else if (!cond && !eyeReset)
	{
		var B = 1.0-smoothingWeight; 
		px = smoothingWeight*px + B*(cursX); 
		py = smoothingWeight*py + B*(cursY);
		
		usedX = headX;
		usedY = headY;
		
		if (lockedOn)
		{
			usedX = lockedHeadX;
			usedY = lockedHeadY;
		}
		else
		{
			usedX = newHeadX;
			usedY = newHeadY;
		}

		//left eye
		push();
		translate(-eyeDist, eyeDownMod);
		let a = atan2(py - (hh+usedY), px - (hw+usedX - eyeDist));
		rotate(a-(rx-(hw))/rotateBuffer);
		
		dc = constrain(dist(px,py,((hw+usedX)-eyeDist),hh+usedY),0,eyeLim);

		translate(dc,0);
		image(eye, 0, 0, eyeSize, eyeSize);
		pop();

		//right eye
		push();
		translate(eyeDist, eyeDownMod);
		a = atan2(py - (hh+usedY), px - ((hw+usedX) + eyeDist));
		rotate(a-(rx-(hw))/rotateBuffer);
		dc = constrain(dist(px,py,((hw+usedX)+eyeDist),(hh+usedY)),0,eyeLim);

		translate(dc,0);
		image(eye, 0, 0, eyeSize, eyeSize);
		pop();
	}
}

function mousePressed(){
	//print(mouseX-hw+eyeDist);
}