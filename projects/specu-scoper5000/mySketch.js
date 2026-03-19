let planetList = [];
results = [0, 0, 0, 0, 0, 0];

const Elements = {
    C: [475,490,505,537,600,670,685],
    H: [410,434,486,656],
    N: [415, 485, 495, 530,640,660],
    O: [420,440,525,540,560,595,610,640,650],
    He: [447,469,472,493,501,505,587,669]
};

function preload(){
	importDrawings();
	myFont = loadFont('arial.ttf');
	buttonSound = loadSound("click-soundEff.mp3");
	loadingSound = loadSound("short-load-soundEff.mp3");
	lofiTrack = loadSound("lofi_moment.mp3");
	glitch = loadSound("glitch-soundEff.mp3");
	closeButton = loadSound("close-button-soundEff.mp3");
	woosh = loadSound("woosh_open-soundEff.mp3");
	longLoad = loadSound("type-loading-soundEff.mp3");
	charge = loadSound("chargeUp-soundEff.mp3");
	loadingScreen = loadImage("loading.gif");
	
}

function setup() {
	noCursor();
	Aspec = ["C","O","H"];
	Bspec = ["C","N","He"];
	Cspec = ["C","N","O","H"];
	Dspec = ["O","He"];
	Espec = ["N","He"];
	Fspec = ["O","H"];
	
	textFont(myFont);
	shipMoveRegardless = true;
	w = 1280;
	h = 720;
	wc = w/2;
	hc = h/2;
	createCanvas(w, h, WEBGL);
	//planet scaler, bigger the scaler bigger the planet
	scaleSize = 1;
	
	makePlanets();
	
	
	imageMode(CENTER);
	angleMode(DEGREES);
	
	let waterShow = waterGood;
	let waterText = waterA;
	
	enteredPlanet = 0;
	
	planetMode = false;
	
	//water stuff
	water = false;
	waterWidth = 300;
	waterHeight = 164;
	waterShift = 260;
	waterTurn = 30;
	specG = false;
	waterPressed = false;
	specGPressed = false;
	
	//divides mouseX by this number for rotate on turn, smaller for more rotate
	shipRotateBuffer = 400;
	//divides mouseX by this number for turn on turn, smaller for bigger turn
	xShipTurnBuffer = 7;
	yShipTurnBuffer = 10;
	//sets origin for rotations
	turnBase = 200;
	//breathing cycle size
	breatheSize = 10;
	//breathing cycle length; make smaller to breathe faster
	breatheTime = 15;
	bgColor = 0;
	//mouse move buffer: smaller for more sluggish
	mouseMoveBuffer = 0.02;
	
	//how fast you navigate the map. smaller for faster
	xMapBuffer = 600;
	yMapBuffer = 450;
	//multiplier for parallex scrolling. higher for slower front
	parallexMod = 0.6;
	//previous mouse position
	mx = 0;
	my = 0;
	
	//ship interior upwards shift
	shipUp = -30;
	
	//map location;
	mapX = 0;
	mapY = 0;
	frontMapX = 0;
	frontMapY = 0;
	
	//general menu config: when menu gets toggled
	menuToggled= 300;
	
	//menu turned value
	lCurrentTurn = 0;
	rCurrentTurn = 0;
	
	//left menu specs;
	lMenuWidth= 280;
	lMenuHeight= 400;
	lMenuTurn= 50;
	lMenuFront= 100;
	lMenuMove= 330;
	
	//right menu specs;
	rMenuWidth= 280;
	rMenuHeight= 400;
	rMenuTurn= 50;
	rMenuFront= 100;
	rMenuMove= 330;
	panels = new Sprite(0,0);
	panels.collider = "none";
	panels.draw = () => {
		drawCockpit(mx, my, ms);
	}
		buttonW = 150;
    buttonH = 75;
    bpos = [-450,300,-250,300]
    b1 = new Sprite(wc+bpos[0],bpos[1]+hc);
    b1.collider = "none";
    b1.image = yes;
		b1.w = buttonW;
		b1.h = buttonH;
    // waterButton.x = -450;
    // waterButton.y = 200;
    b1.draw = () => {
        if (planetMode && waterPressed && specGPressed)
				{
					image(yes,-wc,-hc,buttonW,buttonH);
				}
    }
    
    b2 = new Sprite(wc+bpos[2],bpos[1]+hc);
    b2.collider = "none";
    b2.image = no;
		b2.w = buttonW;
		b2.h = buttonH;
    // waterButton.x = -450;
    // waterButton.y = 200;
    b2.draw = () => {
			if (planetMode && waterPressed && specGPressed)
			{
        image(no,-wc,-hc,buttonW,buttonH);
			}
    }
    b3 = new Sprite(wc-bpos[2],bpos[3]+hc);
    b3.collider = "none";
    b3.image = wb;
		b3.w = buttonW;
		b3.h = buttonH;
    // waterButton.x = -450;
    // waterButton.y = 200;
    b3.draw = () => {
			if (planetMode)
			{
        image(sb,-wc,-hc,buttonW,buttonH);
			}
    }
    b4 = new Sprite(wc-bpos[0],bpos[3]+hc);
    b4.collider = "none";
    b4.image = sb;
		b4.w = buttonW;
		b4.h = buttonH;
	//b4.debug=true;
    // waterButton.x = -450;
    // waterButton.y = 200;
    b4.draw = () => {
			if (planetMode)
			{
        image(wb,-wc,-hc,buttonW,buttonH);
			}
    }
		load = new Sprite();
		load.layer = 600;
		load.draw = () => {
			if (millis()>3000) 
			{
				load.remove();
				lofiTrack.play();
			}
			image(loadingScreen,0,0);
    }
    
}

function draw() {
	
	background(bgColor);
	ms = millis();
	
	//buffered mouse
	mx = (1-mouseMoveBuffer) * mx + mouseMoveBuffer*(mouseX-wc);
	my = (1-mouseMoveBuffer) * my + mouseMoveBuffer*(mouseY-hc);
	
	drawStarMap(mx, my);

}

function drawStarMap(x, y)
{
	push();
		blendMode(BLEND);
	if (!planetMode) {
		mapX += x/xMapBuffer;
		mapY += y/yMapBuffer;
		frontMapX += x/xMapBuffer/parallexMod;
		frontMapY += y/yMapBuffer/parallexMod;
	}
		translate(-mapX, -mapY, 0);
		image(starMap, 0, 0);
		blendMode(ADD);
		image(starMapGlow, 0, 0);
		pop();
		push();
		translate(-frontMapX, -frontMapY, 0);
		image(frontStars, 0, 0);
		pop();
}

function drawCockpit(mx, my, ms)
{
	push();
	if (!planetMode || shipMoveRegardless)
	{
		//sets origin down to rotate, then sets back
		translate(0, turnBase, 0);
		rotate((mx)/shipRotateBuffer);
		translate(0, -turnBase, 0);
		//turns ship, breathes
		translate((mx)/xShipTurnBuffer, (breatheSize * sin(ms/breatheTime) + (my)/yShipTurnBuffer) + shipUp, 0);
	}
	image(cockpit, 0, 0);
	image(idles, 0, 0);
	image(tail, 0, 0);
	image(cat, 0, 0);
	if (specG) {
		drawSpectrography(planetList[enteredPlanet].spec);
	}
	
	for (let i = 0; i < results.length; i++)
	{
		if (results[i] == 1)
		{
			switch (i)
			{
				case 0: 
				image(yesA, 0, 0);
				break;
				case 1: 
				image(yesB, 0, 0);
				break;
				case 2: 
				image(yesC, 0, 0);
				break;
				case 3: 
				image(yesD, 0, 0);
				break;
				case 4: 
				image(yesE, 0, 0);
				break;
				case 5: 
				image(yesF, 0, 0);
				break;
			}
		}
		else if (results[i] == -1)
		{
			switch (i)
			{
				case 0: 
				image(noA, 0, 0);
				break;
				case 1: 
				image(noB, 0, 0);
				break;
				case 2: 
				image(noC, 0, 0);
				break;
				case 3: 
				image(noD, 0, 0);
				break;
				case 4: 
				image(noE, 0, 0);
				break;
				case 5: 
				image(noF, 0, 0);
				break;
			}
		}
	}
	
	if (!planetMode)
	{
		image(button1still, 0, 0);
		image(button2still, 0, 0);
		image(latchstill, 0, 0);
	}
	else
	{
		image(button1, 0, 0);
		image(button2, 0, 0);
		image(latch, 0, 0);
		if (water)
		{
			//blendMode(ADD);
			rotateX(waterTurn);
			image(waterShow, 0, waterShift, waterWidth, waterHeight);
			image(waterText, 0, waterShift, waterWidth, waterHeight);
			rotateX(-waterTurn);
			//blendMode(BLEND);
		}
	}
	
	//Check whether in planets mode
	if (planetMode)
	{
		tint(255, 255);
		blendMode(BLEND);
		drawLeftMenu(0, -shipUp);
		drawRightMenu(0, -shipUp);
		//drawRightMenu(0, 40);
		blendMode(BLEND);
		tint(255, 255);
	}
	pop();
}

function drawLeftMenu(x, y)
{
	mouseOff = ((mouseX-wc) > -menuToggled);
	thisMove = -(lMenuMove+lCurrentTurn)
	translate(thisMove, 0, lMenuFront);
	if(mouseOff && (lCurrentTurn < lMenuTurn))
	{
		lCurrentTurn+=4;
	}
	else if ((lCurrentTurn > 0) && mouseOff)
	{
		lCurrentTurn = lMenuTurn;
	}
	else if ((lCurrentTurn > 0) && !mouseOff)
	{
		lCurrentTurn-=2;
	}
	else
	{
		lCurrentTurn = 0;
	}
	
	rotateY(lCurrentTurn);
	image(leftMenu, x, y, lMenuWidth-(2*lCurrentTurn), lMenuHeight);
	rotateY(-lCurrentTurn);
	
	translate(-thisMove, 0, -lMenuFront);
}

function drawRightMenu(x, y)
{
	mouseOff = ((mouseX-wc) < menuToggled);
	thisMove = (rMenuMove+rCurrentTurn);
	translate(thisMove, 0, rMenuFront);
	if(mouseOff && (rCurrentTurn < rMenuTurn))
	{
		rCurrentTurn+=4;
	}
	else if ((rCurrentTurn > 0) && mouseOff)
	{
		rCurrentTurn = rMenuTurn;
	}
	else if ((rCurrentTurn > 0) && !mouseOff)
	{
		rCurrentTurn-=2;
		//print("turn down");
	}
	else
	{
		rCurrentTurn = 0;
		//print("turn 0ed");
	}
	
	rotateY(-rCurrentTurn);
	image(rightMenu, x, y, rMenuWidth-(2*rCurrentTurn), rMenuHeight);
	rotateY(rCurrentTurn);
	
	translate(-thisMove, 0, -rMenuFront);
}

function importDrawings() {
	cockpit = loadImage("test.png");
	starMap = loadImage("starMap.png");
	starMapGlow = loadImage("starMapGlow.png");
	frontStars = loadImage("frontStars.png");
	leftMenu = loadImage("leftMenu.png");
	rightA = loadImage("rightA.png");
	rightB = loadImage("rightB.png");
	rightC = loadImage("rightC.png");
	rightD = loadImage("rightD.png");
	rightE = loadImage("rightE.png");
	rightF = loadImage("rightF.png");
	cat = loadImage("cat.gif");
	tail = loadImage("tail.gif");
	idles = loadImage("idles.gif");
	button1still = loadImage("button1.png");
	button1 = loadImage("button1.gif");
	button2still = loadImage("button2.png");
	button2 = loadImage("button2.gif");
	latchstill = loadImage("latch.png");
	latch = loadImage("latch.gif");
	
	yesA = loadImage("k218bW.png");
	noA = loadImage("k218bL.png");
	yesB = loadImage("wasp39bW.png");
	noB = loadImage("wasp39bL.png");
	yesC = loadImage("wasp96bW.png");
	noC = loadImage("wasp96bL.png");
	yesD = loadImage("gj180dW.png");
	noD = loadImage("gj180dL.png");
	yesE = loadImage("ross508bW.png");
	noE = loadImage("ross508bL.png");
	yesF = loadImage("trappist1fW.png");
	noF = loadImage("trappist1fL.png");
	
	waterGood = loadImage("waterGood.png");
	waterEh = loadImage("waterEh.png");
	waterBad = loadImage("waterBad.png");
	eh = loadImage("Eh.png");
	bad = loadImage("Bad.png");
	waterA = loadImage("waterA.png");
	waterB = loadImage("waterB.png");
	waterC = loadImage("WaterC.png");
	
	wb = loadImage("b4.png");
	sb = loadImage("b3.png");
	yes = loadImage("b1.png");
	no = loadImage("b2.png");
	
	specBg = loadImage("Panelleft.png");
	
}

function makePlanets(){

	angleMode(DEGREES); 
	cx = width/2;
	cy = height/2
	background(0);
	C = new Sprite(cx, cy);
	C.collider = 'none';
	C.x = cx;
	C.y = cx;

	imageMode(CENTER);
	
	imgA = loadImage("planetA.png");
	atmA = loadImage("planetA_atm.png");
	imgB = loadImage("planetB.png");
	atmB = loadImage("planetB_atm.png");
	imgC = loadImage("planetC.png");
	atmC = loadImage("planetC_atm.png");
	imgD = loadImage("planetD.png");
	atmD = loadImage("planetD_atm.png");
	imgE = loadImage("planetE.png");
	atmE = loadImage("planetE_atm.png");
	imgF = loadImage("planetF.png");
	atmF = loadImage("planetF_atm.png");
	// imgG = loadImage("planetG.png");
	// atmG = loadImage("planetG_atm.png");
	// imgH = loadImage("planetH.png");
	// atmH = loadImage("planetH_atm.png");
	translate(-cx,-cy)
	planetList.push(new Planet("A",120*scaleSize,imgA,atmA,cx+500,cy+900, Aspec));
	planetList.push(new Planet("B",300*scaleSize,imgB,atmB,cx+1200,cy-300, Bspec));
	planetList.push(new Planet("C",270*scaleSize,imgC,atmC,cx+900,cy+200, Cspec));
	planetList.push(new Planet("D",120*scaleSize,imgD,atmD,cx-400,cy-500, Dspec));
	planetList.push(new Planet("E",100*scaleSize,imgE,atmE,cx-900,cy-600, Espec));
	planetList.push(new Planet("F",80*scaleSize,imgF,atmF,cx-250,cy+200, Espec));
	// planetList.push(new Planet("G",200,imgG,atmG,cx+,cy-300));
	// planetList.push(new Planet("H",100,imgH,atmH,cx-500,cy+50));
	crosshair = loadImage('crosshairG.png');
	C.layer = 500;
	C.draw = () => {
		push();
		translate(-width/2,-height/2)
		// blendMode(ADD);
		if (!planetMode)
		{
			noCursor();
			image(crosshair,0,0,100,100);
		}
		else {
			cursor(CROSS);
		}
		pop();
	}
	C.update = () => {
		C.moveTowards(mouseX,mouseY, 0.07);
		
		if (mouse.pressing()){
			if (C.overlapping(b1))
			{
				closeButton.play();
				water = false;
					specG = false;
					planetExited(planetList[enteredPlanet]);
					results[enteredPlanet] = 1;
				// for (let i=0;i<planetList.length;i++){
					
					//print("EXITED PLANET");
			// }
			}
			else if (C.overlapping(b2))
			{
				glitch.play();
				water = false;
					specG = false;
					planetExited(planetList[enteredPlanet]);
					results[enteredPlanet] = -1;
			// 	for (let i=0;i<planetList.length;i++){
					
			// 		//print("EXITED PLANET");
			// }
			}
			else if (C.overlapping(b3))
			{
				charge.play();
				//print("spectro");
				water = false;
				specG = true;
				specGPressed = true;
			}
			else if (C.overlapping(b4))
			{
				longLoad.play();
				//print("water");
				water=true;
				specG = false;
				waterPressed = true;
			}
			else {
				buttonSound.play();
				for (let i=0;i<planetList.length;i++){
					if (C.overlapping(planetList[i].s)){
						woosh.play() 
						planetClicked(planetList[i]);
						//print("CLICKED PLANET", planetList[i].name);
						waterCheck(planetList[i]);
						rightMenuCheck(planetList[i]);
						enteredPlanet = i;
						water = false;
						C.w=70;
						C.h=70;
						break;
					}
				}
			}
		}
		else {
			C.w=50;
			C.h=50;
		}
		
	};
	// pop();
	
}

function planetClicked(planet){
	planet.zoomIn();
	// planet.planetMode = 1;
	for (let i=0;i<planetList.length;i++){
		if (planetList[i]!=planet){
			planetList[i].planetMode = 2;
		}
	}
	planetMode = true;
}

function planetExited(planet){
	planet.zoomOut();
	// planet.planetMode = 0;
	planet.return();
	waterPressed = false;
	specGPressed = false;
	for (let i=0;i<planetList.length;i++){
		if (planetList[i]!=planet){
			// planetList[i].planetMode = 0;
			planetList[i].return();
		}
	}
	planetMode = false;
}

function waterCheck(planet){
	if (planet.name == "A")
	{
		waterShow = waterGood;
		waterText = waterA;
	}
	if (planet.name == "B")
	{
		waterShow = waterGood;
		waterText = waterB;
	}
	if (planet.name == "C")
	{
		waterShow = waterGood;
		waterText = waterC;
	}
	if (planet.name == "D")
	{
		waterShow = waterBad;
		waterText = bad;
	}
	if (planet.name == "E")
	{
		waterShow = waterBad;
		waterText = bad;
	}
	if (planet.name == "F")
	{
		waterShow = waterEh;
		waterText = eh;
	}
}

function rightMenuCheck(planet){
	if (planet.name == "A")
	{
		rightMenu = rightA;
	}
	if (planet.name == "B")
	{
		rightMenu = rightB;
	}
	if (planet.name == "C")
	{
		rightMenu = rightC;
	}
	if (planet.name == "D")
	{
		rightMenu = rightD;
	}
	if (planet.name == "E")
	{
		rightMenu = rightE;
	}
	if (planet.name == "F")
	{
		rightMenu = rightF;
	}
}


function drawSpectrography(currSpec){
	
	push();
	
	translate(-50,0,100);
	// blendMode(ADD);
	image(specBg,50,0,370,420);
	// blendMode(BLEND);
	textFont(myFont);
  let specAll = ["C","H","N","O"];
  let x = -100;
  let y = -150;
  let w = 150;
  let h = 40;
  drawElems(x,y,w,h,specAll);
  drawSpec(x, y+7*h, w, h, currSpec);
  noStroke();
  colorMode(RGB);
  fill(160,255,255);
  textSize(32);
  text("Our planet", w+x,y+8*h);
	pop();

}

function drawElems(x,y,w,h,spec) {
	textFont(myFont);
  for (let i=0; i<spec.length; i++){
    drawSpec(x,y+(h+20)*i,w,h,[spec[i]]);
    noStroke();
    colorMode(RGB);
    fill(160,255,255);
    textSize(32);
    text(spec[i], w+x, h/2+y+(h+20)*i+10);
    
  }
}


function drawSpec(x,y,w,h,absorbs) {
  // fill(0);
  // rect(x,y,w,h);
  strokeCap(SQUARE);
  strokeWeight(2);
  ratio = 255/w;
  colorMode(HSB,w+10);
  noFill();
  for (let i=0; i<w;i+=3){
    stroke(w-(i+ratio)-w/10,w,w);
    line(x+i,y,x+i,y+h);
  }
  stroke(0);
  for (let i=0;i<absorbs.length;i++){
    let nanos = Elements[absorbs[i]];
    for (let j=0;j<nanos.length;j++){
      let xn = w*(nanos[j]-400)/300;
      
      line(x+xn,y,x+xn,y+h);
    }
  }
  
  if (x<=mouseX+50-wc && mouseX+50-wc<x+w){
    strokeWeight(3)
    stroke(0,255,255);
    line(mouseX+50-wc,y,mouseX+50-wc,y+h);
  }
	
}

