import { Rectangle, Quadtree } from "../js/quadtree.js";
import { Vector, VectorE } from "../js/vector.js";
import { Collisions } from "../js/collisions.js";
import { Float } from "../js/Float.js";
class FluidParticle {
  constructor(pos) {
    this.pos = Vector.clone(pos);
    this.predictedPos = Vector.zero();
    this.force = Vector.zero();
    this.linearVel = Vector.zero();
    this.active = false;
    this.radius = 2;
    this.fieldDensity = 0;
    this.propertyForce = [0, 0];
    this.density = 1;
    this.area = this.radius * this.radius * Math.PI;
    this.mass = this.density * this.area;
  }
  update(dt) {
    VectorE.add(this.linearVel, Vector.scale(this.force, dt));
    VectorE.add(this.pos, Vector.scale(this.linearVel, dt));
    this.force = Vector.zero();
  }

  render(ctx) {
    //ctx.fillStyle = this.active ? "#ff0000" : "#ffffff";
    // const t = Float.clamp(0, 1, Float.toRate(0.01, 0.025, this.fieldDensity));
    const t = Float.clamp(0, 1, Float.toRate(0, 600, Vector.length(this.linearVel)));
    const h = Math.floor(Float.mix(0, 360, t));
    ctx.fillStyle = `hsl(${h},100%,50%)`;
    ctx.beginPath();
    ctx.arc(...this.pos, this.radius, 0, 2 * Math.PI);
    ctx.fill();

    // ctx.strokeStyle = "#ffffff";
    // ctx.beginPath();
    // ctx.moveTo(...this.pos);
    // ctx.lineTo(...Vector.add(this.pos, Vector.scale(this.linearVel, 1 * 0.02)));
    // ctx.stroke();
  }
}
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cHeight = canvas.height;

const rect = new Rectangle(0, 0, cWidth, cHeight);
const qtree = new Quadtree(rect, 10);
const particles = [];
const particleCount = 400;
const collisionDamping = 1;
const gravity = [0, 9.81 * 10];
const w = 20;
const h = Math.ceil(particleCount / w);
const spacing = 8;
for (let i = 0; i < particleCount; i++) {
  //particles[i] = new FluidParticle([Math.random() * cWidth, Math.random() * cHeight]);
  // particles[i].linearVel = [200 - Math.random() * 400, 200 - Math.random() * 400];
  const x = i % w;
  const y = Math.floor(i / w);
  particles.push(
    new FluidParticle([cWidth * 0.5 + (x - w * 0.5 + 0.5) * spacing, cHeight * 0.5 + (y - h * 0.5 + 0.5) * spacing])
  );
}
canvas.addEventListener("click", (ev) => {
  VectorE.set(mPos, [ev.offsetX, ev.offsetY]);
  const particleCount = 100;
  const w = 10;
  const h = Math.ceil(particleCount / w);
  const spacing = 10;
  for (let i = 0; i < particleCount; i++) {
    const x = i % w;
    const y = Math.floor(i / w);
    particles.push(
      new FluidParticle([mPos[0] + (x - w * 0.5 + 0.5) * spacing, mPos[1] + (y - h * 0.5 + 0.5) * spacing])
    );
  }
});
const mPos = [0, 0];
canvas.addEventListener("mousemove", (ev) => {
  VectorE.set(mPos, [ev.offsetX, ev.offsetY]);
});
const resolveCollision = (particle, rect, collisionDamping) => {
  if (particle.pos[0] < rect.left + particle.radius) {
    particle.pos[0] = rect.left + particle.radius;
    particle.linearVel[0] *= -1 * collisionDamping;
  } else if (particle.pos[0] > rect.right - particle.radius) {
    particle.pos[0] = rect.right - particle.radius;
    particle.linearVel[0] *= -1 * collisionDamping;
  }
  if (particle.pos[1] < rect.top + particle.radius) {
    particle.pos[1] = rect.top + particle.radius;
    particle.linearVel[1] *= -1 * collisionDamping;
  } else if (particle.pos[1] > rect.bottom - particle.radius) {
    particle.pos[1] = rect.bottom - particle.radius;
    particle.linearVel[1] *= -1 * collisionDamping;
  }
};
// const smoothingKernel = (radius, dist) => {
//   if (dist >= radius) return 0;
//   const volume = (Math.PI * radius ** 8) / 4;
//   const value = radius ** 2 - dist ** 2);
//   return value ** 3 / volume;
// };
const smoothingKernel = (radius, dist) => {
  if (dist >= radius) return 0;
  const volume = (Math.PI * radius ** 4) / 6;
  return (radius - dist) ** 2 / volume;
};
const calcDensity = (pos, particles, smoothingRadius) => {
  let density = 0;
  const mass = 1;
  particles.forEach((particle) => {
    const dist = Vector.distance(particle.pos, pos);
    const influence = smoothingKernel(smoothingRadius, dist);
    density += mass * influence;
  });
  return density;
};
// const smoothingKernelDerivative = (dist, radius) => {
//   if (dist >= radius) return 0;
//   const f = radius ** 2 - dist ** 2;
//   const scale = -24 / (Math.PI * radius ** 8);
//   return scale * dist * f ** 2;
// };
const smoothingKernelDerivative = (dist, radius) => {
  if (dist >= radius) return 0;
  const scale = 12 / (Math.PI * radius ** 4);
  return scale * (dist - radius);
};
const getRandomDir = () => {
  const angle = Math.random() * 2 * Math.PI;
  return [Math.cos(angle), Math.sin(angle)];
};
const targetDensity = 0.012;
const pressureMul = 40;
const convertDensityToPressure = (density) => {
  //return density * 9.81 * 100;
  const densityError = density - targetDensity;
  const pressure = densityError * pressureMul;
  return pressure;
};
const calcPropertyForce = (particleA, particles, smoothingRadius) => {
  const propertyForce = Vector.zero();
  const mass = smoothingRadius * smoothingRadius * Math.PI;
  particles.forEach((particle) => {
    if (particle === particleA) return;
    const v = Vector.sub(particle.pos, particleA.pos);
    const dist = Vector.length(v);
    if (!dist) return;
    const dir = dist == 0 ? getRandomDir() : Vector.divScale(v, dist);
    const slop = smoothingKernelDerivative(dist, smoothingRadius);
    let density = particle.fieldDensity;
    if (!density) return;
    const d = (convertDensityToPressure(density) + convertDensityToPressure(particleA.fieldDensity)) * 0.5;
    VectorE.add(propertyForce, Vector.scale(dir, (d * slop * mass) / density));
  });
  return propertyForce;
};
const update = (delta) => {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);
  qtree.clear();
  particles.forEach((particle, i) => {
    particle.active = false;
    qtree.insert({ key: i, point: particle.pos });
  });
  const radius = 30;

  const list = particles.map((particle, i) => {
    const range = new Rectangle(particle.pos[0] - radius, particle.pos[1] - radius, radius * 2, radius * 2);
    return qtree
      .query(range)
      .filter((el) => Vector.distance(particles[el.key].pos, particle.pos) <= radius)
      .map((el) => particles[el.key]);
  });
  particles.forEach((particle) => {
    VectorE.add(particle.linearVel, Vector.scale(gravity, delta));
    VectorE.set(particle.predictedPos, Vector.add(particle.pos, Vector.scale(particle.linearVel, delta)));
  });
  list.forEach((query_particles, i) => {
    particles[i].fieldDensity = calcDensity(particles[i].predictedPos, query_particles, radius);
  });
  list.forEach((query_particles, i) => {
    const particle = particles[i];
    VectorE.scale(particle.linearVel, 0.99);
    const propertyForce = calcPropertyForce(particle, query_particles, radius);
    const propertyAcc = Vector.divScale(propertyForce, particle.fieldDensity);
    VectorE.add(particle.linearVel, Vector.scale(propertyAcc, delta));
  });

  particles.forEach((particle) => {
    // particle.update(delta);
    VectorE.add(particle.pos, Vector.scale(particle.linearVel, delta));
  });

  particles.forEach((particle) => resolveCollision(particle, rect, collisionDamping));
  particles.forEach((particle) => particle.render(ctx));
  ctx.strokeStyle = "#ff0000";
  ctx.beginPath();
  ctx.arc(...mPos, radius, 0, 2 * Math.PI);
  ctx.stroke();
  // qtree.render(ctx);
};
let oldTime = Date.now();
const animate = () => {
  requestAnimationFrame(animate);
  const now = Date.now();
  const delta = (now - oldTime) / 1000;
  oldTime = now;
  update(0.02);
  ctx.font = "18px Noto Sans TC";
  ctx.textAlign = "start";
  ctx.textBaseline = "hanging";
  ctx.fillStyle = "#ffffff";
  ctx.fillText((1 / delta).toFixed(1), 10, 10);
};
requestAnimationFrame(animate);
