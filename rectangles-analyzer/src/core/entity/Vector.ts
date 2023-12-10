import Point from "./Point";
import Segment from "./Segment";

export default class Vector {
  constructor(public readonly x: number, public readonly y: number) {}

  static createFromPoints(point1: Point, point2: Point): Vector {
    return new Vector(point2.x - point1.x, point2.y - point1.y);
  }

  static createFromSegment(segment: Segment): Vector {
    return Vector.createFromPoints(segment.P, segment.Q);
  }

  static parseSegmentList(segments: Segment[]): Vector[] {
    return segments.map((s) => Vector.createFromSegment(s));
  }

  dotProduct(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  crossProduct(vector: Vector): number {
    return this.x * vector.y - this.y * vector.x;
  }

  areVectorsParallel(vector: Vector): boolean {
    return this.crossProduct(vector) === 0;
  }
}
