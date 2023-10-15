const ball0 = {
  color: "#ff0000",
  p0: [100, 100],
  p1: [200, 200],
  radius: 15,
};
const ball1 = {
  color: "#0000ff",
  p0: [200, 150],
  p1: [130, 130],
  radius: 10,
};
const drawBall = (ctx, ball) => {
  ctx.save();
  ctx.lineWidth = ball.radius * 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = ball.color;
  ctx.beginPath();
  ctx.moveTo(...ball.p0);
  ctx.lineTo(...ball.p1);
  ctx.stroke();
  ctx.restore();
};
const getBallNormal = (ball) => {
  const edge = Vector.sub(ball.p1, ball.p0);
  return Vector.normalize(Vector.normal(edge));
};
const projectPoints = (points, axis) => {
  let min = Infinity;
  let max = -Infinity;

  points.forEach((point) => {
    const projected = Vector.dot(point, axis);
    min = Math.min(min, projected);
    max = Math.max(max, projected);
  });

  return { min, max };
};
const overlapping = (ball0, ball1) => {
  const axes = [getBallNormal(ball0), getBallNormal(ball1)];
  for (const axis of axes) {
    const projection1 = projectPoints([ball0.p0, ball0.p1], axis);
    const projection2 = projectPoints([ball1.p0, ball1.p1], axis);
    if (projection1.min >= projection2.max || projection2.min >= projection1.max) {
      return false;
    }
  }
  return true;
};

drawBall(ctx, ball0);
drawBall(ctx, ball1);
