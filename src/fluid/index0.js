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
const particleCount = 900;
const collisionDamping = 1;
const gravity = [0, 9.81 * 20];
const w = 30;
const h = Math.ceil(particleCount / w);
const spacing = 6;
for (let i = 0; i < particleCount; i++) {
  // particles[i] = new FluidParticle([Math.random() * cWidth, Math.random() * cHeight]);
  // particles[i].linearVel = [200 - Math.random() * 400, 200 - Math.random() * 400];
  const x = i % w;
  const y = Math.floor(i / w);
  particles.push(
    new FluidParticle([cWidth * 0.5 + (x - w * 0.5 + 0.5) * spacing, cHeight * 0.5 + (y - h * 0.5 + 0.5) * spacing])
  );
}
const xN = Math.floor(cWidth / 10) + 1;
const yN = Math.floor(cHeight / 10) + 1;
const fieldPoints = [];
for (let j = 0; j < yN; j++) {
  fieldPoints[j] = [];
  for (let i = 0; i < xN; i++) {
    fieldPoints[j][i] = { pos: [i * 10, j * 10], density: 0, force: [0, 0] };
  }
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
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    const dist = Vector.distance(particle.pos, pos);
    const influence = smoothingKernel(smoothingRadius, dist);
    density += mass * influence;
  }
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
const targetDensity = 0.005;
const pressureMul = 30000;
const convertDensityToPressure = (density) => {
  //return density * 9.81 * 100;
  const densityError = density - targetDensity;
  const pressure = Math.max(0, densityError * pressureMul);
  return pressure;
};
const calcPropertyForce = (particleA, particles, smoothingRadius) => {
  const propertyForce = Vector.zero();
  // const mass = smoothingRadius * smoothingRadius * Math.PI;
  const mass = 1;
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    if (particle === particleA) continue;
    const v = Vector.sub(particle.pos, particleA.pos);
    const dist = Vector.length(v);
    if (!dist) continue;
    const dir = dist == 0 ? getRandomDir() : Vector.divScale(v, dist);
    const slop = smoothingKernelDerivative(dist, smoothingRadius);
    let density = particle.fieldDensity;
    if (!density) continue;
    const d = (convertDensityToPressure(density) + convertDensityToPressure(particleA.fieldDensity)) * 0.5;
    VectorE.add(propertyForce, Vector.scale(dir, (d * slop * mass) / density));
  }
  return propertyForce;
};
const update = (delta) => {
  const radius = 30;
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);

  // for (let j = 0; j < yN; j++) {
  //   for (let i = 0; i < xN; i++) {
  //     fieldPoints[j][i].density = 0;
  //   }
  // }
  // const smoothingRadius = 60;
  // const range = Math.round(smoothingRadius / 10);
  // const mass = 1;
  // for (let k = 0; k < particles.length; k++) {
  //   const particle = particles[k];
  //   const index = Vector.round(Vector.divScale(particle.pos, 10));
  //   const xMin = Math.max(index[0] - range, 0);
  //   const xMax = Math.min(index[0] + range, xN);
  //   const yMin = Math.max(index[1] - range, 0);
  //   const yMax = Math.min(index[1] + range, yN);
  //   for (let j = yMin; j < yMax; j++) {
  //     for (let i = xMin; i < xMax; i++) {
  //       const dist = Vector.distance(fieldPoints[j][i].pos, particle.pos);
  //       const influence = smoothingKernel(smoothingRadius, dist);
  //       fieldPoints[j][i].density += mass * influence;
  //     }
  //   }
  // }
  // for (let k = 0; k < particles.length; k++) {
  //   const particle = particles[k];
  //   const index = Vector.round(Vector.divScale(particle.pos, 10));
  //   const xMin = Math.max(index[0] - range, 0);
  //   const xMax = Math.min(index[0] + range, xN);
  //   const yMin = Math.max(index[1] - range, 0);
  //   const yMax = Math.min(index[1] + range, yN);
  //   const propertyForce = Vector.zero();
  //   const pDensity = fieldPoints[index[1]][index[0]].density;
  //   for (let j = yMin; j < yMax; j++) {
  //     for (let i = xMin; i < xMax; i++) {
  //       if (i == 0 && j == 0) continue;
  //       const v = Vector.sub(fieldPoints[j][i].pos, particle.pos);
  //       const dist = Vector.length(v);
  //       const dir = dist == 0 ? getRandomDir() : Vector.divScale(v, dist);
  //       const slop = smoothingKernelDerivative(dist, smoothingRadius);
  //       let density = fieldPoints[j][i].density;
  //       if (!density) continue;
  //       const d = (convertDensityToPressure(density) + convertDensityToPressure(pDensity)) * 0.5;
  //       VectorE.add(propertyForce, Vector.scale(dir, (d * slop * mass) / density));
  //     }
  //   }
  //   const propertyAcc = Vector.divScale(propertyForce, pDensity);
  //   VectorE.add(particle.linearVel, Vector.scale(propertyAcc, delta));
  // }
  // let min = Number.MAX_VALUE;
  // let max = Number.MIN_VALUE;
  // for (let j = 0; j < yN; j++) {
  //   for (let i = 0; i < xN; i++) {
  //     if (fieldPoints[j][i].density < min) {
  //       min = fieldPoints[j][i].density;
  //     }
  //     if (fieldPoints[j][i].density > max) {
  //       max = fieldPoints[j][i].density;
  //     }
  //     const t = Float.clamp(0, 1, Float.toRate(0, 0.008, fieldPoints[j][i].density));
  //     const l = Math.floor(Float.mix(0, 100, t));
  //     ctx.fillStyle = `hsl(0,0%,${l}%)`;
  //     ctx.beginPath();
  //     ctx.rect(...Vector.sub(fieldPoints[j][i].pos, [5, 5]), 10, 10);
  //     ctx.fill();
  //   }
  // }

  // // console.log(min, max);

  // for (let i = 0; i < particles.length; i++) {
  //   const particle = particles[i];
  //   // particle.update(delta);
  //   VectorE.add(particle.pos, Vector.scale(particle.linearVel, delta));
  //   resolveCollision(particle, rect, collisionDamping);
  // }

  // for (let k = 0; k < particles.length; k++) {
  //   ctx.fillStyle = "#ff0000";
  //   ctx.beginPath();
  //   ctx.arc(...particles[k].pos, 1, 0, 2 * Math.PI);
  //   ctx.fill();
  // }
  qtree.clear();
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    qtree.insert({ key: i, point: particle.pos });
  }
  const list = [];
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    const range = new Rectangle(particle.pos[0] - radius, particle.pos[1] - radius, radius * 2, radius * 2);
    list[i] = qtree
      .query(range)
      .filter((el) => Vector.distance(particles[el.key].pos, particle.pos) <= radius)
      .map((el) => particles[el.key]);
  }
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    VectorE.add(particle.linearVel, Vector.scale(gravity, delta));
    VectorE.set(particle.predictedPos, Vector.add(particle.pos, Vector.scale(particle.linearVel, delta)));
  }
  for (let i = 0; i < particles.length; i++) {
    const query_particles = list[i];
    particles[i].fieldDensity = calcDensity(particles[i].predictedPos, query_particles, radius);
  }
  for (let i = 0; i < particles.length; i++) {
    const query_particles = list[i];
    const particle = particles[i];
    VectorE.scale(particle.linearVel, 0.99);
    const propertyForce = calcPropertyForce(particle, query_particles, radius);
    const propertyAcc = Vector.divScale(propertyForce, particle.fieldDensity);
    VectorE.add(particle.linearVel, Vector.scale(propertyAcc, delta));
  }

  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    // particle.update(delta);
    VectorE.add(particle.pos, Vector.scale(particle.linearVel, delta));
    resolveCollision(particle, rect, collisionDamping);
  }
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    particle.render(ctx);
  }
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
  ctx.fillText(particles.length, 10, 30);
};
requestAnimationFrame(animate);
