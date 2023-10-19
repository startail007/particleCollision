import { Line } from "./Line.js";
import { Collisions } from "./collisions.js";
import { Vector, VectorE } from "./vector.js";
export class Particle {
  constructor({ color = "#000000", pos = [0, 0], radius = 10, density = 1, restitution = 1 }) {
    this.color = color;
    this.pos = Vector.clone(pos);
    this.linearVel = Vector.zero();
    this.density = density;
    this.radius = radius;
    this.area = this.radius * this.radius * Math.PI;
    this.mass = this.density * this.area;
    this.invMass = this.mass ? 1 / this.mass : 0;
    this.restitution = restitution;
    this.force = Vector.zero();
  }
  update(dt) {
    VectorE.add(this.linearVel, Vector.scale(this.force, dt));
    VectorE.add(this.pos, Vector.scale(this.linearVel, dt));
    this.force = Vector.zero();
  }
  render(ctx) {
    ctx.fillStyle = this.color;
    //ctx.fillStyle = `hsl(0,${Math.min(Vector.length(this.linearVel) / 0.04, 100)}%,50%)`;
    ctx.beginPath();
    ctx.arc(...this.pos, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  static constraint(particles, p0, p1, wallRestitution) {
    const v = Vector.sub(p1, p0);
    const normal = Vector.normal(Vector.normalize(v));
    particles.forEach((particle) => {
      const v0 = Vector.sub(particle.pos, p0);
      const dist = Vector.cross(v0, v) / Vector.length(v) - particle.radius;
      if (dist < 0) {
        VectorE.sub(particle.pos, Vector.scale(normal, Math.abs(dist)));
        const impulse = Collisions.resolveCollisionBasic(
          particle.linearVel,
          Vector.zero(),
          particle.invMass,
          0,
          Math.min(particle.restitution, wallRestitution),
          normal
        );
        if (!impulse) return;
        VectorE.sub(particle.linearVel, Vector.scale(impulse, particle.invMass));
      }
    });
  }
  addForce(amount) {
    this.force = amount;
  }
  static collide(bodyA, bodyB) {
    const info = Collisions.intersectCircles(bodyA.pos, bodyA.radius, bodyB.pos, bodyB.radius);
    if (!info) return;
    const { normal, depth } = info;

    const mtv = Vector.scale(normal, depth * 0.5);
    VectorE.sub(bodyA.pos, mtv);
    VectorE.add(bodyB.pos, mtv);

    const e = Math.min(bodyA.restitution, bodyB.restitution);
    const impulse = Collisions.resolveCollisionBasic(
      bodyA.linearVel,
      bodyB.linearVel,
      bodyA.invMass,
      bodyB.invMass,
      e,
      normal
    );
    if (!impulse) return;
    VectorE.sub(bodyA.linearVel, Vector.scale(impulse, bodyA.invMass));
    VectorE.add(bodyB.linearVel, Vector.scale(impulse, bodyB.invMass));
  }
}
