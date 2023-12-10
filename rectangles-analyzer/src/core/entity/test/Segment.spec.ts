import { expect, describe } from "@jest/globals";

import Segment from "../Segment";
import Point from "../Point";

describe("Segment", () => {
  it("should calculate intersection point correctly", () => {
    const segment1 = new Segment(new Point(0, 0), new Point(2, 2));
    const segment2 = new Segment(new Point(0, 2), new Point(2, 0));

    const intersectionPoint = segment1.calculateIntersectionPoint(segment2);

    expect(intersectionPoint).toEqual(new Point(1, 1));
  });

  it("should return null for parallel segments", () => {
    const segment1 = new Segment(new Point(0, 0), new Point(2, 2));
    const segment2 = new Segment(new Point(1, 1), new Point(3, 3));

    const intersectionPoint = segment1.calculateIntersectionPoint(segment2);

    expect(intersectionPoint).toBeNull();
  });

  it("should return null for collinear segments outside parameter ranges", () => {
    const segment1 = new Segment(new Point(0, 0), new Point(2, 2));
    const segment2 = new Segment(new Point(3, 3), new Point(4, 4));

    const intersectionPoint = segment1.calculateIntersectionPoint(segment2);

    expect(intersectionPoint).toBeNull();
  });

  it("should return intersection point for collinear segments within parameter ranges", () => {
    const segment1 = new Segment(new Point(0, 0), new Point(2, 2));
    const segment2 = new Segment(new Point(0, 2), new Point(2, 0));

    const intersectionPoint = segment1.calculateIntersectionPoint(segment2);

    expect(intersectionPoint).toEqual(new Point(1, 1));
  });
});
