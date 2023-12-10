//Excavator, Bulldozer, Backhoe
export class EarthMovingEquipment {
  public readonly bucketCapacityKg?: number;
  constructor({ bucketCapacityKg }: { bucketCapacityKg?: number }) {
    this.bucketCapacityKg = bucketCapacityKg;
  }
}
