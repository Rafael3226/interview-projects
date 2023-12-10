import Rectangle from "../entity/Rectangle";
import Segment from "../entity/Segment";

export enum SideSharingType {
  PROPER = "PROPER",
  SUB_LINE = "SUB_LINE",
  PARTIAL = "PARTIAL",
  NONE = "NONE",
}

export default class IsRectangleAdjacentUseCase {
  static execute(
    rectangleA: Rectangle,
    rectangleB: Rectangle
  ): SideSharingType {
    const segmentsA = rectangleA.getSegments();
    const segmentsB = rectangleB.getSegments();

    const adjacentSegmentsSet = new Set();

    for (const segmentA of segmentsA) {
      for (const segmentB of segmentsB) {
        const sharingType = IsRectangleAdjacentUseCase.getSideSharingType(
          segmentA,
          segmentB
        );
        if (sharingType !== SideSharingType.NONE) {
          adjacentSegmentsSet.add(sharingType);
        }
      }
    }

    if (adjacentSegmentsSet.has(SideSharingType.PROPER))
      return SideSharingType.PROPER;
    if (adjacentSegmentsSet.has(SideSharingType.SUB_LINE))
      return SideSharingType.SUB_LINE;
    if (adjacentSegmentsSet.has(SideSharingType.PARTIAL))
      return SideSharingType.PARTIAL;

    return SideSharingType.NONE;
  }

  private static getSideSharingType(
    segmentA: Segment,
    segmentB: Segment
  ): SideSharingType {
    if (segmentA.equals(segmentB)) return SideSharingType.PROPER;
    if (segmentA.isSubSegment(segmentB)) return SideSharingType.SUB_LINE;
    if (segmentA.isPartialSegment(segmentB)) return SideSharingType.PARTIAL;
    return SideSharingType.NONE;
  }
}
