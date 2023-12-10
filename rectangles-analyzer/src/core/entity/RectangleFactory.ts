import { InvalidRectangleException } from "../exceptions/invalid-rectangle.exception";
import mapWithNext from "../util/map-with-next";
import Point from "./Point";
import Rectangle from "./Rectangle";
import Segment from "./Segment";
import Vector from "./Vector";

export default class RectangleFactory {
  public static create(points: Point[]) {
    if (points.length !== 4) {
      throw new InvalidRectangleException(
        "Rectangle needs 4 different points."
      );
    }

    RectangleFactory.isRectangle(points);
    const sortedPoints = RectangleFactory.sortPoints(points);
    return new Rectangle(sortedPoints);
  }

  private static calculateCentroid(points: Point[]): Point {
    // Calculate the centroid of the points
    return new Point(
      (points[0].x + points[1].x + points[2].x + points[3].x) / 4,
      (points[0].y + points[1].y + points[2].y + points[3].y) / 4
    );
  }

  private static sortPoints(points: Point[]): Point[] {
    const centroid = RectangleFactory.calculateCentroid(points);
    // Sort the points based on their angle relative to the centroid
    return points.sort(
      (a, b) =>
        Math.atan2(a.y - centroid.y, a.x - centroid.x) -
        Math.atan2(b.y - centroid.y, b.x - centroid.x)
    );
  }

  private static isRectangle(points: Point[]) {
    if (!RectangleFactory.checkSides(points))
      throw new InvalidRectangleException("The sides do not form a rectangle.");
    if (!RectangleFactory.checkAngles(RectangleFactory.sortPoints(points)))
      throw new InvalidRectangleException(
        "The angles do not form a rectangle."
      );
  }

  private static checkSides(points: Point[]): boolean {
    const [p1, p2, p3, p4] = points;
    // Calculate distances between points
    const distances = [
      p1.calculateDistance(p2),
      p1.calculateDistance(p3),
      p1.calculateDistance(p4),
      p2.calculateDistance(p3),
      p2.calculateDistance(p4),
      p3.calculateDistance(p4),
    ];

    // Sort distances in ascending order
    distances.sort((a, b) => a - b);

    // Check if distances form a rectangle
    return (
      distances[0] === distances[1] &&
      distances[2] === distances[3] &&
      distances[4] === distances[5]
    );
  }

  private static checkAngles(points: Point[]): boolean {
    const segments = Segment.parsePointsList(points);
    const dotProducts = mapWithNext(
      Vector.parseSegmentList(segments),
      (v1, v2) => v1.dotProduct(v2)
    );
    // All values for dps has to be 0 in order to validate a rectangle
    return dotProducts.every((dp) => dp === 0);
  }
}
