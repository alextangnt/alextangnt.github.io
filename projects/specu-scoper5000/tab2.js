// mode 0 is mini
// mode 1 is big


class Planet {
	constructor(name, r, img,atm,cx,cy,spec){
		this.spec = spec;
		this.name = name;
		this.planetMode = 0;
		this.image = img;
		this.cx = cx;
		this.cy = cy;
		this.realSize = r;
		// this.result = 0;
		
		this.s = new Sprite();
		this.s.collider = "none";
		this.s.diameter = r;
		this.s.x = cx;
		this.s.y=cy;
		this.s.draw = () => {
			if (this.planetMode!=2){
				let t = millis();
				push();
				translate(-width/2,-height/2)
				noStroke();
				fill("rgba(255, 255, 255,0.25)");

				push();
				rotate(this.s.direction);
				// imageMode(CENTER);
				// image(img, 0, 0, r + this.s.speed, r - this.s.speed);
				ellipse(0, 0, this.s.diameter + this.s.speed*(this.s.diameter/600), this.s.diameter - this.s.speed*(this.s.diameter/600),50);
				pop();

				image(img, this.s.vel.x * 2, this.s.vel.x * 2,this.s.diameter,this.s.diameter);

				push();
				rotate(t/60);
				blendMode(ADD);
				image(atm, this.s.vel.x * 2, this.s.vel.x * 2,1.1*this.s.diameter,1.1*this.s.diameter);
				pop();

				pop();
			}
			// else {
			// 	this.cx = this.s.x;
			// 	this.cy = this.s.y;
			// 	this.s.x = 2000;
			// 	this.s.y = 1000;
			// }
		};
		
		this.s.update = () => {
			if (this.planetMode==0){
				
				this.s.direction = -90-atan2(mouseX-width/2,mouseY-height/2);
				this.s.speed = dist(mouseX,mouseY,width/2,height/2)/200;
				this.cx = this.s.x;
				this.cy = this.s.y;
			}
			else if (this.planetMode == 1)
			{
				this.s.moveTowards(width/2, height/2.4, 0.07);
			}
			else if (this.planetMode == 2)
			{
				this.s.sleeping = true
			}
		};
	}
	zoomIn(){
			this.planetMode = 1
			this.cx = this.s.x;
			this.cy = this.s.y;
			this.s.diameter=450;
	}
	zoomOut(){
			this.s.sleeping = false
			this.planetMode = 0
			this.s.diameter=this.realSize;
	}
	return(){
		//print("returning");
		this.planetMode = 0
		this.s.sleeping = false
		this.s.x = this.cx;
		this.s.y = this.cy;
	}

}