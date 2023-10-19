import { Vector, VectorE } from "../js/vector.js";
class Ball {
  static drawLine(ctx, p0, p1, radius, color) {
    ctx.save();
    const normal = Vector.normal(Vector.sub(p1, p0));
    const a0 = Math.atan2(normal[1], normal[0]);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(...p0, radius, a0, a0 + Math.PI);
    ctx.arc(...p1, radius, a0 - Math.PI, a0);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(...p0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.restore();
  }
  static collide(bodyA, bodyB) {
    const t = resolveBallsCollisionRate(
      bodyA.pos,
      bodyA.linearVel,
      bodyB.pos,
      bodyB.linearVel,
      bodyA.radius + bodyB.radius
    );
    if (t !== undefined) {
      const bodyA_0 = Vector.add(bodyA.pos, Vector.scale(bodyA.linearVel, t));
      const bodyB_0 = Vector.add(bodyB.pos, Vector.scale(bodyB.linearVel, t));
      const normal = Vector.normalize(Vector.sub(bodyB_0, bodyA_0));
      const impulse = resolveCollisionBasic(bodyA.linearVel, bodyB.linearVel, normal, 1, bodyA.invMass, bodyB.invMass);

      const bodyAnewV = Vector.sub(bodyA.linearVel, Vector.scale(impulse, bodyA.invMass));
      const bodyBnewV = Vector.add(bodyB.linearVel, Vector.scale(impulse, bodyB.invMass));
      VectorE.set(bodyA.pos, bodyA_0);
      VectorE.set(bodyB.pos, bodyB_0);
      bodyA.updateRate = 1 - t;
      bodyB.updateRate = 1 - t;
      VectorE.set(bodyA.linearVel, bodyAnewV);
      VectorE.set(bodyB.linearVel, bodyBnewV);
      return { bodyA_0, bodyB_0 };
    }
  }

  // static collideLines(body, p0, p1, p2, p3) {
  //   const pos = Vector.clone(body.pos);
  //   const linearVel = Vector.clone(body.linearVel);
  //   let rate = 1;
  //   const t = resolveBallLineCollisionRate(body.pos, body.linearVel, body.radius, p2, p3);

  //   if (t !== undefined) {
  //     rate -= t;
  //     const collisionPos = Vector.add(pos, Vector.scale(linearVel, t));
  //     const normal = Vector.negate(Vector.normalize(Vector.normal(Vector.sub(p3, p2))));
  //     const impulse = resolveCollisionBasic(linearVel, [0, 0], normal, 1, body.invMass, 0);
  //     VectorE.set(linearVel, Vector.sub(linearVel, Vector.scale(impulse, body.invMass)));
  //     VectorE.set(pos, collisionPos);
  //   }
  //   VectorE.set(body.pos, pos);
  //   VectorE.set(body.linearVel, linearVel);
  //   console.log(pos, linearVel);
  // }
  constructor(pos, linearVel, radius, color) {
    this.pos = pos;
    this.linearVel = linearVel;
    this.updateRate = 1;
    this.color = color;
    this.radius = radius;
    this.density = 1;
    this.area = this.radius * this.radius * Math.PI;
    this.mass = this.density * this.area;
    this.invMass = 1 / this.mass;
  }
  update() {
    VectorE.add(this.pos, Vector.scale(this.linearVel, this.updateRate));
  }
  render(ctx) {
    Ball.drawLine(ctx, this.pos, Vector.add(this.pos, this.linearVel), this.radius, this.color);
  }
}
const balls = [];
balls.push(new Ball([250, 50], [50, 50], 15, "#ff0000"));
balls.push(new Ball([220, -150], [80, 200], 5, "#0000ff"));
balls.push(new Ball([480, 500], [-50, 400], 5, "#0000ff"));

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cHeight = canvas.height;

const resolveBallsCollisionRate = (pA, pAv, pB, pBv, dist) => {
  const BA0v = Vector.sub(pB, pA);
  const BAv = Vector.sub(pBv, pAv);
  const a = BAv[0] ** 2 + BAv[1] ** 2;
  const b = 2 * (BAv[0] * BA0v[0] + BAv[1] * BA0v[1]);
  const c = BA0v[0] ** 2 + BA0v[1] ** 2 - dist ** 2;
  const denom = b ** 2 - 4 * a * c;
  if (denom < 0) return;
  const t0 = (-b - Math.sqrt(denom)) / (2 * a);
  if (t0 >= 0 && t0 <= 1) return t0;
  const t1 = (-b + Math.sqrt(denom)) / (2 * a);
  if (t1 >= 0 && t1 <= 1) return t1;
};
const resolveBallLineCollisionRate = (pA, pAv, dist, p0, p1) => {
  const dir = Vector.sub(p1, p0);
  const denom = Vector.cross(pAv, dir);
  if (denom == 0) return;
  const t = (Vector.cross(dir, Vector.sub(pA, p0)) - Vector.length(dir) * dist) / denom;
  if (t >= 0 && t <= 1) return t;
};
const resolveCollisionBasic = (linearVelA, linearVelB, normal, restitution, invMassA, invMassB) => {
  const relativeVel = Vector.sub(linearVelB, linearVelA);
  if (Vector.dot(relativeVel, normal) > 0) {
    return;
  }
  const e = restitution;
  const j = (-(1 + e) * Vector.dot(relativeVel, normal)) / (invMassA + invMassB);
  const impulse = Vector.scale(normal, j);
  return impulse;
};
const run = () => {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, cWidth, cHeight);
  balls.forEach((ball) => {
    ball.updateRate = 1;
  });
  for (let i = 0; i < balls.length - 1; i++) {
    const ball0 = balls[i];
    for (let j = i + 1; j < balls.length; j++) {
      const ball1 = balls[j];
      const info = Ball.collide(ball0, ball1);
      if (info) {
        const { bodyA_0, bodyB_0 } = info;
        ctx.strokeStyle = ball0.color;
        ctx.beginPath();
        ctx.arc(...bodyA_0, ball0.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = ball1.color;
        ctx.beginPath();
        ctx.arc(...bodyB_0, ball1.radius, 0, 2 * Math.PI);
        ctx.stroke();

        const bodyAnewP = Vector.add(bodyA_0, Vector.scale(ball0.linearVel, ball0.updateRate));
        const bodyBnewP = Vector.add(bodyB_0, Vector.scale(ball1.linearVel, ball1.updateRate));

        Ball.drawLine(ctx, bodyA_0, bodyAnewP, ball0.radius, ball0.color);
        Ball.drawLine(ctx, bodyB_0, bodyBnewP, ball1.radius, ball1.color);
      }
    }
  }
  balls.forEach((ball) => {
    ball.update();
  });
  balls.forEach((ball) => {
    ball.render(ctx);
  });
};
// const p0 = [0, 0];
// const p1 = [cWidth, 0];
// const p2 = [cWidth, cHeight];
// const p3 = [0, cHeight];
// Ball.collideLines(balls[2], p0, p1, p2, p3);
// ctx.strokeStyle = balls[2].color;
// ctx.beginPath();
// ctx.arc(...Vector.add(balls[2].pos, Vector.scale(balls[2].linearVel, t)), balls[2].radius, 0, 2 * Math.PI);
// ctx.stroke();
// ctx.strokeStyle = "#ff0000";
// ctx.beginPath();
// ctx.moveTo(...p0);
// ctx.lineTo(...p1);
// ctx.stroke();
balls.forEach((ball) => {
  ball.render(ctx);
});
//run();
// run();
// run();
// console.log(ball0.pos, ball0.linearVel);
// console.log(ball1.pos, ball1.linearVel);
