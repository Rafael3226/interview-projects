import Rectangle from "../entity/Rectangle";

export default class IsRectangleContainedUseCase {
  static execute(inner: Rectangle, outer: Rectangle): boolean {
    const rectanglePoints = inner.getPoints();
    // Check if all vertices of rectangle1 are inside rectangle2
    for (const point of rectanglePoints) {
      if (!outer.isPointInside(point)) {
        return false;
      }
    }
    return true;
  }
}
