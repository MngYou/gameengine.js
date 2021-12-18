onload = function(){
	document.body.click();
	var track,playerCar,enemysCar,playerExp;
	var speed = new Array(100,120,150,200,270,360,490,540,720);
	var level = 0,dt = 0,start = false,scoreText;score = 0;
	var game = new MngYou.Game(0,0,320,480);
	enemysCar = game.add.group();
	track = game.add.tilesprite(0,0,320,480,'./0.png');
	playerCar = game.add.image(0,0,32,64,'./1.png');
	playerExp = game.add.image(0,0,32,64,'./1-1.png').setVisible();
	scoreText = game.add.text(0,0,'score:'+score,{fontSize:27,color:'red'});
	playerCar.velocity({velocityX:0,velocityY:0,launch:true});
	MngYou.Display.Align.In.BottomCenter(playerCar,track).y-=playerCar.height;
	game.keyboard.addKeyDown('ArrowLeft',function(){playerCar.velocityX = -20;});
	game.keyboard.addKeyUp('ArrowLeft',function(){playerCar.velocityX = 0;});
	game.keyboard.addKeyDown('ArrowRight',function(){playerCar.velocityX = 20;});
	game.keyboard.addKeyUp('ArrowRight',function(){playerCar.velocityX = 0;});
	track.addScrollKey('ArrowUp',10);
	var btnStart = game.add.image(0,0,64,64,'./btnStart.png').setZindex(1);
	var btnRStart = game.add.image(0,0,64,64,'./btnRStart.png').setVisible();
	MngYou.Display.Align.In.Center(btnStart,game);
	btnRStart.x = btnStart.x;
	btnRStart.y = btnStart.y;
	btnStart.on('click',function(){
		start = true;
		btnStart.destroy();
		game.background.setScroll(track,10);
	});
	btnRStart.on('click',function(){
		window.location.reload();
	});
	game.update(function(){
		if (start==false) {
			// track.runner = false;
			playerCar.runner = false;
			return false;
		} else {
			playerCar.runner = !false;
		}
		score = track.tilePositionY;
		scoreText.setText('score:'+score/100+'m');
		dt++;
		if (playerCar.x <= 0) {
			playerCar.x = playerCar.width/10;
		}
		if (playerCar.x + playerCar.width >= game.width) {
			playerCar.x = game.width - playerCar.width - playerCar.width/10;
		}
		if (dt%60==0) {
			var enemyCar = game.add.image(game.rnd.between(0,320-32),-64,32,64,'./2.png');
			enemyCar.velocity({velocityY:speed[level],launch:true});
			enemysCar.add(enemyCar);
			enemysCar.setZindex(1);
		}
		if (dt%600==0) {level++;}
		if (level==speed.length) {level==speed.length - 1;}
		enemysCar.setAll('overlap',playerCar,function(){
			playerExp.setVisible(true);
			playerExp.setZindex(1);
			playerExp.x = playerCar.x;
			playerExp.y = playerCar.y;
			game.tween.to(playerExp,{"width":50,"height":100,"opacity":0},700,"easeBothStrong",function(){
				playerExp.destroy();
			});
			playerCar.destroy();
			start = false;
			btnRStart.setVisible(true);
		});
	},100/6);
}