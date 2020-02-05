var config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {y: 300},
			debug: false
				}
			},
	scene: {
		init: init,
		preload: preload,
		create: create,
		update: update
	}
}

var game = new Phaser.Game(config);

function init(){
	var player;
	var platforms;
	var cursors;
}

function preload(){
	this.load.image('sol','assets/platform.png');
	this.load.spritesheet('personne','assets/perso.png', {frameWidth : 45, frameHeight: 45});
	this.load.image('melodie','assets/ellevaetrecontente.png');
	this.load.image('os','assets/os.png');
}




function create(){

	platforms = this.physics.add.staticGroup();
	platforms.create(50,250,'melodie').setScale(2).refreshBody();
	platforms.create(700,400,'melodie').setScale(2).refreshBody();
	platforms.create(400,800,'sol').setScale(2).refreshBody();
	player = this.physics.add.sprite(450,450,'personne');
	player.setCollideWorldBounds(true);
	this.physics.add.collider(player,platforms);
	player.body.setGravityY(200);
	player.setBounce(0.5);
	cursors = this.input.keyboard.createCursorKeys();

	this.anims.create({
	key: 'gauche',
	frames: this.anims.generateFrameNumbers('perso', {start: 0, end: 3}),
	frameRate: 10,
	repeat: 1
});
this.anims.create({
	key: 'stop',
	frames: [{key: 'perso', frame:4}],
	frameRate: 20
});
oss = this.physics.add.group({
	key: 'os',
	repeat: 11,
	setXY: {x: 12, y: 0, stepX: 70}
});

this.physics.add.collider(oss, platforms);
this.physics.add.overlap(player,oss,collectStar, null, this);
}

function collectStar(player, star){
	star.disableBody(true,true);
	score+=10;
	scoreText.scoreText('score: '+score);
	if(os.countActive(true)===0){
		os.children.iterate(function(child){
			child.enableBody(true,child.x, 0, true, true);
		});
		var x =(player.x<400)? Phaser.Math.Between(400,800) : Phaser.Math.Between(0,400);
		var bombe = bombes.create(x, 16,'bombe');
		bombe.setBounce(1);
		bombe.setCollideWorldBounds(true);
		bombe.setVelocity(Phaser.Math.Between(-200, 200) 20);
	}
}

function update(){
	if(cursors.left.isDown){
		player.setVelocityX(-320);
		player.anims.play('droite', true);
		player.setFlipX(false);
	}
	else if(cursors.right.isDown){
		player.setVelocityX(320);
		player.anims.play('droite', true);
		player.setFlipX(true);
	}
	else {
		player.setVelocityX(0);
		player.anims.play('haut', true);
	}
	if (cursors.up.isDown && player.body.touching.down){
		player.setVelocityY(-500)
	}
};