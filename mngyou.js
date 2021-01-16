var MngYou = {};

MngYou.Game = function(x,y,width,height){
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 800;
	this.height = height || 600;
	var obj = document.createElement('div');
	obj._type = 'game';
	obj.style.position = "absolute"
	obj.style.width = width + 'px';
	obj.style.height = height + 'px';
	obj.style.backgroundColor = 'black';
	obj.style.overflow = 'hidden';
	obj.id = obj._type;
	obj.originalSize = [width,height];
	this.GM = obj;
	obj.select = false;
	document.body.appendChild(obj);
	document.body.onselectstart = function(){
		return obj.select;//禁止选中元素\无法启用编辑属性 当文本需要编辑 改变返回值为true
	}
	this.add();
	this.keyboard();
	this.state();
	this.rnd();
	this.scaleManager();
	this.fullScreen();
	this.code();
	this.background();
	this.tween();
	this.world();
	this.world.init(this.x,this.y,this.width,this.height);
	// this.lostFocusStop();
	// this.focusPlay();
	OP(obj,'width');
	OP(obj,'height');
	return this;
}

/*
	rnd: 随机数
*/
MngYou.Game.prototype.rnd = function(){
	/*
		between: 两者之间
		under: 下限(最小数)
		over: 上限(最大数)
	*/
	this.rnd.between = function(under,over){
		return parseInt(Math.random()*(over-under+1) + under)
	}
}
/*
	tween: 缓动动画
*/
MngYou.Game.prototype.tween = function(){
	this.tween.to = function(obj,json,time,mc,callBack){
		return move(obj,json,time,mc,callBack);
	}
}
/*
	code: 代码相关操作
*/
MngYou.Game.prototype.code = function(){
	/*
		execute: 执行
		callback: 回调函数
		times: 次数
	*/
	this.code.execute = function(callback,times){
		for (var i = 0; i < times; i++) {
			callback();
		}
	}
}
/*
	fullScreen:全屏模式
*/
MngYou.Game.prototype.fullScreen = function(){
	/*
		launch: 启动器
		dom: viewport Dom || dcument.documentElement
	*/
	this.fullScreen.launch = function(dom){//dom元素 div document.documentElement(文档)
		dom.on('click',function(){
			if (dom.requestFullScreen){
				dom.requestFullScreen();
			} else if(dom.mozRequestFullScreen){
				dom.mozRequestFullScreen();
			} else if (dom.webkitRequestFullScreen){
				dom.webkitRequestFullScreen();
			} else if (dom.msRequestFullScreen){
				dom.msRequestFullScreen();
			}
		});
		return this;
	}
	/*
		exit:退出全屏模式
		只能在document上退出
	*/
	this.fullScreen.exit = function(){
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullscreen) {
			document.mozCancelFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen
		}
		return this;
	}
}
MngYou.Game.prototype.background = function(){
	this.background.setScroll = function(bgObj,scrollSpeed){
		return setScroll(bgObj,scrollSpeed);
	}
}
MngYou.Game.prototype.world = function(){
	this.world.init = function(x,y,width,height){
		return MngYou.World(x,y,width,height);
	}
	this.world.isExist = function(obj){
		if (obj.alive) {
			return true;
		} else {
			return false;
		}
	}
	this.world.collider = function(children,children_,callback){
		return this.overlap(children,children_,callback);//当碰撞时应回退
	}
	this.world.overlap = function(children,children_,callback){
		return overlap(children,children_,callback);
	}
	this.world.sleep = function(sec,callback){
		window.setTimeout(callback,sec);
	}
	this.world.setBounds = function(x1, y1, x2, y2){
		
	}
}
MngYou.Game.prototype.add = function(){
	this.add.audio = function(src){
		var obj = new Audio();
		obj.src = src;
		obj.setLoop = function(loop){//是否循环播放
			this.loop = loop;
		}
		return obj;
	}
	this.add.text = function(x,y,text,style,state){
		return MngYou.Text(x,y,text,style,state);
	}
	this.add.image = function(x,y,width,height,imageSrc,state){
		return MngYou.Image(x,y,width,height,imageSrc,state);
	}
	this.add.circle = function(x,y,width,height,imageSrc,state){
		return MngYou.Circle(x,y,width,height,imageSrc,state);
	}
	this.add.spritesheet = function(x,y,width,height,imageSrc,frameWidth,frameHeight,frameMax,row,columns,state){
		return MngYou.SpriteSheet(x,y,width,height,imageSrc,frameWidth,frameHeight,frameMax,row,columns,state);
	}
	this.add.tilesprite = function(x,y,width,height,imageSrc,state){
		return MngYou.TileSprite(x,y,width,height,imageSrc,state);
	}
	this.add.group = function(x,y,width,height,state){
		return MngYou.Group(x,y,width,height,state);
	}
}
MngYou.Game.prototype.keyboard = function(){
	// this.keyboard.addKey = function(){
	// 	document.on('keydown',function(e){
	// 		console.log(e.key);
	// 	});
	// }
	this.keyboard.addKeyDown = function(key,callback){
		document.on('keydown',function(e){
			console.log(e.key);
			if (e.key==key) {
				callback();
			}
		});
	}
	this.keyboard.addKeyUp = function(key,callback){
		document.on('keyup',function(e){
			console.log(e.key);
			if (e.key==key) {
				callback();
			}
		});
	}
}
MngYou.Game.prototype.state = function(){
	this.state.add = function(state,isVisible){
		return MngYou.Scene(state,isVisible);
	}
	this.state.stop = function(state){
		state.setVisible(false);
	}
	this.state.start = function(state){
		state.setVisible(true);
	}
}

/*
	scaleManager: 缩放管理
	setAll:所有游戏对象
*/
MngYou.Game.prototype.scaleManager = function(){
	this.scaleManager.setAll = function(){
		//游戏适配变量
		var scaleX = document.body.offsetWidth / 800;
		var scaleY = window.innerHeight / 600;
		// var scaleX = 1;
		// var scaleY = 1;
		// console.log('scaleX:' + scaleX + ',scaleY:' + scaleY);
		var div = document.getElementsByTagName('div');
		for (var i = 0; i < div.length; i++) {
			// div[i].setScale(scaleX,scaleY);
			//if (div[i]._type=='sprite') {break;}//当对象类型是精灵时跳过 会导致瓦片地图不被缩放 在resetgamesaize设置
			div[i].width = div[i].originalSize[0] * scaleX;
			div[i].height = div[i].originalSize[1] * scaleY;
		}
		// console.log(document.getElementsByTagName('span').length);
		return this;
	}
}

// MngYou.Game.prototype.text = function(x,y,text,style){
// 	return MngYou.Text(x,y,text,style);
// };

MngYou.World = function(x,y,width,height){
	this.x = x || 0;
	this.y = y || 0;
	this.width = width || 800;
	this.height = height || 600;
	this.centerX = this.width / 2;
	this.centerY = this.height / 2;
	return this;
}

/*
	Scene: 场景对象
	state: 创建的场景
	isVisible： 是否显示
*/
MngYou.Scene = function(state,isVisible){
	var obj = document.createElement('div');
	obj._type = 'scene';
	obj.style.position = "absolute"
	obj.style.width = this.width + 'px';
	obj.style.height = this.height + 'px';
	obj.style.backgroundColor = 'black';
	obj.style.overflow = 'hidden';
	obj.id = state;
	obj.alive = true;
	//obj.id = obj._type;
	game.appendChild(obj);
	obj.setVisible(isVisible);
	return obj;
}

/*
	Text: 文本对象
	x: 横坐标
	y:纵坐标
	text: 文本
	style: 文本样式
	state: 父级场景
*/
MngYou.Text = function(x,y,text,style,state){
	style = style || {fontSize:12,color:'white'};
	style.fontSize = style.fontSize || 12;
	style.color = style.color || 'white';
	var obj = document.createElement('span');
	obj._type = 'text';
	obj.id = obj._type;
	obj.alive = true;
	obj.scene = state || game;
	obj.style.position = "absolute";
	obj.style.left = x + 'px';
	obj.style.top = y + 'px';
	obj.style.fontSize = style.fontSize + 'px';
	obj.style.color = style.color;
	obj.innerText = text;
	obj.text = obj.innerText;
	obj.style.zIndex = 0;
	obj.scene.appendChild(obj);
	OP(obj,'x');
	OP(obj,'y');
	OP(obj,'width');
	OP(obj,'height');
	return obj;
}
/*
	Image: 图形对象
	x: 横坐标
	y:纵坐标
	width: 宽度
	height: 高度
	imageSrc: 图片源地址
	state: 父级场景
*/
MngYou.Image = function(x,y,width,height,imageSrc,state){//circle
	var obj = document.createElement('div');
	obj._type = 'image';
	obj.originalSize = [width,height];
	obj.id = obj._type;
	obj.alive = true;
	obj.scene = state || game;
	obj.x = x || 0;
	obj.y = y || 0;
	obj.width = width || 0;
	obj.height = height || 0;
	obj.imageSrc = imageSrc || '';
	obj.style.position = "absolute";
	obj.style.left = obj.x + 'px';
	obj.style.top = obj.y + 'px';
	obj.style.width = obj.width + 'px';
	obj.style.height = obj.height + 'px';
	// obj.style.backgroundColor = 'red';
	obj.style.backgroundImage = 'url(' + obj.imageSrc + ')';
	obj.style.backgroundSize = '100% 100%'; 
	obj.style.zIndex = 0;
	obj.scene.appendChild(obj);
	OP(obj,'x');
	OP(obj,'y');
	OP(obj,'width');
	OP(obj,'height');
	return obj;
}

/*
	Circle: 图形对象圆角化
	x: 横坐标
	y:纵坐标
	width: 宽度
	height: 高度
	imageSrc: 图片源地址
	scale: 圆角化百分比
	state: 父级场景
*/
MngYou.Circle = function(x,y,width,height,imageSrc,scale,state){//碰撞检测 判断圆形与矩形  圆形与点 圆形与圆形
	var obj = document.createElement('div');
	obj._type = 'circle';
	obj.originalSize = [width,height];
	obj.id = obj._type;
	obj.alive = true;
	obj.scene = state || game;
	obj.x = x || 0;
	obj.y = y || 0;
	obj.width = width || 0;
	obj.height = height || 0;
	obj.imageSrc = imageSrc || '';
	obj.style.position = "absolute";
	obj.style.left = obj.x + 'px';
	obj.style.top = obj.y + 'px';
	obj.style.width = obj.width + 'px';
	obj.style.height = obj.height + 'px';
	obj.style.backgroundImage = 'url(' + obj.imageSrc + ')';
	obj.style.backgroundSize = '100% 100%'; 
	obj.style.zIndex = 0;
	obj.style.borderRadius = '' + scale * 100 + '%' ;
	obj.scene.appendChild(obj);
	OP(obj,'x');
	OP(obj,'y');
	OP(obj,'width');
	OP(obj,'height');
	return obj;
}

/*
	SpriteSheet: 精灵集对象
	x: 横坐标
	y:纵坐标
	width: 宽度
	height: 高度
	imageSrc: 图片源地址
	frameWidth: 框架宽度
	frameHeight: 框架高度
	frameMax: 框架数目
	row: 行
	columns: 列
	state: 父级场景
*/
MngYou.SpriteSheet = function(x,y,width,height,imageSrc,frameWidth,frameHeight,frameMax,row,columns,state){
	var obj = document.createElement('div');
	obj._type = 'sprite';
	obj.originalSize = [width,height];
	obj.id = obj._type;
	obj.alive = true;
	obj.scene = state || game;
	obj.x = x || 0;
	obj.y = y || 0;
	obj.width = width || 0;
	obj.height = height || 0;
	obj.imageSrc = imageSrc || '';
	obj.frameWidth = frameWidth || obj.width;
	obj.frameHeight = frameHeight || obj.height;
	obj.frameMax = frameMax;
	obj.row = row;
	obj.columns = columns;
	obj.frame = 0;
	obj.i = 0;//列数计数器
	obj.r = 0;//行数计数器
	obj.h = 0;//第n行位移高度
	obj.rate = 10;//速率
	obj.loop = false;//循环
	obj.style.position = "absolute";
	obj.style.left = obj.x + 'px';
	obj.style.top = obj.y + 'px';
	obj.style.width = obj.width + 'px';
	obj.style.height = obj.height + 'px';
	// obj.style.backgroundColor = 'red';
	obj.style.backgroundImage = 'url(' + obj.imageSrc + ')';
	obj.style.zIndex = 0;
	obj.style.backgroundPosition = '0px 0px';
	obj.scene.appendChild(obj);
	OP(obj,'x');
	OP(obj,'y');
	OP(obj,'width');
	OP(obj,'height');
	OP(obj,'frame');
	return obj;
}

/*
	TileSprite: 瓦片精灵对象
	x: 横坐标
	y:纵坐标
	width: 宽度
	height: 高度
	imageSrc: 图片源地址
	state: 父级场景
*/
MngYou.TileSprite = function(x,y,width,height,imageSrc,state){// TileSprite.x外部 tilePosition.x内部
	var obj = document.createElement('div');
	obj._type = 'tilesprite';
	obj.originalSize = [width,height];
	obj.id = obj._type;
	obj.alive = true;
	obj.scene = state || game;
	obj.x = x || 0;
	obj.y = y || 0;
	obj.width = width || 0;
	obj.height = height || 0;
	obj.imageSrc = imageSrc || '';
	obj.style.position = "absolute";
	obj.style.left = this.x + 'px';
	obj.style.top = this.y + 'px';
	obj.style.width = this.width + 'px';
	obj.style.height = this.height + 'px';
	obj.style.backgroundColor = 'red';
	obj.style.backgroundImage = 'url(' + obj.imageSrc + ')';
	obj.style.backgroundSize = '100% 100%'; 
	obj.style.backgroundRepeat = 'repeat'; 
	obj.style.backgroundPosition = '0.1px 0.1px'; 
	obj.style.zIndex = 0;
	obj.scene.appendChild(obj);
	OP(obj,'x');
	OP(obj,'y');
	OP(obj,'tilePositionX');
	OP(obj,'tilePositionY');
	OP(obj,'width');
	OP(obj,'height');
	return obj;
}

/*
	Group: 组对象
	x: 横坐标
	y:纵坐标
	width: 宽度
	height: 高度
	state: 父级场景
*/
MngYou.Group = function(x,y,width,height,state){
	var obj = document.createElement('div');
	obj._type = 'group';
	obj.originalSize = [width,height];
	obj.id = obj._type;
	obj.alive = true;
	obj.scene = state || game;
	obj.style.position = "absolute";
	obj.style.left = x + 'px';
	obj.style.top = y + 'px';
	obj.style.width = width + 'px';
	obj.style.height = height + 'px';
	obj.style.backgroundColor = 'red';
	obj.style.zIndex = 0;
	obj.scene.appendChild(obj);
	return obj;
}
/*
	setScale: 对象比例缩放
	x: 横坐标比例
	y: 纵坐标比例
*/
Object.prototype.setScale = function(x,y){
	this.width *= x;
	this.height *= y;			
	return this;
}
/*
	setDisplaySize: 设置百分百显示区域
	width： 显示宽度
	height: 显示高度
*/
Object.prototype.setDisplaySize = function(width,height){			
	this.width = width;
	this.height = height;
	return this;
}
/*
	getWidth: 获取宽度
*/
Object.prototype.getWidth = function(){			
	return this.offsetWidth;
}
/*
	setWidth: 设置宽度
*/
Object.prototype.setWidth = function(width){			
	width = width || 0;
	this.style.width = width + 'px';
	return this;
}
/*
	getHeight: 获取高度
*/
Object.prototype.getHeight = function(){			
	return this.offsetHeight;
}
/*
	setHeight: 设置高度
*/
Object.prototype.setHeight = function(height){			
	height = height || 0;
	this.style.height = height + 'px';
	return this;
}
/*
	getX： 获取左边距
*/
Object.prototype.getX = function(){			
	return this.offsetLeft;
}
/*
	setX： 设置左边距
*/
Object.prototype.setX = function(x){
	x = x || 0;
	this.style.left = x + 'px';
	return this;
}
/*
	getY： 获取顶边距
*/
Object.prototype.getY = function(){			
	return this.offsetTop;
}
/*
	setY： 设置顶边距
*/
Object.prototype.setY = function(y){
	y = y || 0;
	this.style.top = y + 'px';
	return this;
}
/*
	getText: 获取文本
*/
Object.prototype.getText = function(){		
	return this.innerText;
}
/*
	setText: 修改文本
*/
Object.prototype.setText = function(text){	
	text = text || '';
	this.innerText = text;
	return this;
}
/*
	getImage: 获取图像
*/
Object.prototype.getImage = function(){		
	return this.style.backgroundImage;
}
/*
	setImage： 修改图像
*/
Object.prototype.setImage = function(image){	
	image = image || '';
	this.style.backgroundImage = 'url(' + image + ')';
	return this;
}
/*
	getTextStyle： 获取字体样式表
*/
Object.prototype.getTextStyle = function(){		
	var style = {};
	style.fontSize = this.style.fontSize;
	style.color = this.style.color;
	return style;
}
/*
	setTextStyle： 修改字体样式表
*/
Object.prototype.setTextStyle = function(style){	
	style = style || {fontSize:12,color:'white'};
	style.fontSize = style.fontSize || 12;
	style.color = style.color || 'white';
	this.style.fontSize = style.fontSize + 'px';
	this.style.color = style.color;
	return this;
}
/*
	getbgColor： 获取背景颜色
*/
Object.prototype.getBgColor = function(){			
	return this.style.backgroundColor;
}
/*
	setbgColor： 修改背景颜色
*/
Object.prototype.setBgColor = function(color){			
	this.style.backgroundColor = color;
	return this;
}
/*
	getZindex： 获取层级关系
*/
Object.prototype.getZindex = function(){			
	return this.style.zIndex;
}
/*
	setZindex： 设置堆叠顺序
*/
Object.prototype.setZindex = function(zIndex){	
	this.style.zIndex = zIndex;
	return this;
}
/*
	getAlpha： 获取透明度
*/
Object.prototype.getAlpha = function(){
	return this.style.opacity;
}
/*
	setAlpha： 设置透明度
*/
Object.prototype.setAlpha = function(alpha){
	this.style.opacity = alpha;
	return this;
}
/*
	getVisible: 获取对象可见性
*/
Object.prototype.getVisible = function(){
	if (this.getAlpha() > 0) {
		return true;
	} else {
		return false;
	}
}
/*
	setVisible: 设置对象可见性
*/
Object.prototype.setVisible = function(boolean){
	this.boolean = boolean || false;
	if (this.boolean == true) {
		this.setAlpha(1);
	} else {
		this.setAlpha(0);
	}
	return this;
}
/*
	addScrollKey:添加按键进行相应的背景滚屏
*/
Object.prototype.addScrollKey = function(key,scrollSpeed){
	var bgObj = this;
	document.on('keydown',function(e){
		if (e.key==key) {
			var tP_ = scrollSpeed;//滚屏速度
			bgObj.tilePositionY += tP_;
		}
	});
	document.on('keyup',function(e){
		if (e.key==key) {
			setScroll(bgObj,scrollSpeed);
		}
	});
	//index.js中调用方法
	// game.keyboard.addKeyDown('ArrowUp',function(){
	// 	var tP_ = 10;//滚屏速度
	// 	bgObj.tilePositionY += tP_;
	// });
	// game.keyboard.addKeyUp('ArrowUp',function(){
	// 	var tP_ = 10;//滚屏速度
	// 	var i = 0,dt = 0;
	// 	var id = setInterval(function(){
	// 		dt++;
	// 		if (dt%10==0) {
	// 			tP_--;
	// 			if (tP_<=0) {
	// 				tP_ = 0;
	// 			}
	// 		}
	// 		if (i==60) {clearInterval(id)}
	// 		bgObj.tilePositionY += tP_;
	// 		i++;
	// 	},60);
	// });
}
/*
	tilesprite.autoScroll: 自动化背景移动(视差特效)
	_x: 横坐标
	_y: 纵坐标
*/
Object.prototype.autoScroll = function(_x,_y){//tilePosition
	this._tilePositionX = _x || 0;
	this._tilePositionY = _y || 0;
	var i = 0;
	var that = this;
	this.update(function(){
		if (that.runner==false) {return false;}//游戏暂停flag
		i++;
		that.style.backgroundPosition = that._tilePositionX * i + 'px' + ' ' + that._tilePositionY * i + 'px';
	},60);
	return this;
}
/*
	group.setAll: 设置全部子级
*/
Object.prototype.setAll = function(attribute,value,callback){
	if (attribute=='visible') {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].setVisible(value);
		}
	}
	if (attribute=='drag') {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].dragEnable();
		}
	}
	if (attribute=='overlap') {
		for (var i = 0; i < this.children.length; i++) {
			overlap(this.children[i],value,callback);
		}
	}
}
/*
	group.add: 添加元素到对象(组)
*/
Object.prototype.add = function(children,lastChild){
	if (lastChild) {
		this.appendChild(children,lastChild);//组中末尾追加元素
		return this;
	}
	this.appendChild(children);//一般式
	return this;
}
/*
	group.getChildAt: 获取子元素(组内成员)
*/
Object.prototype.getChildAt = function(index){
	this.getChildAt = this.children;
	return this.getChildAt[index];
}
/*

	cloneSelf: 克隆自身
	deep: 克隆深度 : true 克隆自身以及子内容 || false(默认) 只克隆本身
	rem: 注解: 克隆返回的对象为DOM对象非MngYou对象只能进行DOM操作
*/
Object.prototype.cloneSelf = function(deep){
	this.deep = deep || false;
	var newNode = this.cloneNode(this.deep);
	this.parentNode.appendChild(newNode);
	return newNode;
}
/*
	preload: 游戏资源预加载
	callback:回调函数
*/
Object.prototype.preload = function(callback){
	return callback();
}
/*
	create: 创建游戏元素
	callback:回调函数
*/
Object.prototype.create = function(callback){
	return callback();
}
/*
	update: 游戏逻辑更新
	callback:回调函数
	sec: 时间间隔(单位毫秒计)
*/
Object.prototype.update = function(callback,sec){
	return setInterval(callback,sec);
}
/*
	killTimer: 移除掉定时器
	id: 目标定时器
*/
Object.prototype.killTimer = function(id){			
	clearInterval(id);
	return this;
}
/*
	destroy: 销毁对象
*/
Object.prototype.destroy = function(){
	this.alive = false;
	this.parentNode.removeChild(this);
}
/*
	velocity: 物理速度
	style: 速度数组
*/
Object.prototype.velocity = function(style){
	this.velocityX = style.velocityX || 0;
	this.velocityY = style.velocityY || 0;
	if (style.velocityY==0) {this.velocityY = 0;}
	this.launch = style.launch || false;
	this.velocityX = this.velocityX/10;
	this.velocityY = this.velocityY/10;
	var that = this;
	var id = this.update(function(){
		if (that.runner==false) {return false;}//游戏暂停flag
		if (!that.launch) {return false;}
		that.style.top = that.offsetTop + that.velocityY + 'px';
		that.style.left = that.offsetLeft + that.velocityX + 'px';
		if (that.offsetTop > game.offsetHeight) {
			that.killTimer(id);
			that.alive = false;
			that.destroy();
		}
		if (that.x + that.width < 0) {
			that.killTimer(id);
			that.alive = false;
			that.destroy();
		}
	},60)
	return this;
}
/*
	gravity: 物理重力
	style: 重力数组
*/
Object.prototype.gravity = function(style){
	this.valueX = style.valueX || 0;
	this.valueY = style.valueY || 0;
	if (style.valueY==0) {this.valueY = 0;}
	this.launch = style.launch || false;
	this.Gx = this.valueX/100;
	this.Gy = this.valueY/100;		
	this.dt = 0;
	var that = this;
	var id = this.update(function(){
		if (that.runner==false) {return false;}//游戏暂停flag
		if (!that.launch) {return false;}	
		that.dt++;
		that.style.top = that.offsetTop + that.dt*that.Gy + 'px';
		that.style.left = that.offsetLeft + that.dt*that.Gx + 'px';
		if (that.offsetTop > game.offsetHeight) {
			that.dt = 0;
			that.killTimer(id);
			that.alive = false;
			that.destroy();
		}
		if (that.x + that.width < 0) {
			that.dt = 0;//此处需要初始化dt 防止重力累加
			that.killTimer(id);
			that.alive = false;
			that.destroy();
		}
	},60)
	return this;
}
/*
	on: 事件绑定
	event: 事件类型
	callback: 回调函数
*/
Object.prototype.on = function(event,callback){
	// var isIE = (window.navigator.userAgent.indexOf('IE')==-1)?false:true;
	// if (isIE) {
	// 	return this.attachEvent('on' + event,callback)
	// }else{
	// 	return this.addEventListener(event,callback,false);
	// }
	/*
	 * addEventListener:监听Dom元素的事件
	 *
	 * target：监听对象
	 * type：监听函数类型，如click,mouseover
	 * func：监听函数
	 */
	 addEventHandler(this,event,callback);
	 function addEventHandler(target,type,func){
	 	if(target.addEventListener){
		  //监听IE9，谷歌和火狐
		  target.addEventListener(type, func, false);
		}else if(target.attachEvent){
			target.attachEvent("on" + type, func);
		}else{
			target["on" + type] = func;
		}
	}
}
/*
	out: 移除事件绑定
	event: 事件类型
	callback: 回调函数
*/
Object.prototype.out = function(event,callback){
	// this.removeEventListener(event,callback,false);
	/*
	* removeEventHandler:移除Dom元素的事件
	*
	* target：监听对象
	* type：监听函数类型，如click,mouseover
	* func：监听函数
	*/
	removeEventHandler(this,event,callback);
	function removeEventHandler(target, type, func) {
	 	if (target.removeEventListener){
		  //监听IE9，谷歌和火狐
		  target.removeEventListener(type, func, false);
		} else if (target.detachEvent){
			target.detachEvent("on" + type, func);
		}else {
			delete target["on" + type];
		}
	}
}
/*
	editEnable: 激活对象编辑状态
*/
Object.prototype.editEnable = function(){
	var text = this;
	text.on('click',function(){
		text.parentNode.select = true;//双击编辑文本
		text.setAttribute("contenteditable", "true");
	});
	text.on('blur',function(){
		text.parentNode.select = false;
		text.setAttribute("contenteditable", "false");
	});
}
/*
	lostFocusStop: 失去焦点游戏暂停
*/
Object.prototype.lostFocusStop = function(){
	var that = this;
	window.on('blur',function(){
		that.paused();
	});
}
/*
	focusPlay: 获取焦点游戏播放
*/
Object.prototype.focusPlay = function(){
	var that = this;
	window.on('focus',function(){
		that.resume();
	});
}
/*
	paused: 游戏暂停
*/
Object.prototype.paused = function(){
	console.log('游戏暂停');
	//给所有元素flag runner执行 在所有update中return
	var div = document.getElementsByTagName('*');
	for (var i = 0; i < div.length; i++) {
		div[i].runner = false;
	}
}
/*
	resume: 游戏恢复
*/
Object.prototype.resume = function(){
	console.log('游戏恢复');
	//给所有元素flag runner执行 在所有update中return
	var div = document.getElementsByTagName('*');
	for (var i = 0; i < div.length; i++) {
		div[i].runner = true;
	}
}
/*
	dragEnable: 启动对象拖拽
*/
Object.prototype.dragEnable = function(){
	this.on('mousedown',function(e){
		this._x = e.clientX - parseInt(this.x);
		this._y = e.clientY - parseInt(this.y);
		this.parentNode.on('mousemove',mouseMove);
		this.parentNode.on('mouseup',function(){
			this.out('mousemove',mouseMove);
		});
	});
	var that = this;
	function mouseMove(e){
		that.x = e.clientX - that._x;
		that.y = e.clientY - that._y;
	}
	return this;
}
/*
	animsAllPlay: 播放精灵动画(ALL)
	rate: 播放速率
	loop: 是否循环播放
*/
Object.prototype.animsAllPlay = function(rate,loop){
	this.rate = rate || this.rate;
	this.loop = loop || this.loop;
	var sprite = this;
	var dt = 0;
	sprite.update(function(){
		if (sprite.runner==false) {return false;}//游戏暂停flag
		if (sprite.isPlay==false) {
			return false;
		}
		dt++;
		if (dt % sprite.rate == 0) {
			++sprite.i;
			if (sprite.i==sprite.columns) {
				sprite.r++;
				sprite.h = sprite.frameHeight * sprite.r;	
			}
			if (sprite.i==sprite.frameMax) {
				sprite.i = 0;
				sprite.r = 0;
				sprite.h = 0;
				sprite.isPlay = sprite.loop;
			}
			sprite.style.backgroundPosition = -sprite.frameWidth * sprite.i + 'px ' + sprite.h +'px';
		}
	},60);
}
/*
	animsPlay: 播放帧序列动画
	ClassName： 1==指定帧序列进行播放 2==指定首尾帧序列进行播放
	rate: 播放速率
	loop: 是否循环播放
	array: 帧序列帧数数组
*/
Object.prototype.animsPlay = function(classNum,rate,loop,array){
	this.classNum = classNum || 1;
	if (this.classNum==1) {
		//array
		this.array = array;
	}else{
		//jason
		this.array = [];
		for (var i = 0; i < array.end - array.start + 1; i++) {
			this.array[i] = i + array.start;
			// console.log(this.array[i]);
		}
		// console.log(this.array);
	}
	this.rate = rate || 10;
	this.loop = loop || this.loop;
	//this.array = array;
	var sprite = this;
	var dt = 0;
	var j = 0;//遍历数组之索引
	sprite.update(function(){
		if (sprite.runner==false) {return false;}//游戏暂停flag
		if (sprite.isPlay==false) {
			return false;
		}
		if (sprite.i==sprite.array[sprite.array.length-1]) {
			sprite.i = 0;
			sprite.r = 0;
			sprite.h = 0;
			j = 0;
			sprite.isPlay = sprite.loop;
		}
		dt++;
		if (dt % sprite.rate == 0) {
			sprite.i = sprite.array[j];
			j++;

			sprite.frame = sprite.i;

			// if (sprite.i > sprite.columns - 1) {
				// sprite.r = 1;
			// }
			// if (sprite.i > Math.ceil(sprite.frameMax/sprite.row) * sprite.r + Math.ceil(sprite.frameMax/sprite.row) -1) {
			// 	sprite.r++;
			// }
			// if (sprite.i <= sprite.columns -1) {
			// 	sprite.r = 0;
			// }//目前只支持两行精灵图
/*			最终代码 to  obj.frame
			for (var i = 0; i < sprite.row; i++) {
				if (sprite.i >= sprite.columns * i) {
					//console.log('look at this:' + sprite.i + '.' + i);
					sprite.r = i;
				}
			}//支持多行
			sprite.h = sprite.frameHeight * sprite.r;	
			sprite.style.backgroundPosition = -sprite.frameWidth * sprite.i + 'px ' + sprite.h +'px';
			*/
		}
	},60);
}

/*
	originalSizePicture: 获取图像的原始尺寸
	callback: 回调函数 
*/
Object.prototype.originalSizePicture = function(callback){
	getImgNaturalDimensions(this,function(nWidth,nHeight){
		callback(nWidth,nHeight);
	});
}


function getImgNaturalDimensions(img, callback){ 
	var nWidth, nHeight 
	if (img.naturalWidth) { // 现代浏览器 (<img标签>)
		nWidth = img.naturalWidth 
		nHeight = img.naturalHeight 
	} else { // IE6/7/8 (获取图片原始尺寸的传统方法:将图片加载进img标签 img.width/height)
		var image = new Image();
		image.src = img.imageSrc; 
		image.onload = function() { 
			callback(image.width, image.height) //返回在此
		} 
	}
} 

//检测对象属性
function OP(o,p){
	Object.defineProperty(o, p, {
		get: function ()
		{
			if (p=='x') {
				return this.offsetLeft;
			}
			if (p=='y') {
				return this.offsetTop;
			}
	    	if (p=='tilePositionX') {//tileSprite.tilePosition.x
	    		return parseInt(this.style.backgroundPosition.split(" ")[0].split("px")[0]);
	    	}
	    	if (p=='tilePositionY') {
	    		return parseInt(this.style.backgroundPosition.split(" ")[1].split("px")[0]);
	    	}
	    	if (p=='width') {
	    		return this.offsetWidth;
	    	}
	    	if (p=='height') {
	    		return this.offsetHeight;
	    	}
	    	if (p=='frame') {
	    		return this.frame;
	    	}
	    	if (p=='text') {
	    		return this.innerText;
	    	}
	    },
	    set: function (value)
	    {
	    	if (p=='x') {
	    		this.style.left = value + 'px';
	    	}
	    	if (p=='y') {
	    		this.style.top = value + 'px';
	    	}
	    	if (p=='tilePositionX') {//tileSprite.tilePosition.x
	    		this.style.backgroundPosition = value + 'px';
	    	}
	    	if (p=='tilePositionY') {
	    		this.style.backgroundPosition = '0px ' + value + 'px';
	    	}
	    	if (p=='width') {
	    		this.style.width = value + 'px';
	    	}
	    	if (p=='height') {
	    		this.style.height = value + 'px';
	    	}
	    	if (p=='frame') {
	    		for (var i = 0; i < this.row; i++) {
	    			if (value >= this.columns * i) {
	    				this.r = i;
	    			}
				}//支持多行
				this.h = this.frameHeight * this.r;	
				this.style.backgroundPosition = -this.frameWidth * value + 'px ' + this.h +'px';
			}
			if (p=='text') {
				this.innerText = value;
			}
		}
	})
}
/*******************************world*****************************/
Object.defineProperty(MngYou.Game.prototype.world,'centerX',{
	get:function(){
		return this.init().centerX;
	}
})
Object.defineProperty(MngYou.Game.prototype.world,'centerY',{
	get:function(){
		return this.init().centerY;
	}
})

MngYou.Display = {};
MngYou.Display.Align = {};
/*
	Display: 游戏对象
	Align: 位置
	To： 在目标对象内部显示
*/
MngYou.Display.Align.In = {
	Center:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width)/2;
		AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height)/2;
		return AlignObj;
	},
	TopCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width)/2;
		AlignObj.y = GameObj.y;
		return AlignObj;
	},
	TopLeft:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x;
		AlignObj.y = GameObj.y;
		return AlignObj;
	},
	TopRight:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
		AlignObj.y = GameObj.y;
		return AlignObj;
	},
	BottomCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width)/2;
		AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
		return AlignObj;
	},
	BottomLeft:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x;
		AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
		return AlignObj;
	},
	BottomRight:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
		AlignObj.y = GameObj.y + GameObj.height - AlignObj.height;
		return AlignObj;
	},
	LeftCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x;
		AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height)/2;
		return AlignObj;
	},
	RightCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
		AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height)/2;
		return AlignObj;
	}
};
/*
	Display: 游戏对象
	Align: 位置
	To： 在目标对象外部显示
*/
MngYou.Display.Align.To = {
	TopCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width)/2;
		AlignObj.y = GameObj.y - AlignObj.height;
		return AlignObj;
	},
	TopLeft:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x;
		AlignObj.y = GameObj.y - AlignObj.height;
		return AlignObj;
	},
	TopRight:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
		AlignObj.y = GameObj.y - AlignObj.height;
		return AlignObj;
	},
	BottomCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + (GameObj.width - AlignObj.width)/2;
		AlignObj.y = GameObj.y + GameObj.height;
		return AlignObj;
	},
	BottomLeft:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x;
		AlignObj.y = GameObj.y + GameObj.height;
		return AlignObj;
	},
	BottomRight:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + GameObj.width - AlignObj.width;
		AlignObj.y = GameObj.y + GameObj.height;
		return AlignObj;
	},
	LeftCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x - AlignObj.width;
		AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height)/2;
		return AlignObj;
	},
	RightCenter:function(AlignObj,GameObj){
		AlignObj.x = GameObj.x + GameObj.width;
		AlignObj.y = GameObj.y + (GameObj.height - AlignObj.height)/2;
		return AlignObj;
	}
};

function overlap(children,children_,callback){
	var bool = true;
	var left = children.x;
	var right = children.x + children.width;
	var top = children.y;
	var bottom = children.y + children.height;
	var left_ = children_.x;
	var right_ = children_.x + children_.width;
	var top_ = children_.y;
	var bottom_ = children_.y + children_.height;
	if (right > left_ && left < right_ && bottom > top_ && top < bottom_){
		bool = true;
		return callback();
	} else {
		bool = false;
		return bool;
	}
}
function collide(children,children_,callback){
	var bool = true;
	var left = children.x;
	var right = children.x + children.width;
	var top = children.y;
	var bottom = children.y + children.height;
	var left_ = children_.x;
	var right_ = children_.x + children_.width;
	var top_ = children_.y;
	var bottom_ = children_.y + children_.height;
	if (right > left_ && left < right_ && bottom > top_ && top < bottom_){
		if (right>left_) {//
			children.x = children_.x - children.width;
		}
		if (left<right_) {
			children.x = children_.x + children_.width;
		}
		if (bottom>top_) {//
			children.y = children_.y - children.height;
		}
		if (top<bottom) {
			children.y = children_.y + children_.height;
		}
	}
}
function setScroll(bgObj,scrollSpeed){
	var tP_ = scrollSpeed;//滚屏速度
	var i = 0,dt = 0;
	var id = setInterval(function(){
		dt++;
		if (dt%10==0) {
			tP_--;
			if (tP_<=0) {
				tP_ = 0;
			}
		}
		if (i==60) {clearInterval(id)}
		bgObj.tilePositionY += tP_;
		i++;
	},60);
}
/*
	tween: 缓动动画
	this code by 维克多噗噗 from http://blog.poetries.top/
*/ 		//mc ==> motion curve
        function move(obj,json,time,mc,callBack){
            clearInterval(obj.timer);
            var cur = {};
            var end = {};
            for(var attr in json){
                if(attr=="opacity"){
                    cur[attr] = getStyle(obj,attr)*100 || 0;
                }else{
                    cur[attr] = parseInt(getStyle(obj,attr)) || 0;
                }
                end[attr] = json[attr];
            };
            var sTime = new Date();
            /*
                    t, b, c, d
                    time             : current time==>(nTime-sTime)现在过去的时间
                    beginning value  : cur
                    change in value  : 变化量(end-cur)
                    duration         : 持续时间 time
             */
            obj.timer = setInterval(function(){
                // var sTime = new Date();
                var t = new Date() - sTime;
                //duration 持续时间
                if(t>=time){
                    t = time;
                    clearInterval(obj.timer);
                    callBack&&callBack.call(obj);
                }
                var s = undefined;
                for(var attr in json){
                    //var s = prop * (end[attr] - cur[attr]) + cur[attr];
                    var b = cur[attr];
                    var c = end[attr]-b;
                    s = Tween[mc](t,b,c,time);
                    if(attr=="opacity"){
                        obj.style.filter = "alpha(opacity="+s+")";
                        obj.style[attr] = s/100 ;
                    }else{
                       obj.style[attr] = s + "px";
                    }
                };
            },13);
            //数学公式
            var Tween = {
                linear: function (t, b, c, d){  //匀速
                    return c*t/d + b;   //  t/d = prop;
                },
                easeIn: function(t, b, c, d){  //加速曲线
                    return c*(t/=d)*t + b;
                },
                easeOut: function(t, b, c, d){  //减速曲线
                    return -c *(t/=d)*(t-2) + b;
                },
                easeBoth: function(t, b, c, d){  //加速减速曲线
                    if ((t/=d/2) < 1) {
                        return c/2*t*t + b;
                    }
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInStrong: function(t, b, c, d){  //加加速曲线
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutStrong: function(t, b, c, d){  //减减速曲线
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
                    if ((t/=d/2) < 1) {
                        return c/2*t*t*t*t + b;
                    }
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
                    if (t === 0) {
                        return b;
                    }
                    if ( (t /= d) == 1 ) {
                        return b+c;
                    }
                    if (!p) {
                        p=d*0.3;
                    }
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p/4;
                    } else {
                        var s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
                    if (t === 0) {
                        return b;
                    }
                    if ( (t /= d) == 1 ) {
                        return b+c;
                    }
                    if (!p) {
                        p=d*0.3;
                    }
                    if (!a || a < Math.abs(c)) {
                        a = c;
                        var s = p / 4;
                    } else {
                        var s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                elasticBoth: function(t, b, c, d, a, p){
                    if (t === 0) {
                        return b;
                    }
                    if ( (t /= d/2) == 2 ) {
                        return b+c;
                    }
                    if (!p) {
                        p = d*(0.3*1.5);
                    }
                    if ( !a || a < Math.abs(c) ) {
                        a = c;
                        var s = p/4;
                    }
                    else {
                        var s = p/(2*Math.PI) * Math.asin (c/a);
                    }
                    if (t < 1) {
                        return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    }
                    return a*Math.pow(2,-10*(t-=1)) *
                            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
                },
                backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
                    if (typeof s == 'undefined') {
                       s = 1.70158;
                    }
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                backOut: function(t, b, c, d, s){
                    if (typeof s == 'undefined') {
                        s = 3.70158;  //回缩的距离
                    }
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                backBoth: function(t, b, c, d, s){
                    if (typeof s == 'undefined') {
                        s = 1.70158;
                    }
                    if ((t /= d/2 ) < 1) {
                        return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    }
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
                    return c - Tween['bounceOut'](d-t, 0, c, d) + b;
                },
                bounceOut: function(t, b, c, d){
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
                    }
                    return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
                },
                bounceBoth: function(t, b, c, d){
                    if (t < d/2) {
                        return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
                    }
                    return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
                }
            };
        }

        function getStyle(obj,attr){
            return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,null)[attr];
        }
/////////////////////////////////////////////////////////////////////////////////////////////////////