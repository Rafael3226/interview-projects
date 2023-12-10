import { expect, test, describe } from "@jest/globals";

import Point from "../Point";

describe("Point class", () => {
  test("constructor initializes x and y properties", () => {
    const point = new Point(2, 3);
    expect(point.x).toBe(2);
    expect(point.y).toBe(3);
  });

  it("calculates distance between two points correctly", () => {
    // Define two points
    const point1: Point = new Point(3, 0);
    const point2: Point = new Point(0, 4);

    // Calculate the expected distance manually
    const expectedDistance = 5;

    // Call the function
    const result = point1.calculateDistance(point2);

    // Check if the result matches the expected distance
    expect(result).toBe(expectedDistance);
  });

  it("calculates the correct distance with negatives", () => {
    const point1: Point = new Point(0, -1);
    const point2: Point = new Point(0, -3);

    const distance = point1.calculateDistance(point2);

    expect(distance).toBeCloseTo(2);
  });
});
