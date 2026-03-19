class Folder {
    constructor(folderDim, folderMid,paperDim, paperMid,maxLeft,maxRight){
      this.closed = true;
      this.maxLeft = maxLeft;
      this.leftCount = 0;
      this.maxRight = maxRight;
      this.rightCount = 0;
      this.resize(folderDim, folderMid,paperDim, paperMid);
      this.message = "closed";
      this.hoverMsg = "";
    }
    resize(folderDim, folderMid,paperDim, paperMid){
      this.folderDim = paperDim;
      this.folderMid = paperMid
      this.paperDim = paperDim;
      this.paperMid = paperMid
    }
    
    hover(mX,mY){
      fill(255);
      stroke(0);
      textAlign(LEFT);
      if ( (mY<this.folderMid.y || mY>this.folderMid.y+this.folderDim.y || mX<this.folderMid.x-(this.folderDim.x*9/10) || mX>this.folderMid.x+(this.folderDim.x*9/10))){
        if (!this.closed) this.hoverMsg = "Close"
        else{
          this.hoverMsg = "";
        }
      }
      else if (mX>this.folderMid.x && this.closed){
        this.hoverMsg = "Open";
      }
      else {
        if (this.closed){
          this.hoverMsg = "";
        }
        else if (mX<this.folderMid.x){
          this.hoverMsg = "< Flip"
          if (mY<this.folderMid.y+this.folderDim.y/3){
            this.hoverMsg = "^ Back";
            if (this.leftCount==0){
              fill(255,100);
              stroke(0,100);
            }
          }
          else if (this.leftCount==this.maxLeft){
            fill(255,100);
            stroke(0,100);
          }
        }
        else if (mX>this.folderMid.x){
          textAlign(RIGHT);
          this.hoverMsg = "Flip >"
          if (mY<this.folderMid.y+this.folderDim.y/3){
            this.hoverMsg = "Back ^";
            if (this.rightCount==0){
              fill(255,100);
              stroke(0,100);
            }
          }
          else if (this.rightCount==this.maxRight){
            fill(255,100);
            stroke(0,100);
          }
          
        }
  
        
      }
      strokeWeight(2);
      
      text(this.hoverMsg,mX,mY);
    }
    
    click(mX, mY){
      this.message = "click";
      if (mY<this.folderMid.y || mY>this.folderMid.y+this.folderDim.y || mX<this.folderMid.x-(this.folderDim.x*9/10) || mX>this.folderMid.x+(this.folderDim.x*9/10)){
        this.message = "clicked to close";
        this.closed = true;
        this.leftCount = 0;
        this.rightCount = 0;
        return;
      }
      this.message = "clicked somewhere else";
      let flipCount = 1;
      if (mY<this.folderMid.y+this.folderDim.y/3){
        flipCount = -1;
      }
      if (mX<this.folderMid.x){
        this.flip(true,flipCount);
      }
      else if (mX>this.folderMid.x){
        this.flip(false,flipCount);
      }
    }
    // true = left, false = right
    flip(isLeft, flipCount){
      if (!isLeft){
        this.message = "click right";
        if (this.closed){
          this.closed = false
          return;
        }
        if (this.rightCount+flipCount<=this.maxRight && this.rightCount+flipCount>=0)
          this.rightCount+=flipCount;
      }
      if (isLeft){
        this.message = "click left";
        if (this.leftCount+flipCount<=this.maxLeft &&  this.leftCount+flipCount>=0)
          this.leftCount+=flipCount;
      }
    }
    
    drawPapers(papers,isLeft){
      drawingContext.shadowOffsetX = -2;
      drawingContext.shadowOffsetY = 2;
      drawingContext.shadowBlur = 3;
      drawingContext.shadowColor = 'black';
      let dx,dy,maxIdx, topIdx;
      dy = this.paperMid.y
      if (isLeft){
        maxIdx = this.maxLeft;
        topIdx = this.leftCount;
        dx = this.paperMid.x-this.paperDim.x;
        // translate(this.paperMid.x-this.paperDim.x,this.paperMid.y);
      }
      else {
        maxIdx = this.maxRight;
        topIdx = this.rightCount;
        dx = this.paperMid.x;
        // translate(this.paperMid.x,this.paperMid.y);
      }
      for (let i=maxIdx;i>=topIdx;i--){
        let paper = papers[i];
        //translate(5,5);
        push();
        translate(dx,dy);
        rotate(paper.rot);
        
        // fill(0);
        
        
        tint(map(i,maxIdx+1,topIdx,220,255));
        // tint(0);
        image(paper.img, 0,0, this.paperDim.x, this.paperDim.y);
        
  
        pop();
      }
      
    }
    
  }
  
  class Paper {
    constructor(image){
      this.img = loadImage(image);
      this.rot = random(-1,1);
      paperPics.push(this.img);
    }
  }
  
  //================================================
  // Don't delete these 'comments'; they are essential hacks to make p5.js work in the Glitch.com editor.
  // First: shut Glitch up about p5's global namespace pollution using this magic comment:
  /* global describe p5 setup draw P2D WEBGL ARROW CROSS HAND MOVE TEXT WAIT HALF_PI PI QUARTER_PI TAU TWO_PI DEGREES RADIANS DEG_TO_RAD RAD_TO_DEG CORNER CORNERS RADIUS RIGHT LEFT CENTER TOP BOTTOM BASELINE POINTS LINES LINE_STRIP LINE_LOOP TRIANGLES TRIANGLE_FAN TRIANGLE_STRIP QUADS QUAD_STRIP TESS CLOSE OPEN CHORD PIE PROJECT SQUARE ROUND BEVEL MITER RGB HSB HSL AUTO ALT BACKSPACE CONTROL DELETE DOWN_ARROW ENTER ESCAPE LEFT_ARROW OPTION RETURN RIGHT_ARROW SHIFT TAB UP_ARROW BLEND REMOVE ADD DARKEST LIGHTEST DIFFERENCE SUBTRACT EXCLUSION MULTIPLY SCREEN REPLACE OVERLAY HARD_LIGHT SOFT_LIGHT DODGE BURN THRESHOLD GRAY OPAQUE INVERT POSTERIZE DILATE ERODE BLUR NORMAL ITALIC BOLD BOLDITALIC LINEAR QUADRATIC BEZIER CURVE STROKE FILL TEXTURE IMMEDIATE IMAGE NEAREST REPEAT CLAMP MIRROR LANDSCAPE PORTRAIT GRID AXES frameCount deltaTime focused cursor frameRate getFrameRate setFrameRate noCursor displayWidth displayHeight windowWidth windowHeight width height fullscreen pixelDensity displayDensity getURL getURLPath getURLParams pushStyle popStyle popMatrix pushMatrix registerPromisePreload camera perspective ortho frustum createCamera setCamera setAttributes createCanvas resizeCanvas noCanvas createGraphics blendMode noLoop loop push pop redraw applyMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate arc ellipse circle line point quad rect square triangle ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight bezier bezierDetail bezierPoint bezierTangent curve curveDetail curveTightness curvePoint curveTangent beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex alpha blue brightness color green hue lerpColor lightness red saturation background clear colorMode fill noFill noStroke stroke erase noErase createStringDict createNumberDict storeItem getItem clearStorage removeItem select selectAll removeElements createDiv createP createSpan createImg createA createSlider createButton createCheckbox createSelect createRadio createColorPicker createInput createFileInput createVideo createAudio VIDEO AUDIO createCapture createElement deviceOrientation accelerationX accelerationY accelerationZ pAccelerationX pAccelerationY pAccelerationZ rotationX rotationY rotationZ pRotationX pRotationY pRotationZ pRotateDirectionX pRotateDirectionY pRotateDirectionZ turnAxis setMoveThreshold setShakeThreshold isKeyPressed keyIsPressed key keyCode keyIsDown movedX movedY mouseX mouseY pmouseX pmouseY winMouseX winMouseY pwinMouseX pwinMouseY mouseButton mouseIsPressed requestPointerLock exitPointerLock touches createImage saveCanvas saveGif saveFrames loadImage image tint noTint imageMode pixels blend copy filter get loadPixels set updatePixels loadJSON loadStrings loadTable loadXML loadBytes httpGet httpPost httpDo createWriter save saveJSON saveJSONObject saveJSONArray saveStrings saveTable writeFile downloadFile abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt fract createVector noise noiseDetail noiseSeed randomSeed random randomGaussian acos asin atan atan2 cos sin tan degrees radians angleMode textAlign textLeading textSize textStyle textWidth textAscent textDescent loadFont text textFont append arrayCopy concat reverse shorten shuffle sort splice subset float int str boolean byte char unchar hex unhex join match matchAll nf nfc nfp nfs split splitTokens trim day hour minute millis month second year plane box sphere cylinder cone ellipsoid torus orbitControl debugMode noDebugMode ambientLight specularColor directionalLight pointLight lights lightFalloff spotLight noLights loadModel model loadShader createShader shader resetShader normalMaterial texture textureMode textureWrap ambientMaterial emissiveMaterial specularMaterial shininess remove canvas drawingContext*/
  // Also socket.io:
  /* global describe io*/
  
  