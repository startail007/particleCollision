class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  constains(point) {
    return point[0] >= this.x && point[0] <= this.x + this.w && point[1] >= this.y && point[1] <= this.y + this.h;
  }

  intersect(rect) {
    return !(
      rect.x > this.x + this.w ||
      rect.x + rect.w < this.x ||
      rect.y > this.y + this.h ||
      rect.y + rect.h < this.y
    );
  }
}
class Quadtree {
  constructor(boundary, minRange = 1, maxPoints = 4, maxLevel = 5, level = 0) {
    this.boundary = boundary;
    this.center = [boundary.x + boundary.w * 0.5, boundary.y + boundary.h * 0.5];
    this.minRange = minRange;
    this.maxPoints = maxPoints;
    this.maxLevel = maxLevel;
    this.level = level;

    this.points = [];
    this.divided = false;
    this.used = false;
  }
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w * 0.5;
    let h = this.boundary.h * 0.5;
    this.northwest = new Quadtree(
      new Rectangle(x, y, w, h),
      this.minRange,
      this.maxPoints,
      this.maxLevel,
      this.level + 1
    );
    this.northeast = new Quadtree(
      new Rectangle(x + w, y, w, h),
      this.minRange,
      this.maxPoints,
      this.maxLevel,
      this.level + 1
    );
    this.southeast = new Quadtree(
      new Rectangle(x + w, y + h, w, h),
      this.minRange,
      this.maxPoints,
      this.maxLevel,
      this.level + 1
    );
    this.southwest = new Quadtree(
      new Rectangle(x, y + h, w, h),
      this.minRange,
      this.maxPoints,
      this.maxLevel,
      this.level + 1
    );
  }
  insertOrientation(pointData) {
    if (pointData.point[0] < this.center[0]) {
      if (pointData.point[1] < this.center[1]) {
        this.northwest.insert(pointData);
      } else {
        this.southwest.insert(pointData);
      }
    } else {
      if (pointData.point[1] < this.center[1]) {
        this.northeast.insert(pointData);
      } else {
        this.southeast.insert(pointData);
      }
    }
  }
  insert(pointData) {
    if (!this.divided) {
      if (this.points.length < this.maxPoints || this.level > this.maxLevel) {
        this.points.push(pointData);
      } else {
        if (this.boundary.w > this.minRange && this.boundary.h > this.minRange) {
          this.divided = true;
          if (!this.used) {
            this.used = true;
            this.subdivide();
          }
          for (let i = 0; i < this.points.length; i++) {
            this.insertOrientation(this.points[i]);
          }
          this.points = [];
          this.insertOrientation(pointData);
        } else {
          this.points.push(pointData);
        }
      }
    } else {
      this.insertOrientation(pointData);
    }
  }
  query(range, found) {
    if (!found) found = [];
    if (!this.boundary.intersect(range)) return found;
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southeast.query(range, found);
      this.southwest.query(range, found);
    } else {
      for (let i = 0; i < this.points.length; i++) {
        if (range.constains(this.points[i].point)) {
          found.push(this.points[i]);
        }
      }
    }
    return found;
  }
  clear() {
    this.points = [];
    if (this.divided) {
      this.northwest.clear();
      this.northeast.clear();
      this.southeast.clear();
      this.southwest.clear();
      this.divided = false;
    }
  }
  render(ctx) {
    ctx.strokeStyle = "#ffffff";
    ctx.beginPath();
    ctx.strokeRect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    ctx.stroke();

    if (this.divided) {
      this.northwest.render(ctx);
      this.northeast.render(ctx);
      this.southeast.render(ctx);
      this.southwest.render(ctx);
    }
  }
}
export { Rectangle, Quadtree };
