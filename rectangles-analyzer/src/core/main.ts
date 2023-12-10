import Point from "./entity/Point";
import Segment from "./entity/Segment";
import Vector from "./entity/Vector";
import Rectangle from "./entity/Rectangle";
import RectangleFactory from "./entity/RectangleFactory";

import CalculateIntersectionsUseCase from "./use-case/calculate-intersections.use-case";
import IsRectangleContainedUseCase from "./use-case/is-rectangle-contained.use-case";
import IsRectangleAdjacentUseCase from "./use-case/is-rectangle-adjacent.use-case";

import { CoreException } from "./exceptions/core.exception";
import { InvalidRectangleException } from "./exceptions/invalid-rectangle.exception";

export {
  Point,
  Segment,
  Vector,
  Rectangle,
  RectangleFactory,
  CalculateIntersectionsUseCase,
  IsRectangleContainedUseCase,
  IsRectangleAdjacentUseCase,
  CoreException,
  InvalidRectangleException,
};
