import Point from "../entity/Point";
import Rectangle from "../entity/Rectangle";

export default class CalculateIntersectionsUseCase {
  static execute(rectangleA: Rectangle, rectangleB: Rectangle): Point[] {
    const segmentsA = rectangleA.getSegments();
    const segmentsB = rectangleB.getSegments();

    const intersectionSet = new Map<string, Point>();

    for (const segmentA of segmentsA) {
      for (const segmentB of segmentsB) {
        const intersection = segmentA.calculateIntersectionPoint(segmentB);
        if (!intersection) continue;
        const stringHash = `${intersection.x},${intersection.y}`;
        if (!intersectionSet.has(stringHash)) {
          intersectionSet.set(stringHash, intersection);
        }
      }
    }
    return [...intersectionSet.values()];
  }
}
