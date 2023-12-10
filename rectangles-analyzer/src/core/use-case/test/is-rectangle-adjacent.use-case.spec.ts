import IsRectangleAdjacentUseCase, {
  SideSharingType,
} from "../is-rectangle-adjacent.use-case";
import Rectangle from "../../entity/Rectangle";
import Point from "../../entity/Point";

describe("IsRectangleAdjacentUseCase", () => {
  const rectangleA = new Rectangle([
    new Point(3, 3),
    new Point(6, 3),
    new Point(6, 6),
    new Point(3, 6),
  ]);

  it("should return PROPER for rectangles with proper side sharing", () => {
    const rectangleB = new Rectangle([
      new Point(2, 3),
      new Point(3, 3),
      new Point(3, 6),
      new Point(2, 6),
    ]);
    const sharingType = IsRectangleAdjacentUseCase.execute(
      rectangleA,
      rectangleB
    );

    expect(sharingType).toBe(SideSharingType.PROPER);
  });

  it("should return SUB_LINE for rectangles with sub-line side sharing", () => {
    const rectangleB = new Rectangle([
      new Point(6, 4),
      new Point(7, 4),
      new Point(7, 5),
      new Point(6, 5),
    ]);
    const sharingType = IsRectangleAdjacentUseCase.execute(
      rectangleA,
      rectangleB
    );

    expect(sharingType).toBe(SideSharingType.SUB_LINE);
  });

  it("should return PARTIAL for rectangles with partial side sharing", () => {
    const rectangleB = new Rectangle([
      new Point(5, 6),
      new Point(7, 6),
      new Point(7, 8),
      new Point(5, 8),
    ]);
    const sharingType = IsRectangleAdjacentUseCase.execute(
      rectangleA,
      rectangleB
    );

    expect(sharingType).toBe(SideSharingType.PARTIAL);
  });

  it("should return NONE for rectangles with no side sharing", () => {
    const rectangleB = new Rectangle([
      new Point(4, 1),
      new Point(5, 1),
      new Point(5, 2),
      new Point(4, 2),
    ]);
    const sharingType = IsRectangleAdjacentUseCase.execute(
      rectangleA,
      rectangleB
    );

    expect(sharingType).toBe(SideSharingType.NONE);
  });
});
