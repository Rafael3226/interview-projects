import mapWithNext from "../util/map-with-next";
import Point from "./Point";
import Segment from "./Segment";
import Vector from "./Vector";

export default class Rectangle {
  private readonly points: Point[];

  constructor(points: Point[]) {
    this.points = points;
  }

  getPoints(): Point[] {
    return this.points;
  }

  getSegments(): Segment[] {
    return Segment.parsePointsList(this.points);
  }

  getVectors(): Vector[] {
    return this.getSegments().map((s) => Vector.createFromSegment(s));
  }

  isPointInside(point: Point): boolean {
    const vectors: Vector[] = this.getPoints().map((p) =>
      Vector.createFromPoints(p, point)
    );
    const dotProducts = mapWithNext(vectors, (v1, v2) => v1.crossProduct(v2));
    return dotProducts.every((dp) => dp > 0);
  }
}
