import mapWithNext from "../util/map-with-next";
import Point from "./Point";
import Vector from "./Vector";

export default class Segment {
  constructor(public readonly P: Point, public readonly Q: Point) {}

  static parsePointsList(points: Point[]): Segment[] {
    return mapWithNext(points, (p1, p2) => new Segment(p1, p2));
  }

  calculateIntersectionPoint(segment: Segment): Point | null {
    const p1 = this.P;
    const q1 = this.Q;
    const p2 = segment.P;
    const q2 = segment.Q;

    const [x1, y1] = [p1.x, p1.y];
    const [x2, y2] = [q1.x, q1.y];
    const [x3, y3] = [p2.x, p2.y];
    const [x4, y4] = [q2.x, q2.y];

    const det = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

    if (det === 0) {
      // Segments are parallel or colsegmentar
      return null;
    }

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / det;
    const s = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / det;

    // Check if the intersection point is within the parameter ranges
    if (0 <= t && t <= 1 && 0 <= s && s <= 1) {
      const intersectionX = x1 + t * (x2 - x1);
      const intersectionY = y1 + t * (y2 - y1);

      return new Point(intersectionX, intersectionY);
    }

    return null; // Return null if intersection point is outside parameter ranges
  }

  equals(segment: Segment): boolean {
    const aP = this.P;
    const aQ = this.Q;
    const bP = segment.P;
    const bQ = segment.Q;

    const isSameDirection = aP.equals(bP) && aQ.equals(bQ);
    const isDifferentDirection = aP.equals(bQ) && aQ.equals(bP);
    // Do not consider direction
    return isSameDirection || isDifferentDirection;
  }

  isSubSegment(subSegment: Segment) {
    return this.includesPoint(subSegment.P) && this.includesPoint(subSegment.Q);
  }

  isPartialSegment(segment: Segment): boolean {
    if (!this.isParallel(segment)) return false;
    return this.includesPoint(segment.P) || this.includesPoint(segment.Q);
  }

  getSegmentDistance() {
    return this.P.calculateDistance(this.Q);
  }

  includesPoint(point: Point): boolean {
    const distance1 = this.P.calculateDistance(point);
    const distance2 = this.Q.calculateDistance(point);
    const segmentLength = this.getSegmentDistance();

    // Check if the sum of distances from the point to both endpoints is approximately equal to the length of the segment
    return Math.abs(distance1 + distance2 - segmentLength) < Number.EPSILON;
  }

  isParallel(segment: Segment): boolean {
    const vA = Vector.createFromSegment(this);
    const vB = Vector.createFromSegment(segment);

    return vA.areVectorsParallel(vB);
  }
}
