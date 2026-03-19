
// var localWindow;
// var boxSizes = {}
// var boxes = [];
// var totalClients = 0;
var folderPics = [];
var paperPics = [];
var leftPages = [];
var rightPages = [];
var pic;

var myFolder;
var leftPad;
var folderDim;
var folderMid;
var fr;
var hscale;
var wscale;

var paperDim;
var paperMid;
var pr;

var cover;
var backleft;
var backright;
var pin;

var dbg = false;

var imgScale = 1.5;


function preload() {
  
  //spine = loadImage("images/spine.png");
  pin = loadImage("assets/pin_small.png");
  folderPics.push(pin);
  cover = loadImage("assets/cover_small.png");
  folderPics.push(cover);
  backleft = loadImage("assets/backleft_small.png");
  folderPics.push(backleft);
  backright = loadImage("assets/backright_small.png");
  folderPics.push(backright);
  leftPages.push(new Paper("assets/left_page1.png"));
  leftPages.push(new Paper("assets/left_page_2.5.png"));
  leftPages.push(new Paper("assets/left_page_3.5.png"));
  leftPages.push(new Paper("assets/left_page2.png"));
  leftPages.push(new Paper("assets/left_page4.png"));
  leftPages.push(new Paper("assets/left_page6.png"));
  
  rightPages.push(new Paper("assets/right_page1.png"));
  rightPages.push(new Paper("assets/right_page2.png"));
  rightPages.push(new Paper("assets/right_page3.png"));
  rightPages.push(new Paper("assets/right_page4.png"));
  rightPages.push(new Paper("assets/right_page5.png"));
  rightPages.push(new Paper("assets/right_page6.png"));

}

function setup() {
  textFont('Courier New');
  drawingContext.shadowOffsetX = -5;
  drawingContext.shadowOffsetY = -5;
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'black';
  angleMode(DEGREES);
  fr = createVector(9.5,11.625);
  pr = createVector(8.5,11);

  createCanvas(windowWidth, windowHeight);

  hscale = (width / 2 / fr.x) * fr.y;
  wscale = (height / fr.y) * fr.x;
  if (hscale > height) {
    leftPad = true;
    folderDim = createVector(wscale, height);
    folderMid = createVector(width / 2, 0);
  } else {
    leftPad = false;
    folderDim = createVector(width / 2, hscale);
    folderMid = createVector(width / 2, (height - folderDim.y) / 2);
  }
  
  paperDim = createVector((folderDim.x/fr.x)*pr.x,(folderDim.y/fr.y)*pr.y);
  paperMid = createVector(width/2, (height - paperDim.y)/2);
  myFolder = new Folder(folderDim,folderMid, paperDim,paperMid,leftPages.length-1,rightPages.length-1);
  for (let i=0;i<folderPics.length;i++){
    folderPics[i].resize(folderDim.x*imgScale,folderDim.y*imgScale);
  }
  for (let i=0;i<paperPics.length;i++){
    paperPics[i].resize(paperDim.x*imgScale,paperDim.y*imgScale);
  }
  mouseMoved();

}

function mouseMoved() {
  noStroke();
  background(0, 0, 0);

  textSize(20);
  fill(255);
  if (dbg){
    text("dims: " + nfc(myFolder.folderDim.x,2) + ", " + nfc(myFolder.folderDim.y,2) + " mid: " + nfc(myFolder.folderMid.x,2) + ", " + nfc(myFolder.folderMid.x,2), 50,50);
    text("leftCount: " + myFolder.leftCount + " maxLeft: "+ myFolder.maxLeft,50,100);
  }


  if (myFolder.closed){
    image(backright, folderMid.x, folderMid.y, folderDim.x, folderDim.y);
    myFolder.drawPapers(rightPages,false);
    fill(0);
    rect(width/2,0,-20,height);
    image(cover, folderMid.x, folderMid.y, folderDim.x, folderDim.y);
  }
  else {

    image(backleft, folderMid.x-folderDim.x, folderMid.y, folderDim.x, folderDim.y);
    image(backright, folderMid.x, folderMid.y, folderDim.x, folderDim.y);
    
    myFolder.drawPapers(leftPages,true);
    myFolder.drawPapers(rightPages,false);
    image(pin,folderMid.x-folderDim.x*1.35, folderMid.y+folderDim.x*0.02, folderDim.x*1.6, folderDim.y);
    
    push();
    translate(-folderMid.x+folderDim.x*1.35,folderDim.x*0.02);
    scale(-1, 1);
    image(pin,-width, folderMid.y, folderDim.x*1.6, folderDim.y);
    pop();

  }
  myFolder.hover(mouseX,mouseY);

}

function draw() {
  
}


function mousePressed() {
  myFolder.click(mouseX, mouseY);
  mouseMoved();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  hscale = (width / 2 / fr.x) * fr.y;
  wscale = (height / fr.y) * fr.x;
  if (hscale > height) {
    leftPad = true;
    folderDim = createVector(wscale, height);
    folderMid = createVector(width / 2, 0);
  } else {
    leftPad = false;
    folderDim = createVector(width / 2, hscale);
    folderMid = createVector(width / 2, (height - folderDim.y) / 2);
  }
  paperDim = createVector((folderDim.x/fr.x)*pr.x,(folderDim.y/fr.y)*pr.y);
  paperMid = createVector(width/2, (height - paperDim.y)/2);
  myFolder.resize(folderDim,folderMid, paperDim,paperMid);
  

  //   if (socket.id){ // make sure socket is established

  //     console.log("from client");
  //     socket.emit('getWindows', {});
  //     var w = windowWidth;
  //     var h = windowHeight;
  //     socket.emit('fromClient', {id:socket.id,w:windowWidth,h:windowHeight,c:color});
  //     //text(nfc(w, 2), windowWidth/2,windowHeight/2)

  //   }
  mouseMoved();
}
function touchMoved(){
  return false;
}
function touchEnded() {
  return false;
}

document.ontouchmove = function (event) {
  event.preventDefault();
};
//================================================
// Don't delete these 'comments'; they are essential hacks to make p5.js work in the Glitch.com editor.
// First: shut Glitch up about p5's global namespace pollution using this magic comment:
/* global describe p5 setup draw P2D WEBGL ARROW CROSS HAND MOVE TEXT WAIT HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS DEG_TO_RAD RAD_TO_DEG CORNER CORNERS RADIUS RIGHT LEFT CENTER TOP BOTTOM BASELINE POINTS LINES LINE_STRIP LINE_LOOP TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP QUADS QUAD_STRIP TESS CLOSE OPEN CHORD PIE PROJECT SQUARE ROUND BEVEL MITER RGB HSB HSL AUTO ALT BACKSPACE CONTROL DELETE DOWN_ARROW ENTER ESCAPE LEFT_ARROW OPTION RETURN RIGHT_ARROW SHIFT TAB UP_ARROW BLEND REMOVE ADD DARKEST LIGHTEST DIFFERENCE SUBTRACT EXCLUSION MULTIPLY SCREEN REPLACE OVERLAY HARD_LIGHT SOFT_LIGHT DODGE BURN THRESHOLD GRAY OPAQUE INVERT POSTERIZE DILATE ERODE BLUR NORMAL ITALIC BOLD BOLDITALIC LINEAR QUADRATIC BEZIER CURVE STROKE FILL TEXTURE IMMEDIATE IMAGE NEAREST REPEAT CLAMP MIRROR LANDSCAPE PORTRAIT GRID AXES frameCount deltaTime focused cursor frameRate getFrameRate setFrameRate noCursor displayWidth displayHeight windowWidth windowHeight width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams pushStyle popStyle popMatrix pushMatrix registerPromisePreload camera perspective ortho frustum createCamera setCamera setAttributes createCanvas resizeCanvas noCanvas createGraphics blendMode noLoop loop push pop redraw applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase createStringDict createNumberDict storeItem getItem clearStorage removeItem select selectAll removeElements createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ pRotateDirectionX pRotateDirectionY pRotateDirectionZ turnAxis setMoveThreshold setShakeThreshold isKeyPressed keyIsPressed key keyCode keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveGif saveFrames loadImage image tint noTint imageMode pixels blend copy filter get loadPixels set updatePixels loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo createWriter save saveJSON saveJSONObject saveJSONArray saveStrings saveTable writeFile downloadFile abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont append arrayCopy concat reverse shorten shuffle sort splice subset float int str boolean byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim day hour minute millis month second year plane box sphere cylinder cone ellipsoid torus orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadModel model loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess remove canvas drawingContext*/
// Also socket.io:
/* global describe io*/
