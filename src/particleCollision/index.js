import { Particle } from "../js/particle.js";
import { isPhone } from "../js/base.js";

let canvas, ctx, cWidth, cHeight;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
cWidth = canvas.width;
cHeight = canvas.height;

//let mPos = [0, 0];
const isPC = !isPhone();

/*canvas.addEventListener("mousemove", function (el) {
  mPos[0] = el.clientX;
  mPos[1] = el.clientY;
});*/

/*function handleScroll() {
  console.log("aaa");
}
window.addEventListener("mousemove", debounce(handleScroll));*/

let particles = [];
for (let i = 0; i < (isPC ? 2000 : 1000); i++) {
  let radius = 3 + Math.random() * 3;
  const particle = new Particle({
    color: `hsl(${Math.floor(360 * Math.random())},100%,50%)`,
    pos: [radius + (cWidth - 2 * radius) * Math.random(), radius + (cHeight - 2 * radius) * Math.random()],
    radius,
    restitution: 1,
  });
  const vel = 25;
  const angel = 2 * Math.PI * Math.random();
  particle.linearVel = [Math.cos(angel) * vel, Math.sin(angel) * vel];
  particles.push(particle);
}
//particles.push(new Particle("#ff0000", [250, 250], 10, 0.5 * Math.PI, 80));
//particles.push(new Particle("#00ff00", [300, 300], 20, 0.5 * Math.PI, 100));
//particles.push(new Particle("#ff0000", [200, 300], 5, 0 * Math.PI, 80));
//particles.push(new Particle("#00ff00", [300, 300], 2, 1 * Math.PI, 100));
/*particles.push(new Particle("#ff0000", [280, 300], 20, 1 * Math.PI, 30));
particles.push(new Particle("#00ff00", [340, 300], 0, 0 * Math.PI, 30));
particles.push(new Particle("#0000ff", [400, 300], 0, 0 * Math.PI, 30));*/

//particles.push(new Particle("#ff0000", [290, 300], 5, 0 * Math.PI, 20));
//particles.push(new Particle("#00ff00", [300, 300], 2, 0 * Math.PI, 20));

function update(delta) {
  //ctx.clearRect(0, 0, cWidth, cHeight);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update(0.1);
  }
  for (let i = 0; i < particles.length; i++) {
    const particleA = particles[i];
    for (let j = 0; j < particles.length; j++) {
      if (i === j) continue;
      const particleB = particles[j];
      Particle.collide(particleA, particleB);
    }
  }
  const wellRestitution = 1;
  Particle.constraint(particles, [cWidth, 0], [0, 0], wellRestitution);
  Particle.constraint(particles, [0, cHeight], [cWidth, cHeight], wellRestitution);
  Particle.constraint(particles, [0, 0], [0, cHeight], wellRestitution);
  Particle.constraint(particles, [cWidth, cHeight], [cWidth, 0], wellRestitution);
  /*particles.forEach((ele, i, ary) => {
    ele.collisionCheck(ary);
  });
  particles.forEach((ele, i, ary) => {
    ele.boundCheck(cWidth, cHeight);
  });*/
  //ctx.save();
  //particles.forEach((ele) => ele.render(ctx, "#ffffff"));
  for (let i = 0; i < particles.length; i++) {
    particles[i].render(ctx);
  }
  //ctx.restore();
}
let oldTime = 0;
let animate = function (t) {
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
