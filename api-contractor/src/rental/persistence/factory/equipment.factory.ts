import { EquipmentType, Prisma } from '@prisma/client';
import { Equipment } from '@src/rental/core/entity/equipment.entity';
import { EarthMovingEquipment } from '@src/rental/core/value-object/earth-moving-equipment.value-object';
import { MaterialHandlingEquipment } from '@src/rental/core/value-object/material-handling-equipment.value-object';
import { MiscellaneusEquipment } from '@src/rental/core/value-object/miscellaneus-equipment.value-object';

export class EquipmentFactory {
  public static create(equipmentData: Prisma.$EquipmentPayload['scalars']) {
    const equipment = new Equipment({
      ...{
        id: equipmentData.id,
        serialNumber: equipmentData.serialNumber,
        name: equipmentData.name,
        year: equipmentData.year,
        manufacturer: equipmentData.manufacturer,
        widthCm: equipmentData.widthCm,
        heightCm: equipmentData.heightCm,
        weightKg: equipmentData.weightKg,
        status: equipmentData.status,
        currentJobId: equipmentData.currentJobId ? equipmentData.currentJobId : undefined,
        lastLocation: equipmentData.lastLocation ? equipmentData.lastLocation : undefined,
      },
      ...EquipmentFactory.getSpecificDetails(equipmentData),
    });
    return equipment;
  }

  public static getSpecificDetails(equipmentData: Prisma.$EquipmentPayload['scalars']) {
    switch (equipmentData.type) {
      case EquipmentType.EARTH_MOVING:
        return {
          type: EquipmentType.EARTH_MOVING,
          specificDetails: new EarthMovingEquipment({
            //prevent from null. Prisma doesn't use undefined
            bucketCapacityKg: equipmentData.bucketCapacityKg
              ? equipmentData.bucketCapacityKg
              : undefined,
          }),
        };
      case EquipmentType.MISCELLANEUS:
        return {
          type: EquipmentType.MISCELLANEUS,
          specificDetails: new MiscellaneusEquipment({
            powerCapacityW: equipmentData.powerCapacityW
              ? equipmentData.powerCapacityW
              : undefined,
          }),
        };
      case EquipmentType.MATERIAL_HANDLING:
        return {
          type: EquipmentType.MATERIAL_HANDLING,
          specificDetails: new MaterialHandlingEquipment({
            liftingCapacityKg: equipmentData.liftingCapacityKg
              ? equipmentData.liftingCapacityKg
              : undefined,
            reachMt: equipmentData.reachMt ? equipmentData.reachMt : undefined,
          }),
        };
      default:
        throw new Error('Equipment type not found');
    }
  }
}
