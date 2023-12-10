import { expect, describe } from "@jest/globals";

import Vector from "../Vector";
import Point from "../Point";
import Segment from "../Segment";

describe("Vector", () => {
  it("should create a vector from points correctly", () => {
    const point1 = new Point(0, 0);
    const point2 = new Point(2, 3);

    const vector = Vector.createFromPoints(point1, point2);

    expect(vector).toEqual(new Vector(2, 3));
  });

  it("should create a vector from a segment correctly", () => {
    const segment = new Segment(new Point(1, 1), new Point(4, 5));

    const vector = Vector.createFromSegment(segment);

    expect(vector).toEqual(new Vector(3, 4));
  });

  it("should calculate dot product correctly", () => {
    const vector1 = new Vector(2, 3);
    const vector2 = new Vector(4, 5);

    const dotProduct = vector1.dotProduct(vector2);

    expect(dotProduct).toBe(23);
  });
});
