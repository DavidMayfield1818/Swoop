title = "Swoop";

description = `
	[TAP] swoop
`;

options = {
    seed: 2,
    isPlayingBgm: true,
	isCapturing: true,
	isCapturingGameCanvasOnly: true,
	captureCanvasScale: 2
};

// Define pixel arts of characters.
// Each letter represents a pixel color.
// (l: black, r: red, g: green, b: blue
//  y: yellow, p: purple, c: cyan
//  L: light_black, R: light_red, G: light_green, B: light_blue
//  Y: light_yellow, P: light_purple, C: light_cyan)
// Characters are assigned from 'a'.
// 'char("a", 0, 0);' draws the character
// defined by the first element of the array.

characters = [
	// a
	`
	  Y  
	lllll
	 lll
	`
	,
	// b
	`
	bbYbb  
	lllll
	 lll
	`
	,
	// c
	`
	B
	`
	,
	// d
	`
	B
	B
	`
	,
	// e
	`
	B
	B
	B
	`
	,
	// f
	`
	 B
	 BB
	BB
	`
	,
	// f
	`
	  B
	  BB
	  BB
	  B
	 BB
	`
	,
	// h
	`
	  b
	  bb
	  bb
	  b
	 bb
	`
	,
	// i
	`
	 b
	  bb
	  bb
	bbb
	 b
	`
	,
	// j
	`
	  b
	  bb
	  bb
	  b
	 bb
	`
	,
	// k
	`
	  b
	 bb
	 bb
	  b
	  bb
	`
	,
	// l
	`
	   b
	 bb
	 bb
	  bbb
	   b
	`
	,
	// m
	`
	  b
	 bb
	 bb
	  b
	  bb
	`
	,
	// n
	`
	  B
	 BBC
	 BBC
	 CBC
	  BB
	`
	,
	// o
	`
	 CCC
	C B C
	C BBC
	CBB C
	 CCC
	`
	,
	// p
	`
	CC CC
	C B C
	  B
	C B C
	CC CC
	`
	,
	// q
	`
	C   C
	  B 
	  B
	     
	C   C
	`
	,
	// r
	`
	B
	`
	,
	// s
	' '
];
const fish_frames = {
	0: 's',
	1: 'c',
	2: 'd',
	3: 'e',
	4: 'f',
	5: 'g',
	6: 'h',
	7: 'i',
	8: 'j',
	9: 'k',
	10: 'l',
	11: 'm',
	12: 'n',
	13: 'o',
	14: 'p',
	15: 'q',
	16: 'r'
}

const G = {
	WIDTH: 100,
	HEIGHT: 100
};

/**
 * @typedef {{
 * pos: Vector,
 * rot: number,
 * hasFish: boolean,
 * isSwooping: boolean
 * }} Bird
 */

/**
 * @type { Bird }
 */
let bird;

bird = {
	pos: vec(50, 20),
	rot: PI/2,
	hasFish: false,
	isSwooping: true
}

let circleTime = 2*PI;
let swoopSpeed = 3;

/**
 * @typedef {{
 * pos: Vector,
 * rot: number,
 * frame: number,
 * frame_pause: number
 * }} Fish
 */

/**
 * @type { Fish [] }
 */
let fishes;

/**
 * @type { Fish }
 */
let tempfish;
let fish1;

let pause_dir = 3;

fish1 = {
	pos: vec(G.WIDTH/2, G.HEIGHT/2),
	rot: PI/2,
	frame: 0,
	frame_pause: 0
}

fishes = [];

let fish_counter = 0;

function update() {
	if (!ticks) {

	}
	// make new fish
	if(fish_counter <= 0 && fishes.length<4) {
		const xpos = rnd(15,G.WIDTH-15);
		const ypos = rnd(15,G.HEIGHT-15);
		tempfish = {
			pos: vec(xpos,ypos),
			rot: PI/2,
			frame: 0,
			frame_pause: 0
		}
		fishes.push(tempfish);
		fish_counter = 0 + 32/(1 + (0.3*difficulty));
	}

	if(input.isJustPressed && !bird.isSwooping){
		bird.isSwooping = true;
		bird.rot += PI/2;
	}

	var newX;
	var newY;
	if(!bird.isSwooping){
		// set values in relation to
		var ogX = bird.pos.x - G.WIDTH/2;
		var ogY = bird.pos.y - G.HEIGHT/2;
		
		// calculate new values
		newX = (ogX * Math.cos(2*PI/360)) - (ogY * Math.sin(2*PI/360));
		newY = (ogY * Math.cos(2*PI/360)) + (ogX * Math.sin(2*PI/360));

		newX += G.WIDTH/2;
		newY +=  + G.HEIGHT/2;
		bird.rot += 2*PI/360;

		if(bird.rot >= 2*PI){
			bird.rot -= 2*PI;
		}
	}
	else{
		newX = bird.pos.x + (swoopSpeed*cos(bird.rot));
		newY = bird.pos.y + (swoopSpeed*sin(bird.rot));
	}
	
	bird.pos = vec(newX,newY);
	bird.pos.clamp(0,G.WIDTH,0,G.HEIGHT);

	if(bird.isSwooping){
		var xdist = (bird.pos.x - G.WIDTH/2);
		var ydist = (bird.pos.y - G.HEIGHT/2);
		var distFromCenter = Math.sqrt(xdist*xdist+ydist*ydist);
		if(distFromCenter >= 40){
			var revertX = bird.pos.x + (-swoopSpeed*cos(bird.rot));
			var revertY = bird.pos.y + (-swoopSpeed*sin(bird.rot));
			bird.pos = vec(revertX,revertY);
			bird.isSwooping = false;
			bird.rot += PI/2;
		}
	}

	if(!bird.hasFish){
		char("a", bird.pos);
		color('black');
		rect(bird.pos.x,bird.pos.y,2,2);
	}
	else{
		char("b", bird.pos);
	}
	fish_counter -= 1;

	// fish deletion
	let killlist = [];
	fishes.forEach((f,i) => {
		if(f.frame_pause <= 0){
			f.frame += 1;
			if(f.frame > 16){
				f.frame = 0;
				f.pos = vec(rnd(0,G.WIDTH), rnd(0,G.HEIGHT));
			}
			f.frame_pause = pause_dir + 3/(1 + (0.3*difficulty));
		}
		f.frame_pause -= 1;
		
		if(f.frame == 0){
			fishes.splice(i,1);
		}
		if((char(fish_frames[f.frame],f.pos).isColliding.char.a)){
			if(f.frame >= 6 && f.frame <= 11) {
				// kill here
				killlist.push(i);
				
			}
		}
	});
	killlist.forEach((i)=>{
		fishes.splice(i,1);
		addScore(1);
	});
	killlist = [];

}
