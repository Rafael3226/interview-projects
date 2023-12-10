import RectangleFactory from "../RectangleFactory";
import Point from "../Point";
import { InvalidRectangleException } from "../../exceptions/invalid-rectangle.exception";

describe("RectangleFactory", () => {
  it("should create a valid rectangle", () => {
    const points: Point[] = [
      new Point(0, 0),
      new Point(4, 0),
      new Point(4, 2),
      new Point(0, 2),
    ];

    const rectangle = RectangleFactory.create(points);

    expect(rectangle).toBeDefined();
  });

  it("should throw InvalidRectangleException for less than 4 points", () => {
    const points: Point[] = [new Point(0, 0), new Point(4, 0), new Point(4, 2)];

    expect(() => RectangleFactory.create(points)).toThrowError(
      InvalidRectangleException
    );
  });

  it("should throw InvalidRectangleException for more than 4 points", () => {
    const points: Point[] = [
      new Point(0, 0),
      new Point(4, 0),
      new Point(4, 2),
      new Point(0, 2),
      new Point(2, 1),
    ];

    expect(() => RectangleFactory.create(points)).toThrowError(
      InvalidRectangleException
    );
  });

  it("should throw InvalidRectangleException for points not forming a rectangle", () => {
    const points: Point[] = [
      new Point(0, 0),
      new Point(4, 0),
      new Point(4, 3),
      new Point(0, 2),
    ];

    expect(() => RectangleFactory.create(points)).toThrowError(
      InvalidRectangleException
    );
  });

  it("should throw InvalidRectangleException for points with invalid angles", () => {
    const points: Point[] = [
      new Point(0, 0),
      new Point(4, 0),
      new Point(4, 2),
      new Point(2, 2),
    ];

    expect(() => RectangleFactory.create(points)).toThrowError(
      InvalidRectangleException
    );
  });
});
