let shapes = [];
let points = [];
let balls = [];

let shapeScale = 1;
let targetScale = 1;

function setup() {
  let canvas = createCanvas(windowWidth,windowHeight, WEBGL);
  canvas.parent('header-canvas');

  // مکعب - منهتن
  shapes.push({ type: 'box', pos: createVector(200, 0, 0), size: 100, color: [255, 80, 180] });
  // هشت‌وجهی - چبیشف
  shapes.push({ type: 'octahedron', pos: createVector(-200, 0, 0), size: 100, color: [80, 255, 180] });

  // نقاط
  for (let i = 0; i < 25; i++) {
    points.push(p5.Vector.random3D().mult(random(500, 900)));
  }
  // توپ‌ها
  for (let i = 0; i < 3; i++) {
    let pos = p5.Vector.random3D().mult(random(100, 700));
    balls.push({ pos: pos, radius: random(60, 120) });
  }
}

function draw() {
  background(5, 8, 20);
  ambientLight(60);
  pointLight(150, 200, 255, 0, 0, 200);
  shapeScale = lerp(shapeScale, targetScale, 0.01);

  rotateY(frameCount * 0.004);
  rotateX(frameCount * 0.002);

  shapeScale = lerp(shapeScale, targetScale, 0.01);
  if (targetScale > 0.5 || shapeScale > 0.9) {
    for (let s of shapes) {
      push();
      scale(shapeScale);
      let offset = createVector(sin(frameCount * 0.012) * 60, cos(frameCount * 0.012) * 60, sin(frameCount * 0.012) * 40);
      let x = constrain(s.pos.x + offset.x, -width / 2 + 100, width / 2 - 100);
      let y = constrain(s.pos.y + offset.y, -width / 2 + 100, width / 2 - 100);
      translate(x, y, s.pos.z + offset.z);
      rotateY(frameCount * 0.008);
      rotateX(frameCount * 0.006);

      noFill();
      stroke(s.color);
      strokeWeight(6);

      if (s.type === 'box') box(s.size);
      else if (s.type === 'octahedron') {
        rotateX(PI / 4);
        cone(s.size / sqrt(2), s.size * 1.5, 4, 1);
        rotateX(PI);
        cone(s.size / sqrt(2), s.size * 1.5, 4, 1);
      }
      pop();
    }
  }


  // توپ‌های شفاف
  noFill();
  stroke(100, 200, 255, 70);
  strokeWeight(2);

  shapeScale = lerp(shapeScale, targetScale, 0.01);
  if (targetScale > 0.5 || shapeScale > 0.9) {
    for (let b of balls) {
      push();
      scale(shapeScale);
      translate(b.pos.x, b.pos.y, b.pos.z);
      sphere(b.radius);
      pop();
    }
  }

  // نقاط
  noStroke();
  fill(150, 220, 255);
  for (let p of points) {
    push();
    translate(p.x, p.y, p.z);
    sphere(5);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, 600);
}

const content = document.querySelector(".content");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll" , () => {
  if (window.scrollY > document.getElementsByClassName("overlay")[0].offsetHeight-200){
    targetScale = 0;
    navbar.classList.add("show1");
    setTimeout(() => {
      content.classList.add("show2");
    }, 1000);
  } else {
    targetScale = 1;
    navbar.classList.remove("show1");
    content.classList.remove("show2")
  }
})