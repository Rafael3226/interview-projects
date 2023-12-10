export default class Point {
  constructor(public readonly x: number, public readonly y: number) {}

  calculateDistance(point: Point): number {
    return Math.sqrt(
      Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2)
    );
  }
  equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }
}
