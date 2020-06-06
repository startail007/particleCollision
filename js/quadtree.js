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
  constructor(boundary) {
    this.boundary = boundary;
    this.points = [];
    //this.area = [];
    this.divided = false;
    //this.used = false;
  }
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w * 0.5;
    let h = this.boundary.h * 0.5;
    this.northwest = new Quadtree(new Rectangle(x, y, w, h));
    this.northeast = new Quadtree(new Rectangle(x + w, y, w, h));
    this.southeast = new Quadtree(new Rectangle(x + w, y + h, w, h));
    this.southwest = new Quadtree(new Rectangle(x, y + h, w, h));
    /*this.area.push(new Quadtree(new Rectangle(x, y, w, h)));
    this.area.push(new Quadtree(new Rectangle(x + w, y, w, h)));
    this.area.push(new Quadtree(new Rectangle(x + w, y + h, w, h)));
    this.area.push(new Quadtree(new Rectangle(x, y + h, w, h)));*/
  }
  insert(key, point) {
    if (!this.boundary.constains(point)) return false;

    if (this.points.length < 4) {
      this.points.push({ key: key, point: point });
    } else {
      if (!this.divided) {
        this.divided = true;
        /*if (!this.used) {
          this.used = true;*/
        this.subdivide();
        //}
      }
      if (this.northwest.insert(key, point)) {
        return true;
      } else if (this.northeast.insert(key, point)) {
        return true;
      } else if (this.southeast.insert(key, point)) {
        return true;
      } else if (this.southwest.insert(key, point)) {
        return true;
      }
      /*for (let i = 0; i < this.area.length; i++) {
        if (this.area[i].insert(point)) {
          return true;
        }
      }*/
    }
  }
  query(range, found) {
    if (!found) found = [];
    if (!this.boundary.intersect(range)) return found;

    for (let i = 0; i < this.points.length; i++) {
      if (range.constains(this.points[i].point)) {
        found.push(this.points[i]);
      }
    }
    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southeast.query(range, found);
      this.southwest.query(range, found);
      /*for (let i = 0; i < this.area.length; i++) {
        this.area[i].query(range, found);
      }*/
    }
    return found;
  }
  /*clear() {
    this.points = [];
    if (this.divided) {
      this.northwest.clear();
      this.northeast.clear();
      this.southeast.clear();
      this.southwest.clear();
      this.divided = false;
    }
  }*/
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
      /*for (let i = 0; i < this.area.length; i++) {
        this.area[i].render(ctx);
      }*/
    }
  }
}
export { Rectangle, Quadtree };
