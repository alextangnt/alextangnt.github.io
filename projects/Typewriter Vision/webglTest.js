let firstC = 33;
let lastC = 126;

let s = 60;
let s2 = 120;
let cx = -s;
let cy = -s;

let ps = 10;
let psx = ps; // must be int
let psy = ps*2; // must be int
let psc = ps*2.4;

let w = 720;
let h = 480;
let left = -w/2;
let right = w/2;
let up = -h/2;
let bot = h/2;

let chars = [];
let intervals = 10;
let low = 0.7;
let high = 0.98;
let noiseLevel = 255;
let noiseScale = 0.3;
let c = 'c';
let font;
let options = { width: 120, height: 120, willReadFrequently: true };
let lines;
let totalText;

let mouseMoves;
let pastMoves = [];
let pastPix = [];
// let currPix = [];

let fs = 0;
let count = 0;

let cmap = {};

function preload(){
    font = loadFont("assets/times.ttf")
    lines = loadStrings('assets/stud.txt');
}

function setup() {
    mouseMoves = Array.from({ length: int(w/psx) }, () => 
    Array(int(h/psy)).fill(false)
    );

    pastPix = Array.from({ length: int(w/psx) }, () => 
    Array(int(h/psy)).fill(0)
    );

    // currPix = Array.from({ length: int(w/psx) }, () => 
    // Array(int(h/psy)).fill(0)
    // );
    totalText = join(lines, ' ');
	capture = createCapture(VIDEO,{ flipped:true });
	capture.hide();
    capture.size(w,h);
    createCanvas(w, h, WEBGL);
    
    background(255);
    textSize(1.8*s);
    textAlign(CENTER, CENTER);
    
    textFont(font);
    let d = pixelDensity();
    


    buf2 = createFramebuffer(options);
    buf2.begin();
    background(255);
    for (let y1 = 0; y1 < height; y1 += 1) {
        // Iterate from left to right.
        for (let x1 = 0; x1 < width; x1 += 1) {
            x = x1-s;
            y = y1-s
            // Scale the input coordinates.
            let nx = noiseScale * x1;
            let ny = noiseScale * y1;
            // let nt = noiseScale * frameCount;

            // Compute the noise value.
            noiseDetail(5, 0.78);
            let c = noiseLevel * noise(nx, ny);

            // Draw the point.
            stroke(c,c,c);
            point(x, y);
        }
    } 
    buf2.end();


    makeChars();    
    

}

function makeChars(){
    
    for (let i=firstC; i<=lastC; i++){
        let ch = String.fromCharCode(i);
        cmap[ch] = []
        for (let i = 0; i<intervals; i++){
        
            buf = createFramebuffer(options);
            buf.begin();

            blendMode(BLEND);
            background(255);
            let t = map(i, 0, intervals, high, low);
            fill(0);
            text(ch, 0, -s/2);
            
            filter(BLUR,0.5);
            blendMode(LIGHTEST);
            image(buf2,cx,cy);



            filter(BLUR,3.8);
            
            blendMode(MULTIPLY);
            tint(255, 10);
            image(buf2,cx,cy,s2*10,s2*10);
            tint(255,255);
            filter(THRESHOLD,t)


            buf.end();
            cmap[ch].push(buf);
            // chars.push(buf);
        }
        
        blendMode(BLEND);
    }
}

function draw(){
    count = (count+1)%4;
    if (count == 0)
        fs = (fs+1)%totalText.length;
    capture.loadPixels();
    let pix = capture.pixels;
    background(255);
    // image(capture, left, up, width, height);
    
    // console.log(cmap);
    fill(0);

    let m = constrain(mouseX,-s,s)
    let t = int(map(m, -s, s, 0, intervals-1));
    // image(buf2,cx,cy);

    // image(cmap[c][t],cx,cy);
    // text(c, 0, 0);
    let idx = fs;
    
    // console.log(mouseX,mouseY);
    let cols = int(capture.height/psy);
    let rows = int(capture.width/psx);
    for (let i=0; i<cols; i+=1){
        for (let j=0; j<rows; j+=1) {
            // if (pastMoves.length>=100){
            //         let oldest = pastMoves[0];
            //         mouseMoves[oldest[0]][oldest[1]] = false;
            //         pastMoves.shift();
            //         // console.log(oldest);
            //     }
            let py = i*psy;
            let px = j*psx;
            // let pyy = i*psx;
            
			let index = (py*capture.width + px)*4;
			let r = pix[index+0]; // red byte
			let g = pix[index+1]; // green byte
			let b = pix[index+2]; // blue byte

            let av = (r+g+b)/3
            // currPix[i][j] = av;
            if (abs(pastPix[i][j]-av)>100){
                mouseMoves[i][j] = true;
                pastMoves.push([i,j]);
            }
            t = int(map(av, 0, 255, 0, intervals-1));

            noStroke();
			fill(color(r,g,b));
            // square(px-right,py-bot,ps);


			// if (mouseX >= px && mouseX < px+psc && mouseY >= py && mouseY < py+psc){
            //     // square(px-right,py-bot,ps);
            //     // console.log(mouseMoves);
            //     mouseMoves[i][j] = true;

            //     pastMoves.push([i,j]);

                
            // }
            
			// blendMode(BLEND);
			// square(px-right,py-bot,ps);
            blendMode(MULTIPLY);
            let rx = random(-0.5,0.5);
            let ry = random(-1,1);
            let currChar = totalText[idx];
            if (j<rows-1 && mouseMoves[i][j+1]){
                mouseMoves[i][j] = true;
                pastMoves.push([i,j]);
            }
            if (mouseMoves[i][j]){
                let rc = random(firstC,lastC);
                let ch = String.fromCharCode(rc);
                currChar = ch;

                let rdel = int(random(0,2));
                if (rdel == 0){
                    mouseMoves[i][j] = false;
                }
                t = int(random(0,intervals-1));
            }

            // for (let i=0;i<mouseMoves.length;i++){
            //     if (mouseMoves[i] == (px,py)){
            //         console.log("BSDKLFKDFKD");
            //         currChar = "5";
            //     }
            // }

            // console.log(mouseMoves);
            if (currChar!= " ")
            
                image(cmap[currChar][t],px-right+rx,py-bot+ry,psc,psc);
			
			idx+=1;

            pastPix[i][j] = av;
		}

    }
    
}

function keyTyped() {
    c = key;
}