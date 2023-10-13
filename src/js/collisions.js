import { Vector } from "./vector.js";
export class Collisions {
  static resolveCollisionBasic(bodyA_linearVel, bodyB_linearVel, bodyA_invMass, bodyB_invMass, e, normal) {
    const relativeVel = Vector.sub(bodyB_linearVel, bodyA_linearVel);
    if (Vector.dot(relativeVel, normal) > 0) {
      return;
    }

    const j = (-(1 + e) * Vector.dot(relativeVel, normal)) / (bodyA_invMass + bodyB_invMass);
    const impulse = Vector.scale(normal, j);
    return impulse;
  }

  static intersectCircles(centerA, radiusA, centerB, radiusB) {
    const distance = Vector.distance(centerA, centerB);
    const radii = radiusA + radiusB;

    if (distance >= radii) {
      return;
    }

    const normal = Vector.normalize(Vector.sub(centerB, centerA));
    const depth = radii - distance;

    return { normal, depth };
  }
}
