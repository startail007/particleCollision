import { Particle } from "../js/particle.js";
import { Rectangle, Quadtree } from "../js/quadtreeE.js";
import { debounce, isPhone } from "../js/base.js";
let canvas, ctx, cWidth, cHeight;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
cWidth = canvas.width;
cHeight = canvas.height;

let mPos = [0, 0];
const isPC = !isPhone();

/*canvas.addEventListener("mousemove", function (el) {
  mPos[0] = el.offsetX;
  mPos[1] = el.offsetY;
});*/

let rect = new Rectangle(0, 0, cWidth, cHeight);
let qtree = new Quadtree(rect, 10);

const radius_min = isPC ? 5 : 6;
const radius_max = isPC ? 10 : 12;
const particles = [];
for (let i = 0; i < (isPC ? 2000 : 2000); i++) {
  particles.push(new Particle(`hsl(${Math.floor(360 * Math.random())},100%,50%)`));
}
function handleResize() {
  canvas.width = cWidth = window.innerWidth;
  canvas.height = cHeight = window.innerHeight;
  rect = new Rectangle(0, 0, cWidth, cHeight);
  qtree = new Quadtree(rect, 10);
  //console.log(window.innerHeight);
  for (let i = 0; i < particles.length; i++) {
    const radius = radius_min + Math.random() * (radius_max - radius_min);
    particles[i].setPos(
      radius + (cWidth - 2 * radius) * Math.random(),
      radius + (cHeight - 2 * radius) * Math.random()
    );
    particles[i].setVelocity(2, 2 * Math.PI * Math.random());
    particles[i].setRadius(radius);
    particles[i].setMass(radius / radius_min);
  }
}
window.addEventListener("resize", debounce(handleResize));
handleResize();
function update() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].boundaryCheck(cWidth, cHeight);
  }
  qtree.clear();
  for (let i = 0; i < particles.length; i++) {
    qtree.insert({ key: i, point: particles[i].pos });
  }
  for (let i = 0; i < particles.length; i++) {
    let query_particles = [];
    let w = particles[i].radius + radius_max;
    let h = particles[i].radius + radius_max;
    let range = new Rectangle(particles[i].pos[0] - w, particles[i].pos[1] - h, w * 2, h * 2);
    let query_points = qtree.query(range);
    for (let j = 0; j < query_points.length; j++) {
      query_particles.push(particles[query_points[j].key]);
    }
    particles[i].collisionCheck(query_particles);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].render(ctx);
  }
}
update();
let oldTime = Date.now();
let animate = function () {
  requestAnimationFrame(animate);
  let nowTime = Date.now();
  let delta = (nowTime - oldTime) / 1000;
  oldTime = nowTime;
  update();
  ctx.font = "18px Noto Sans TC";
  ctx.textAlign = "start";
  ctx.textBaseline = "hanging";
  ctx.fillStyle = "#ffffff";
  ctx.fillText((1 / delta).toFixed(1), 10, 10);
};
animate();
