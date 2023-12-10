import { expect, test, describe } from "@jest/globals";

import Point from "../Point";
import Segment from "../Segment";
import Vector from "../Vector";
import RectangleFactory from "../RectangleFactory";

describe("Rectangle class", () => {
  const pointA = new Point(0, 0);
  const pointB = new Point(6, 0);
  const pointC = new Point(6, 6);
  const pointD = new Point(0, 6);

  const pointsRectangle = [pointA, pointB, pointC, pointD];

  const rectangle = RectangleFactory.create(pointsRectangle);

  describe("getSegments method", () => {
    test("returns an array of segments", () => {
      const segments = rectangle.getSegments();
      expect(segments).toHaveLength(4);
      segments.forEach((segment) => {
        expect(segment).toBeInstanceOf(Segment);
      });
    });
  });

  describe("getVectors method", () => {
    test("returns an array of vectors", () => {
      const vectors = rectangle.getVectors();
      expect(vectors).toHaveLength(4);
      vectors.forEach((vector) => {
        expect(vector).toBeInstanceOf(Vector);
      });
    });
  });

  describe("getPoints method", () => {
    test("returns an array of points", () => {
      const points = rectangle.getPoints();
      expect(points).toHaveLength(4);
      points.forEach((point) => {
        expect(point).toBeInstanceOf(Point);
      });
    });
  });

  describe("isPointInside method", () => {
    it("should return true for a point inside the rectangle", () => {
      const insidePoint = new Point(1, 1);
      expect(rectangle.isPointInside(insidePoint)).toBe(true);
    });

    it("should return false for a point outside the rectangle", () => {
      const outsidePoint = new Point(-3, -3);
      expect(rectangle.isPointInside(outsidePoint)).toBe(false);
    });

    it("should return false for a point on the border of the rectangle", () => {
      const borderPoint = new Point(0, 2);
      expect(rectangle.isPointInside(borderPoint)).toBe(false);
    });
  });
});
