
class SelectPhotoSize{
	constructor(_image=""){
		this.canvas = document.getElementById('select_photo_size');
		this.ctx = this.canvas.getContext("2d");
		this.canvas_rect = this.canvas.getBoundingClientRect();
		this.w = this.canvas.offsetWidth;
		this.h = this.canvas.offsetHeight;
		this.img = new Image();
		this.img.src = _image;
		this.imgX=0;
		this.imgY=0;
		this.box={
			x:0,
			y:0,
			w:0,
			h:0,
			x1:0,
			y1:0,
		};
		this.selected={
			x:0,
			y:0,
			w:0,
			h:0,
			cx:0,
			cy:0,
		};

		this.selected_update={};

		this.stretch={
			'tl':{'x':0,'y':0},
			'tr':{'x':0,'y':0},
			'bl':{'x':0,'y':0},
			'br':{'x':0,'y':0},
			'cn':{'x':0,'y':0},
		};
		this.stretch_save={};
		this.radius=10;
		this.StretchLength=this.radius*2;
		this.minSize=this.StretchLength;
		this.CoverCanvas=false;
		this.move_box=false;
		this.aspect_ratio=0;
		this.mouse={
			'x':0,
			'y':0,
			'move':'',
			'move_box':false,
			'offsetX':0,
			'offsetY':0,
		};

		this.mouse_calc={
			'x':0,
			'y':0,
			'move':'',
			'move_box':false,
			'offsetX':0,
			'offsetY':0,
		};

		this.option={
			'corral':false,
		}

		this.onload = false;

		this.img.onload = ()=>{
			this.Load();
		};

	}


	Load(){
		
		this.imgX=this.w/2-this.img.width/2;
		this.imgY=this.h/2-this.img.height/2;
		this.box.x=this.imgX;
		this.box.y=this.imgY;
		this.box.x1=this.box.x+this.img.width;
		this.box.y1=this.box.y+this.img.height;
		this.box.w=this.img.width;
		this.box.h=this.img.height;

		this.PreparationAspectRatio();

		this.onload = true;

		
		this.SelectedUpdate();
		this.Draw();
		this.MouseController();
	}

	SelectedUpdate(){

		if(Object.entries(this.selected_update).length === 0){
			this.selected.x=this.box.x;
			this.selected.y=this.box.y;
			this.selected.w=this.box.w;
			this.selected.h=this.box.h;
		}else{
			this.selected={
				x:this.box.x+this.selected_update.x,
				y:this.box.y+this.selected_update.y,
				w:this.selected_update.w,
				h:this.selected_update.h,
				cx:0,
				cy:0,
			};
			this.selected_update={};
		}


		

		this.stretch.tl={'x':this.selected.x,'y':this.selected.y};
		this.stretch.tr={'x':this.selected.x+this.selected.w,'y':this.selected.y};
		this.stretch.bl={'x':this.selected.x,'y':this.selected.y+this.selected.h};
		this.stretch.br={'x':this.selected.x+this.selected.w,'y':this.selected.y+this.selected.h};
		this.stretch.cn={'x':this.selected.x+this.selected.w/2,'y':this.selected.y+this.selected.h/2};
	}




	Draw(){
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.drawImage(this.img, this.imgX, this.imgY);

		this.ctx.lineWidth = 1; 
		this.ctx.strokeStyle = 'white';
		this.ctx.strokeRect(this.selected.x, this.selected.y, this.selected.w, this.selected.h);

		this.ctx.fillStyle  = 'rgba(0, 0, 0, 0.4)';;

		if(this.CoverCanvas){
			this.ctx.fillRect(0,0,this.w,this.stretch.tl.y);
			this.ctx.fillRect(0,this.stretch.bl.y,this.w,this.h-this.stretch.bl.y);
			this.ctx.fillRect(0,this.stretch.tl.y,this.stretch.bl.x,this.stretch.bl.y-this.stretch.tl.y);
			this.ctx.fillRect(this.stretch.tr.x,this.stretch.tr.y,this.w-this.stretch.br.x,this.stretch.bl.y-this.stretch.tl.y);
		}else{
			this.ctx.fillRect(this.box.x,this.box.y,this.box.w,this.stretch.tl.y-this.box.y);
			this.ctx.fillRect(this.box.x,this.stretch.bl.y,this.box.w,this.box.y1-this.stretch.bl.y);
			this.ctx.fillRect(this.box.x,this.stretch.tl.y,this.stretch.bl.x-this.box.x,this.stretch.bl.y-this.stretch.tl.y);
			this.ctx.fillRect(this.stretch.tr.x,this.stretch.tr.y,this.box.x1-this.stretch.br.x,this.stretch.bl.y-this.stretch.tl.y);
		}
		
		if(this.move_box){
			this.CenterPoint();
		}
		

		for(let key in this.stretch){
			if(key=='cn')continue;
			this.Circle(this.stretch[key].x,this.stretch[key].y);
		}

		;
		
	}



	StretchPoint(x=0,y=0){
		this.StretchBox(x,y);
	}

	StretchBox(x=0,y=0){


		x-=this.StretchLength/2;
		y-=this.StretchLength/2;

		this.ctx.fillStyle = 'white'; 
		this.ctx.fillRect(x, y, this.StretchLength, this.StretchLength); 
		this.ctx.lineWidth = 1; 
		this.ctx.strokeStyle = 'black';
		this.ctx.strokeRect(x, y, this.StretchLength, this.StretchLength);
	}

	Circle(x=0,y=0){
		this.ctx.beginPath();
		this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = 'white';
		this.ctx.fill(); 
		this.ctx.lineWidth = 1; 
		this.ctx.strokeStyle = 'black'; 
		this.ctx.stroke();
	}

	CenterPoint(){
		this.ctx.beginPath();
		this.ctx.arc(this.stretch.cn.x, this.stretch.cn.y, this.radius, 0, 2 * Math.PI, false);
		this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
		this.ctx.fill(); 
		this.ctx.lineWidth = 1; 
		this.ctx.strokeStyle = 'black'; 
		this.ctx.moveTo(this.stretch.cn.x-this.StretchLength, this.stretch.cn.y);
		this.ctx.lineTo(this.stretch.cn.x+this.StretchLength, this.stretch.cn.y);
		this.ctx.moveTo(this.stretch.cn.x, this.stretch.cn.y-this.StretchLength);
		this.ctx.lineTo(this.stretch.cn.x, this.stretch.cn.y+this.StretchLength);
		this.ctx.stroke();
	}




	MouseController(){
		let t=this;
		this.canvas.addEventListener("mousedown", function(e){
			t.MouseDown(e);
		});
		this.canvas.addEventListener("mousemove", function(e){
			if(t.mouse.move!=''){
				t.MousePosition(e);
				t.MouseMove();
			}else{
				if(t.Collision(e)!=''){
					t.MouseStyle(true);
				}else{
					t.MouseStyle(false);
				}
			}
			
			
		});
		this.canvas.addEventListener("mouseup", function(e){
			t.mouse.move='';
		});

		this.canvas.addEventListener("mouseout", function(e){
			t.mouse.move='';
			t.MouseStyle(false);
		});
	}

	MouseDown(e){
		this.mouse.move=this.Collision(e);
		if(this.mouse.move!=''){
			this.mouse.offsetX=this.mouse.x-this.stretch[this.mouse.move].x;
			this.mouse.offsetY=this.mouse.y-this.stretch[this.mouse.move].y;
		}
	}

	MouseMove(){
		if(this.mouse.move=='')return false;

		this.stretch_save=JSON.parse(JSON.stringify(this.stretch));

		this.CalcMove();
		let Crossing=this.getCrossing();
		if(Crossing.x!=0 || Crossing.y!=0){
			if(Crossing.x!=0)this.mouse.x+=Crossing.x;
			if(Crossing.y!=0)this.mouse.y+=Crossing.y;
			this.stretch=JSON.parse(JSON.stringify(this.stretch_save));

			if(this.aspect_ratio>0 && this.mouse.move!='cn'){
				this.CalcMove(false);
			}else{
				this.CalcMove();
			}
			
		}


		if(this.option.corral)this.IntoCorral();

		if(this.CheckMinSize()){
			this.stretch=this.stretch_save;
			this.mouse.move='';
			this.MouseStyle(false);
		}

		this.selected={
			x:this.stretch.tl.x,
			y:this.stretch.tl.y,
			w:this.stretch.br.x-this.stretch.tl.x,
			h:this.stretch.br.y-this.stretch.tl.y,
		};

		this.stretch.cn={'x':this.selected.x+this.selected.w/2,'y':this.selected.y+this.selected.h/2};

		this.Draw();
	}


	CalcMove(_move=true){

		if(_move){
			this.stretch[this.mouse.move].x=this.mouse.x-this.mouse.offsetX;
			this.stretch[this.mouse.move].y=this.mouse.y-this.mouse.offsetY;
		}
		
		this.MoveAspectRatio();

		if(this.mouse.move=='tr' || this.mouse.move==''){
			this.stretch.tl.y=this.stretch.tr.y;
			this.stretch.br.x=this.stretch.tr.x;
		}

		if(this.mouse.move=='tl' || this.mouse.move==''){
			this.stretch.tr.y=this.stretch.tl.y;
			this.stretch.bl.x=this.stretch.tl.x;
		}

		if(this.mouse.move=='br' || this.mouse.move==''){
			this.stretch.tr.x=this.stretch.br.x;
			this.stretch.bl.y=this.stretch.br.y;
		}

		if(this.mouse.move=='bl' || this.mouse.move==''){
			this.stretch.tl.x=this.stretch.bl.x;
			this.stretch.br.y=this.stretch.bl.y;
		}

		if(this.mouse.move=='cn'){
			let BoxOffset={
				x:this.stretch_save.cn.x-this.stretch.cn.x,
				y:this.stretch_save.cn.y-this.stretch.cn.y
			}

			this.stretch.tl.x-=BoxOffset.x;
			this.stretch.tl.y-=BoxOffset.y;
			this.stretch.bl.x-=BoxOffset.x;
			this.stretch.bl.y-=BoxOffset.y;
			this.stretch.tr.x-=BoxOffset.x;
			this.stretch.tr.y-=BoxOffset.y;
			this.stretch.br.x-=BoxOffset.x;
			this.stretch.br.y-=BoxOffset.y;
		}
	}


	MoveAspectRatio(){
		if(this.mouse.move=='cn' || this.aspect_ratio==0)return false;


		let BoxSize={'w':0,'h':0};

		if(this.mouse.move=='tl'){
			BoxSize.w=this.stretch.br.x-this.stretch.tl.x;
			BoxSize.h=this.stretch.br.y-this.stretch.tl.y;
			BoxSize=this.CalcAspectRatio(BoxSize);
			this.stretch.tl.x=this.stretch.br.x-BoxSize.w;
			this.stretch.tl.y=this.stretch.br.y-BoxSize.h;
		}

		if(this.mouse.move=='tr'){
			BoxSize.w=this.stretch.tr.x-this.stretch.bl.x;
			BoxSize.h=this.stretch.bl.y-this.stretch.tr.y;
			BoxSize=this.CalcAspectRatio(BoxSize);
			this.stretch.tr.x=this.stretch.bl.x+BoxSize.w;
			this.stretch.tr.y=this.stretch.bl.y-BoxSize.h;
		}

		if(this.mouse.move=='bl'){
			BoxSize.w=this.stretch.tr.x-this.stretch.bl.x;
			BoxSize.h=this.stretch.bl.y-this.stretch.tr.y;
			BoxSize=this.CalcAspectRatio(BoxSize);
			this.stretch.bl.x=this.stretch.tr.x-BoxSize.w;
			this.stretch.bl.y=this.stretch.tr.y+BoxSize.h;
		}

		if(this.mouse.move=='br'){
			BoxSize.w=this.stretch.br.x-this.stretch.tl.x;
			BoxSize.h=this.stretch.br.y-this.stretch.tl.y;
			BoxSize=this.CalcAspectRatio(BoxSize);
			this.stretch.br.x=this.stretch.tl.x+BoxSize.w;
			this.stretch.br.y=this.stretch.tl.y+BoxSize.h;
		}



	}

	CalcAspectRatio(BoxSize={}){
		let len=0;
		if(this.aspect_ratio==1){
			len=(BoxSize.w+BoxSize.h)/2;
			BoxSize.w=len;
			BoxSize.h=len;
		}else{
			BoxSize.w=BoxSize.h*this.aspect_ratio;
		}

		return BoxSize;
	}


	getCrossing(){
		let crossing={'x':0,'y':0};

		for(let key in this.stretch){
			if(key=='cn')continue;
			if(this.stretch[key].x<this.box.x){
				crossing.x=this.box.x-this.stretch[key].x;
			}

			if(this.stretch[key].x>this.box.x1){
				crossing.x=this.box.x1-this.stretch[key].x;
			}

			if(this.stretch[key].y<this.box.y){
				crossing.y=this.box.y-this.stretch[key].y;
			}

			if(this.stretch[key].y>this.box.y1){
				crossing.y=this.box.y1-this.stretch[key].y;
			}
		}

		return crossing;
	}

	IsVerge(){
		for(let key in this.stretch){
			if(key=='cn')continue;
			if(this.stretch[key].x<this.box.x){
				return false;
			}

			if(this.stretch[key].x>this.box.x1){
				return false;
			}

			if(this.stretch[key].y<this.box.y){
				return false;
			}

			if(this.stretch[key].y>this.box.y1){
				return false;
			}
		}
		

		return true;

	}


	IntoCorral(){

		if(this.stretch.tl.x<this.box.x || this.stretch.bl.x<this.box.x){
			this.stretch.tl.x=this.box.x;
			this.stretch.bl.x=this.box.x;
		}

		if(this.stretch.tl.y<this.box.y || this.stretch.tr.y<this.box.y){
			this.stretch.tl.y=this.box.y;
			this.stretch.tr.y=this.box.y;
		}

		if(this.stretch.tr.x>this.box.x1 || this.stretch.br.x>this.box.x1){
			this.stretch.tr.x=this.box.x1;
			this.stretch.br.x=this.box.x1;
		}

		if(this.stretch.bl.y>this.box.y1 || this.stretch.br.y>this.box.y1){
			this.stretch.bl.y=this.box.y1;
			this.stretch.br.y=this.box.y1;
		}
	}


	AspectRatio(_value=0){
		this.aspect_ratio=_value;
		if(this.onload){
			this.PreparationAspectRatio();
			this.Draw();
		}
		
	}

	PreparationAspectRatio(){
		if(this.aspect_ratio==0)return false;

		let x=0;
		let y=0;
		let w=0;
		let h=0;
		let len=0;
		if(this.aspect_ratio==1){
			
			if(this.box.w>this.box.h){
				len=this.box.h;
			}else{
				len=this.box.w;
			}
			x=this.box.w/2-len/2;
			y=this.box.h/2-len/2;
			this.setSelected(x,y,len,len);
		}else{
			w=this.box.w;
			h=w/this.aspect_ratio;
			y=(this.box.h-h)/2;
			if(h>this.box.h){
				h=this.box.h;
				w=h*this.aspect_ratio;
				y=0;
				x=(this.box.w-w)/2;
			}
			this.setSelected(x,y,w,h);
		}


	}

	CheckMinSize(){
		if(this.stretch.tr.x-this.stretch.tl.x<=this.minSize){
			return true;
		}

		if(this.stretch.br.y-this.stretch.tr.y<=this.minSize){
			return true;
		}
		return false;
	}


	Collision(e){
		this.MousePosition(e);
		for(let key in this.stretch){
			if(!this.move_box && key=='cn')continue;
			if(this.Distance(this.mouse,this.stretch[key])<=this.StretchLength){
				return key;
			}
		}
		return '';
	}




	MousePosition(e){
		this.mouse.x=e.pageX - this.canvas_rect.left;
		this.mouse.y=e.pageY - this.canvas_rect.top;
		return this.mouse;
	}

	MouseStyle(_move=true){
		if(_move){
			this.canvas.style.cursor="move";
		}else{
			this.canvas.style.cursor="default";
		}
	}





	Distance(obj1, obj2) {
	  let deltaX = obj2.x - obj1.x;
	  let deltaY = obj2.y - obj1.y;
	  return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}

	getSelected(){
		this.IntoCorral();
		return {
			'x':this.selected.x-this.box.x,
			'y':this.selected.y-this.box.y,
			'w':this.selected.w,
			'h':this.selected.h,
		}
	}


	setSelected(x=0,y=0,w=0,h=0){
		if(x<0 || y<0 || w>this.w || h>this.h || w<this.minSize || h<this.minSize ) return false;
		this.selected_update={
			'x':x,
			'y':y,
			'w':w,
			'h':h,
		};
		if(this.onload){
			this.SelectedUpdate();
			this.Draw();
		}
		return true;
	}

	MoveBox(_value=true){
		this.move_box=_value;
	}
	

	setMinSize(_value=20){
		this.minSize=_value;
	}

	setCoverCanvas(_value=true){
		this.CoverCanvas=_value;
	}


	Update(){
		if(!this.onload)return false;
		this.Draw();
	}

	
	setOption(_name='',_value=''){
		this.option[_name]=_value;
	}

	

}


