
let shapes = [];
let points = [];
let balls = [];

let shapeScale = 1;
let targetScale = 1;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  canvas.parent('header-canvas');

  // فاصله‌ی اشکال از مرکز، متناسب با عرض صفحه (برای موبایل کوچک‌تر می‌شود)
  let offsetX = min(200, windowWidth / 5);
  let shapeSize = windowWidth < 480 ? 60 : 100;

  // مکعب - چبیشف (بیشینه)
  shapes.push({ type: 'box', pos: createVector(offsetX, 0, 0), size: shapeSize, color: [255, 80, 180] });
  // هشت‌وجهی - منهتن
  shapes.push({ type: 'octahedron', pos: createVector(-offsetX, 0, 0), size: shapeSize, color: [80, 255, 180] });

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

  if (targetScale > 0.5 || shapeScale > 0.9) {
    for (let s of shapes) {
      push();
      scale(shapeScale);
      let offset = createVector(
        sin(frameCount * 0.012) * 60,
        cos(frameCount * 0.012) * 60,
        sin(frameCount * 0.012) * 40
      );
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
  resizeCanvas(windowWidth, windowHeight);
  let offsetX = min(200, windowWidth / 5);
  let shapeSize = windowWidth < 480 ? 60 : 100;
  shapes[0].pos.x = offsetX;
  shapes[0].size = shapeSize;
  shapes[1].pos.x = -offsetX;
  shapes[1].size = shapeSize;
}


const content = document.querySelector(".content");
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > document.getElementsByClassName("overlay")[0].offsetHeight) {
    targetScale = 0;
    navbar.classList.add("show1");
    content.classList.add("show2");
  } else{
    targetScale = 1;
    navbar.classList.remove("show1");
    content.classList.remove("show2");
  }

  if (window.scrollY > document.querySelector(".content").offsetHeight) {
    navbar.classList.add("hidden1");
    content.classList.add("hidden2");
  } else{
    navbar.classList.remove("hidden1");
    content.classList.remove("hidden2");
  }
});


  /* ---------- برجسته کردن لینک فعال نوار پیمایش ---------- */

document.addEventListener('DOMContentLoaded', () => {

  const sectionMarkers = document.querySelectorAll('.empty');
  const navLinks = document.querySelectorAll('.navbar a');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  sectionMarkers.forEach(marker => spy.observe(marker));
});

/* ---------- تنظیم خودکار ارتفاع iframe ها بر اساس محتوا ---------- */

function autoResizeIframe(iframe) {
  function resize() {
    try {
      const doc = iframe.contentWindow.document;
      const height = doc.documentElement.scrollHeight;
      iframe.style.height = height + "px";
    } catch (e) {
      console.warn("امکان خواندن ارتفاع محتوای iframe نبود:", e);
    }
  }

  iframe.addEventListener("load", () => {
    // تنظیم اولیه‌ی ارتفاع
    resize();

    // اگر محتوای iframe بعداً تغییر اندازه بده (مثلاً به‌خاطر انیمیشن یا فونت)
    try {
      const ro = new ResizeObserver(resize);
      ro.observe(iframe.contentWindow.document.body);
    } catch (e) {
      // اگر ResizeObserver در دسترس نبود، فقط با resize پنجره آپدیت می‌کنیم
    }

    window.addEventListener("resize", resize);
  });
}

document.querySelectorAll(".iframe-container iframe").forEach(autoResizeIframe);