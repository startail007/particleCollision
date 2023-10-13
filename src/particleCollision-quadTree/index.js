import { Particle } from "../js/particle.js";
import { Rectangle, Quadtree } from "../js/quadtree.js";
import { debounce } from "../js/base.js";
import { Vector, VectorE } from "../js/vector.js";
import { Collisions } from "../js/collisions.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let cWidth = canvas.width;
let cHeight = canvas.height;

let rect = new Rectangle(0, 0, cWidth, cHeight);
let qtree = new Quadtree(rect, 10);

const radius_min = 5;
const radius_max = 10;
const n = 1;
let particles;
const handleResize = () => {
  canvas.width = cWidth = window.innerWidth;
  canvas.height = cHeight = window.innerHeight;
  rect.width = cWidth;
  rect.height = cHeight;
  qtree.reset(rect, 20);
  particles = new Array(Math.ceil((cWidth * cHeight) / 1000));
  // particles = new Array(2000);
  for (let i = 0; i < particles.length; i++) {
    const radius = radius_min + Math.random() * (radius_max - radius_min);
    particles[i] = new Particle({
      color: `hsl(${Math.floor(360 * Math.random())},100%,50%)`,
      radius: radius,
      pos: [radius + (cWidth - 2 * radius) * Math.random(), radius + (cHeight - 2 * radius) * Math.random()],
      restitution: 1,
    });
    const vel = 100;
    const angel = 2 * Math.PI * Math.random();
    particles[i].linearVel = [Math.cos(angel) * vel, Math.sin(angel) * vel];
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
    const dist = Vector.distance(el.point, p);
    if (dist <= r) {
      const vel = n * 100000 * (1 - dist / r);
      const normal = Vector.normalize(Vector.sub(particles[el.key].pos, p));
      particles[el.key].addForce(Vector.scale(normal, vel));
    }
  });
});
const update = (delta) => {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);
  const dt = delta / n;
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < particles.length; i++) {
      particles[i].update(dt);
    }
    qtree.clear();
    for (let i = 0; i < particles.length; i++) {
      qtree.insert({ key: i, point: particles[i].pos });
    }

    for (let i = 0; i < particles.length; i++) {
      const w = particles[i].radius + radius_max;
      const h = particles[i].radius + radius_max;
      const range = new Rectangle(particles[i].pos[0] - w, particles[i].pos[1] - h, w * 2, h * 2);
      const query_points = qtree.query(range);
      const particleA = particles[i];
      for (let j = 0; j < query_points.length; j++) {
        const key = query_points[j].key;
        if (i === key) continue;
        const particleB = particles[key];
        Particle.collide(particleA, particleB);
      }
    }
    const wellRestitution = 1;
    Particle.constraint(particles, [cWidth, 0], [0, 0], wellRestitution);
    Particle.constraint(particles, [0, cHeight], [cWidth, cHeight], wellRestitution);
    Particle.constraint(particles, [0, 0], [0, cHeight], wellRestitution);
    Particle.constraint(particles, [cWidth, cHeight], [cWidth, 0], wellRestitution);
  }

  //qtree.render(ctx);
  for (let i = 0; i < particles.length; i++) {
    particles[i].render(ctx);
  }
};
let oldTime = 0;
const animate = (t) => {
  requestAnimationFrame(animate);
  const delta = Math.min(Math.max((t - oldTime) / 1000, 0.01), 0.05);
  oldTime = t;
  update(delta);
  ctx.font = "18px Noto Sans TC";
  ctx.textAlign = "start";
  ctx.textBaseline = "hanging";
  ctx.fillStyle = "#ffffff";
  ctx.fillText((1 / delta).toFixed(1), 10, 10);
};
requestAnimationFrame(animate);
