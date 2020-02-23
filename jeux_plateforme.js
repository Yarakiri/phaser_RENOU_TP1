var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: true
        }
    },
scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
};

var game = new Phaser.Game(config);
var score = 0;
var jump = 0;
var pv = 3;

function init(){
 	var platforms;
	var player;
	var cursors; 
	var stars;
	var scoreText;
	var bomb;
	var pv1;
	var pv2;
	var pv3;
}

function preload(){
	this.load.image('background','assets/sky.png');	
	this.load.image('fond','assets/sky.png');
	this.load.image('etoile','assets/star.png');
	this.load.image('sol','assets/platform.png');
	this.load.image('bomb','assets/bomb.png');
	this.load.image('plat','assets/plat.png');
	this.load.image('pv1','assets/coeur1.png');
	this.load.image('pv2','assets/coeur2.png');
	this.load.image('pv3','assets/coeur3.png');
	this.load.spritesheet('perso','assets/perso.png',{frameWidth: 32, frameHeight: 48});

}



function create(){
	this.add.image(400,300,'background');

	platforms = this.physics.add.staticGroup();
	platforms.create(400,768,'sol').setScale(2).refreshBody();
	platforms.create(533,500,'sol');
	platforms.create(-230,550,'sol');
	platforms.create(300,250,'plat');
	player = this.physics.add.sprite(100,450,'perso');
	player.setCollideWorldBounds(true);
	player.setBounce(0.2);
	player.body.setGravityY(000);
	this.physics.add.collider(player,platforms);
	pv1 = this.add.image(650,30,'pv1').setScale(1.5);
	pv2 = this.add.image(700,30,'pv2').setScale(1.5);
	pv3 = this.add.image(750,30,'pv3').setScale(1.5);
	cursors = this.input.keyboard.createCursorKeys(); 
	
	this.anims.create({
		key:'left',
		frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
		frameRate: 10,
		repeat: -1
	});
	
	this.anims.create({
		key:'stop',
		frames: [{key: 'perso', frame:4}],
		frameRate: 20
	});
	
	stars = this.physics.add.group({
		key: 'etoile',
		repeat:11,
		setXY: {x:12,y:0,stepX:70}
	});
	
	this.physics.add.collider(stars,platforms);
	this.physics.add.overlap(player,stars,collectStar,null,this);

	scoreText = this.add.text(16,16, 'score: 0', {fontSize: '32px', fill:'#000'});
	bombs = this.physics.add.group();
	this.physics.add.collider(bombs,platforms);
	this.physics.add.collider(player,bombs, hitBomb, null, this);
}



function update(){
	if 	(cursors.left.isDown){
		player.anims.play('left', true);
		player.setVelocityX(-300);
		player.setFlipX(false);
	}
	else if (cursors.right.isDown){
			player.setVelocityX(300);
			player.anims.play('left', true);
			player.setFlipX(true);
	}
	else{
			player.anims.play('stop', true);
			player.setVelocityX(0);
	}

//Double Jump

		if	(cursors.up.isDown && player.body.touching.down){
			player.setVelocityY(-350);
		} 
		if  (player.body.touching.down) {
			jump = 0;
		}

		if 	(cursors.up.isDown && player.body.touching.down){
			player.setVelocityY(-250);
		}

		if 	(cursors.up.isUp && !player.body.touching.down && jump == 0){
			jump = 1;
		}

		if (jump == 1) {
			if  (cursors.up.isDown) {
				player.setVelocityY(-200);
				jump = 2;
			}
		}	
}

//Gestion vie

function hitBomb(player, bomb){
		bomb.disableBody(true, true);
	if (pv == 0) {
		this.physics.pause();
		player.setTint(0xff0000);
		player.anims.play('turn');
		pv1.visible = false;
		gameOver = true;
	} else if (pv > 0){
		pv = pv -1;
		player.setTint(0xff0000);
	}
	if (pv == 2) {
		pv3.visible = false;
	}
	if (pv == 1) {
		pv2.visible = false;
	}
	if (pv == 0) {
			pv1.visible = false;
			this.physics.pause();
			gameOver = true;
		}
}

//Recolter

function collectStar(player, star){
	star.disableBody(true,true);
	score += 10;
	scoreText.setText('score: '+score);
	if(stars.countActive(true)===0){
		stars.children.iterate(function(child){
			child.enableBody(true,child.x,0, true, true);
		});
		
		var x = (player.x < 400) ? 
			Phaser.Math.Between(400,800):
			Phaser.Math.Between(0,400);
		var bomb = bombs.create(x, 16, 'bomb');
		bomb.setBounce(1);
		bomb.setCollideWorldBounds(true);
		bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
	}
}