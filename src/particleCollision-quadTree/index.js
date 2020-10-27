import { Particle } from "../js/particle.js";
import { Rectangle, Quadtree } from "../js/quadtree.js";
import { debounce } from "../js/base.js";
import { Vector } from "../js/vector.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cWidth = canvas.width;
let cHeight = canvas.height;

let rect = new Rectangle(0, 0, cWidth, cHeight);
let qtree = new Quadtree(rect, 10);

const radius_min = 5;
const radius_max = 10;
let particles;
const handleResize = () => {
  canvas.width = cWidth = window.innerWidth;
  canvas.height = cHeight = window.innerHeight;
  rect.width = cWidth;
  rect.height = cHeight;
  qtree.reset(rect, 10);
  particles = new Array(Math.ceil((cWidth * cHeight) / 1000));
  //console.log(window.innerHeight);
  for (let i = 0; i < particles.length; i++) {
    const radius = radius_min + Math.random() * (radius_max - radius_min);
    particles[i] = new Particle(`hsl(${Math.floor(360 * Math.random())},100%,50%)`);
    particles[i].setPos(
      radius + (cWidth - 2 * radius) * Math.random(),
      radius + (cHeight - 2 * radius) * Math.random()
    );
    particles[i].setVelocity(2, 2 * Math.PI * Math.random());
    particles[i].setRadius(radius);
    particles[i].setMass(radius / radius_min);
  }
};
window.addEventListener("resize", debounce(handleResize));
handleResize();
canvas.addEventListener("click", (el) => {
  const p = [el.pageX, el.pageY];
  const r = 100;
  const range = new Rectangle(p[0] - r, p[1] - r, r * 2, r * 2);
  const query_points = qtree.query(range);

  query_points.forEach((el) => {
    const v = Vector.sub(el.point, p);
    const r0 = Vector.length(v);
    if (r0 <= r) {
      particles[el.key].addVelocity(Math.min(r0 ? (10 * r) / r0 : 0, 10), Math.atan2(v[1], v[0]));
      particles[el.key].setRadius(particles[el.key].radius);
    }
  });
});
const update = () => {
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
    const query_particles = [];
    const w = particles[i].radius + radius_max;
    const h = particles[i].radius + radius_max;
    const range = new Rectangle(particles[i].pos[0] - w, particles[i].pos[1] - h, w * 2, h * 2);
    const query_points = qtree.query(range);
    for (let j = 0; j < query_points.length; j++) {
      query_particles.push(particles[query_points[j].key]);
    }
    particles[i].collisionCheck(query_particles);
  }

  for (let i = 0; i < particles.length; i++) {
    particles[i].render(ctx);
  }
  //qtree.render(ctx);
};
update();
let oldTime = Date.now();
const animate = () => {
  requestAnimationFrame(animate);
  const nowTime = Date.now();
  const delta = (nowTime - oldTime) / 1000;
  oldTime = nowTime;
  update();
  ctx.font = "18px Noto Sans TC";
  ctx.textAlign = "start";
  ctx.textBaseline = "hanging";
  ctx.fillStyle = "#ffffff";
  ctx.fillText((1 / delta).toFixed(1), 10, 10);
};
animate();
