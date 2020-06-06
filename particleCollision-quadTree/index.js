import { Particle } from "../js/particle.js";
import { Rectangle, Quadtree } from "../js/quadtreeE.js";
let canvas, ctx, cWidth, cHeight;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
cWidth = canvas.width;
cHeight = canvas.height;

let mPos = [0, 0];

canvas.addEventListener("mousemove", function (el) {
  mPos[0] = el.offsetX;
  mPos[1] = el.offsetY;
});

/*function handleScroll() {
  console.log("aaa");
}
window.addEventListener("mousemove", debounce(handleScroll));*/
let radius_min = 3;
let radius_max = 6;
let particles = [];
for (let i = 0; i < 2000; i++) {
  let radius = radius_min + Math.random() * (radius_max - radius_min);
  particles.push(
    new Particle(
      `hsl(${Math.floor(360 * Math.random())},100%,50%)`,
      //"#ffffff",
      [radius + (cWidth - 2 * radius) * Math.random(), radius + (cHeight - 2 * radius) * Math.random()],
      2,
      2 * Math.PI * Math.random(),
      radius,
      radius / radius_min
    )
  );
}

let rect = new Rectangle(0, 0, cWidth, cHeight);
//let qtree = new Quadtree(rect);
/*for (let i = 0; i < particles.length; i++) {
  qtree.insert(i, particles[i].pos);
}*/
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, cWidth, cHeight);

let qtree = new Quadtree(rect, 10);
function update() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].boundaryCheck(cWidth, cHeight);
  }
  /*for (let i = 0; i < particles.length; i++) {
    qtree.clear();
  }
  for (let i = 0; i < particles.length; i++) {
    qtree.insert(i, particles[i].pos);
  }*/
  /*let qtree = new Quadtree(rect);
  for (let i = 0; i < particles.length; i++) {
    qtree.insert(i, particles[i].pos);
  }*/
  qtree.clear();
  for (let i = 0; i < particles.length; i++) {
    qtree.insert({ key: i, point: particles[i].pos });
  }

  //let w = radius_max * 2;
  //let h = radius_max * 2;
  //let range = new Rectangle(0, 0, w * 2, h * 2);
  for (let i = 0; i < particles.length; i++) {
    let query_particles = [];
    //range.x = particles[i].pos[0] - w;
    //range.y = particles[i].pos[1] - h;
    let w = particles[i].radius + radius_max;
    let h = particles[i].radius + radius_max;
    let range = new Rectangle(particles[i].pos[0] - w, particles[i].pos[1] - h, w * 2, h * 2);
    let query_points = qtree.query(range);
    for (let j = 0; j < query_points.length; j++) {
      query_particles.push(particles[query_points[j].key]);
    }
    //console.log(query_points.length);
    particles[i].collisionCheck(query_particles);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].render(ctx);
  }
}
update();
let oldTime = Date.now();
//let count = 0;
let animate = function () {
  requestAnimationFrame(animate);
  let nowTime = Date.now();
  let delta = (nowTime - oldTime) / 1000;
  oldTime = nowTime;
  /*count += delta;
  if (count >= 0.033) {
    count %= 0.033;*/
  update();
  //}

  ctx.font = "18px Noto Sans TC";
  ctx.textAlign = "start";
  ctx.textBaseline = "hanging";
  ctx.fillStyle = "#ffffff";
  ctx.fillText((1 / delta).toFixed(1), 10, 10);
};
animate();
