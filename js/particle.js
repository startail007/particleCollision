//import { Point } from "./point.js";
import { Vector, VectorE } from "./vector.js";
class Particle {
  constructor(color = "#000000", pos = [0, 0], velocity = 10, direct = 0, radius = 10, mass = 1) {
    this.options = {
      color,
      pos,
      velocity,
      direct,
      radius,
      mass,
    };
    this.init();
  }
  init() {
    this.pos = this.options.pos.slice();
    this.velocity = [
      Math.cos(this.options.direct) * this.options.velocity,
      Math.sin(this.options.direct) * this.options.velocity,
    ];
    this.radius = this.options.radius;
    this.mass = this.options.mass;
    this.collision = false;
    this.velocity0 = [0, 0];
  }
  /*setVelocity(velocity = 10, direct = 0) {
    this.velocity[0] = Math.cos(direct) * velocity;
    this.velocity[1] = Math.sin(direct) * velocity;
  }
  setPos(x = 0, y = 0) {
    this.pos[0] = x;
    this.pos[1] = y;
  }
  setRadius(radius) {
    this.radius = radius;
  }
  setMass(mass) {
    this.mass = mass;
  }
  update() {
    this.pos[0] += this.velocity[0];
    this.pos[1] += this.velocity[1];
  }
  render(ctx) {
    ctx.fillStyle = this.options.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  boundaryCheck(width, height) {
    if (this.pos[0] - this.radius < 0 && this.velocity[0] < 0) {
      this.velocity[0] *= -1;
      this.pos[0] = 0 + this.radius;
    } else if (this.pos[0] + this.radius > width && this.velocity[0] > 0) {
      this.velocity[0] *= -1;
      this.pos[0] = width - this.radius;
    } else if (this.pos[1] - this.radius < 0 && this.velocity[1] < 0) {
      this.velocity[1] *= -1;
      this.pos[1] = 0 + this.radius;
    } else if (this.pos[1] + this.radius > height && this.velocity[1] > 0) {
      this.velocity[1] *= -1;
      this.pos[1] = height - this.radius;
    }
  }
  collisionCheck(particles) {
    for (let i = 0; i < particles.length; i++) {
      let ele = particles[i];
      if (this === ele) {
        return;
      }
      let pos = this.pos;
      let otherPos = ele.pos;
      let r = Point.distance(pos, otherPos);
      if (r > 0 && r < this.radius + ele.radius) {
        let dir1 = Point.getVector(pos, otherPos);
        VectorE.scale(dir1, this.radius / r);
        let dir2 = Point.getVector(otherPos, pos);
        VectorE.scale(dir2, ele.radius / r);
        let c = Point.toPosRate(pos, otherPos, this.radius / (this.radius + ele.radius));

        let move1 = Point.getVector(Point.addVector(pos, dir1), c);
        VectorE.scale(move1, 0.5);
        let move2 = Point.getVector(Point.addVector(otherPos, dir2), c);
        VectorE.scale(move2, 0.5);

        VectorE.add(pos, move1);
        VectorE.add(otherPos, move2);

        let velocityDiff = Vector.sub(this.velocity, ele.velocity);

        if (Vector.dot(velocityDiff, dir1) >= 0) {
          let force1 = Vector.projection(this.velocity, dir1);
          let force2 = Vector.projection(ele.velocity, dir2);

          VectorE.sub(this.velocity, force1);
          VectorE.sub(ele.velocity, force2);

          let v1 = Vector.collisionCalc(force1, force2, this.mass, ele.mass);
          let v2 = Vector.collisionCalc(force2, force1, ele.mass, this.mass);

          VectorE.add(this.velocity, v1);
          VectorE.add(ele.velocity, v2);
        }
      }
    }
  }*/
}
export { Particle };
