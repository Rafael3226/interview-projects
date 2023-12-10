// Crane, Forklift, etc.
export class MaterialHandlingEquipment {
  public readonly liftingCapacityKg?: number;
  public readonly reachMt?: number;
  constructor({
    liftingCapacityKg,
    reachMt,
  }: {
    liftingCapacityKg?: number;
    reachMt?: number;
  }) {
    this.liftingCapacityKg = liftingCapacityKg;
    this.reachMt = reachMt;
  }
}
