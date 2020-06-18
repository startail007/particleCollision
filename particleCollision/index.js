import { Particle } from "../js/particle.js";

let canvas, ctx, cWidth, cHeight;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
cWidth = canvas.width;
cHeight = canvas.height;

let mPos = [0, 0];

canvas.addEventListener("mousemove", function (el) {
  mPos[0] = el.clientX;
  mPos[1] = el.clientY;
});

/*function handleScroll() {
  console.log("aaa");
}
window.addEventListener("mousemove", debounce(handleScroll));*/

let particles = [];
for (let i = 0; i < 400; i++) {
  let radius = 3 + Math.random() * 3;
  particles.push(
    new Particle(
      `hsl(${Math.floor(360 * Math.random())},100%,50%)`,
      //"#ffffff",
      [radius + (cWidth - 2 * radius) * Math.random(), radius + (cHeight - 2 * radius) * Math.random()],
      2,
      2 * Math.PI * Math.random(),
      radius
    )
  );
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

function update() {
  //ctx.clearRect(0, 0, cWidth, cHeight);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);

  /*particles.forEach((ele, i, ary) => {
    ele.update();
  });*/
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].collisionCheck(particles);
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].boundaryCheck(cWidth, cHeight);
  }
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
update();
let oldTime = Date.now();
//let count = 0;
let animate = function () {
  requestAnimationFrame(animate);
  let nowTime = Date.now();
  let delta = (nowTime - oldTime) / 1000;
  oldTime = nowTime;
  //console.log(1 / delta);

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
