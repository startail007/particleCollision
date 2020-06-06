import { Rectangle, Quadtree } from "../js/quadtreeE.js";
let canvas, ctx, cWidth, cHeight;
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
cWidth = canvas.width;
cHeight = canvas.height;

let mPos = [0, 0];
let mBool = false;
canvas.addEventListener("mousedown", function (el) {
  mBool = true;
});
window.addEventListener("mouseup", function (el) {
  mBool = false;
});
canvas.addEventListener("mousemove", function (el) {
  mPos[0] = el.offsetX;
  mPos[1] = el.offsetY;
  if (mBool) {
    let point = [...mPos];
    points.push(point);
    qtree.insert({ key: points.length - 1, point: point });
  }
});
let rect = new Rectangle(0, 0, cWidth, cHeight);

let points = [];
for (let i = 0; i < 10; i++) {
  points.push([Math.random() * cWidth, Math.random() * cHeight]);
}

let qtree = new Quadtree(rect, 2, 4, 8);
/*for (let i = 0; i < points.length; i++) {
  qtree.insert({ key: i, point: points[i] });
}*/

canvas.addEventListener("click", function (el) {
  //console.log(el);
  mPos[0] = el.offsetX;
  mPos[1] = el.offsetY;
  let point = [...mPos];
  points.push(point);
  qtree.insert({ key: points.length - 1, point: point });
});
//console.log(qtree);
function update() {
  //ctx.clearRect(0, 0, cWidth, cHeight);
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);

  ctx.save();

  for (let i = 0; i < points.length; i++) {
    points[i][0] += 1 - Math.random() * 2;
    points[i][1] += 1 - Math.random() * 2;
  }

  //let qtree = new Quadtree(rect);
  qtree.clear();
  for (let i = 0; i < points.length; i++) {
    qtree.insert({ key: i, point: points[i] });
  }
  ctx.lineWidth = 0.5;
  qtree.render(ctx);
  ctx.fillStyle = "#00ffff";
  for (let i = 0; i < points.length; i++) {
    ctx.beginPath();
    //ctx.fillRect(points[i][0] - 1, points[i][1] - 1, 2, 2);
    ctx.arc(points[i][0], points[i][1], 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  let range;
  let query_points;
  //for (let i = 0; i < points.length; i++) {
  range = new Rectangle(mPos[0] - 100, mPos[1] - 100, 200, 200);
  query_points = qtree.query(range);
  //}

  for (let i = 0; i < query_points.length; i++) {
    ctx.fillStyle = "#ff00ff";
    ctx.beginPath();
    ctx.arc(query_points[i].point[0], query_points[i].point[1], 3, 0, 2 * Math.PI);
    //ctx.fillRect(query_points[i].point[0] - 2, query_points[i].point[1] - 2, 4, 4);
    ctx.fill();
  }
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.strokeRect(range.x, range.y, range.w, range.h);
  ctx.stroke();
  ctx.restore();
}
update();
let oldTime = Date.now();
let animate = function () {
  requestAnimationFrame(animate);
  let nowTime = Date.now();
  let delta = (nowTime - oldTime) / 1000;
  oldTime = nowTime;
  update();

  ctx.font = "bold 18px Noto Sans TC";
  ctx.textAlign = "start";
  ctx.textBaseline = "hanging";
  ctx.fillStyle = "#ffffff";
  ctx.fillText((1 / delta).toFixed(1), 10, 10);
};
animate();
