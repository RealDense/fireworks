let fireworks = [];
let particles = [];
let gravity = {x: 0,y:.05};
// let width = 1440;
let width = window.screen.width;
// let height = 760;
let height = window.screen.height-1;
let sleeping = 1000;
let timeOut = 500;

var colors = [];
while (colors.length < 100) {
    do {
        var color = Math.floor((Math.random()*1000000)+1);
    } while (colors.indexOf(color) >= 0);
    colors.push("#" + ("000000" + color.toString(16)).slice(-6));
}

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

// let colorChoice = [

// ]

let particle = function(x,y,col){
  let mag = random(1,2.5);
  let ang = random(0,2*PI);
  let vel = {x:mag * cos(ang), y:mag*sin(ang)};
  let pos = {x: x,y:y};
  let lifetime = 0
  let limit = random(40, 150)
  

  function update(){
    vel = {x: vel.x + gravity.x, y: vel.y + gravity.y};
    pos = {x: pos.x + vel.x, y: pos.y + vel.y};
    lifetime++;
    return lifetime < limit;
  }

  function render(){
    fill(col);
    noStroke();
    ellipse(pos.x, pos.y, 3, 3);
  }

  let api = {
    update : update,
    render : render
  }

  return api;
}

let projectile = function (x,y){
  let pct = 0.0;
  let endX = x;
  let endY = y;
  let step = 0.015;    // Size of each step along the path
  // var col = colors[Math.floor(Math.random() * colors.length)];
  let totalColors = 8;
  let col = [];
  for( let i = 0; i < totalColors; i ++){
    col.push(colorArray[Math.floor(Math.random() * colorArray.length)]);
  }
  // let multiColor = random(1,10) < 4;
  let colorAmount = random(0,totalColors);

  let side = 1;
  if(Math.random() < .5) side = -1;

  let beginX = x + side * (width* (Math.random() * .3 + .1));
  let beginY = height;

  let distX = endX - beginX;
  let distY = endY - beginY;

  function update(){
    pct += step;
    if (pct < 1.37) {
      // y = beginY + (pct * distY);
      // x = beginX + (pow(pct, exponent) * distX);
      y = -pct * ( pct - 2.1 ) * (distY) + height;
      x = beginX + (pct* distX)*.73

      return true;
    }else{ 
      // explode here
      for(let i = 0; i < 100; i ++){
          // console.log(col.length);
          particles.push(particle(x,y,col[floor(random(0,colorAmount))]))

      }
      return false;
    }
  }

  function render(){
    fill(col[0]);
    noStroke();
    ellipse(x, y, 5, 5);
  }

  let api = {
    update : update,
    render : render
  }

  return api;

}

function setup() {
  createCanvas(width, height);
  noStroke();
}

function draw() {
  fill(0,20);
  rect(0, 0, width, height);
  sleeping++;
  if(sleeping > timeOut && Math.random() > .95){
    // console.log(floor(random(width*.1,width*.9)), floor(random(height*.05, height*.7)));

    fireworks.push(projectile(floor(random(width*.1,width*.9)), floor(random(height*.05, height*.5))));
  }
  for( let i = fireworks.length - 1; i >= 0; i--){
    if(fireworks[i].update()){
      fireworks[i].render();
    }else{ 
      fireworks.splice(i,1);
    }
  }
  // console.log(particles.length);
  for( let i = particles.length - 1; i >= 0; i--){
    if(particles[i].update()){
      particles[i].render();
    }else{ 
      particles.splice(i,1);
    }
  }
}

function mousePressed() {
  console.log(mouseX, mouseY);
  if(sleeping > timeOut){
  fireworks = [];
  particles = [];
  }
  sleeping = 0;

  fireworks.push(projectile(mouseX, mouseY));
  fireworks.push(projectile(mouseX, mouseY));
}