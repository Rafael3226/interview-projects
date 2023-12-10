import Point from "../../entity/Point";
import RectangleFactory from "../../entity/RectangleFactory";
import IsRectangleContainedUseCase from "../is-rectangle-contained.use-case";

describe("Is Rectangle Contained Use Case class", () => {
  const pointA = new Point(0, 0);
  const pointB = new Point(6, 0);
  const pointC = new Point(6, 6);
  const pointD = new Point(0, 6);

  const pointsRectangle1 = [pointA, pointB, pointC, pointD];

  const pointsRectangle2 = [
    new Point(4, 4),
    new Point(8, 4),
    new Point(8, 8),
    new Point(4, 8),
  ];

  const pointsRectangle3 = [
    new Point(2, 2),
    new Point(4, 2),
    new Point(4, 4),
    new Point(2, 4),
  ];

  const pointsRectangle4 = [
    new Point(-4, 2),
    new Point(0, 2),
    new Point(0, 4),
    new Point(-4, 4),
  ];

  const pointsRectangle5 = [
    new Point(10, 10),
    new Point(12, 10),
    new Point(12, 12),
    new Point(10, 12),
  ];

  const rectangle1 = RectangleFactory.create(pointsRectangle1);
  const rectangle2 = RectangleFactory.create(pointsRectangle2);
  const rectangle3 = RectangleFactory.create(pointsRectangle3);
  const rectangle4 = RectangleFactory.create(pointsRectangle4);
  const rectangle5 = RectangleFactory.create(pointsRectangle5);

  describe("isRectangleInside method", () => {
    it("should return true for a rectangle fully inside", () => {
      expect(IsRectangleContainedUseCase.execute(rectangle3, rectangle1)).toBe(
        true
      );
    });

    it("should return false for a rectangle partially outside", () => {
      expect(IsRectangleContainedUseCase.execute(rectangle1, rectangle2)).toBe(
        false
      );
    });

    it("should return false for a rectangle adjacent", () => {
      expect(IsRectangleContainedUseCase.execute(rectangle1, rectangle4)).toBe(
        false
      );
    });

    it("should return false for a rectangle fully outside", () => {
      expect(IsRectangleContainedUseCase.execute(rectangle1, rectangle5)).toBe(
        false
      );
    });
  });
});
