noslidein = false;

function preload() {
	importDrawings();
	importSounds();
	preloadWeg();
}
function setup() {
	incinerateTimer = 0;
	doneIncinerating = 6000;
	restartBuffer = 50;
	body2Setted = false;
	body3Setted = false;
	levelTime = 40000;
	
	w = 1620;
	h = 1080;
	wc = w/2;
	hc = h/2;
	easer = new p5.Ease();
	
	createCanvas(w, h);
	background(80);
	imageMode(CENTER);
	angleMode(DEGREES);
	colorMode(RGB, 255);
	
	//some various variables
	bodyWidth = wc;
	bodyHeight = hc-20;
	
	//for typing
	typable = true;
	typedWord = "";
	notif = "NOTIF NOT INITIALIZED";
	SCALPEL = 0;
	BONESAW = 1;
	toolName = ["SCALPEL", "BONESAW", "HAMMER", "ALKALINE", "LITHIUM"];
	toolCode = ["scalpel", "bonesaw", "hammer", "alkaline", "lithium"];
	errorNotif = "UNRECOGNIZABLE";
	ENTER = "Enter";
	SPACE = "Space";
	maxTextTime = 400;
	textTimer = 0;
	textDisplaySize = 200;
	textDisplayOpacity = 0.8;
	chrome = 0.004;
	brightnessBuffer = 400;
	
	//drawer logic
	r1isOpen = 0;
	r2isOpen = 0;
	r3isOpen = 0;
	
	//timer
	timeLeft = levelTime;
	timerDisplacementX = 550;
	timerDisplacementY = -300;
	
	//begin
	bgm.play();
	
	bodyCount = 1;
	body1hasArm = true;
	body1hasLeg = true;
	body1hasEyeball = true;
	body1hasEyelid = true;
	body1hasFlap = true;
	
	body2hasHand = true;
	body2hasKnee = true;
	body2hasRibs = true;
	body2hasHeart = true;
	body2hasFlap = true;
	body2hasSkin = true;
	
	body3hasFoot = true;
	body3hasGuts = true;
	body3hasFlap = true;
	body3hasBrain = true;
	body3hasSkin = true;
	body3hasSkull = true;
	
	hasScalpel = true;
	hasBonesaw = true;
	hasHammer = true;
	
	incinerate = false;
	isTimeUp = false;
	
	framesCounted=0;
	
	setupWeg();
	
	scalpelInUse = false;
	bonesawInUse = false;
	hammerInUse = false;
	
	alkalineIsOpen = false;
	lithiumIsOpen = false;
	
}

function draw() {
	framesCounted++;
	image(bg, wc, hc);
	image(l1, wc, hc);
	image(l2, wc, hc);
	noStroke();
	if (noslidein)
		{
			if (bodyCount == 1) 
			{
				drawBody1(wc, hc);
			}
			if (bodyCount == 2)
			{
			}
		}
	else
		{
			speed = 6;
			t = (speed*framesCounted);

			timer = map(min(t-600, 500), 0, 600, 0, 1);
			var pos = easer["elasticInOut"](timer, 0.85);
			t = map(pos, 0, 1, -hc, hc);

			//circle(t, hc, 20);

			if (bodyCount == 1) 
			{
				if (!isTimeUp)
				{
					drawBody1(wc, t);
				}
				else
					{
						speed = 6;
						t = (speed*(millis()-incinerateTimer))

						timer = map(min(t-600, 500), 0, 600, 0, 1);
						var pos = easer["elasticInOut"](timer, 0.85);
						t = map(pos, 0, 1, -hc, hc*2);
						drawBody1(wc, t+hc);
					}
			}
			else if (bodyCount == 2) 
			{
				if (!isTimeUp)
				{
					if (!body2Setted){
								setupBody2();
							body2Setted = true;
							}

					drawBody2(wc, t);
				}
				else
					{
						speed = 6;
						t = (speed*(millis()-incinerateTimer))

						timer = map(min(t-600, 500), 0, 600, 0, 1);
						var pos = easer["elasticInOut"](timer, 0.85);
						t = map(pos, 0, 1, -hc, hc*2);
						drawBody2(wc, t+hc);
					}
			}
			else if (bodyCount == 3) 
			{
				if (!isTimeUp)
				{
					if (!body3Setted){
								setupBody3();
							body3Setted = true;
							}
					drawBody3(wc, t);
				}
				else
					{
						dspeed = 6;
						t = (speed*(millis()-incinerateTimer))

						timer = map(min(t-600, 500), 0, 600, 0, 1);
						var pos = easer["elasticInOut"](timer, 0.85);
						t = map(pos, 0, 1, -hc, hc*2);
						drawBody3(wc, t+hc);
					}
			}
			
		}
	image(chutes, wc, hc);
	
	xNoise = getXNoiseValue();
	yNoise = getYNoiseValue();
	chromaticOffset = chrome;
	
	//drawer logic
	push();
	translate(0, 50);
	if(alkalineIsOpen)
		{
			image(can1_open, wc, hc);
			can1_close.reset();
		}
	else
		{
			image(can1_close, wc, hc);
			can1_open.reset()
		}
	if(lithiumIsOpen)
		{
			image(can2_open, wc, hc);
			can2_close.reset()
		}
	else
		{
			image(can2_close, wc, hc);
			can2_open.reset()
		}
	if (scalpelInUse == true)
		{
			image(r1empty, wc, hc);
		}
	else if (r1isOpen == 1)
		{ 
		 	image(r1open, wc, hc);
			untoss(grabbables[SCALPELG]);
			r1close.reset();
		}
	else if (r1isOpen == -1)
		{
			image(r1close, wc, hc);
			toss(grabbables[SCALPELG]);
			r1open.reset();
		}
	else
		{
			image(r1, wc, hc);
		}
	
	if (r2isOpen == 1)
		{
		 	image(r2open, wc, hc);
			untoss(grabbables[BONESAWG]);
			r2close.reset();
		}
	else if (r2isOpen == -1)
		{
			image(r2close, wc, hc);
			toss(grabbables[BONESAWG]);
			r2open.reset();
		}
	else
		{
			image(r2, wc, hc);
		}
	if (r3isOpen == 1)
		{
		 	image(r3open, wc, hc);
			untoss(grabbables[HAMMERG]);
			r3close.reset();
		}
	else if (r3isOpen == -1)
		{
			image(r3close, wc, hc);
			toss(grabbables[HAMMERG]);
			r3open.reset();
		}
	else
		{
			image(r3, wc, hc);
		}
	
	image(rightCab, wc, hc);
	pop();
	drawWeg();
	noStroke();
	
	if (millis() <= textTimer) {
		textAlign(CENTER);
		textFont('Courier New', 10);
		// fill(0);
		// stroke(255);
		// strokeWeight(0.05*textDisplaySize);
		if (random()> 0.9)
		{
			xNoise = xNoise*10;
			yNoise = yNoise * 10;
			chromaticOffset = chrome*4;
		}
		let theText;
		if (typable)
		{
			textSize(textDisplaySize);
			theText = typedWord;
			fill(152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, 255, textDisplayOpacity*40);
			text(theText, (1-chromaticOffset)*wc+xNoise*30, (1-chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
			fill(255, 152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, textDisplayOpacity*50);
			text(theText, wc+xNoise*30, hc-0.5*textDisplaySize+yNoise*15);
			fill(84+xNoise*brightnessBuffer, 255, 152+xNoise*brightnessBuffer, textDisplayOpacity*255);
			text(theText, (1+chromaticOffset)*wc+xNoise*30, (1+chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
		}
		else {
			theText = notif;
			if (notif == errorNotif)
				{
					textSize(textDisplaySize*0.6);
					fill(152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, 255, textDisplayOpacity*40);
					text(theText, (1-chromaticOffset)*wc+xNoise*30, (1-chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
					fill(255, 152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, textDisplayOpacity*255);
					text(theText, wc+xNoise*30, hc-0.5*textDisplaySize+yNoise*15);
					fill(84+xNoise*brightnessBuffer, 255, 152+xNoise*brightnessBuffer, textDisplayOpacity*40);
					text(theText, (1+chromaticOffset)*wc+xNoise*30, (1+chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
				}
			else
				{
					textSize(textDisplaySize*0.8);
					fill(152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, 255, textDisplayOpacity*255);
					text(theText, (1-chromaticOffset)*wc+xNoise*30, (1-chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
					fill(255, 152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, textDisplayOpacity*50);
					text(theText, wc+xNoise*30, hc-0.5*textDisplaySize+yNoise*15);
					fill(84+xNoise*brightnessBuffer, 255, 152+xNoise*brightnessBuffer, textDisplayOpacity*55);
					text(theText, (1+chromaticOffset)*wc+xNoise*30, (1+chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
				}
		}
	}
	else {
		typable = true;
	}
	
	//timer
	secondsLeft = (int(((timeLeft-millis())/1000)));
	push();
	translate(timerDisplacementX, timerDisplacementY);
	tint(255, 127);
	image(screen, wc-3, hc-147);
	tint(255, 255);
	image(clock, wc-3, hc-147);
	textAlign(CENTER);
	textFont('Courier New', 10);
	if (secondsLeft >0)
	{
		textSize(textDisplaySize*0.3);
		milli = int(((timeLeft-millis())%1000)/60);
		theText = (secondsLeft + ":");
		if (milli < 10)
		{
			theText += "0";
		}
		theText += milli;
		fill(182+xNoise*brightnessBuffer, 182+xNoise*brightnessBuffer, 255, textDisplayOpacity*255);
		text(theText, (1-chromaticOffset)*wc+xNoise*30, (1-chromaticOffset)*hc-0.5*textDisplaySize-yNoise*15);
		fill(255, 182+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, textDisplayOpacity*50);
		text(theText, wc+xNoise*30, hc-0.5*textDisplaySize-yNoise*15);
		fill(84+xNoise*brightnessBuffer, 285, 152+xNoise*brightnessBuffer, textDisplayOpacity*55);
		text(theText, (1+chromaticOffset)*wc+xNoise*30, (1+chromaticOffset)*hc-0.5*textDisplaySize-yNoise*15);
	}
	else
	{
		textSize(textDisplaySize*0.35);
		theText = "00:00";
		xNoise = xNoise*10;
		yNoise = yNoise * 10;
		chromaticOffset = chrome*4;
		fill(152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, 255, textDisplayOpacity*50);
		text(theText, (1-chromaticOffset)*wc+xNoise*30, (1-chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
		fill(255, 152+xNoise*brightnessBuffer, 152+xNoise*brightnessBuffer, textDisplayOpacity*255);
		text(theText, wc+xNoise*30, hc-0.5*textDisplaySize+yNoise*15);
		fill(84+xNoise*brightnessBuffer, 255, 152+xNoise*brightnessBuffer, textDisplayOpacity*55);
		text(theText, (1+chromaticOffset)*wc+xNoise*30, (1+chromaticOffset)*hc-0.5*textDisplaySize+yNoise*15);
		
		timesUp();
	}
	pop();
	
	if (incinerate)
	{
		blendMode(ADD)
		tint(255, 255-(millis()-incinerateTimer)/50);
		image(blowup, wc, hc)
		blendMode(BLEND)
		tint(255, 255);
		if (incinerateTimer == 0)
			{
				incinerateTimer = millis();
				blaze.play()
			}
		//print("incinerate timer upping");
		
		if(incinerateTimer + doneIncinerating <= millis())
			{
				//print("incinerate timer running");
				incinerate = false;
				timeLeft = millis() + levelTime;
				incinerateTimer = 0;
				bodyCount++;
				if (bodyCount == 2)
					{
						if (grabbables[B1FLAP].hasBeenGrabbed == false){toss(grabbables[B1FLAP]);}
						if (grabbables[B1ARM].hasBeenGrabbed == false){toss(grabbables[B1ARM]);}
						if (grabbables[B1LEG1].hasBeenGrabbed == false && grabbables[B1LEG2].hasBeenGrabbed == false){toss(grabbables[B1LEG1]);}
						if (grabbables[B1LEG2].hasBeenGrabbed == false && grabbables[B1LEG2].hasBeenGrabbed == false){toss(grabbables[B1LEG2]);}
						if (grabbables[B1EYEBALL2].hasBeenGrabbed == false){toss(grabbables[B1EYEBALL2]);}
						if (grabbables[B1EYEBALL].hasBeenGrabbed == false){toss(grabbables[B1EYEBALL]);}
					}
				else if (bodyCount == 3)
				{
					for (let j = 9; j < 15; j++) {
						if (grabbables[j].hasBeenGrabbed == false){toss(grabbables[j]);}
					}
				}
				framesCounted = restartBuffer;
				isTimeUp = false;
			}
	}
	else 
		{
			blowup.reset();
		}
}

function timesUp(){
	isTimeUp = true;
	if (framesCounted > 900)
		{
			framesCounted = 0;
		}
	if (timeLeft-millis() < 8000)
		{
			incinerate = true;
		}
}

function mouseClicked() {
	print(round(mouseX) + ", " + round(mouseY));
}

function scan(){
	return false;
}

function keyTyped() {
	if (key == " ")
		{
				typable = false;
				print("scanning");
			for (let i=0; i<grabbables.length; i++){
			let g = grabbables[i];
			if (g.isGrabbed){
				if (g.itemID%2 == 0)
					{
						notif = "Contains alkaline. Can recycle."
					}
				else 
					{
						notif = "Contains lithium. Dangerous."
					}
			}
		}
				entered(-2);
				typedWord = "";
		}
	else 
	if (key != ENTER)
  {
		if (millis() > textTimer)
			{
				typable = true;
			}
		if(typable)
			{
				typedWord = typedWord + key;
				print(typedWord);
				textTimer = millis() + maxTextTime;
			}
  }
	else if (key == ENTER)
	{
		if (typedWord == toolCode[SCALPEL])
    {
			typable = false;
			entered(SCALPEL);
  		typedWord = "";
    }
		else if (typedWord == toolCode[BONESAW])
    {
			typable = false;
			entered(BONESAW);
  		typedWord = "";
    }
		else if (typedWord == toolCode[2])
    {
			typable = false;
			entered(2);
  		typedWord = "";
    }
		else if (typedWord == toolCode[3])
    {
			typable = false;
			entered(3);
  		typedWord = "";
    }
		else if (typedWord == toolCode[4])
    {
			typable = false;
			entered(4);
  		typedWord = "";
    }
		else 
		{
			typable = false;
      print("input not recognized");
			notif=errorNotif;
			entered(-1);
  		typedWord = "";
		}
	}
}

function entered(tool)
{
	textTimer = millis() + 2*maxTextTime;
	if (tool >= 0)
	{
		print(toolName[tool]);
		notif = toolName[tool];
		if (tool == SCALPEL)
		{
			if (r1isOpen == 1)
			{
				drawerClose.play();
				toss(grabbables[SCALPELG]);
				r1isOpen = -1;
			}
			else {
				drawerOpen.play();
				r1isOpen = 1;
			}
		}
		else if (tool == BONESAW)
		{
			if (r2isOpen == 1)
			{
				drawerClose.play();
				toss(grabbables[BONESAWG]);
				r2isOpen = -1;
			}
			else {
				drawerOpen.play();
				r2isOpen = 1;
			}
		}
		if (tool == 2)
		{
			if (r3isOpen == 1)
			{
				drawerClose.play();
				toss(grabbables[HAMMERG]);
				r3isOpen = -1;
			}
			else {
				drawerOpen.play();
				r3isOpen = 1;
			}
		}
		if (tool == 3)
		{
			if (alkalineIsOpen)
			{
				drawerClose.play();
				alkalineIsOpen = false;
			}
			else {
				drawerOpen.play();
				alkalineIsOpen = true;
			}
		}
		if (tool == 4)
		{
			if (lithiumIsOpen)
			{
				drawerClose.play();
				lithiumIsOpen = false;
			}
			else {
				drawerOpen.play();
				lithiumIsOpen = true;
			}
		}
	}
	if (tool = -2)
	{
		for (let i=0; i<grabbables.length; i++){
			let g = grabbables[i];
			if (g.isGrabbed){
				if (g.itemID%2 == 0)
					{
						notif = "Contains alkaline. Can recycle."
					}
				else 
					{
						notif = "Contains lithium. Dangerous."
					}
			}
		}
	}
	else
	{
		notif = errorNotif;
	}
	
}

function drawBody1(x, y) {
	image(bed, x, y);
	image(body1, x, y);
	if (body1hasArm)
		{
			image(body1arm, x, y);
		}
	if (body1hasLeg)
		{
			image(body1leg, x, y);
		}
	if (body1hasEyeball)
		{
			image(body1eyeball, x, y);
		}
	if (body1hasEyelid)
		{
			image(body1eyelid, x, y);
			if (!body1hasEyeball)
				{
					print("has eyelid but no eyeball?? bug");
				}
		}
	if (body1hasFlap)
		{
			image(body1flap, x, y);
		}
}

function drawBody2(x, y) {
  image(bed, x, y);
  image(body2, x, y);
  if(body2hasKnee)
    {
      image(body2knee, x, y);
    }
	else
		{
			image(body2blood, x, y);
		}
	if(body2hasHand)
    {
      image(body2hand, x, y);
    }
	if(body2hasHeart)
		{
			image(body2heart, x, y);
		}
		else {
			image(body2empty, x, y);
		}
  if(body2hasRibs)
    {
      image(body2ribs, x, y);
    }
	if(body2hasSkin)
		{
			image(body2, x, y);
		}
  if(body2hasFlap)
    {
      image(body2flap, x, y);
    }
}

function drawBody3(x, y) {
  image(bed, x, y)
  image(body3, x, y);
  if(body3hasFoot)
    {
      image(body3foot, x, y);
    }
	if(!body3hasSkull)
		{
			image(body3blood,x,y);
		}
  if(body3hasGuts && (!body3hasSkin))
    {
      image(body3guts, x, y);
    }
	if(!body3hasGuts)
		{
			image(body3empty, x, y);
		}
  if(body3hasBrain && (!body3hasSkull))
    {
      image(body3brain, x, y);
    }
	if(!body3hasBrain)
		{
			image(body3dummy, x, y)
		}
	if(body3hasFlap)
	{
		image(body3flap, x, y);
	}
}

function getXNoiseValue() { 
  let v = noise(millis()/100);
  const cutOff = 0.5;
  
  if(v < cutOff) {
    return 0;
  }
  
  v = pow((v-cutOff) * 1/(1-cutOff), 2);
  
  return v;
}
function getYNoiseValue() { 
  let v = noise(millis()+500/100);
  const cutOff = 0.5;
  
  if(v < cutOff) {
    return 0;
  }
  
  v = pow((v-cutOff) * 1/(1-cutOff), 2);
  
  return v;
}

function importDrawings() {
	bg = loadImage("background.gif");
	body1 = loadImage("body1.png");
	body1arm = loadImage("body1_arm.png");
	body1leg = loadImage("body1_leg.png");
	body1eyeball = loadImage("body1_eyeball.png");
	body1eyelid = loadImage("body1_eyelid.png");
	body1flap = loadImage("body1_flap.png");
	body1arm_severed = loadImage("b1arm_severed.png");
	body1eyeball_severed = loadImage("b1eyeball_severed.png");
	body1leg_severed = loadImage("b1leg_severed.png");
	
	body2 = loadImage("body2.png");
	body2hand = loadImage("body2_hand.png");
	body2knee = loadImage("body2_knee.png");
	body2blood = loadImage("body2_blood.png");
	body2ribs = loadImage("body2_ribs.png");
	body2heart = loadImage("body2_heart.png");
	body2empty = loadImage("body2_empty.png");
	body2flap = loadImage("body2_flap.png");
	body2_knee_severed = loadImage("body2_knee_severed.png");
	body2_hand_severed = loadImage("body2_hand_severed.png");
	body2_heart_severed = loadImage("body2_heart_severed.png");
	
	body3 = loadImage("body3.png");
	body3blood = loadImage("body3_blood.png");
	body3foot = loadImage("body3_foot.png");
	body3guts = loadImage("body3_guts.png");
	body3empty = loadImage("body3_empty.png");
	body3flap = loadImage("body3_flap.png");
	body3brain = loadImage("body3_brain.png");
	body3dummy = loadImage("body3_dummy.png");
	body3_guts_severed = loadImage("body3_guts_severed.png");
	body3_foot_severed = loadImage("body3_foot_severed.png");
	body3_brain_severed = loadImage("body3_brain_severed.png");
	
	rightCab = loadImage("right_cabinet.png");
	r1open = loadImage("top_right_open2.gif");
	r1close = loadImage("top_right_close2.gif");
	r1 = loadImage("top_right.png");
	r1empty = loadImage("top_right_empty.png")
	r2open = loadImage("mid_right_open2.gif");
	r2close = loadImage("mid_right_close2.gif");
	r2 = loadImage("mid_right.png");
	r3open = loadImage("low_right_open2.gif");
	r3close = loadImage("low_right_close2.gif");
	r3 = loadImage("low_right.png");
	clock = loadImage("timer.gif");
	screen = loadImage("screen.gif");
	bed = loadImage("bed.png");
	l1 = loadImage("top_left.png");
	l2 = loadImage("low_left.png");
	chutes = loadImage("chutes.png");
	
	openclaw = loadImage("pliers.png");
	closedclaw = loadImage("pliersclosed.png");
	
	hammer = loadImage("hammer.png");
	bonesaw = loadImage("bonesaw.png");
	scalpel = loadImage("scalpel.png");
	
	blowup = loadImage("blowup.gif");
	can2_open = loadImage("can2_open.gif");
	can1_open = loadImage("can1_open.gif");
	can1_close = loadImage("can1_close.gif");
	can2_close = loadImage("can2_close.gif");
}

function importSounds() {
	bgm = createAudio('Ambience.mp3');
	bgm.volume(0.4);
	drawerOpen = loadSound('drawerOpen.mp3');
	drawerClose = loadSound('drawerClose.mp3');
	
	rustle = loadSound('rustle1.mp3')
	rustleL = loadSound('longRustle.mp3')
	pickup = loadSound('clipboardPickup.mp3')
	pickupL = loadSound('randomPickup.mp3')
	blaze = loadSound('9jdd4s_1.mp3')
}
